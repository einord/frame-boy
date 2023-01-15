import { ipcMain } from 'electron';
import { appSettingsService } from './app-settings';

export interface MainModule<T = object> {
    moduleKey: string;
    availableInRenderProcess: (keyof T)[];
}

const allModules: MainModule<any>[] = [
    appSettingsService
];

/**
 * Adds main process modules to the ipcMain object.
 * Any class that inherits the MainModule interface will be added to the ipcMain object.
 */
export function addModulesToIpcMain() {
    for (const module of allModules) {
        for (const handle of module.availableInRenderProcess) {
            const channel = `${module.moduleKey}.${handle.toString()}`;
            console.log('Adding channel: ' + channel);
            ipcMain.handle(channel, (event, ...args) => module[handle](...args));
        }
    }
}