# Contract: Module Manifest (v1)

```ts
export type ModuleServiceType =
  | 'widget'
  | 'bottom_panel'
  | 'fullscreen_view'
  | 'background_job';

export interface ModuleManifest {
  moduleId: string;            // slug, unique
  name: string;
  version: string;            // semver
  author?: string;
  description?: string;
  origin: 'bundled' | 'remote';
  icon?: string;              // data URI or asset path
  defaultEnabled: boolean;
  services: ModuleServiceCapability[];
  configSchema?: JSONSchema;
  signature?: string;         // remote modules only
}

export interface ModuleServiceCapability {
  type: ModuleServiceType;
  id: string;                 // unique per module
  name: string;
  description?: string;
  entry: string;              // relative ESM path
  minSize?: GridSize;         // widget/bottom only
  maxSize?: GridSize;
  defaultSize?: GridSize;
  supportsFullScreen?: boolean; // widgets that can pop out
  menuOrder?: number;         // fullscreen menu ordering
  polling?: BackgroundJobConfig; // background job only
}

export interface GridSize {
  width: number;  // cells
  height: number; // cells
}

export interface BackgroundJobConfig {
  intervalMinutes: number; // >= 1
  runOnStartup: boolean;
  description?: string;
}
```

## Validation Rules
- `moduleId`, `services[].id` och `services[].entry` måste vara unika.
- `services[].type` måste matcha standarduppsättningen.
- Widgets måste definiera `defaultSize` inom `minSize`/`maxSize` (om angivna).
- Background jobs måste ha `intervalMinutes >= 1`.

## Notes
- Manifest laddas via dynamic import och valideras innan aktivering.
- `signature` används för att verifiera fjärrmoduler innan installation.
