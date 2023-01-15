import { AppSettingsServiceFunctions } from "src-electron/modules/app-settings";

declare global {
    interface Window {
        settings: AppSettingsServiceFunctions;
    }
}
