import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}


/*
z = window.require('electron')
//y = new z.remote.BrowserWindow()


opt = {
  width: 800,
  height: 600,
  minWidth: 200,
  minHeight: 150,
  backgroundColor: "#00000000",
  trafficLightPosition: {
    x: 19,
    y: 12
  },
  show: !1,
  frame: "native",
  titleBarStyle: "default",
  webPreferences: {
    contextIsolation: !1,
    nodeIntegration: !0,
    nodeIntegrationInWorker: !0,
    spellcheck: !0,
    webviewTag: !0
  },
}


y = new z.remote.BrowserWindow(opt)
y.show()

z.ipcRenderer.sendSync('vault-list')
{
    "2081afd8feedc2e6": {
        "path": "/Users/islam/Vault",
        "ts": 1704221217378,
        "open": true
    }
}

z.remote.ipcMain.removeAllListeners('vault')
z.remote.ipcMain.on('vault', (t) => {
  t.returnValue = {
    id: '2081afd8feedc2e6',
    path: '/Users/islam/Vault'
  }
})

z.remote.require('@electron/remote/main').enable(y.webContents)
*/

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();


		this.addCommand({
			id: 'new-window',
			name: 'New Window (ibash)',
			callback: this.openNewWindow
//			callback: () => {
//				console.log('yay')
//				const electron = window.require('electron')
//				console.log('electron', electron)
//				//new SampleModal(this.app).open();
//			}
		});

		this.patchVault()


		/*
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
		*/
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	patchVault = () => {
		const electron = window.require('electron')
		electron.remote.ipcMain.removeAllListeners('vault')
		// TODO(ibash) get the vault from the "vault-list" sendSync event
		electron.remote.ipcMain.on('vault', (t: any) => {
			t.returnValue = {
				id: '2081afd8feedc2e6',
				path: '/Users/islam/Vault'
			}
		})
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
			show: !1,
			frame: "native",
			titleBarStyle: "default",
			webPreferences: {
				contextIsolation: !1,
				nodeIntegration: !0,
				nodeIntegrationInWorker: !0,
				spellcheck: !0,
				webviewTag: !0
			},
		}

		const win = new electron.remote.BrowserWindow(opt)
		electron.remote.require('@electron/remote/main').enable(win.webContents)
		win.show()
		win.loadURL(location.href)

	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
