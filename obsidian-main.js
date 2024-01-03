var Ge = Object.create
var Le = Object.defineProperty
var Ze = Object.getOwnPropertyDescriptor
var Xe = Object.getOwnPropertyNames
var Qe = Object.getPrototypeOf,
  Ye = Object.prototype.hasOwnProperty
var et = (c, u, h, A) => {
  if ((u && typeof u == 'object') || typeof u == 'function')
    for (let x of Xe(u))
      !Ye.call(c, x) &&
        x !== h &&
        Le(c, x, {
          get: () => u[x],
          enumerable: !(A = Ze(u, x)) || A.enumerable
        })
  return c
}
var Ve = (c, u, h) => (
  (h = c != null ? Ge(Qe(c)) : {}),
  et(
    u || !c || !c.__esModule
      ? Le(h, 'default', {
          value: c,
          enumerable: !0
        })
      : h,
    c
  )
)
var G = class {
  constructor() {
    ;(this.rawRules = []), (this.rules = [])
  }
  addList(u) {
    for (let h of u.split(`
`))
      this.add(h)
  }
  add(u) {
    if (
      (this.rawRules.push(u),
      (u = u.trim()),
      (u = u.replace(/[\r\n]/g, '')),
      u.length <= 3 || u[0] === '!')
    )
      return
    let h = {
      hasStart: !1,
      hasEnd: !1,
      rule: u,
      text: u,
      domain: !1,
      items: []
    }
    if (u.indexOf('##') >= 0) return
    if (u.indexOf('@@') === 0) return
    if (u[0] === '|' && u[1] === '|') {
      h.domain = !0
      let E = u.slice(2)
      h.text = Ue(E)
    } else
      u[0] === '|'
        ? ((h.hasStart = !0), (h.text = u.slice(1)))
        : u[u.length - 1] === '|' &&
          ((h.hasEnd = !0), (h.text = u.slice(0, -1)))
    let A = h.text.lastIndexOf('$')
    if (A >= 0) {
      h.text = h.text.slice(0, A)
      return
    }
    if (
      (h.text[0] === '/' && h.text[h.text.length - 1] === '/') ||
      h.text.length <= 3
    )
      return
    let x = h.text.split(/\*+/).filter(function (E) {
      return E
    })
    for (let E = 0; E < x.length; E++) {
      let C = x[E],
        O = C.split('^')
      if (O.length > 0)
        for (let T = 0; T < O.length; T++) {
          let I = O[T]
          if (I === '') continue
          let q = O[T - 1],
            L = O[T + 1]
          h.items.push({
            text: I,
            before: q !== void 0,
            after: L !== void 0
          })
        }
      else
        h.items.push({
          text: C,
          before: !1,
          after: !1
        })
    }
    this.rules.push(h)
  }
  clearRules() {
    ;(this.rules = []), (this.rawRules = [])
  }
  matches(u) {
    let h = {}
    for (let A = 0; A < this.rules.length; A++) {
      let x = this.rules[A]
      if (tt(x, u, h)) return !0
    }
    return !1
  }
}

function tt(c, u, h) {
  let A = c.items
  c.domain &&
    (h.domainUrl ? (u = h.domainUrl) : ((u = Ue(u)), (h.domainUrl = u)))
  let x = -1
  for (let E = 0; E < A.length; E++) {
    let C = A[E],
      O = u.indexOf(C.text, x + 1)
    if (O <= x || ((x = O), c.hasStart && E === 0 && O !== 0)) return !1
    if (c.hasEnd && E === A.length - 1) {
      let T = u.length - C.text.length
      if (O !== T) return !1
    }
    if (C.before && !We(u[x - 1])) return !1
    if (C.after) {
      let T = x + C.text.length
      if (u[T] !== void 0 && !We(u[T])) return !1
    }
  }
  return !0
}

function We(c) {
  return c === '/' || c === ':' || c === '?' || c === '=' || c === '&'
}

function Ue(c) {
  return (
    c.indexOf('https://') === 0 && (c = c.slice(8)),
    c.indexOf('http://') === 0 && (c = c.slice(7)),
    c.indexOf('www.') === 0 && (c = c.slice(4)),
    c
  )
}
var i = require('electron'),
  g = Ve(require('fs')),
  D = Ve(require('path')),
  Ne = require('url')

function qe(c, u) {
  return c.length <= u ? c : c.slice(0, u - 1).trim() + '\u2026'
}
var v = process.platform === 'darwin',
  N = process.platform === 'win32',
  nt = process.versions.electron,
  rt = parseInt(nt.split('.')[0])

function j(c, u) {
  return c ? u() : []
}

function je(c) {
  let u = []
  for (let h = 0; h < c; h++) u.push(((Math.random() * 16) | 0).toString(16))
  return u.join('')
}

function _e(c) {
  return typeof c == 'string' && /^[\\\/]{2,}[^\\\/]+[\\\/]+[^\\\/]+/.test(c)
}

function He(c, u, h) {
  let { editFlags: A, misspelledWord: x, dictionarySuggestions: E } = h,
    C = h.selectionText.trim(),
    O = C.length > 0,
    T = !!h.linkURL,
    I = (M) => A[`can${M}`] && O,
    q = h.isEditable || O,
    L = [
      ...j(v, () => [
        {
          label: `Look up \u201C${
            C.length <= 40 ? C : C.slice(0, 39).trim() + '\u2026'
          }\u201D`,
          visible: O && !T,
          click() {
            u.showDefinitionForSelection()
          }
        },
        {
          type: 'separator'
        }
      ]),
      {
        accelerator: 'CmdOrCtrl+X',
        label: 'Cut',
        role: I('Cut') ? 'cut' : void 0,
        enabled: I('Cut'),
        visible: h.isEditable
      },
      {
        accelerator: 'CmdOrCtrl+C',
        label: 'Copy',
        role: I('Copy') ? 'copy' : void 0,
        enabled: I('Copy'),
        visible: h.isEditable || O
      },
      {
        accelerator: 'CmdOrCtrl+V',
        label: 'Paste',
        role: A.canPaste ? 'paste' : void 0,
        enabled: A.canPaste,
        visible: h.isEditable
      },
      {
        accelerator: 'CmdOrCtrl+Shift+V',
        label: 'Paste as text',
        role: A.canPaste ? 'pasteAndMatchStyle' : void 0,
        enabled: A.canPaste,
        visible: h.isEditable
      }
    ]
  if (x && x.length >= 1) {
    let M = []
    E && E.length > 0
      ? E.slice(0, 5).forEach((z) => {
          M.push({
            label: z,
            click: () => {
              u.replaceMisspelling(z)
            }
          })
        })
      : M.push({
          label: 'No suggestion',
          enabled: !1
        }),
      M.push({
        label: 'Add to Dictionary',
        click: () => {
          u.session.addWordToSpellCheckerDictionary(x), u.replaceMisspelling(x)
        }
      }),
      M.push({
        type: 'separator'
      }),
      (L = M.concat(L)),
      (q = !0)
  }
  q &&
    i.Menu.buildFromTemplate(L).popup({
      window: c
    })
}

function U(c, u) {
  try {
    return c()
  } catch (h) {
    return console.error(h), u
  }
}
module.exports = function (c, u, h) {
  if (rt < 18) {
    i.dialog.showErrorBox(
      'Manual update required',
      'This version of Obsidian is no longer supported. Please download and install the latest version from https://obsidian.md'
    ),
      i.shell.openExternal('https://obsidian.md/download'),
      i.app.quit()
    return
  }
  if (!(process.mas || i.app.requestSingleInstanceLock())) {
    i.app.quit()
    return
  }
  let A = ['SharedArrayBuffer']
  for (let e of process.argv)
    e.startsWith('--enable-features=') &&
      (A = A.concat(
        e
          .substring(18)
          .split(',')
          .map((o) => o.trim())
      ))
  i.app.commandLine.appendSwitch('enable-features', A.join(',')),
    process.on('uncaughtException', function (e) {
      if (
        (console.error('Uncaught Exception', e),
        e.message.includes(
          'Render frame was disposed before WebFrameMain could be accessed'
        ))
      )
        return
      let l =
        `Uncaught Exception:
` + (e.stack ? e.stack : `${e.name}: ${e.message}`)
      i.dialog.showErrorBox(
        'A JavaScript error occurred in the main process',
        l
      )
    })
  let x = '',
    E = !1
  u.on('update-manual-required', () => (x = 'update-manual-required')),
    u.on('update-downloaded', () => (x = 'update-downloaded')),
    u.on('check-start', () => (E = !0)),
    u.on('check-end', () => (E = !1))
  let C = i.app.getPath('userData'),
    O = (() => {
      try {
        return i.app.getPath('documents')
      } catch (e) {}
      try {
        let e = D.join(i.app.getPath('home'), 'Documents')
        if (e && g.existsSync(e)) return e
      } catch (e) {}
      return C
    })(),
    T = (() => {
      try {
        return i.app.getPath('desktop')
      } catch (e) {}
      try {
        let e = D.join(i.app.getPath('home'), 'Desktop')
        if (e && g.existsSync(e)) return e
      } catch (e) {}
      return C
    })(),
    I = {},
    q = new G(),
    L = (e) => D.join(C, e + '.json')

  function M(e, o) {
    U(() => g.writeFileSync(L(e), JSON.stringify(o)))
  }

  function z(e) {
    return U(() => JSON.parse(g.readFileSync(L(e), 'utf8')) || {}, {})
  }

  function ge(e) {
    U(() => g.unlinkSync(L(e)))
  }
  let ne = null
  async function Z() {
    let e = D.join(C, 'adblock')
    g.existsSync(e) || g.mkdirSync(e)
    let o = b.hasOwnProperty('adblockFrequency') ? b.adblockFrequency : Se,
      l = new G(),
      a = b.adblock || Ee
    for (let d of a) {
      let t = D.basename(d),
        n = D.join(e, t),
        r = !0
      try {
        let s = await g.promises.stat(n),
          f = (new Date().getTime() - s.mtime.getTime()) / 864e5
        r = o === 0 ? !1 : f >= o
      } catch (s) {}
      if (!r) {
        let s = D.join(e, D.basename(d)),
          f = await g.promises.readFile(s, 'utf8')
        l.addList(f)
        continue
      }
      console.log(`Retrieving newer version of ${d}`)
      try {
        let f = await (await i.net.fetch(d)).text()
        await g.promises.writeFile(n, f), l.addList(f)
      } catch (s) {
        console.log('Failed to retrieve adblock list: ' + s)
      }
    }
    ;(q = l),
      ne !== null && clearTimeout(ne),
      o !== 0 && ((o = Math.min(o, 24)), (ne = setTimeout(Z, o * 864e5)))
  }

  function ze(e) {
    try {
      return g.accessSync(e, g.constants.R_OK | g.constants.W_OK), !0
    } catch (o) {
      return !1
    }
  }
  let re = (() => {
      let e = D.join(c, 'package.json')
      try {
        if (g.existsSync(e))
          return JSON.parse(g.readFileSync(e, 'utf8')).version
      } catch (o) {}
      return i.app.getVersion()
    })(),
    ie = 'file://'
  N && (ie = 'file:///')
  async function X(e, o, l, a) {
    let d = o.match(/^([a-z][a-z0-9+\-.]*):/i),
      t = d ? d[1].toLowerCase() : ''
    if (!t || t === xe || t === 'about') return
    if (
      t !== 'http' &&
      t !== 'https' &&
      t !== 'obsidian' &&
      !(b.openSchemes && b.openSchemes[t])
    ) {
      let s = await i.dialog.showMessageBox(e, {
        message:
          `Are you sure you want to open this link?

Link: ` + qe(o, 200),
        type: 'question',
        buttons: ['Open this link', 'Cancel'],
        defaultId: 1,
        cancelId: 1,
        title: 'Open link',
        checkboxLabel: 'Always open ' + t + ': links in the future'
      })
      if (s.response !== 0) return
      t &&
        s.checkboxChecked &&
        ((b.openSchemes = b.openSchemes || {}), (b.openSchemes[t] = !0), k())
    }
    if (t === 'http' || t === 'https') {
      let s = 'tab',
        f = !1
      l === 'new-window'
        ? ((s = 'window'), (f = !0))
        : a === 'split'
          ? ((s = 'split'), (f = !0))
          : l === 'background-tab'
            ? ((s = 'tab'), (f = !1))
            : l === 'foreground-tab' && ((s = 'tab'), (f = !0))
      let y = `(() => {let e = new CustomEvent('open-url', ${JSON.stringify({
        cancelable: !0,
        detail: { url: o, leaf: s, active: f }
      })}); window.dispatchEvent(e); return e.defaultPrevented;})()`
      if (await e.webContents.executeJavaScript(y)) return
    }
    if (!o.startsWith(ie))
      return console.log('Opening URL: ' + o), i.shell.openExternal(o)
    let n = o.lastIndexOf('#'),
      r = ''
    n !== -1 && ((r = o.substr(n)), (o = o.substr(0, n))),
      (o = decodeURIComponent(o.substr(ie.length))),
      (o = D.normalize(o) + r),
      !(
        _e(o) &&
        (
          await i.dialog.showMessageBox(e, {
            message:
              `This file is located on a remote server, and may be dangerous.
Are you sure you want to open it?

Location: ` + o,
            type: 'warning',
            buttons: ['Open this file', 'Cancel'],
            defaultId: 1,
            cancelId: 1,
            title: 'Remote file warning'
          })
        ).response !== 0
      ) && (console.log('Opening file: ' + o), be(o))
  }

  function be(e) {
    !N && !v
      ? i.shell.openExternal((0, Ne.pathToFileURL)(e).href)
      : i.shell.openPath(e)
  }

  function ye(e) {
    if (i.remote)
      try {
        i.remote.enable(e)
      } catch (o) {
        console.error(o)
      }
  }

  function De(e, o) {
    let l = e.webContents
    we(l),
      ye(l),
      l.on('will-navigate', (t, n) => {
        n.indexOf(Ae) !== 0 &&
          (t.preventDefault(), n.indexOf(V) !== 0 && X(e, n))
      }),
      N &&
        e.on('app-command', (t, n) => {
          n === 'browser-backward'
            ? l.executeJavaScript('history.back()')
            : n === 'browser-forward' &&
              l.executeJavaScript('history.forward()')
        }),
      e.on('swipe', (t, n) => {
        n === 'left'
          ? l.executeJavaScript('history.back()')
          : n === 'right' && l.executeJavaScript('history.forward()')
      }),
      e.on('focus', () => {
        ;(e.focusTime = Date.now()),
          te(),
          pe(J(e), 'window-always-on-top', {
            checked: e.isAlwaysOnTop(),
            enabled: !o
          })
      }),
      e.on('always-on-top-changed', () => {
        e === i.BrowserWindow.getFocusedWindow() &&
          pe(J(e), 'window-always-on-top', {
            checked: e.isAlwaysOnTop()
          })
      }),
      e.on('maximize', () => {
        e.isAlwaysOnTop() && e.setAlwaysOnTop(!1)
      }),
      e.on('enter-full-screen', () => {
        e.isAlwaysOnTop() && e.setAlwaysOnTop(!1)
      })
    let a = () =>
      e.webContents.executeJavaScript(
        "window.dispatchEvent(new Event('focuschange'));"
      )
    e.on('focus', a), e.on('blur', a)
    let d = () =>
      l.executeJavaScript(
        "window.dispatchEvent(new Event('fullscreenchange'));"
      )
    e.on('enter-full-screen', d), e.on('leave-full-screen', d)
  }

  function we(e) {
    e.isSecured ||
      ((e.isSecured = !0),
      e.setWindowOpenHandler((o) => {
        if (
          o.url === 'about:blank' &&
          o.features &&
          o.features.startsWith('popup')
        ) {
          let l = o.features.split(','),
            a = {}
          for (let d of l) {
            let [t, n] = d.split('=')
            ;(t === 'x' || t === 'y' || t === 'width' || t === 'height') &&
              (a[t] = parseInt(n))
          }
          return {
            action: 'allow',
            overrideBrowserWindowOptions: {
              trafficLightPosition: {
                x: 19,
                y: 12
              },
              autoHideMenuBar: !0,
              frame: Q,
              titleBarStyle: le,
              ...Fe(a),
              webPreferences: {
                contextIsolation: !1,
                nodeIntegration: !0,
                nodeIntegrationInWorker: !0,
                spellcheck: !0,
                webviewTag: !0,
                affinity: 'main-window',
                backgroundThrottling: !1
              }
            }
          }
        }
        try {
          let { url: l, disposition: a, frameName: d } = o
          X(i.BrowserWindow.fromWebContents(e), l, a, d)
        } catch (l) {
          console.error(l)
        }
        return {
          action: 'deny'
        }
      }),
      e.on('will-attach-webview', (o, l) => {
        delete l.preload,
          delete l.preloadURL,
          (l.sandbox = !0),
          (l.nodeIntegration = !1),
          (l.nodeIntegrationInWorker = !1),
          (l.nodeIntegrationInSubFrames = !1),
          (l.webSecurity = !0),
          (l.plugins = !1),
          (l.experimentalFeatures = !1),
          (l.webviewTag = !1)
      }),
      e.on('did-attach-webview', (o, l) => {
        l.setWindowOpenHandler((a) => {
          let { url: d, disposition: t, frameName: n } = a
          if (/^https?:\/\//.test(d))
            try {
              X(i.BrowserWindow.fromWebContents(l), d, t, n)
            } catch (r) {
              console.error(r)
            }
          return {
            action: 'deny'
          }
        }),
          l.on('will-navigate', (a, d) => {
            ;/^https?:\/\//.test(d) || a.preventDefault()
          }),
          l.on('will-frame-navigate', (a) => {
            ;/^https?:\/\//.test(a.url) || a.preventDefault()
          }),
          l.on('will-attach-webview', (a) => {
            a.preventDefault()
          })
      }))
  }

  function Fe(e) {
    let o = {
      width: 800,
      height: 600
    }
    U(() => {
      let a = i.screen.getPrimaryDisplay().workArea
      ;(o.width = Math.min(1024, a.width)),
        (o.height = Math.min(800, a.height - 1))
    })
    let l = !1
    if (
      e.x !== void 0 &&
      e.y !== void 0 &&
      e.width !== void 0 &&
      e.height !== void 0
    )
      try {
        for (let a of i.screen.getAllDisplays()) {
          let d = a.workArea
          if (
            e.x < d.x + d.width - 2 &&
            e.x + e.width > d.x + 2 &&
            e.y < d.y + d.height - 2 &&
            e.y + e.height > d.y + 2
          ) {
            l = !0
            break
          }
        }
      } catch (a) {
        console.error(a)
      }
    else
      e.x === void 0 &&
        e.y === void 0 &&
        e.width !== void 0 &&
        e.height !== void 0 &&
        (l = !0)
    return (
      l &&
        ((o.x = e.x), (o.y = e.y), (o.width = e.width), (o.height = e.height)),
      o.width < 300 && (o.width = 300),
      o.height < 200 && (o.height = 200),
      o
    )
  }
  let Je = D.join(O, 'Obsidian Vault'),
    Ce = D.join(C, 'Obsidian Sandbox'),
    Ke = D.join(C, 'Obsidian Help'),
    xe = 'app',
    oe = xe + '://',
    V = oe + 'obsidian.md/',
    se = oe + je(36) + '/',
    Ae = V + 'index.html',
    Ee = [
      'https://easylist.to/easylist/easylist.txt',
      'https://easylist.to/easylist/easyprivacy.txt'
    ],
    Se = 4,
    Oe = ['clipboard-read', 'clipboard-sanitized-write'],
    b = z('obsidian')
  ;(!b || typeof b != 'object') && (b = {})
  let F = b.vaults || {}
  $e()
  for (let e in F) {
    let o = F[e]
    ;(o.path = D.resolve(o.path)),
      (!o.path || o.path === Ke || !g.existsSync(o.path)) &&
        (delete F[e], ge(e))
  }
  ;(b.vaults = F), b.insider && u.emit('insider', !0)
  let Q = b.frame === 'native',
    le = Q ? 'default' : 'hidden'
  if (
    (b.updateDisabled &&
      (u.emit('disable', !0), console.log('Updates disabled.')),
    b.disableGpu && !i.app.isReady())
  )
    try {
      i.app.disableHardwareAcceleration(),
        console.log('GPU Acceleration disabled.')
    } catch (e) {
      console.error(e)
    }
  let P
  b.icon && g.existsSync(D.join(C, b.icon)) && (P = D.join(C, b.icon)),
    !P && h && (P = D.join(c, 'icon-dev.png'))

  function k() {
    M('obsidian', b)
  }

  function ve(e, o) {
    let l = F[e]
    l && (o ? (l.open = !0) : delete l.open, k())
  }
  async function $e() {
    let e = D.join(C, 'Partitions')
    try {
      let o = await g.promises.readdir(e)
      if (!o) return
      for (let l of o) {
        let a = l.replace(/^vault-/, '')
        F[a] || (await ke(a))
      }
    } catch (o) {
      o.code !== 'ENOENT' && console.error('ERROR: ' + o)
    }
  }
  async function ke(e) {
    console.log('Removing partition for vault ' + e)
    let o = D.join(C, 'Partitions', `vault-${e}`)
    return g.promises.rm(o, {
      recursive: !0,
      force: !0
    })
  }
  let B = {},
    ae = new WeakMap(),
    ue = !1,
    Y = null,
    ee = Be([], !0)

  function J(e) {
    if (!e) return ee
    for (; !e.appMenu && ae.has(e); ) e = ae.get(e)
    return e.appMenu || ee
  }

  function te() {
    let e = i.BrowserWindow.getFocusedWindow()
    if (!e || !v) return
    let o = J(e)
    i.Menu.setApplicationMenu(o)
  }

  function Be(e, o = !1) {
    let l = []
    for (let n = e.length - 1; n >= 0; n--) {
      let r = e[n]
      ;(r.label === '&Window' || r.label === '&Help') &&
        (l.push(r), e.splice(n, 1))
    }

    function a(n) {
      n.forEach((r) => {
        if (r.appCommand) {
          let s = r.appCommand
          ;(r.id = s),
            (r.click = (f, p, y) => {
              if (!p) {
                let m = fe()
                if (m)
                  if (((p = B[m]), p && p.isMinimized())) p.restore()
                  else return
              }
              p &&
                (!y.triggeredByAccelerator ||
                  (!y.shiftKey && !y.ctrlKey && !y.metaKey && !y.altKey)) &&
                p.webContents.executeJavaScript(
                  `app.commands.executeCommandById(${JSON.stringify(s)})`
                )
            }),
            delete r.appCommand
        }
        'submenu' in r && a(r.submenu)
      })
    }

    function d(n) {
      let r = []
      for (let s of n) {
        let f = r.find((p) => (p.id && p.id === s.id) || p.label === s.label)
        if (f)
          for (let p of s.submenu) {
            let y = p.before && f.submenu.findIndex((m) => m.id === p.before[0])
            y != null ? f.submenu.splice(y, 0, p) : f.submenu.push(p)
          }
        else r.push(s)
      }
      return r
    }
    let t = d([
      ...j(v, () => [
        {
          label: 'Obsidian',
          submenu: [
            {
              label: 'About Obsidian',
              async click(n, r) {
                let s = `Version ${re} (Installer ${i.app.getVersion()})`
                ;(
                  await i.dialog.showMessageBox(r, {
                    message: 'Obsidian',
                    icon: D.join(c, 'icon.png'),
                    detail: `${s}

Copyright \xA9 2023 Dynalist Inc.`,
                    type: 'info',
                    buttons: ['OK', 'Copy'],
                    defaultId: 0,
                    cancelId: 0
                  })
                ).response === 1 &&
                  i.clipboard.writeText(`About Obsidian
${s}`)
              }
            },
            {
              type: 'separator'
            },
            {
              id: 'preferences-section',
              visible: !1,
              label: ''
            },
            {
              type: 'separator'
            },
            {
              role: 'services'
            },
            {
              type: 'separator'
            },
            {
              label: 'Hide Obsidian',
              click: () => i.app.hide(),
              accelerator: 'Cmd+H'
            },
            {
              role: 'hideOthers'
            },
            {
              role: 'unhide'
            },
            {
              type: 'separator'
            },
            {
              label: 'Quit Obsidian',
              click: () => i.app.quit(),
              accelerator: 'Cmd+Q'
            }
          ]
        }
      ]),
      {
        label: '&File',
        submenu: [
          {
            id: 'open-section',
            type: 'separator'
          },
          {
            id: 'open-vault',
            click: $,
            label: 'Open Vault...'
          },
          ...j(v || N, () => [
            {
              role: 'recentDocuments',
              submenu: [
                {
                  label: 'Clear Recent',
                  role: 'clearRecentDocuments'
                }
              ]
            }
          ]),
          {
            type: 'separator'
          },
          ...j(o, () => [
            {
              id: 'close-window',
              role: 'close'
            }
          ]),
          ...j(!v, () => [
            {
              type: 'separator'
            },
            {
              id: 'quit',
              role: 'quit'
            }
          ])
        ]
      },
      {
        label: '&Edit',
        submenu: [
          {
            type: 'separator',
            id: 'undo-section'
          },
          {
            role: 'undo'
          },
          {
            role: 'redo'
          },
          {
            type: 'separator',
            id: 'copy-section'
          },
          {
            role: 'cut'
          },
          {
            role: 'copy'
          },
          {
            role: 'paste'
          },
          {
            role: 'pasteAndMatchStyle',
            accelerator: v ? 'Cmd+Shift+V' : 'Shift+CommandOrControl+V'
          },
          {
            label: 'Paste and Match Style',
            accelerator: v
              ? 'Cmd+Option+Shift+V'
              : 'Shift+CommandOrControl+Alt+V',
            click: (n, r) => r.webContents.pasteAndMatchStyle(),
            visible: !1
          },
          {
            role: 'delete'
          },
          {
            role: 'selectAll'
          },
          ...j(v, () => [
            {
              type: 'separator',
              id: 'speech-section'
            },
            {
              label: 'Speech',
              submenu: [
                {
                  role: 'startSpeaking'
                },
                {
                  role: 'stopSpeaking'
                }
              ]
            }
          ])
        ]
      },
      ...e,
      {
        label: '&View',
        submenu: [
          ...j(h, () => [
            {
              role: 'reload'
            }
          ]),
          {
            id: 'actual-size',
            label: 'Actual Size',
            accelerator: 'CommandOrControl+0',
            click(n, r) {
              r && (r.webContents.zoomLevel = 0)
            }
          },
          {
            label: 'Zoom In',
            accelerator: 'CommandOrControl+=',
            click(n, r) {
              r &&
                r.webContents.executeJavaScript(`
									(() => {
										let wf = require('electron').webFrame;
										let zoom = wf.getZoomLevel();
										if (zoom < 3) {
											wf.setZoomLevel(zoom + 0.5);
										}
									})()
								`)
            }
          },
          {
            label: 'Zoom Out',
            accelerator: 'CommandOrControl+-',
            click(n, r) {
              r &&
                r.webContents.executeJavaScript(`
									(() => {
										let wf = require('electron').webFrame;
										let zoom = wf.getZoomLevel();
										if (zoom > -2.5) {
											wf.setZoomLevel(zoom - 0.5);
										}
									})()
								`)
            }
          },
          {
            id: 'developer-section',
            type: 'separator'
          },
          {
            role: 'forceReload',
            accelerator: ''
          },
          {
            role: 'toggleDevTools'
          },
          {
            type: 'separator'
          },
          {
            role: 'togglefullscreen'
          }
        ]
      },
      {
        label: '&Window',
        role: 'window',
        submenu: [
          {
            role: 'minimize',
            accelerator: v ? 'CommandOrControl+M' : ''
          },
          {
            role: 'front'
          },
          {
            type: 'separator'
          },
          {
            id: 'window-always-on-top',
            checked: !1,
            enabled: !1,
            type: 'checkbox',
            label: 'Always on Top',
            click(n, r) {
              if (r) {
                let s = r.isAlwaysOnTop()
                r.setAlwaysOnTop(!s)
              }
            }
          }
        ]
      },
      {
        label: '&Help',
        role: 'help',
        submenu: [
          {
            label: 'Open Help',
            click: () => Re()
          },
          {
            type: 'separator',
            id: 'help-links'
          },
          {
            label: 'Homepage',
            click: () => i.shell.openExternal('https://obsidian.md')
          },
          {
            label: 'Community',
            click: () => i.shell.openExternal('https://obsidian.md/community')
          },
          {
            label: 'Help Center',
            click: () => i.shell.openExternal('https://help.obsidian.md/')
          },
          {
            type: 'separator'
          }
        ]
      },
      ...l
    ])
    return a(t), i.Menu.buildFromTemplate(t)
  }

  function fe() {
    let e = null,
      o = null
    for (let l in B) {
      let a = B[l]
      a.isDestroyed() ||
        ((!e || a.focusTime > e.focusTime) && ((e = a), (o = l)))
    }
    return o
  }

  function K(e) {
    if (B[e]) {
      let m = B[e]
      return m.isMinimized() && m.restore(), m.focus(), m
    }
    let o = z(e),
      l = {
        width: 800,
        height: 600,
        minWidth: 200,
        minHeight: 150,
        backgroundColor: '#00000000',
        trafficLightPosition: {
          x: 19,
          y: 12
        },
        show: !1,
        frame: Q,
        titleBarStyle: le,
        webPreferences: {
          contextIsolation: !1,
          nodeIntegration: !0,
          nodeIntegrationInWorker: !0,
          spellcheck: !0,
          webviewTag: !0
        },
        ...Fe(o)
      },
      a = new i.BrowserWindow(l)
    B[e] = a
    let d = a.webContents,
      t = !1,
      n = () => {
        if (t) return
        ;(t = !0),
          o.isMaximized && a.maximize(),
          o.devTools && d.openDevTools(),
          a.show()
        let m = o.zoom
        m &&
          typeof m == 'number' &&
          d.executeJavaScript(
            `require('electron').webFrame.setZoomLevel(${o.zoom})`
          )
      }
    ;(a.menuBarVisible = !1), P && !v && U(() => a.setIcon(P))

    function r() {
      return !a.isMaximized() && !a.isMinimized() && !a.isFullScreen()
    }

    function s() {
      try {
        let m = a.getBounds()
        r() &&
          ((o.x = m.x),
          (o.y = m.y),
          (o.width = m.width),
          (o.height = m.height)),
          (o.isMaximized = a.isMaximized()),
          (o.devTools = d.isDevToolsOpened()),
          (o.zoom = d.zoomLevel)
      } catch (m) {}
    }
    d.on('did-finish-load', () => {
      a.loaded = !0
    }),
      De(a, !0)
    let f = (m) => {
      m.on('context-menu', (R, w) => {
        if (Y && Y === d.id) {
          Y = null
          try {
            let {
              editFlags: S,
              misspelledWord: W,
              dictionarySuggestions: me
            } = w
            d.send('context-menu', {
              editFlags: S,
              misspelledWord: W,
              dictionarySuggestions: me,
              webContentsId: m.id
            })
            return
          } catch (S) {
            console.error(S)
          }
        }
        He(a, m, w)
      })
    }
    f(d),
      a.on('close', (m) => {
        s(),
          M(e, o),
          setTimeout(() => {
            !m.defaultPrevented && !a.isDestroyed() && a.destroy()
          }, 3e3)
      }),
      a.on('closed', () => {
        delete B[e],
          !ue && i.BrowserWindow.getAllWindows().length > 0 && ve(e, !1)
      })
    let p

    function y() {
      clearTimeout(p), (p = setTimeout(s, 100))
    }
    return (
      a.on('resize', y),
      a.on('move', y),
      a.on('ready-to-show', n),
      d.on('did-create-window', (m) => {
        let R = m.webContents
        ae.set(m, a), P && !v && U(() => m.setIcon(P)), De(m, !1), f(R)
      }),
      a.loadURL(Ae).then(n, n),
      ve(e, !0),
      a
    )
  }

  function Te(e) {
    let o = new i.BrowserWindow({
      width: 800,
      height: 600,
      resizable: !1,
      maximizable: !1,
      fullscreenable: !1,
      show: !1,
      frame: Q,
      titleBarStyle: le,
      webPreferences: {
        contextIsolation: !1,
        nodeIntegration: !0
      },
      ...e
    })
    return (
      P && !v && U(() => o.setIcon(P)),
      ye(o.webContents),
      (o.menuBarVisible = !1),
      o.on('focus', () => {
        te()
      }),
      o
    )
  }
  let _

  function $() {
    if (_) {
      _.isMinimized() && _.restore(), _.focus()
      return
    }
    let e = (_ = Te({
      width: 800,
      height: 650
    }))
    e.on('closed', () => {
      _ = null
    })
    let o = () => e.show()
    e.loadURL(V + 'starter.html').then(o, o)
  }
  let H

  function Re() {
    if (H) {
      H.isMinimized() && H.restore(), H.focus()
      return
    }
    let e = (H = Te({
      width: 600,
      height: 600
    }))
    e.on('closed', () => {
      H = null
    })
    let o = () => e.show()
    e.loadURL(V + 'help.html').then(o, o)
  }
  let ce = null
  i.app.on('will-finish-launching', () => {
    i.app.once('open-url', (e, o) => {
      e.preventDefault(), (ce = o)
    })
  })
  let de = () => {
    for (let e in F) F[e].open && K(e)
    Object.keys(B).length === 0 && $()
  }

  function pe(e, o, l) {
    let a = e.getMenuItemById(o)
    if (a) for (let d in l) a[d] = l[d]
  }
  i.app.whenReady().then(() => {
    i.app.on('second-instance', (t, n) => {
      Pe(n) || $()
    }),
      i.protocol.registerFileProtocol('app', (t, n) => {
        let r = t.url,
          s = !1
        r.indexOf('?') > 0 && (r = r.substr(0, r.indexOf('?'))),
          r.indexOf('#') > 0 && (r = r.substr(0, r.indexOf('#'))),
          r.indexOf(V) === 0
            ? ((r = decodeURIComponent(r.substr(V.length))),
              (r = D.resolve(D.join(c, r))),
              r.indexOf(D.resolve(c)) !== 0 && (r = ''),
              (s = !0))
            : r.indexOf(se) === 0
              ? ((r = decodeURIComponent(r.substr(se.length))),
                N || (r = '/' + r),
                (r = D.resolve(r)),
                _e(r) && (s = !0))
              : (r = '')
        let f = {}
        s && (f['X-Frame-Options'] = 'DENY'),
          n({
            path: r,
            headers: f
          })
      }),
      i.ipcMain.on('is-dev', (t) => {
        t.returnValue = h
      }),
      i.ipcMain.on('desktop-dir', (t) => {
        t.returnValue = T
      }),
      i.ipcMain.on('documents-dir', (t) => {
        t.returnValue = O
      }),
      i.ipcMain.on('resources', (t) => {
        t.returnValue = c
      }),
      i.ipcMain.on('version', (t) => {
        t.returnValue = re
      }),
      i.ipcMain.on('file-url', (t) => {
        t.returnValue = se
      }),
      i.ipcMain.on('relaunch', (t) => {
        ;(t.returnValue = ''),
          console.log('Relaunching!'),
          (ue = !0),
          i.app.relaunch(),
          i.app.quit()
      }),
      i.ipcMain.on('update', (t) => {
        t.returnValue = x
      }),
      i.ipcMain.on('check-update', (t, n) => {
        n &&
          (b.updateDisabled && u.emit('disable', !1),
          u.emit('check'),
          b.updateDisabled && setTimeout(() => u.emit('disable', !0), 50)),
          (t.returnValue = E)
      }),
      i.ipcMain.on('disable-update', (t, n) => {
        n === !0
          ? ((b.updateDisabled = !0),
            u.emit('disable', !0),
            k(),
            console.log('Updates disabled.'))
          : n === !1 &&
            (delete b.updateDisabled,
            u.emit('disable', !1),
            k(),
            console.log('Updates enabled.')),
          (t.returnValue = b.updateDisabled)
      }),
      i.ipcMain.on('disable-gpu', (t, n) => {
        n === !0
          ? ((b.disableGpu = !0), k())
          : n === !1 && (delete b.disableGpu, k()),
          (t.returnValue = b.disableGpu)
      }),
      i.ipcMain.on('insider-build', (t, n) => {
        n === !0
          ? ((b.insider = !0), u.emit('insider', !0), k())
          : n === !1 && (delete b.insider, u.emit('insider', !1), k()),
          (t.returnValue = b.insider)
      }),
      i.ipcMain.on('frame', (t, n) => {
        typeof n == 'string' && ((b.frame = n), n || delete b.frame, k()),
          (t.returnValue = b.frame)
      }),
      i.ipcMain.on('adblock-lists', (t, n) => {
        Array.isArray(n) && ((b.adblock = n), k(), Z()),
          (t.returnValue = b.adblock || Ee)
      }),
      i.ipcMain.on('adblock-frequency', (t, n) => {
        typeof n == 'number' && ((b.adblockFrequency = n), k(), Z()),
          (t.returnValue = b.adblockFrequency || Se)
      }),
      i.ipcMain.on('print-to-pdf', async (t, n) => {
        console.log('Saving PDF...')
        let r = t.sender
        try {
          let { filepath: s } = n,
            f = await r.printToPDF(n)
          await g.promises.writeFile(s, f), n.open && be(s)
        } finally {
          console.log('Done.'), r.send('print-to-pdf', {})
        }
      }),
      i.ipcMain.on('vault', (t) => {
        for (let n in B)
          if (B[n].webContents === t.sender) {
            t.returnValue = {
              id: n,
              path: D.resolve(F[n].path)
            }
            return
          }
        t.returnValue = {}
      }),
      i.ipcMain.on('vault-list', (t) => {
        t.returnValue = F
      }),
      i.ipcMain.on('vault-remove', (t, n) => {
        if (n && typeof n == 'string') {
          for (let r in F)
            if (F[r].path === n) {
              if (B[r]) {
                t.returnValue = !1
                return
              }
              ;(t.returnValue = !0), delete F[r], k(), ge(r), ke(r)
              return
            }
        }
        t.returnValue = !1
      }),
      i.ipcMain.on('vault-move', (t, n, r) => {
        if (n && typeof n == 'string')
          for (let s in F) {
            let f = F[s]
            if (f.path === n) {
              if (B[s]) {
                t.returnValue = 'EVAULTOPEN'
                return
              }
              try {
                g.renameSync(n, r)
              } catch (p) {
                t.returnValue = p.toString()
                return
              }
              ;(t.returnValue = ''), (f.path = r), k()
              return
            }
          }
        t.returnValue = !1
      }),
      i.ipcMain.on('vault-open', (t, n, r) => {
        if (r) {
          if (g.existsSync(n)) {
            t.returnValue = 'Vault already exists'
            return
          }
          try {
            g.mkdirSync(n, {
              recursive: !0
            })
          } catch (s) {
            t.returnValue = s.toString()
            return
          }
        }
        t.returnValue = l(n)
      }),
      i.ipcMain.on('vault-message', (t, n, r) => {
        n = D.resolve(n)
        for (let s in F)
          if (F[s].path === n) {
            Me(s, r)
            break
          }
        t.returnValue = ''
      }),
      i.ipcMain.on('starter', (t) => {
        ;(t.returnValue = null), $()
      }),
      i.ipcMain.on('help', (t) => {
        ;(t.returnValue = null), Re()
      }),
      i.ipcMain.on('sandbox', (t) => {
        ;(t.returnValue = null), a()
      }),
      i.ipcMain.on('context-menu', (t) => {
        Y = t.sender.id
      }),
      i.ipcMain.on('request-url', async (t, n, r) => {
        let { url: s, method: f, contentType: p, body: y, headers: m } = r,
          R = i.net.request({
            url: s,
            method: f,
            redirect: 'follow'
          })
        if ((p && R.setHeader('Content-Type', p), m))
          for (let w in m)
            try {
              R.setHeader(w, m[w])
            } catch (S) {
              console.error(S)
            }
        R.on('login', (w, S) => S()),
          R.on('error', (w) => {
            t.reply(n, {
              error: w
            })
          }),
          R.on('response', (w) => {
            let S = []
            w.on('data', (W) => S.push(W)),
              w.on('end', () => {
                let W = Buffer.concat(S),
                  me = W.buffer.slice(W.byteOffset, W.byteOffset + W.byteLength)
                t.reply(n, {
                  status: w.statusCode,
                  headers: w.headers,
                  body: me
                })
              })
          })
        try {
          typeof y == 'string'
            ? R.write(y)
            : y instanceof ArrayBuffer &&
              R.write(Buffer.from(new Uint8Array(y))),
            R.end()
        } catch (w) {
          t.reply(n, {
            error: w
          })
        }
      }),
      i.ipcMain.on('open-url', (t, n) => {
        let r = i.BrowserWindow.fromWebContents(t.sender)
        r && typeof n == 'string' && X(r, n)
      }),
      i.ipcMain.on('trash', async (t, n) => {
        try {
          await i.shell.trashItem(n), (t.returnValue = !0)
        } catch (r) {
          console.log(r), (t.returnValue = !1)
        }
      }),
      i.ipcMain.on('get-documents-path', (t) => {
        t.returnValue = O
      }),
      i.ipcMain.on('get-sandbox-vault-path', (t) => {
        t.returnValue = Ce
      }),
      i.ipcMain.on('get-default-vault-path', (t) => {
        t.returnValue = Je
      }),
      i.ipcMain.on('set-menu', (t, { template: n }) => {
        let r = i.BrowserWindow.fromWebContents(t.sender)
        if (!r) return
        let s = Be(n)
        ;(r.appMenu = s), v ? te() : r.setMenu(s)
      }),
      i.ipcMain.on('update-menu-items', (t, n, r) => {
        let s = i.BrowserWindow.fromWebContents(t.sender),
          f = J(s)
        if (f !== ee) {
          for (let { itemId: p, eState: y } of n) pe(f, p, y)
          r && te()
        }
      }),
      i.ipcMain.on('render-menu', (t) => {
        let n = i.BrowserWindow.fromWebContents(t.sender)
        J(n).popup({
          window: n
        })
      }),
      i.ipcMain.on('set-icon', (t, n, r) => {
        b.icon &&
          g.rmSync(D.join(C, b.icon), {
            force: !0
          }),
          n && r ? g.writeFileSync(D.join(C, n), r) : (n = null),
          (b.icon || '') !== (n || '') &&
            (n ? (b.icon = n) : delete b.icon, k()),
          (t.returnValue = null)
      }),
      i.ipcMain.on('get-icon', (t) => {
        t.returnValue = b.icon
      }),
      i.ipcMain.on('create-browser-session', async (t, n, r) => {
        let s = I[n]
        s ||
          (r === !0 && Z(),
          (s = {
            session: i.session.fromPartition('persist:vault-' + n),
            adblock: !!r
          }),
          (I[n] = s),
          s.session.setUserAgent(
            s.session
              .getUserAgent()
              .split(' ')
              .filter((f) => !/^(obsidian|electron)/i.test(f))
              .join(' ')
          ),
          s.session.webRequest.onBeforeRequest(
            {
              urls: ['https://*/*', 'http://*/*']
            },
            (f, p) => {
              let y = s.adblock && q.matches(f.url)
              p({
                cancel: y
              })
            }
          ),
          s.session.webRequest.onBeforeSendHeaders(
            {
              urls: ['https://*/*', 'http://*/*']
            },
            (f, p) => {
              let { requestHeaders: y } = f
              for (let m in y)
                m.toLowerCase() === 'sec-fetch-dest' ||
                m.toLowerCase() === 'sec-ch-ua'
                  ? delete y[m]
                  : m.toLowerCase() === 'user-agent' &&
                    f.url.startsWith('https://accounts.google.com/') &&
                    (y[m] = 'Chrome')
              p({
                requestHeaders: y
              })
            }
          ),
          s.session.setPermissionCheckHandler((f, p, y) => Oe.includes(p)),
          s.session.setPermissionRequestHandler((f, p, y, m) => {
            y(Oe.includes(p))
          }),
          s.session.setDevicePermissionHandler((f) => !1)),
          (r === !0 || r === !1) && (s.adblock = r)
      })
    let e = i.session.defaultSession.webRequest
    e.onBeforeRequest(
      {
        urls: [oe + '*/*']
      },
      (t, n) => {
        let { frame: r, url: s } = t,
          f = r.origin,
          p = !0
        f + '/' === V && (p = !1),
          f === 'null' && r === r.top && s.startsWith(V) && (p = !1),
          n({
            cancel: p
          })
      }
    ),
      e.onBeforeSendHeaders(
        {
          urls: ['https://*/*', 'http://*/*']
        },
        (t, n) => {
          let { requestHeaders: r } = t
          for (let s in r)
            (s.toLowerCase() === 'sec-fetch-dest' ||
              s.toLowerCase() === 'sec-ch-ua') &&
              delete r[s]
          n({
            requestHeaders: r
          })
        }
      ),
      e.onHeadersReceived(
        {
          urls: ['https://*/*', 'http://*/*']
        },
        (t, n) => {
          let {
              responseHeaders: r,
              url: s,
              resourceType: f,
              frame: p,
              webContents: y
            } = t,
            m = f === 'subFrame'
          try {
            if (!m) {
              let w = y.mainFrame
              m = w.framesInSubtree
                .filter((S) => S !== w)
                .some(
                  (S) =>
                    S.routingId === p.routingId && S.processId === p.processId
                )
            }
          } catch (w) {}
          let R = !1
          for (let w in r)
            w.toLowerCase() === 'access-control-allow-origin' && (R = !0),
              w.toLowerCase() === 'x-frame-options' && delete r[w],
              w.toLowerCase() === 'cross-origin-opener-policy' && delete r[w],
              w.toLowerCase() === 'content-security-policy' &&
                (r[w] = r[w].map((S) =>
                  S.replace(/\s*frame-ancestors [^;]*(;|$)/g, '')
                )),
              w.toLowerCase() === 'set-cookie' &&
                m &&
                (r[w] = r[w].map((S) =>
                  /Secure;/i.test(S)
                    ? S.replace(/SameSite=Lax/i, 'SameSite=None')
                    : S
                ))
          n({
            responseHeaders: r
          })
        }
      )
    let o = () => !1
    ;(e.onBeforeRequest = o),
      (e.onBeforeSendHeaders = o),
      (e.onHeadersReceived = o)
    for (let t of [i.protocol, i.session.defaultSession.protocol])
      (t.interceptBufferProtocol = o),
        (t.interceptStreamProtocol = o),
        (t.interceptStringProtocol = o),
        (t.interceptFileProtocol = o),
        (t.interceptHttpProtocol = o),
        (t.handle = o)
    i.session.defaultSession.setPermissionRequestHandler((t, n, r, s) => {
      let f = t.getURL().startsWith(V)
      s.isMainFrame &&
        s.requestingUrl === 'about:blank' &&
        n.startsWith('clipboard-') &&
        (f = !0),
        n === 'openExternal' ? (f = !1) : n === 'fullscreen' && (f = !0),
        f || console.log('Blocked permission request', t.getURL(), n, s),
        r(f)
    })

    function l(t) {
      if (t && typeof t == 'string') {
        if (((t = D.resolve(t)), !g.existsSync(t))) return 'folder not found'
        if (!ze(t)) return 'no permission to access folder'
        for (let r in F) {
          let s = F[r]
          if (s.path === t)
            return (s.ts = Date.now()), K(r), i.app.addRecentDocument(t), !0
        }
        let n = je(16)
        return (
          (F[n] = {
            path: t,
            ts: Date.now()
          }),
          K(n),
          i.app.addRecentDocument(t),
          !0
        )
      }
      return 'folder not found'
    }

    function a() {
      let t = D.join(c, 'sandbox'),
        n = Ce
      for (let r in B) {
        let s = F[r]
        if (s.path === n) {
          ;(s.ts = Date.now()), K(r)
          return
        }
      }
      try {
        g.rmSync
          ? g.rmSync(n, {
              recursive: !0
            })
          : g.rmdirSync(n, {
              recursive: !0
            })
      } catch (r) {
        r.code !== 'ENOENT' && console.error(r)
      }
      d(t, n), l(n)
    }

    function d(t, n) {
      g.mkdirSync(n, {
        recursive: !0
      })
      let r = g.readdirSync(t)
      for (let s of r) {
        let f = D.join(t, s),
          p = g.statSync(f),
          y = n + '/' + s
        p.isFile() && g.writeFileSync(y, g.readFileSync(f)),
          p.isDirectory() && d(f, y)
      }
    }
    if (
      (i.app.setAboutPanelOptions({
        applicationName: 'Obsidian',
        applicationVersion: re + ' (installer ' + i.app.getVersion() + ')',
        version: '',
        copyright: 'Copyright \xA9 Dynalist Inc.',
        website: 'https://obsidian.md'
      }),
      v && U(() => i.app.dock.setIcon(P)),
      i.Menu.setApplicationMenu(ee),
      i.app.on('web-contents-created', (t, n) => {
        we(n),
          (n.noContextMenu = !1),
          n.hostWebContents &&
            n.on('context-menu', (r, s) => {
              n.noContextMenu || He(i.BrowserWindow.fromWebContents(n), n, s)
            })
      }),
      i.app.on('open-file', function (t, n) {
        t.preventDefault()
        let r = D.resolve(n),
          s = ''
        for (let f in F) {
          let p = F[f].path
          r.startsWith(p) && s.length < p.length && (s = p)
        }
        s && l(s)
      }),
      i.app.on('window-all-closed', () => {
        v || i.app.quit()
      }),
      i.app.on('before-quit', () => {
        ue = !0
      }),
      i.app.on('activate', () => {
        i.BrowserWindow.getAllWindows().length === 0 && de()
      }),
      Pe(process.argv),
      ce && he(ce),
      i.app.on('open-url', function (t, n) {
        t.preventDefault(), he(n)
      }),
      Object.keys(B).length === 0)
    )
      de()
    else {
      for (let t in F) B[t] || delete F[t].open
      k()
    }
  }),
    !h &&
      !i.app.isDefaultProtocolClient('obsidian') &&
      i.app.setAsDefaultProtocolClient('obsidian')
  let Ie = 'obsidian://'

  function he(e) {
    if (!e.startsWith(Ie)) return
    let o = e
    console.log('Received callback URL', e), (e = e.substr(Ie.length))
    let l = {}
    if (e.startsWith('/')) {
      let n = e
      N && (n = e.substr(1)), (l.action = 'open'), (l.path = decodeURI(n))
    } else if (e.startsWith('sync-setup')) {
      $()
      return
    } else if (e.startsWith('vault/')) {
      e = e.substr(6)
      let n = e.split('/').map((r) => decodeURIComponent(r))
      ;(l.action = 'open'), (l.vault = n[0]), (l.file = n.slice(1).join('/'))
    } else {
      let n = '',
        r = '',
        s = e.indexOf('?'),
        f = e.indexOf('#', Math.max(0, s))
      f >= 0 && ((r = e.substr(f + 1)), (e = e.substr(0, f)), (l.hash = r)),
        s >= 0 && ((n = e.substr(s + 1)), (e = e.substr(0, s)))
      for (let p of n.split('&')) {
        let y = p.split('='),
          m = !0
        y.length > 1 && (m = decodeURIComponent(y[1])),
          (l[decodeURIComponent(y[0])] = m)
      }
      l.action = e.replace(/\/+$/g, '')
    }
    let a = null,
      d = l.path,
      t = l.vault
    if (d && typeof d == 'string') {
      let n = D.resolve(d),
        r = ''
      for (let s in F) {
        let f = F[s].path
        n.startsWith(f) && r.length < f.length && ((r = f), (a = s))
      }
      a && (l.file = n.substr(r.length))
    } else if (t && typeof t == 'string')
      for (let n in F) {
        let r = F[n].path
        if (n === t || D.basename(r).toUpperCase() === t.toUpperCase()) {
          a = n
          break
        }
      }
    else (a = fe()), a || de(), (a = fe())
    a
      ? Me(a, l)
      : i.dialog.showErrorBox(
          'Vault not found',
          'Unable to find a vault for the URL ' + o
        )
  }

  function Me(e, o) {
    let l = K(e),
      a = JSON.stringify(o),
      d = `var w=window;if(typeof w.OBS_ACT === "function"){w.OBS_ACT(${a})}else{w.OBS_ACT=${a}}`,
      t = l.webContents
    l.loaded
      ? t.executeJavaScript(d)
      : t.once('did-finish-load', () => t.executeJavaScript(d))
  }

  function Pe(e) {
    for (let o of e) if (o.startsWith('obsidian://')) return he(o), !0
    return !1
  }
}
