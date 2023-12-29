import { app, dialog } from 'electron'
const { exec, spawn } = require('child_process');
import fs from 'fs'
import path from 'path'
import robotjs from 'robotjs'

const IS_PROD = process.env.NODE_ENV === 'production'

let root_path = path.dirname(app.getPath('exe'))
let ss_path = path.join(root_path, 'resources', 'lib', 'ss')
if (!IS_PROD) {
  root_path =  path.join(__dirname)
  ss_path = path.join(__dirname, '../src/lib', 'ss')
}

const config = {
  "version": "4.4.1.0",
  "configs": [
    {
      "server": "qq.miaomiao.press",
      "server_port": 8860,
      "password": "123456",
      "method": "none",
      "timeout": 5,
      "warnLegacyUrl": false
    }
  ],
  "onlineConfigSource": [],
  "strategy": null,
  "index": 0,
  "global": false,
  "enabled": true,
  "shareOverLan": true,
  "firstRun": false,
  "localPort": 1080,
  "portableMode": true,
  "showPluginOutput": true,
  "pacUrl": "",
  "useOnlinePac": false,
  "secureLocalPac": true,
  "regeneratePacOnUpdate": true,
  "autoCheckUpdate": false,
  "checkPreRelease": false,
  "skippedUpdateVersion": "",
  "isVerboseLogging": true,
  "isIPv6Enabled": false,
  "generateLegacyUrl": false,
  "geositeUrl": "",
  "geositeSha256sumUrl": "",
  "geositeDirectGroups": [
    "private",
    "cn",
    "geolocation-!cn@cn"
  ],
  "geositeProxiedGroups": [
    "geolocation-!cn"
  ],
  "geositePreferDirect": false,
  "userAgent": "ShadowsocksWindows/$version",
  "logViewer": {
    "topMost": false,
    "wrapText": false,
    "toolbarShown": false,
    "Font": "Consolas, 8pt",
    "BackgroundColor": "Black",
    "TextColor": "White"
  },
  "proxy": {
    "useProxy": false,
    "proxyType": 0,
    "proxyServer": "",
    "proxyPort": 0,
    "proxyTimeout": 3,
    "useAuth": false,
    "authUser": "",
    "authPwd": ""
  },
  "hotkey": {
    "SwitchSystemProxy": "",
    "SwitchSystemProxyMode": "",
    "SwitchAllowLan": "",
    "ShowLogs": "Ctrl+Shift+L",
    "ServerMoveUp": "",
    "ServerMoveDown": "",
    "RegHotkeysAtStartup": true
  },
  "WebProxy": {
    "_BypassOnLocal": false,
    "_ProxyAddress": "http://127.0.0.1:1080",
    "_BypassList": null,
    "_UseDefaultCredentials": false
  }
}

function startSS (msg) {
  config.configs[0].server = msg.ip || ''
  config.configs[0].server_port = msg.port || ''
  config.configs[0].password = msg.password
  config.configs[0].method = msg.encrypt
  if (msg.proxyMode == 0) {
    config.enabled = false
    config.global = false
  } else if (msg.proxyMode == 2) {
    config.enabled = true
    config.global = true
  } else {
    config.enabled = true
    config.global = false
  }
  fs.writeFileSync(path.join(ss_path, 'gui-config.json'), JSON.stringify(config))
  const calcProcess = spawn(path.join(ss_path, 'Shadowsocks.exe'))

  calcProcess.on('close', (code) => {
    console.log(`calc 进程关闭，退出码为 ${code}`);
  });

  calcProcess.on('error', (err) => {
    console.error(`启动 calc 进程时出错: ${err}`);
  });
}

async function stopSS () {
  await new Promise(r => exec('taskkill /F /IM Shadowsocks.exe', r))
}

let run = false

export default {
  onload (ipcMain) {
    ipcMain.on('openSS', async (sys, msg) => {
      if (run) {
        return
      }
      run = true
      try {
        console.log('stopSS')
        await stopSS()
        console.log('startSS')
        startSS(msg)
        setTimeout(() => {
          console.log('robotjs.keyTap')
          robotjs.keyTap('l', ['control', 'shift'])
        }, 3000)
      } finally {
        run = false
      }
    })
  }
}