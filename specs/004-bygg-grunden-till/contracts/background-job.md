# Contract: Background Job Registration (v1)

```ts
export interface BackgroundJobRegistration {
  jobId: string;                 // unique per module
  moduleId: string;
  serviceId: string;
  intervalMinutes: number;      // integer, >= 1
  runOnStartup: boolean;
  handler: () => Promise<JobResult>;
}

export interface JobResult {
  status: 'success' | 'error' | 'skipped';
  message?: string;
  payload?: Record<string, unknown>;
}

export interface BackgroundJobStatus {
  jobId: string;
  moduleId: string;
  state: 'idle' | 'running' | 'throttled' | 'error';
  lastRunAt?: string;           // ISO timestamp
  lastDurationMs?: number;
  errorMessage?: string;
}
```

## Scheduler Behaviour
- Registrering sker via `ipcRenderer.invoke('jobs:register', BackgroundJobRegistration)` under moduleinit.
- Scheduler verifierar `intervalMinutes >= 1` och lägger jobben i `node-cron` mönster `*/interval * * * *`.
- Varje körning sker i worker thread; resultat loggas i `BackgroundJobStatus` + telemetry event.
- Jobb som överskrider 30s markeras `throttled` och köhålls tills nästa intervall.

## Error Handling
- Misslyckade jobb triggar `jobs:error`-event till modulen för egen återhämtning.
- Efter tre på varandra följande fel sätts `state = 'error'` och jobben pausas tills användaren åtgärdar.

## Security
- Handler körs i isolerad worker; ingen direkt åtkomst till DOM/Electron API utan explicit IPC.
- Moduler får endast registrera jobb under init; dynamiska registreringar kräver modul reload.
