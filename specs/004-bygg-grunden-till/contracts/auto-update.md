# Contract: Auto-Update Service (v1)

```ts
export interface AutoUpdateConfig {
  updateFeed: string;             // GitHub releases URL
  pollIntervalMinutes: number;    // default 60, integer
  allowPrerelease: boolean;
  autoInstallOnAppQuit: boolean;  // fallback if immediate install fails
}

export interface AutoUpdateStatus {
  currentVersion: string;
  latestVersion: string | null;
  channel: 'stable' | 'beta';
  lastCheckedAt: string;          // ISO timestamp
  status: 'up-to-date' | 'downloading' | 'updating' | 'error';
  downloadProgress?: number;      // 0-100
  errorMessage?: string;
}

export interface AutoUpdateEvent {
  type: 'checking' | 'update-available' | 'up-to-date' | 'download-progress' | 'downloaded' | 'error';
  payload?: Record<string, unknown>;
}
```

## IPC Channels
- `ipcMain.handle('autoUpdate:status')` → `AutoUpdateStatus`
- `ipcMain.handle('autoUpdate:apply')` → triggers immediate install/restart
- `autoUpdate:events` (event emitter) → `AutoUpdateEvent`

## Behaviour
- Scheduler kör `autoUpdater.checkForUpdates()` varje timme.
- Vid `update-available` laddas paketet ner automatiskt; efter `downloaded` körs `autoUpdater.quitAndInstall()` om användaren godkänner (eller direkt om konfigurerat).
- Fel loggas och exponeras i `AutoUpdateStatus`.

## Validation
- `pollIntervalMinutes` måste vara >= 15 (vi använder 60 default).
- GitHub provider kräver att release är signerad och publicerad.
- ARM artifacts måste finnas för Raspberry Pi builds; annars flaggas `status = 'error'`.
