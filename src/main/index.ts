import { app, BrowserWindow, ipcMain, dialog, shell, Menu, MenuItem } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';

let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;

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

function createMainWindow() {
  isForceClosing = false;
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 900,
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

  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window:maximized-status', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window:maximized-status', false);
  });

  mainWindow.on('close', (e) => {
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
      extension = 'doc';
      filterName = 'Documento Word (*.doc)';
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

  ipcMain.on('window:force-close', () => {
    isForceClosing = true;
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
}

app.whenReady().then(() => {
  setupIpcHandlers();
  createSplashWindow();
  createMainWindow();

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
