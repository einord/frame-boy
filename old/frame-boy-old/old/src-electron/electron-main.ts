import { app, nativeTheme } from 'electron';
import { initialize } from '@electron/remote/main';
import path from 'path';
import os from 'os';
import { createWindow, mainWindow } from './electron-main-window';

console.log('APPDATA PATH: ' + app.getPath('appData'));

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
    if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
        require('fs').unlinkSync(
            path.join(app.getPath('userData'), 'DevTools Extensions')
        );
    }
} catch (_) { }

initialize();

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', async() => {
    if (mainWindow === undefined) {
        await createWindow();
    }
});

app.on('browser-window-created', (_, window) => {
    require("@electron/remote/main").enable(window.webContents)
});