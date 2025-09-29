import { app, BrowserWindow } from 'electron'
import path from 'node:path'

const isDevelopment = process.env.NODE_ENV === 'development'

async function createMainWindow() {
  await app.whenReady()

  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    fullscreen: true,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/index.cjs')
    }
  })

  if (isDevelopment) {
    await window.loadURL('http://localhost:3000')
    window.webContents.openDevTools({ mode: 'detach' })
  } else {
    const indexFile = path.join(app.getAppPath(), 'renderer', 'dist', 'index.html')
    await window.loadFile(indexFile)
  }
}

app.once('ready', createMainWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    void createMainWindow()
  }
})
