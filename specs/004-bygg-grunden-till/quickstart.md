# Quickstart — Home Hub Display Foundation

## Prerequisites
- Node.js 20.x
- pnpm 8.x
- Python 3 & build tools (för native moduler)
- Xcode Command Line Tools (macOS) / Build Tools for Visual Studio (Windows)
- Raspberry Pi OS Bullseye/Bookworm (32/64-bit) med Node 20 (via `nvm` eller `nodejs.org` arm builds)

## Setup
```bash
pnpm install
pnpm run bootstrap        # workspace init (lerna/turbo optional)
pnpm run dev              # start Electron + Nuxt dev
```

## Running Tests
```bash
pnpm run lint
pnpm run test:unit        # Vitest
pnpm run test:integration # Vue Test Utils + composables
pnpm run test:e2e         # Playwright (touch viewport)
pnpm run test:pi-smoke    # Raspberry Pi smoke script (requires SSH target)
```

## Building
```bash
pnpm run build:renderer   # nuxt build (static)
pnpm run build:electron   # electron-builder prereq
pnpm run dist             # electron-builder matrix (mac, win, linux/arm)
```

## Configuration
- Inställningar lagras i `electron-store` (`apps/frame-boy/shared/stores/settings.ts`).
- Kopiera `.env.example` till `.env.local` för API-nycklar; känsliga värden krypteras automatiskt.
- Bundlade moduler ligger i `apps/frame-boy/modules/*`. Lägg nya moduler i samma katalog eller installera via fjärrkatalog (kommer i V1 UI).
- Auto-update konfigureras i `apps/frame-boy/electron/main/updates.ts` (GitHub provider); standardintervallet är 60 min.

## Raspberry Pi Deployment
```bash
pnpm run dist -- --linux AppImage --armv7l
scp dist/*.AppImage pi@raspberrypi.local:/opt/frame-boy/
ssh pi@raspberrypi.local 'chmod +x /opt/frame-boy/frame-boy-armv7.AppImage'
ssh pi@raspberrypi.local '/opt/frame-boy/frame-boy-armv7.AppImage --install'
```

## Troubleshooting
- Om dev server inte startar: verifiera att `pnpm run build:renderer` körts minst en gång.
- Om `electron-store` klagar på nyckel: kör `pnpm run key:reset` (raderar lokala secrets).
- För trög touch på Pi: aktivera GPU med `sudo raspi-config` → Advanced → GL (Fake KMS).
