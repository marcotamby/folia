import { contextBridge, ipcRenderer } from 'electron';

export interface FoliaAPI {
  getSystemLanguage: () => Promise<string>;
  openProjectDialog: () => Promise<{ canceled: boolean; filePath?: string; data?: any }>;
  saveProjectDialog: (titleOrData: any, data?: any) => Promise<{ canceled: boolean; filePath?: string; success?: boolean }>;
  saveProjectDirect: (filePath: string, data: any) => Promise<{ success: boolean; error?: string }>;
  exportDocument: (format: string, defaultName: string, content: string) => Promise<{ canceled: boolean; filePath?: string; success?: boolean }>;
  printToPDF: () => Promise<void>;
  openExternal: (url: string) => Promise<{ success: boolean; error?: string }>;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  forceCloseWindow: () => void;
  onWindowMaximizedChange: (callback: (isMaximized: boolean) => void) => () => void;
  onAppCloseRequested: (callback: () => void) => () => void;
  addWordToSpellchecker: (word: string) => Promise<boolean>;
  loadCustomDictionary: (words: string[]) => Promise<boolean>;
  onWordAddedToSpellchecker: (callback: (word: string) => void) => () => void;
}

const api: FoliaAPI = {
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
  printToPDF: () => ipcRenderer.invoke('dialog:printToPDF'),
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
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
  }
};

contextBridge.exposeInMainWorld('foliaAPI', api);
