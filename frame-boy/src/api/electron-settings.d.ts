import { AppSettingsServiceFunctions } from "@/electron/modules/app-settings";

declare global {
    interface Window {
        settings: AppSettingsServiceFunctions;
    }
}
