import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('settings', {
    has: (key: string) => ipcRenderer.invoke('appSettings.has', key),
    get: (key: string) => ipcRenderer.invoke('appSettings.get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('appSettings.set', key, value)
});
