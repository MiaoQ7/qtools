import { ipcMain, dialog, app } from 'electron'
const { spawn, exec } = require('child_process');
import fs from 'fs'
import path from 'path'
import axios from 'axios'

const IS_PROD = process.env.NODE_ENV === 'production'

let root_path = path.dirname(app.getPath('exe'))
console.log(root_path)
let frpc_path = path.join(root_path, 'resources', 'lib', 'frpc')
if (!IS_PROD) {
  frpc_path = path.join(__dirname, '../src/lib', 'frpc')
  root_path =  path.join(__dirname)
}

let nettunnel_config_file = 'nettunnel.json'
let default_nettunnel_config = {
  "domain": "",
  "port": "1000",
  "status": "0",
  "localIP": "127.0.0.1",
  "localPort": "8080",
  "url_add": "http://www.miaomiao.press/add",
  "url_heartbeat": "http://www.miaomiao.press/heartbeat"
}

function read_nettunnel_config() {
  let nettunnel_config = {}
  if (fs.existsSync(path.join(root_path, nettunnel_config_file))) {
    try {
      nettunnel_config = JSON.parse(fs.readFileSync(path.join(root_path, nettunnel_config_file)))
    } catch {}
  } else {
    fs.writeFileSync(path.join(root_path, nettunnel_config_file), JSON.stringify(nettunnel_config))
  }
  return nettunnel_config
}

function save_nettunnel_config(nettunnel_config) {
  fs.writeFileSync(path.join(root_path, nettunnel_config_file), JSON.stringify(nettunnel_config))
  return nettunnel_config
}

const openDefaultBrowser = function (url) {
  console.log(process.platform)
  switch (process.platform) {
    case "darwin":
      exec('open ' + url);
      break;
    case "win32":
      exec('start ' + url);
      break;
    default:
      exec('xdg-open', [url]);
  }
}

const startFrpc = async function (config) {
  await new Promise(r => exec('taskkill /F /IM frpc.exe', r))

  let frpc_config_path = path.join(frpc_path, 'frpc.toml')
  fs.writeFileSync(frpc_config_path, `
serverAddr = "qq.miaomiao.press"
serverPort = 7000
auth.method = "token"
auth.token = "0x85hB2P"

[[proxies]]
name = "${config.domain}"
type = "tcp"
localIP = "${config.localIP}"
localPort = ${config.localPort}
remotePort = ${config.port}
`)
  const executablePath = path.join(frpc_path, 'frpc.exe');
  const args = ['-c', frpc_config_path];
  const childProcess = spawn(executablePath, args, {
    detached: true,
    // stdio: 'ignore',
  });

  await new Promise(r => {
    childProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      if (data.indexOf('start proxy success') >= 0) {
        config.status = 2
        r()
      }
    });
    setTimeout(r, 1000 * 10)
  })

  childProcess.unref();
}

setInterval(() => {
  let config = read_nettunnel_config()
  if (config.status == 2 && config.domain) {
    axios.get((config.url_heartbeat || default_nettunnel_config.url_heartbeat) + `?domain=${config.domain}&port=${config.port}`).then(async res => {
      if (res && res.data && res.data.domain && res.data.port) {
        config.domain = res.data.domain
        config.port = res.data.port
        config.localIP = config.localIP || default_nettunnel_config.localIP
        config.localPort = config.localPort || default_nettunnel_config.localPort
        await startFrpc(config)
      }
    }).catch(e => {
      console.log(e)
    })
  }
}, 10 * 1000)


class IpcEvents {
  create (appManager) {
    this.appManager = appManager

    /* 翻译器函数
    Translator function */
    const $t = appManager.translator.get()

    // ipc通信示例 / ipc demo
    ipcMain.on('showDialog', (sys, msg) => {
      dialog.showMessageBox({
        type: 'info',
        title: '收到消息！',

        // 在任何能调用翻译器函数的地方都能使用多语言
        // Multi-language support where translator functions are available
        message: $t('reciveFromRenderer'),
        detail: msg
      })
    })

    // 语言变更事件 / language change event
    ipcMain.on('appLanguageChange', (sys, lang) => {
      this.appManager.languageChange(lang)
    })

    ipcMain.on('connectFrp', async (sys, msg) => {
      let config = read_nettunnel_config()
      if (msg.action === 'connect') {
        if (!config.domain) {
          await axios.get(config.url_add || default_nettunnel_config.url_add).then(async res => {
            let data = res.data
            console.log(data)
            config.domain = data.domain
            config.port = data.port
            config.localIP = msg.localIP
            config.localPort = msg.localPort
            await startFrpc(config)
          }).catch(e => {
            dialog.showMessageBox({
              type: 'error',
              title: '错误消息',
              message: e.message
            })
            config.status = 0
          })
        } else {
          await axios.get((config.url_heartbeat || default_nettunnel_config.url_heartbeat) + `?domain=${config.domain}&port=${config.port}`).then(async res => {
            if (res && res.data && res.data.domain && res.data.port) {
              config.domain = res.data.domain
              config.port = res.data.port
            }
            config.localIP = msg.localIP || config.localIP || default_nettunnel_config.localIP
            config.localPort = msg.localPort || config.localPort || default_nettunnel_config.localPort
            await startFrpc(config)
          }).catch(e => {
            console.log(e)
          })
        }
        if (config.status != 2) {
          config.status = 0
          await new Promise(r => exec('taskkill /F /IM frpc.exe', r))
        }
        save_nettunnel_config(config)
      } else if (msg.action === 'close') {
        await new Promise(r => exec('taskkill /F /IM frpc.exe', r))
        config.status = 0
        save_nettunnel_config(config)
      }
      sys.sender.send('getFrpConfig', read_nettunnel_config())
    })

    ipcMain.on('getFrpConfig', (sys, msg) => {
      sys.sender.send('getFrpConfig', read_nettunnel_config())
    })

    ipcMain.on('openBrowser', (sys, msg) => {
      openDefaultBrowser(msg)
    })
  }
}

export default new IpcEvents()
