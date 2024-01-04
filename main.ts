import { Plugin } from 'obsidian'

declare global {
  var originalVaultListener: any;
}

// This is a separate function because we serialize it and execute it in the
// main process.
// We do this so that the listeners aren't proxy functions bound to the current
// window, and instead live within the main process.
function patchVault() {
  const ipcMain = process.mainModule!.require('electron').ipcMain
  const mapping: any = {}

  ipcMain.addListener(
    'set-vault',
    function (event: any, webContentsId: any, vault: any) {
      mapping[webContentsId] = vault
      event.returnValue = null
      return
    }
  )

  const fn = ipcMain.listeners('vault')[0]

  // for unpatching later
  global.originalVaultListener = fn

  ipcMain.removeAllListeners('vault')
  ipcMain.addListener('vault', function (event: any) {
    if (mapping[event.sender.id]) {
      event.returnValue = mapping[event.sender.id]
      return
    }
    return fn(event)
  })
}

function unpatchVault() {
  const fn = global.originalVaultListener

  if (!fn) {
    return
  }
  delete global.originalVaultListener

  const ipcMain = process.mainModule!.require('electron').ipcMain

  ipcMain.removeAllListeners('set-vault')
  ipcMain.removeAllListeners('vault')
  ipcMain.addListener('vault', fn)
}

export default class NewWindowPlugin extends Plugin {
  systemSettings: any = {}

  async onload() {
    this.loadSystemSettings()
    this.patchVault()

    this.addCommand({
      id: 'open-new-window',
      name: 'New window',
      callback: this.openNewWindow
    })
  }

  onunload() {
    this.unpatchVault()
  }

  // reads the obsidian.json file which contains options for how windows are
  // displayed
  loadSystemSettings() {
    const electron = window.require('electron')
    const fs = electron.remote.require('fs')
    const path = electron.remote.require('path')
    const app = electron.remote.app

    const filepath = path.join(app.getPath('userData'), 'obsidian.json')
    this.systemSettings = JSON.parse(
      fs.readFileSync(filepath, { encoding: 'utf8' })
    )
  }

  patchVault = () => {
    const electron = window.require('electron')
    electron.remote.getGlobal('eval')(`(${patchVault.toString()})()`)
  }

  unpatchVault = () => {
    const electron = window.require('electron')
    electron.remote.getGlobal('eval')(`(${unpatchVault.toString()})()`)
  }

  openNewWindow = () => {
    const electron = window.require('electron')

    const isNativeFrame = this.systemSettings.frame === 'native'
    const titleBarStyle = isNativeFrame ? 'default' : 'hidden'

    const opt = {
      width: 800,
      height: 600,
      minWidth: 200,
      minHeight: 150,
      backgroundColor: '#00000000',
      trafficLightPosition: {
        x: 19,
        y: 12
      },
      show: false,
      frame: isNativeFrame,
      titleBarStyle: titleBarStyle,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        spellcheck: true,
        webviewTag: true
      }
    }

    const win = new electron.remote.BrowserWindow(opt)
    electron.remote.require('@electron/remote/main').enable(win.webContents)

    const vault = electron.ipcRenderer.sendSync('vault')
    electron.ipcRenderer.sendSync('set-vault', win.webContents.id, vault)

    win.show()
    win.loadURL(location.href)
  }
}
