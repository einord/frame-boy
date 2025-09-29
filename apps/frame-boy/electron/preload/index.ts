import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('frameBoy', {
  version: '0.1.0',
})
