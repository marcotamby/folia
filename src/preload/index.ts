import { contextBridge, ipcRenderer } from 'electron';

export interface FoliaAPI {
  getSystemLanguage: () => Promise<string>;
  openProjectDialog: () => Promise<{ canceled: boolean; filePath?: string; data?: any }>;
  saveProjectDialog: (titleOrData: any, data?: any) => Promise<{ canceled: boolean; filePath?: string; success?: boolean }>;
  saveProjectDirect: (filePath: string, data: any) => Promise<{ success: boolean; error?: string }>;
  exportDocument: (format: string, defaultName: string, content: string) => Promise<{ canceled: boolean; filePath?: string; success?: boolean }>;
  exportPDF: (defaultName: string, htmlContent: string) => Promise<{ canceled: boolean; filePath?: string; success?: boolean; error?: string }>;
  printToPDF: () => Promise<void>;
  openExternal: (url: string) => Promise<{ success: boolean; error?: string }>;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  isWindowMaximized: () => Promise<boolean>;
  closeWindow: () => void;
  forceCloseWindow: () => void;
  onWindowMaximizedChange: (callback: (isMaximized: boolean) => void) => () => void;
  onAppCloseRequested: (callback: () => void) => () => void;
  addWordToSpellchecker: (word: string) => Promise<boolean>;
  loadCustomDictionary: (words: string[]) => Promise<boolean>;
  onWordAddedToSpellchecker: (callback: (word: string) => void) => () => void;
  saveAudioRecording: (campaignTitle: string, fileName: string, buffer: ArrayBuffer) => Promise<{ success: boolean; filePath?: string; fileSizeBytes?: number; error?: string }>;
  deleteAudioRecording: (filePath: string) => Promise<{ success: boolean; error?: string }>;
  showItemInFolder: (filePath: string) => Promise<{ success: boolean; error?: string }>;
  initialFile?: { filePath?: string; data?: any } | null;
  getInitialFile: () => Promise<{ filePath?: string; data?: any } | null>;
  onOpenFile: (callback: (payload: { filePath: string; data: any }) => void) => () => void;
  getMediaUrl: (filePath: string) => string;
  readRecordingBuffer: (filePath: string) => Promise<{ success: boolean; buffer?: ArrayBuffer; error?: string }>;
  getAppVersion: () => Promise<string>;
  getUpdateSettings: () => Promise<{ autoUpdateEnabled: boolean }>;
  setUpdateSettings: (settings: { autoUpdateEnabled: boolean }) => Promise<{ success: boolean }>;
  checkForUpdates: () => Promise<{ success: boolean; isDev?: boolean; updateInfo?: any; error?: string }>;
  quitAndInstallUpdate: () => void;
  onUpdateStatus: (callback: (payload: { 
    status: 'checking' | 'available' | 'up-to-date' | 'downloading' | 'downloaded' | 'error'; 
    version?: string; 
    releaseNotes?: any; 
    percent?: number; 
    error?: string;
  }) => void) => () => void;
}

let cachedInitialFile: { filePath?: string; data?: any } | null = null;
try {
  cachedInitialFile = ipcRenderer.sendSync('app:getInitialFileSync');
} catch (e) {
  console.error('Failed to pre-fetch initial file synchronously:', e);
}

const api: FoliaAPI = {
  initialFile: cachedInitialFile,
  getSystemLanguage: () => ipcRenderer.invoke('app:getSystemLanguage'),
  openExternal: (url: string) => ipcRenderer.invoke('app:openExternal', url),
  openProjectDialog: () => ipcRenderer.invoke('dialog:openProject'),
  saveProjectDialog: (titleOrData: any, optionalData?: any) => {
    let defaultTitle = 'Manoscritto';
    let data = titleOrData;
    if (typeof titleOrData === 'string' && optionalData) {
      defaultTitle = titleOrData;
      data = optionalData;
    } else if (titleOrData && typeof titleOrData === 'object') {
      defaultTitle = titleOrData.title || 'Manoscritto';
      data = titleOrData;
    }
    return ipcRenderer.invoke('dialog:saveProject', { defaultTitle, data });
  },
  saveProjectDirect: (filePath, data) => ipcRenderer.invoke('fs:saveDirect', { filePath, data }),
  exportDocument: (format, defaultName, content) => ipcRenderer.invoke('fs:exportDocument', { format, defaultName, content }),
  exportPDF: (defaultName, htmlContent) => ipcRenderer.invoke('fs:exportPDF', { defaultName, htmlContent }),
  printToPDF: () => ipcRenderer.invoke('dialog:printToPDF'),
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  isWindowMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  closeWindow: () => ipcRenderer.send('window:close'),
  forceCloseWindow: () => ipcRenderer.send('window:force-close'),
  addWordToSpellchecker: (word: string) => ipcRenderer.invoke('spellcheck:addWord', word),
  loadCustomDictionary: (words: string[]) => ipcRenderer.invoke('spellcheck:loadCustomDictionary', words),
  onWordAddedToSpellchecker: (callback: (word: string) => void) => {
    const handler = (_: any, word: string) => callback(word);
    ipcRenderer.on('spellcheck:wordAdded', handler);
    return () => {
      ipcRenderer.removeListener('spellcheck:wordAdded', handler);
    };
  },
  onWindowMaximizedChange: (callback) => {
    const handler = (_: any, isMaximized: boolean) => callback(isMaximized);
    ipcRenderer.on('window:maximized-status', handler);
    return () => {
      ipcRenderer.removeListener('window:maximized-status', handler);
    };
  },
  onAppCloseRequested: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('app:request-close', handler);
    return () => {
      ipcRenderer.removeListener('app:request-close', handler);
    };
  },
  saveAudioRecording: (campaignTitle: string, fileName: string, buffer: ArrayBuffer) =>
    ipcRenderer.invoke('audio:saveRecording', { campaignTitle, fileName, buffer }),
  deleteAudioRecording: (filePath: string) =>
    ipcRenderer.invoke('audio:deleteRecording', filePath),
  showItemInFolder: (filePath: string) =>
    ipcRenderer.invoke('audio:showInFolder', filePath),
  getMediaUrl: (filePath: string) => {
    if (!filePath) return '';
    return `folia-media://local?file=${encodeURIComponent(filePath)}`;
  },
  getInitialFile: () => ipcRenderer.invoke('app:getInitialFile'),
  onOpenFile: (callback: (payload: { filePath: string; data: any }) => void) => {
    const handler = (_: any, payload: any) => callback(payload);
    ipcRenderer.on('app:open-file', handler);
    return () => {
      ipcRenderer.removeListener('app:open-file', handler);
    };
  },
  readRecordingBuffer: (filePath: string) =>
    ipcRenderer.invoke('audio:readRecordingBuffer', filePath),
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
  getUpdateSettings: () => ipcRenderer.invoke('updater:getSettings'),
  setUpdateSettings: (settings: { autoUpdateEnabled: boolean }) => ipcRenderer.invoke('updater:setSettings', settings),
  checkForUpdates: () => ipcRenderer.invoke('updater:checkForUpdates'),
  quitAndInstallUpdate: () => ipcRenderer.invoke('updater:quitAndInstall'),
  onUpdateStatus: (callback: (payload: any) => void) => {
    const handler = (_: any, payload: any) => callback(payload);
    ipcRenderer.on('updater:status', handler);
    return () => {
      ipcRenderer.removeListener('updater:status', handler);
    };
  }
};

contextBridge.exposeInMainWorld('foliaAPI', api);
