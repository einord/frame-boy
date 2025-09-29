import { BrowserWindow } from 'electron';
import path from 'path';
import { addModulesToIpcMain } from './modules';
import { appSettingsService } from './modules/app-settings';

export let mainWindow: BrowserWindow | undefined;

export async function createWindow() {
    // Restore window position
    const [x, y] = await appSettingsService.has('mainWindow.position')
        ? await appSettingsService.get<number[]>('mainWindow.position')
        : [undefined, undefined];
    
    // Restore window size
    const [width, height] = await appSettingsService.has('mainWindow.size')
        ? await appSettingsService.get<number[]>('mainWindow.size')
        : [1000, 1300];
    
    // Restore window fullscreen
    const fullscreen = await appSettingsService.has('mainWindow.fullscreen')
        ? await appSettingsService.get<boolean>('mainWindow.fullscreen')
        : false;
    
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
        x,
        y,
        width,
        height,
        fullscreen,
        fullscreenable: true,
        useContentSize: true,
        webPreferences: {
            // contextIsolation: true,
            // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
            preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
            // sandbox: false
        },
    });

    // Add main thread modules to ipcMain
    addModulesToIpcMain();

    mainWindow.loadURL(process.env.APP_URL);

    if (process.env.DEBUGGING) {
        // if on DEV or Production with debug enabled
        mainWindow.webContents.openDevTools();
    } else {
        // we're on production; no access to devtools pls
        mainWindow.webContents.on('devtools-opened', () => {
            mainWindow?.webContents.closeDevTools();
        });
    }

    mainWindow.on('closed', () => {
        mainWindow = undefined;
    });

    // Save window position when moved
    mainWindow.on('moved', async () => {
        // Retrieve window position and save it
        const position = mainWindow?.getPosition();
        if (position) {
            await appSettingsService.set('mainWindow.position', position);
        }
    });

    // Save window state when resized
    mainWindow.on('resize', async () => {
        // Don't save window size if full screen
        if (mainWindow?.fullScreen) { return; }

        // Retrieve window size and save it
        const size = mainWindow?.getSize();
        if (size) {
            await appSettingsService.set('mainWindow.size', size);
        }
    });

    // Save window state when full screen
    mainWindow.on('enter-full-screen', async () => {
        // Retrieve window size and save it
        const fullscreen = mainWindow?.fullScreen;
        await appSettingsService.set('mainWindow.fullscreen', fullscreen);
    });

    // Save window state when not in full screen
    mainWindow.on('leave-full-screen', async () => {
        // Retrieve window size and save it
        const fullscreen = mainWindow?.fullScreen;
        await appSettingsService.set('mainWindow.fullscreen', fullscreen);
    });
}