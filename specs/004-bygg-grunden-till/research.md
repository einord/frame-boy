# Phase 0 Research — Home Hub Display Foundation

## Electron + Nuxt 3 Integration
- **Decision**: Köra en Nuxt 3 app i renderer-processen via `nuxt dev --spa` under utveckling och statiskt buildad output (`.output/public`) vid produktion, serverad via custom protocol med `BrowserWindow.loadURL`. Preload-script exponerar modul-API via `contextBridge`.
- **Rationale**: Nuxt 3 (Vite) ger snabb HMR och komponentstruktur som passar widget-layout. Custom protocol avlägsnar behovet av lokal HTTP-server i produktion och förbättrar starttid.
- **Alternatives considered**:  
  - Traditionell Vue CLI + webpack: snabb att starta men sämre treeshaking och SSR-integration.  
  - Electron + vanilla Vite: kräver mer handbyggd routing/layout jämfört med Nuxts modulstöd.

## Secure Storage & Key Handling
- **Decision**: Använd `electron-store` med `encryptionKey` från en per-plattform nyckelkälla: macOS Keychain (Keytar), Windows Credential Locker, Linux Secret Service; Raspberry Pi fallback till Argon2-härledd nyckel från lokal PIN (inställningsbar), lagrad krypterad i config.
- **Rationale**: Uppfyller kravet på säker, svårhackad lagring utan att behöva extern server; stödet för keytar möjliggör centraliserad hantering på desktop. Pi fallback kräver offline-lösning men skyddar genom minnesbegränsning + salt.
- **Alternatives considered**:  
  - SQLite med SQLCipher: tungt beroende, mer komplex distribution.  
  - OS-specifika secrets endast: Pi saknar standardiserad keyring.

## Modul- och Widgetarkitektur
- **Decision**: Modulmanifest (`module-manifest.md`) definierar tjänstetyper (widget, bottom_panel, fullscreen_view, background_job). Moduler bundlas som ESM-paket med entry `registerModule` som returnerar registreringar. Laddning sker via dynamic import från `modules`-katalogen samt fjärrkatalog (signerade zip). Renderer synkar modulmetadata via IPC.
- **Rationale**: Harmoniserar med specens tjänstetyper, möjliggör tree-shaking och lazy load. Dynamic import fungerar på alla OS och stödjer framtida fjärruppdateringar.
- **Alternatives considered**:  
  - Webpack Module Federation: överdrivet för desktop bundlar.  
  - Runtime eval (sandboxed) av JS: säkerhetsrisker.

## Background Job Scheduler
- **Decision**: Main-process schemaläggare byggd ovanpå `node-cron` i minutupplösning. Varje modul registrerar jobb med `{intervalMinutes, runOnStartup, handler}`. Scheduler kör parallellt i isolerade worker threads med tidsgräns (default 30s) och rapporterar status via `BackgroundJobStatus`.
- **Rationale**: Uppfyller kravet på minsta intervall 1 minut och isolerar tunga jobb från UI. Worker threads fungerar på alla målplattformar och delar kod med Node.
- **Alternatives considered**:  
  - Electron renderer `setInterval`: risk för blockering och saknar isolering.  
  - Extern tjänst (cron server): kontra kravet på fristående offline-lösning.

## Cross-Platform Build Pipeline
- **Decision**: Använd `electron-builder` med konfigurationer för `mac (dmg)`, `win (nsis)`, `linux (AppImage + deb armv7/arm64)`. Raspberry Pi builds genereras via `electron-builder --armv7l` och testas på Pi smoke script (Playwright + instrumentation). GitHub Actions matrix: macos-latest, windows-latest, ubuntu-latest (arm builds via docker). Release pipeline signerar binärer där det är möjligt.
- **Rationale**: electron-builder stöder multi-target builds och auto-updater. Docker-baserade arm builds är etablerade. Möjliggör enhetlig releaseprocess.
- **Alternatives considered**:  
  - Electron Forge + Make targets: mindre stöd för arm.  
  - Kappta manuella scripts: högre underhållskostnad.

## Auto-Update Strategy
- **Decision**: Använd `electron-updater` (GitHub provider) för att söka efter nya releaser varje timme från stable-kanalen. Scheduler körs i main-processen (återanvänder background-job infrastrukturen) och laddar ner uppdateringen tyst; användaren notifieras om automatisk omstart behövs. Raspberry Pi builds använder samma feed via arm-artifacts.
- **Rationale**: Integrerar sömlöst med electron-builder releaser och uppfyller kravet på självgående uppdatering utan manuell nedladdning. Hourly polling påverkar inte SBC-prestanda när den körs i worker.
- **Alternatives considered**:  
  - Själv-hostad update server: överdrivet i V1 och ökar driftkostnad.
  - Manuellt "download and relaunch" script: saknar signatur- och delta-hantering samt användarvänlighet.


## SBC Performance Optimisation
- **Decision**: Reducera Nuxt bundle via komponent lazy-loading, `nuxt build --analyze` i CI, aktivera GPU acceleration (`app.commandLine.appendSwitch('enable-gpu-rasterization')`), throttla bakgrundsjobb med adaptiv scheduler, injicera metrics modul för minne/CPU i electron-store instrumentation.
- **Rationale**: Möt <150MB/<40% CPU-krav, säkerställ 60 Hz touch. GPU-acceleration och edge caching minskar CPU-belastning. Metrics behövs för Lean Hardware Footprint-principen.
- **Alternatives considered**:  
  - Använda native UI (QT): strider mot krav (Nuxt/Vue).  
  - Headless Chrome via kiosk: sämre modulär kontroll och mer minne.

## Documentation Artifacts
- `docs/adr/0001-module-architecture.md` (Plan Phase 1) dokumenterar modul-API, säkerhetshänsyn och distributionskanaler.  
- `docs/build/raspberry-pi.md` (Plan Phase 1) definierar särskilda steg för Pi-deployment och smoke tests. 

*All research items färdigställda — inga öppna NEEDS CLARIFICATION kvar.*
