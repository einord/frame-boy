import { app } from 'electron';
import { access, mkdir, readFile, writeFile } from 'fs';
import { MainModule } from '.';

export interface AppSettingsServiceFunctions {
    has: (key: string) => Promise<boolean>;
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<void>;
}

export interface AppSettings {
    name: string;
}

export class AppSettingsService implements AppSettingsServiceFunctions, MainModule<AppSettingsServiceFunctions> {
    public moduleKey = 'appSettings';
    public availableInRenderProcess: (keyof AppSettingsServiceFunctions)[] = [
        'has',
        'get',
        'set'
    ];

    public async has(key: string): Promise<boolean> {
        const appSettings = await this.readFile();
        const propertyChain = key.split('.');

        // Recursively check if the property exists
        let currentProperty = appSettings;
        for (const property of propertyChain) {
            if (!currentProperty.hasOwnProperty(property)) {
                return false;
            }
            currentProperty = (currentProperty as any)[property];
        }

        // If we end up here, the property exists
        return true;
    }

    public async get<T>(key: string): Promise<T> {
        const appSettings = await this.readFile();
        const propertyChain = key.split('.');

        // Recursively get the property
        let currentProperty = appSettings;
        for (const property of propertyChain) {
            currentProperty = (currentProperty as any)[property];
        }

        // If we end up here, the property exists and we expect it to be of type T
        return currentProperty as T;
    }

    public async set(key: string, value: any): Promise<void> {
        const appSettings = await this.readFile();
        const propertyChain = key.split('.');

        // Recursively set the property
        let currentProperty = appSettings;
        let lastProperty = '';
        for (let i = 0; i < propertyChain.length - 1; i++) {
            const property = propertyChain[i];
            lastProperty = property;
            if (!currentProperty.hasOwnProperty(property)) {
                (currentProperty as any)[property] = {};
            }
            currentProperty = (currentProperty as any)[property];
        }

        // If we end up here, the property exists and we expect it to be of type T
        (currentProperty as any)[propertyChain[propertyChain.length - 1]] = value;
        await this.saveFile(appSettings);
    }

    private readFile(): Promise<AppSettings> {
        return new Promise(async(resolve, reject) => {
            const filePath = await this.getFilePath();
            readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                const dataString = data.toString();
                const dataJson = JSON.parse(dataString);
                resolve(dataJson);
            });
        });
    }

    private saveFile(data: AppSettings): Promise<void> {
        return new Promise(async(resolve, reject) => {
            const filePath = await this.getFilePath();
            writeFile(filePath, JSON.stringify(data), (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }

    private getFilePath(): Promise<string> {
        return new Promise((resolve, reject) => {
            const folderPath = `${app.getPath('appData')}/frame-boy`;
            const fileName = 'settings.json';
            const fullPath = `${folderPath}/${fileName}`;
    
            // Ensure that the folder and file exists
            access(folderPath, err => {
                if (err?.code === 'ENOENT') {
                    mkdir(folderPath, err => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        console.log('Created folder: ' + folderPath);
                    });
                } else if (err != null) {
                    reject(err);
                } else {
                    // Ensure that the file exists
                    access(fullPath, err => {
                        if (err?.code === 'ENOENT') {
                            writeFile(fullPath, '{}', err => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                console.log('Created file: ' + fullPath);
                                resolve(fullPath);
                            });
                        } else if (err != null) {
                            reject(err);
                        } else {
                            // Return the file path
                            resolve(fullPath);
                        }
                    });
                }
            });
        });
    }
}
export const appSettingsService = new AppSettingsService();