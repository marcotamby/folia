import { app, BrowserWindow, ipcMain, dialog, shell, Menu, MenuItem, protocol, net, session, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import { pathToFileURL } from 'url';
import { autoUpdater } from 'electron-updater';

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'folia-media',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true,
      bypassCSP: true,
      corsEnabled: true
    }
  }
]);

let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;

function getFilePathFromArgs(args: string[]): string | null {
  for (const arg of args) {
    if (!arg.startsWith('--') && !arg.startsWith('-')) {
      const lower = arg.toLowerCase();
      if (lower.endsWith('.folia') || lower.endsWith('.json')) {
        try {
          if (fsSync.existsSync(arg)) {
            return path.resolve(arg);
          }
        } catch {}
      }
    }
  }
  return null;
}

let initialFilePath: string | null = getFilePathFromArgs(process.argv);

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function getAppIcon() {
  const possiblePaths = [
    path.join(__dirname, '../../assets/icon.ico'),
    path.join(__dirname, '../assets/icon.ico'),
    path.join(process.resourcesPath || '', 'assets/icon.ico'),
    path.join(__dirname, '../../assets/logo.png'),
    path.join(__dirname, '../assets/logo.png'),
    path.join(process.resourcesPath || '', 'assets/logo.png'),
  ];
  for (const p of possiblePaths) {
    try {
      if (require('fs').existsSync(p)) return p;
    } catch {}
  }
  return path.join(__dirname, '../../assets/logo.png');
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 480,
    height: 420,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    center: true,
    show: false,
    icon: getAppIcon(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const splashPath = path.join(__dirname, '../splash/splash.html');
  splashWindow.loadFile(splashPath);

  splashWindow.once('ready-to-show', () => {
    splashWindow?.show();
  });
}

let isForceClosing = false;

interface WindowState {
  width: number;
  height: number;
  x?: number;
  y?: number;
  isMaximized: boolean;
}

const DEFAULT_WINDOW_STATE: WindowState = {
  width: 1360,
  height: 900,
  isMaximized: false
};

function getWindowStateFilePath(): string {
  return path.join(app.getPath('userData'), 'window-state.json');
}

function loadWindowState(): WindowState {
  try {
    const filePath = getWindowStateFilePath();
    if (fsSync.existsSync(filePath)) {
      const raw = fsSync.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      const width = typeof data.width === 'number' && data.width >= 960 ? data.width : DEFAULT_WINDOW_STATE.width;
      const height = typeof data.height === 'number' && data.height >= 640 ? data.height : DEFAULT_WINDOW_STATE.height;
      const isMaximized = Boolean(data.isMaximized);

      let x = typeof data.x === 'number' ? data.x : undefined;
      let y = typeof data.y === 'number' ? data.y : undefined;

      // Validate coordinates against connected displays to avoid opening off-screen
      if (x !== undefined && y !== undefined) {
        const displays = screen.getAllDisplays();
        const isVisible = displays.some(display => {
          const { x: dx, y: dy, width: dw, height: dh } = display.bounds;
          return (
            x! + 100 > dx &&
            x! < dx + dw &&
            y! + 50 > dy &&
            y! < dy + dh
          );
        });
        if (!isVisible) {
          x = undefined;
          y = undefined;
        }
      }

      return { width, height, x, y, isMaximized };
    }
  } catch (err) {
    console.error('Failed to load window state:', err);
  }
  return { ...DEFAULT_WINDOW_STATE };
}

let saveStateTimeout: NodeJS.Timeout | null = null;
let currentWindowState: WindowState = { ...DEFAULT_WINDOW_STATE };

function saveWindowStateDebounced(state: WindowState) {
  if (saveStateTimeout) {
    clearTimeout(saveStateTimeout);
  }
  saveStateTimeout = setTimeout(() => {
    saveWindowStateSync(state);
  }, 300);
}

function saveWindowStateSync(state: WindowState) {
  if (saveStateTimeout) {
    clearTimeout(saveStateTimeout);
    saveStateTimeout = null;
  }
  try {
    const filePath = getWindowStateFilePath();
    fsSync.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save window state:', err);
  }
}

function createMainWindow() {
  isForceClosing = false;
  currentWindowState = loadWindowState();

  mainWindow = new BrowserWindow({
    width: currentWindowState.width,
    height: currentWindowState.height,
    x: currentWindowState.x,
    y: currentWindowState.y,
    minWidth: 960,
    minHeight: 640,
    show: false,
    frame: false, // Sleek frameless window with custom titlebar
    titleBarStyle: 'hidden',
    backgroundColor: '#FAFAF8',
    icon: getAppIcon(),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: true
    }
  });

  const updateNormalBounds = () => {
    if (!mainWindow || mainWindow.isMaximized() || mainWindow.isMinimized() || mainWindow.isFullScreen()) return;
    const bounds = mainWindow.getBounds();
    currentWindowState.width = bounds.width;
    currentWindowState.height = bounds.height;
    currentWindowState.x = bounds.x;
    currentWindowState.y = bounds.y;
    saveWindowStateDebounced(currentWindowState);
  };

  mainWindow.on('resize', updateNormalBounds);
  mainWindow.on('move', updateNormalBounds);

  mainWindow.on('maximize', () => {
    currentWindowState.isMaximized = true;
    saveWindowStateDebounced(currentWindowState);
    mainWindow?.webContents.send('window:maximized-status', true);
  });

  mainWindow.on('unmaximize', () => {
    currentWindowState.isMaximized = false;
    saveWindowStateDebounced(currentWindowState);
    mainWindow?.webContents.send('window:maximized-status', false);
  });

  mainWindow.on('close', (e) => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        currentWindowState.isMaximized = true;
      } else if (!mainWindow.isMinimized()) {
        const bounds = mainWindow.getBounds();
        currentWindowState.isMaximized = false;
        currentWindowState.width = bounds.width;
        currentWindowState.height = bounds.height;
        currentWindowState.x = bounds.x;
        currentWindowState.y = bounds.y;
      }
      saveWindowStateSync(currentWindowState);
    }
    if (!isForceClosing) {
      e.preventDefault();
      mainWindow?.webContents.send('app:request-close');
    }
  });

  // Open external links in default browser instead of electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:') || url.startsWith('mailto:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Spellchecker Context Menu with "Aggiungi al dizionario di Folia"
  mainWindow.webContents.on('context-menu', (_, params) => {
    if (params.misspelledWord) {
      const menu = new Menu();
      for (const suggestion of params.dictionarySuggestions) {
        menu.append(new MenuItem({
          label: suggestion,
          click: () => mainWindow?.webContents.replaceMisspelling(suggestion)
        }));
      }
      if (params.dictionarySuggestions.length > 0) {
        menu.append(new MenuItem({ type: 'separator' }));
      }
      menu.append(new MenuItem({
        label: `Aggiungi "${params.misspelledWord}" al dizionario di Folia`,
        click: () => {
          mainWindow?.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord);
          mainWindow?.webContents.send('spellcheck:wordAdded', params.misspelledWord);
        }
      }));
      menu.popup();
    }
  });

  if (isDev) {
    const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Minimum splash duration for smooth UX
  const startTime = Date.now();
  const minSplashMs = 1800;

  mainWindow.once('ready-to-show', () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minSplashMs - elapsed);

    setTimeout(() => {
      if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.close();
        splashWindow = null;
      }
      if (currentWindowState.isMaximized) {
        mainWindow?.maximize();
      }
      mainWindow?.show();
      mainWindow?.focus();
    }, remaining);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
function setupIpcHandlers() {
  ipcMain.on('app:getInitialFileSync', (event) => {
    if (initialFilePath) {
      const p = initialFilePath;
      initialFilePath = null; // consume once
      try {
        const raw = fsSync.readFileSync(p, 'utf-8');
        const data = JSON.parse(raw);
        event.returnValue = { filePath: p, data };
        return;
      } catch (err: any) {
        console.error('Failed to load initial file synchronously:', err);
      }
    }
    event.returnValue = null;
  });

  ipcMain.handle('app:getInitialFile', async () => {
    if (initialFilePath) {
      const p = initialFilePath;
      initialFilePath = null; // consume once
      try {
        const raw = await fs.readFile(p, 'utf-8');
        const data = JSON.parse(raw);
        return { filePath: p, data };
      } catch (err: any) {
        console.error('Failed to load initial file:', err);
      }
    }
    return null;
  });

  ipcMain.handle('app:getSystemLanguage', () => {
    const locale = app.getLocale().toLowerCase();
    if (locale.startsWith('it')) return 'it';
    return 'en';
  });

  ipcMain.handle('dialog:openProject', async () => {
    if (!mainWindow) return { canceled: true };
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Apri Progetto Folia',
      filters: [
        { name: 'File Progetto Folia (*.folia, *.json)', extensions: ['folia', 'json'] },
        { name: 'Tutti i file', extensions: ['*'] }
      ],
      properties: ['openFile']
    });

    if (canceled || filePaths.length === 0) {
      return { canceled: true };
    }

    try {
      const filePath = filePaths[0];
      const raw = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(raw);
      return { canceled: false, filePath, data };
    } catch (err: any) {
      return { canceled: false, error: err.message };
    }
  });

  ipcMain.handle('dialog:saveProject', async (_, { defaultTitle, data }) => {
    if (!mainWindow) return { canceled: true };
    const sanitizedTitle = (defaultTitle || 'Nuovo progetto').replace(/[<>:"/\\|?*]/g, '_');
    
    // Default folder: Documents/Folia/Progetti
    const documentsFolder = app.getPath('documents');
    const foliaProjectsFolder = path.join(documentsFolder, 'Folia', 'Progetti');
    try {
      await fs.mkdir(foliaProjectsFolder, { recursive: true });
    } catch (e) {}

    const defaultFilePath = path.join(foliaProjectsFolder, `${sanitizedTitle}.folia`);

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Salva Progetto Folia',
      defaultPath: defaultFilePath,
      filters: [
        { name: 'File Progetto Folia (*.folia)', extensions: ['folia'] },
        { name: 'File JSON (*.json)', extensions: ['json'] }
      ]
    });

    if (canceled || !filePath) {
      return { canceled: true };
    }

    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return { canceled: false, filePath };
    } catch (err: any) {
      return { canceled: false, error: err.message };
    }
  });

  ipcMain.handle('fs:saveDirect', async (_, { filePath, data }) => {
    try {
      if (!filePath) throw new Error('Percorso file non specificato');
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('fs:exportDocument', async (_, { format, defaultName, content }) => {
    if (!mainWindow) return { canceled: true };
    
    let extension = 'txt';
    let filterName = 'File di Testo (*.txt)';
    if (format === 'markdown') {
      extension = 'md';
      filterName = 'File Markdown (*.md)';
    } else if (format === 'html') {
      extension = 'html';
      filterName = 'File HTML (*.html)';
    } else if (format === 'docx') {
      extension = 'docx';
      filterName = 'Documento Microsoft Word (*.docx)';
    } else if (format === 'epub') {
      extension = 'epub';
      filterName = 'E-Book EPUB (*.epub)';
    }

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Esporta Manoscritto',
      defaultPath: `${defaultName || 'Manoscritto'}.${extension}`,
      filters: [{ name: filterName, extensions: [extension] }]
    });

    if (canceled || !filePath) return { canceled: true };

    try {
      if (typeof content === 'string' && content.startsWith('base64:')) {
        const buffer = Buffer.from(content.slice(7), 'base64');
        await fs.writeFile(filePath, buffer);
      } else {
        await fs.writeFile(filePath, content, 'utf-8');
      }
      return { canceled: false, filePath, success: true };
    } catch (err: any) {
      return { canceled: false, error: err.message };
    }
  });

  ipcMain.handle('fs:exportPDF', async (_, { defaultName, htmlContent }) => {
    if (!mainWindow) return { canceled: true };

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Esporta in PDF',
      defaultPath: `${defaultName || 'Manoscritto'}.pdf`,
      filters: [{ name: 'Documento PDF (*.pdf)', extensions: ['pdf'] }]
    });

    if (canceled || !filePath) return { canceled: true };

    let printWindow: BrowserWindow | null = null;
    try {
      printWindow = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      });

      await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

      // Ensure web fonts and layout are completely loaded before generating PDF
      await printWindow.webContents.executeJavaScript(`
        Promise.all([
          document.fonts ? document.fonts.ready : Promise.resolve(),
          new Promise(resolve => setTimeout(resolve, 400))
        ])
      `);

      const pdfBuffer = await printWindow.webContents.printToPDF({
        printBackground: true,
        preferCSSPageSize: true
      });

      await fs.writeFile(filePath, pdfBuffer);
      return { canceled: false, filePath, success: true };
    } catch (err: any) {
      return { canceled: false, error: err.message };
    } finally {
      if (printWindow) {
        printWindow.destroy();
      }
    }
  });

  ipcMain.handle('dialog:printToPDF', async () => {
    if (!mainWindow) return;
    mainWindow.webContents.print({ silent: false, printBackground: true });
  });

  ipcMain.on('window:minimize', () => {
    mainWindow?.minimize();
  });

  ipcMain.on('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });

  ipcMain.on('window:close', () => {
    mainWindow?.webContents.send('app:request-close');
  });

  ipcMain.handle('window:isMaximized', () => {
    return mainWindow?.isMaximized() ?? false;
  });

  ipcMain.on('window:force-close', () => {
    isForceClosing = true;
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        currentWindowState.isMaximized = true;
      } else if (!mainWindow.isMinimized()) {
        const bounds = mainWindow.getBounds();
        currentWindowState.isMaximized = false;
        currentWindowState.width = bounds.width;
        currentWindowState.height = bounds.height;
        currentWindowState.x = bounds.x;
        currentWindowState.y = bounds.y;
      }
      saveWindowStateSync(currentWindowState);
    }
    mainWindow?.close();
  });

  ipcMain.handle('app:openExternal', async (_, url: string) => {
    try {
      if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:'))) {
        await shell.openExternal(url);
        return { success: true };
      }
      return { success: false, error: 'Invalid URL protocol' };
    } catch (e: any) {
      console.error('Failed to open external URL:', e);
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('spellcheck:addWord', (_, word: string) => {
    if (mainWindow && word) {
      mainWindow.webContents.session.addWordToSpellCheckerDictionary(word);
      return true;
    }
    return false;
  });

  ipcMain.handle('spellcheck:loadCustomDictionary', (_, words: string[]) => {
    if (mainWindow && Array.isArray(words)) {
      words.forEach(w => {
        if (w && typeof w === 'string') {
          mainWindow?.webContents.session.addWordToSpellCheckerDictionary(w);
        }
      });
      return true;
    }
    return false;
  });

  // Audio recordings IPC handlers
  ipcMain.handle('audio:saveRecording', async (_, { campaignTitle, fileName, buffer }: { campaignTitle: string; fileName: string; buffer: Uint8Array | ArrayBuffer }) => {
    try {
      const documentsFolder = app.getPath('documents');
      const safeCampaign = (campaignTitle || 'Campagna D&D').replace(/[<>:"/\\|?*]/g, '_').trim();
      const folderPath = path.join(documentsFolder, 'Folia', 'Registrazioni', safeCampaign);
      await fs.mkdir(folderPath, { recursive: true });

      const safeFileName = (fileName || `Sessione_${Date.now()}.webm`).replace(/[<>:"/\\|?*]/g, '_');
      const targetFilePath = path.join(folderPath, safeFileName);

      const nodeBuffer = Buffer.from(buffer as any);
      await fs.writeFile(targetFilePath, nodeBuffer);
      const stat = await fs.stat(targetFilePath);

      return {
        success: true,
        filePath: targetFilePath,
        fileSizeBytes: stat.size
      };
    } catch (err: any) {
      console.error('Error saving audio recording:', err);
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('audio:deleteRecording', async (_, filePath: string) => {
    try {
      if (!filePath) return { success: false, error: 'Percorso non specificato' };
      try {
        await fs.unlink(filePath);
      } catch (e: any) {}
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting audio recording:', err);
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('audio:showInFolder', async (_, filePath: string) => {
    try {
      if (!filePath) return { success: false };
      shell.showItemInFolder(filePath);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('audio:readRecordingBuffer', async (_, filePath: string) => {
    try {
      if (!filePath) return { success: false, error: 'Percorso non specificato' };
      const resolved = path.resolve(filePath);
      const fileBuffer = await fs.readFile(resolved);
      const arrayBuffer = fileBuffer.buffer.slice(
        fileBuffer.byteOffset,
        fileBuffer.byteOffset + fileBuffer.byteLength
      );
      return { success: true, buffer: arrayBuffer };
    } catch (err: any) {
      console.error('Error reading audio file buffer:', err);
      return { success: false, error: err.message };
    }
  });

  // Auto Updater IPC Handlers
  ipcMain.handle('updater:getSettings', () => {
    return loadAppSettings();
  });

  ipcMain.handle('updater:setSettings', (_, settings: { autoUpdateEnabled: boolean }) => {
    saveAppSettings(settings);
    return { success: true };
  });

  ipcMain.handle('updater:checkForUpdates', async () => {
    if (isDev) {
      return { success: false, isDev: true, message: 'La verifica automatica è attiva nell\'app installata.' };
    }
    try {
      const result = await autoUpdater.checkForUpdates();
      return { success: true, updateInfo: result?.updateInfo };
    } catch (err: any) {
      console.error('Check for updates error:', err?.message || err);
      return { 
        success: true, 
        isLatest: true, 
        message: `Sei all'ultima versione (v${app.getVersion()})` 
      };
    }
  });

  ipcMain.handle('updater:quitAndInstall', () => {
    autoUpdater.quitAndInstall();
  });

  ipcMain.handle('app:getVersion', () => {
    return app.getVersion();
  });
}

function getAppSettingsPath() {
  return path.join(app.getPath('userData'), 'folia-app-settings.json');
}

function loadAppSettings(): { autoUpdateEnabled: boolean } {
  try {
    const p = getAppSettingsPath();
    if (fsSync.existsSync(p)) {
      const data = JSON.parse(fsSync.readFileSync(p, 'utf-8'));
      return { autoUpdateEnabled: data.autoUpdateEnabled !== false };
    }
  } catch {}
  return { autoUpdateEnabled: true };
}

function saveAppSettings(settings: { autoUpdateEnabled: boolean }) {
  try {
    const p = getAppSettingsPath();
    fsSync.writeFileSync(p, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save app settings:', err);
  }
}

function setupAutoUpdater() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('checking-for-update', () => {
    mainWindow?.webContents.send('updater:status', { status: 'checking' });
  });

  autoUpdater.on('update-available', (info) => {
    mainWindow?.webContents.send('updater:status', { 
      status: 'available', 
      version: info.version,
      releaseNotes: info.releaseNotes 
    });
  });

  autoUpdater.on('update-not-available', (info) => {
    mainWindow?.webContents.send('updater:status', { 
      status: 'up-to-date', 
      version: app.getVersion() 
    });
  });

  autoUpdater.on('error', (err) => {
    console.error('Auto-updater error:', err?.message || err);
    mainWindow?.webContents.send('updater:status', { 
      status: 'error', 
      error: 'Impossibile verificare gli aggiornamenti al momento' 
    });
  });

  autoUpdater.on('download-progress', (progressObj) => {
    mainWindow?.webContents.send('updater:status', { 
      status: 'downloading', 
      percent: Math.round(progressObj.percent),
      transferred: progressObj.transferred,
      total: progressObj.total
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    mainWindow?.webContents.send('updater:status', { 
      status: 'downloaded', 
      version: info.version 
    });
  });
}

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', async (_event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();

      const secondFilePath = getFilePathFromArgs(commandLine);
      if (secondFilePath) {
        try {
          const raw = await fs.readFile(secondFilePath, 'utf-8');
          const data = JSON.parse(raw);
          mainWindow.webContents.send('app:open-file', { filePath: secondFilePath, data });
        } catch (e) {
          console.error('Failed to open project file from second instance:', e);
        }
      }
    }
  });

  app.whenReady().then(() => {
  // Protocol handler for streaming local audio files smoothly
  protocol.handle('folia-media', (request) => {
    try {
      const url = new URL(request.url);
      let targetPath = '';
      if (url.searchParams.has('file')) {
        targetPath = decodeURIComponent(url.searchParams.get('file') || '');
      } else if (url.searchParams.has('path')) {
        targetPath = decodeURIComponent(url.searchParams.get('path') || '');
      } else {
        let raw = request.url.slice('folia-media:'.length);
        while (raw.startsWith('/')) raw = raw.slice(1);
        if (raw.toLowerCase().startsWith('localhost/')) raw = raw.slice('localhost/'.length);
        targetPath = decodeURIComponent(raw);
        if (/^[a-zA-Z]\//.test(targetPath)) {
          targetPath = targetPath[0] + ':' + targetPath.slice(1);
        }
      }

      if (!targetPath) return new Response('File path missing', { status: 400 });

      const resolved = path.resolve(targetPath);
      const fileUrl = pathToFileURL(resolved).toString();
      return net.fetch(fileUrl);
    } catch (err) {
      console.error('Failed to handle folia-media request:', err);
      return new Response('Media not found', { status: 404 });
    }
  });

  // Ensure ONLY microphone permissions (never camera/video) are handled
  session.defaultSession.setPermissionCheckHandler((_webContents, permission, _origin, details) => {
    if (permission === 'media') {
      const mediaType = (details as any)?.mediaType;
      // Strictly deny any video/camera check
      if (mediaType === 'video') return false;
      if (mediaType === 'audio') return true;
    }
    return false;
  });
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback, details) => {
    if (permission === 'media') {
      const mediaTypes = (details as any)?.mediaTypes;
      // Strictly deny if video/camera is requested
      if (Array.isArray(mediaTypes) && mediaTypes.includes('video')) {
        return callback(false);
      }
      // Allow microphone only
      if (Array.isArray(mediaTypes) && mediaTypes.includes('audio')) {
        return callback(true);
      }
    }
    callback(false);
  });

  setupIpcHandlers();
  setupAutoUpdater();
  createSplashWindow();
  createMainWindow();

  // Automatic check for updates if enabled and not in development
  const settings = loadAppSettings();
  if (settings.autoUpdateEnabled && !isDev) {
    setTimeout(() => {
      autoUpdater.checkForUpdates().catch((err) => {
        console.error('Silent auto update check error:', err);
      });
    }, 8000);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
}
