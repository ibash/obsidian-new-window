import { Plugin } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	//mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	//mySetting: 'default'
}

// This is a separate function because we serialize it and execute it in the
// main process. 
// We do this so that the listeners aren't proxy functions bound to the current
// window, and instead live within the main process.
function patchVault() {
	const ipcMain = process.mainModule!.require('electron').ipcMain
	const mapping: any = {}

	ipcMain.addListener('set-vault', function(event: any, webContentsId: any, vault: any) {
		mapping[webContentsId] = vault
		event.returnValue = null
		return
	})

	const fn = ipcMain.listeners('vault')[0]
	ipcMain.removeAllListeners('vault')
	ipcMain.addListener('vault', function(event: any) {
		if (mapping[event.sender.id]) {
			event.returnValue = mapping[event.sender.id]
			return
		}
		return fn(event)
	})
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		// await this.loadSettings();

		this.addCommand({
			id: 'new-window',
			name: 'New window',
			callback: this.openNewWindow
		});

		this.patchVault()
	}

	onunload() {
		// TODO(ibash) cleanup the patch
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	patchVault = () => {
		const electron = window.require('electron')
		electron.remote.getGlobal('eval')(`(${patchVault.toString()})()`)
	}


	openNewWindow = () => {
		const electron = window.require('electron')
		const opt = {
			width: 800,
			height: 600,
			minWidth: 200,
			minHeight: 150,
			backgroundColor: "#00000000",
			trafficLightPosition: {
				x: 19,
				y: 12
			},
			show: false,

			// TODO(ibash) set frame and titleBarStyle to whatever obsidian sets
			// it to ... is there a way to get it from the current window?
			frame: "native",
			titleBarStyle: "default",
			webPreferences: {
				contextIsolation: false,
				nodeIntegration: true,
				nodeIntegrationInWorker: true,
				spellcheck: true,
				webviewTag: true
			},
		}

		const win = new electron.remote.BrowserWindow(opt)
		electron.remote.require('@electron/remote/main').enable(win.webContents)

		const vault = electron.ipcRenderer.sendSync('vault')
		electron.ipcRenderer.sendSync('set-vault', win.webContents.id, vault)

		win.show()
		win.loadURL(location.href)
	}
}
