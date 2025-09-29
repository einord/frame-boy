# Tasks: Home Hub Display Foundation

**Input**: Design documents from `/specs/004-bygg-grunden-till/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
   → quickstart.md: Extract test + deployment flows
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests, hardware smoke
   → Core: models, services, UI, scheduler, auto-update
   → Integration: secure storage, telemetry, packaging
   → Polish: verify performance, docs, release notes
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
   → Include UX validation and hardware budget verification tasks before release
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have model tasks?
   → Auto-update + scheduler referenced?
   → Raspberry Pi smoke covered?
9. Return: SUCCESS (tasks ready for execution)
```

## Phase 3.1: Setup
- [X] T001 Initialize pnpm workspace + Electron/Nuxt scaffold in `apps/frame-boy/package.json` and `apps/frame-boy/nuxt.config.ts` (follow plan.md Technical Context).
- [ ] T002 Configure linting/formatting (ESLint, Prettier, TypeScript config) across repo (`package.json`, `.eslintrc.cjs`, `.prettierrc`) ensuring CI compatibility.
- [ ] T003 Create baseline build pipeline configs (`build/builders/electron-builder.{yml,json}`) for macOS, Windows, Raspberry Pi (research.md Cross-Platform Build Pipeline).

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] Author Vitest contract tests for module manifests (`apps/frame-boy/tests/contract/module-manifest.spec.ts`) covering rules in `contracts/module-manifest.md`.
- [ ] T005 [P] Author Vitest contract tests for widget registration (`apps/frame-boy/tests/contract/widget-registration.spec.ts`) per `contracts/widget-registration.md`.
- [ ] T006 [P] Author Vitest contract tests for background job registration (`apps/frame-boy/tests/contract/background-job.spec.ts`).
- [ ] T007 [P] Author Vitest contract tests for auto-update service (`apps/frame-boy/tests/contract/auto-update.spec.ts`).
- [ ] T008 Create Playwright e2e spec `apps/frame-boy/tests/e2e/home-screen.spec.ts` covering: fullscreen menu navigation, widget layout edit, SBC resource budget assertions (plan.md Acceptance Scenarios).

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T009 [P] Implement TypeScript domain models for modules/services (`apps/frame-boy/shared/types/module.ts`) referencing `data-model.md` ModuleManifest/ModuleServiceCapability.
- [ ] T010 [P] Implement layout + widget models (`apps/frame-boy/shared/types/layout.ts`) for WidgetDefinition/ViewLayout/Grid types.
- [ ] T011 [P] Implement system models (`apps/frame-boy/shared/types/system.ts`) containing BackgroundJob, AutoUpdateStatus/Config, TelemetryEvent per data-model.
- [ ] T012 Scaffold Electron main process (`apps/frame-boy/electron/main/index.ts`) to launch Nuxt renderer, preload bridges, kiosk full-screen (plan.md Structure Decision).
- [ ] T013 Implement secure `electron-store` wrapper (`apps/frame-boy/shared/stores/settings.ts`) with keytar/Argon2 handling (research.md Secure Storage).
- [ ] T014 Implement module loader + manifest validation (`apps/frame-boy/electron/main/services/module-loader.ts`) wired to contracts/module-manifest.
- [ ] T015 Implement widget registry + grid layout manager (`apps/frame-boy/renderer/nuxt-app/plugins/widget-registry.ts`) satisfying `contracts/widget-registration.md` and FR-012–FR-017.
- [ ] T016 Implement background job scheduler with worker threads (`apps/frame-boy/electron/main/services/background-scheduler.ts`) enforcing 1-minute intervals and telemetry hooks.
- [ ] T017 Implement auto-update service (`apps/frame-boy/electron/main/updates/index.ts`) using electron-updater, hourly check, stable channel only (`contracts/auto-update.md`).
- [ ] T018 Build Nuxt main UI layout + menu (`apps/frame-boy/renderer/nuxt-app/pages/index.vue`) showing widget grid, bottom panel, fullscreen buttons (spec acceptance).
- [ ] T019 Implement settings mode UI for drag/resize + module activation (`apps/frame-boy/renderer/nuxt-app/pages/settings.vue`) persisting layout via settings store.
- [ ] T020 Bundle core modules (clock, weather, calendar, home status) under `apps/frame-boy/modules/core-*` implementing manifest + widget entrypoints.

## Phase 3.4: Integration
- [ ] T021 Wire IPC channels between renderer and main for widgets/jobs/auto-update (`apps/frame-boy/electron/main/ipc/index.ts`, `apps/frame-boy/renderer/nuxt-app/plugins/ipc.ts`).
- [ ] T022 Instrument telemetry & logs (`apps/frame-boy/shared/services/telemetry.ts`) capturing memory/CPU, job durations, auto-update events.
- [ ] T023 Integrate electron-builder scripts with CI matrix and Raspberry Pi smoke script (`.github/workflows/release.yml`, `build/pipelines/pi-smoke.sh`).
- [ ] T024 Implement docs/adr/0001-module-architecture.md capturing module/auto-update decisions (plan.md Governance alignment).

## Phase 3.5: Polish & Validation
- [ ] T025 [P] Finalize unit tests for layout + settings store (`apps/frame-boy/tests/unit/layout-store.spec.ts`) ensuring FR-015 auto-correction.
- [ ] T026 [P] Extend Playwright suite with auto-update download simulation and touch accessibility checks (`apps/frame-boy/tests/e2e/auto-update.spec.ts`).
- [ ] T027 [P] Run Raspberry Pi hardware smoke (per quickstart) and capture results in `docs/build/raspberry-pi.md`.
- [ ] T028 [P] Document Quickstart additions (auto-update config, release flow) in `quickstart.md` & create release notes template `docs/release-notes/template.md`.

## Dependencies
- Setup (T001-T003) before any tests or implementation.
- Tests (T004-T008) must fail before implementing corresponding services (T009-T017).
- T009-T011 precede services using those models (T012-T020).
- Auto-update service (T017) depends on module loader (T014) and settings store (T013).
- IPC wiring (T021) depends on T014-T019.
- Telemetry (T022) depends on scheduler (T016) and auto-update (T017).
- CI packaging (T023) depends on build config (T003) and auto-update (T017).
- Polish tasks (T025-T028) require integration tasks complete.

## Parallel Example
```
# After setup, run contract tests in parallel:
/specs 004-bygg-grunden-till/tasks T004 T005 T006 T007
```

## Notes
- [P] tasks = independent files (parallel-safe).
- Ensure Playwright tests target touch viewport (quickstart.md) and record failure state before implementation.
- Maintain <150MB/<40% CPU budgets – instrument telemetry during implementation (T022, T027).
