import { build } from 'esbuild'
import { resolve } from 'node:path'

async function bundle() {
  await build({
    entryPoints: [resolve('electron/main/index.ts')],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: resolve('electron/main/index.cjs'),
    format: 'cjs',
    sourcemap: true,
    external: ['electron'],
  })

  await build({
    entryPoints: [resolve('electron/preload/index.ts')],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: resolve('electron/preload/index.cjs'),
    format: 'cjs',
    sourcemap: true,
    external: ['electron'],
  })
}

bundle().catch((error) => {
  console.error(error)
  process.exit(1)
})
