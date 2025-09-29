# Data Model — Home Hub Display Foundation

## Core Entities

### ModuleManifest
- **moduleId** (`string`, slug) — unikt ID.
- **name** (`string`) — visningsnamn.
- **version** (`semver string`).
- **author** (`string`).
- **services** (`ModuleServiceCapability[]`) — vilka tjänstetyper exponeras (subset av `{widget, bottom_panel, fullscreen_view, background_job}`).
- **defaultEnabled** (`boolean`).
- **description** (`string`).
- **icon** (`string | null`, data-URI eller path).
- **configSchema** (`JSONSchema | null`) — modulens egna inställningar.
- **lastUpdatedAt** (`ISO timestamp`).
- **origin** (`'bundled' | 'remote'`).
- **signature** (`string | null`) — för fjärrmoduler (signatur/checksum).

### ModuleServiceCapability
- **type** (`'widget' | 'bottom_panel' | 'fullscreen_view' | 'background_job'`).
- **id** (`string`) — unik inom modulen.
- **name** (`string`).
- **description** (`string`).
- **entry** (`string`) — path till ESM entry.
- **minSize** (`GridSize | null`) — endast för widget/bottom.
- **maxSize** (`GridSize | null`).
- **defaultSize** (`GridSize | null`).
- **supportsFullScreen** (`boolean`, endast widget).
- **polling** (`BackgroundJobConfig | null`) — endast background_job.

### WidgetDefinition
- **widgetId** (`string`) — globalt unik.
- **moduleId** (`string`).
- **serviceId** (`string`).
- **title** (`string`).
- **layout** (`WidgetLayout`).
- **settings** (`Record<string, unknown>`).
- **enabled** (`boolean`).

### WidgetLayout
- **gridCellSize** (`'small' | 'medium' | 'large'`).
- **position** (`GridPosition`).
- **span** (`GridSpan`).

### GridPosition
- **row** (`number`, 0-index).
- **column** (`number`, 0-index).

### GridSpan
- **width** (`number`, >=1).
- **height** (`number`, >=1).

### BackgroundJob
- **jobId** (`string`).
- **moduleId** (`string`).
- **serviceId** (`string`).
- **intervalMinutes** (`number`, >=1).
- **runOnStartup** (`boolean`).
- **status** (`BackgroundJobStatus`).
- **lastRunAt** (`ISO timestamp | null`).
- **lastResult** (`'success' | 'error' | 'skipped' | null`).
- **errorMessage** (`string | null`).

### BackgroundJobStatus
- **state** (`'idle' | 'running' | 'throttled' | 'error'`).
- **cpuMs** (`number`).
- **memoryMb** (`number`).
- **lastDurationMs** (`number`).

### DeviceProfile
- **deviceId** (`string`).
- **platform** (`'macos' | 'windows' | 'raspberrypi'`).
- **screenResolution** (`{ width: number; height: number }`).
- **touchEnabled** (`boolean`).
- **hideCursor** (`boolean`).
- **gridCellSize** (`'small' | 'medium' | 'large'`) — default i hushållet.
- **performanceBudget** (`{ ramMb: number; cpuPercent: number }`).
- **gpuAcceleration** (`boolean`).

### AutoUpdateStatus
- **currentVersion** (`string`).
- **latestVersion** (`string | null`).
- **channel** (`'stable'`) — V1 använder enbart stable-feed.
- **lastCheckedAt** (`ISO timestamp`).
- **status** (`'up-to-date' | 'downloading' | 'updating' | 'error'`).
- **errorMessage** (`string | null`).
- **downloadProgress** (`number | null`, 0-100).

### AutoUpdateConfig
- **updateFeed** (`string`) — GitHub releases URL.
- **pollIntervalMinutes** (`number`, default 60).
- **allowPrerelease** (`boolean`).
- **autoInstallOnAppQuit** (`boolean`).

### SettingsStore
- **layout** (`ViewLayout`).
- **modules** (`ModuleSettings[]`).
- **secrets** (`SecretSetting[]`).
- **device** (`DeviceProfile`).

### ModuleSettings
- **moduleId** (`string`).
- **enabled** (`boolean`).
- **configuredServices** (`ConfiguredService[]`).
- **config** (`Record<string, unknown>`).

### ConfiguredService
- **serviceId** (`string`).
- **target** (`'widget' | 'bottom_panel' | 'fullscreen_view' | 'background_job'`).
- **layout** (`WidgetLayout | null`).
- **menuOrder** (`number | null`).

### SecretSetting
- **key** (`string`).
- **value** (`string`, krypterad).*
- **moduleId** (`string | null`).
- **createdAt** (`ISO timestamp`).
- **updatedAt** (`ISO timestamp`).

### ViewLayout
- **gridCellSize** (`'small' | 'medium' | 'large'`).
- **widgets** (`WidgetDefinition[]`).
- **bottomPanel** (`ConfiguredService | null`).
- **fullscreenViews** (`ConfiguredService[]`).

### TelemetryEvent
- **eventId** (`string`).
- **timestamp** (`ISO`).
- **type** (`'cpu' | 'memory' | 'renderDuration' | 'interaction'`).
- **payload** (`Record<string, unknown>`).

## Relationships
- Ett **ModuleManifest** har många **ModuleServiceCapability**.  
- Ett **ViewLayout** refererar till flera **WidgetDefinition** som pekar tillbaka till **ModuleManifest** via `moduleId`.  
- **BackgroundJob** instanser ägs av **ModuleManifest**.  
- **SecretSetting** kan knytas till en modul (eller global).  
- **AutoUpdateStatus** och **AutoUpdateConfig** hör ihop med DeviceProfile (per enhet) och uppdateras av auto-update scheduler.  
- **TelemetryEvent** loggas mot DeviceProfile och ModuleIds (för Lean Hardware uppföljning).

## State Transitions
- **Widget drag/resize**: uppdaterar `WidgetLayout.position/span`. Validation säkerställer att nya värden ligger inom grid och respekterar modulens min/max.  
- **Module activation**: ändrar `ModuleSettings.enabled` och lägger till/ta bort `ConfiguredService`.  
- **Background job cycle**: `status.state` → `running` → `success|error|throttled` baserat på resultat och budgets.  
- **Secret update**: krypterad `value` uppdateras och timestamp bumpas; audit log via `TelemetryEvent` (kategori `interaction`).

## Validation Rules
- `ModuleManifest.services.type` måste vara inom standarduppsättningen.  
- `WidgetLayout.span` får inte understiga modulens `minSize` eller överstiga `maxSize`.  
- `ConfiguredService.menuOrder` är unik per target.  
- `BackgroundJob.intervalMinutes` >= 1; scheduler validerar integer.  
- Auto-update checks körs minst var 60:e minut och blockerar inte UI-tråden.  
- `SecretSetting.value` lagras endast krypterad (inga plaintext writes).  
- DeviceProfile.performanceBudget <= konstitutionens gränser (<150MB/<40%).

*Not: SecretSetting lagras krypterat via electron-store, ingen plaintext i minne vid persist.*
