import { BrowserWindow } from 'electron';
// import path from 'path';
import { addModulesToIpcMain } from './modules';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
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
    
    // Create the browser window.
    mainWindow = new BrowserWindow({
        x,
        y,
        width,
        height,
        fullscreen,
        fullscreenable: true,
        useContentSize: true,
        webPreferences: {

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: (process.env
                .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            // preload: path.join(__dirname, "electron/preload.js")
        }
    })

    // Add main thread modules to ipcMain
    addModulesToIpcMain();

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
        if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        mainWindow.loadURL('app://./index.html')
    }

    if (process.env.WEBPACK_DEV_SERVER_URL) {
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