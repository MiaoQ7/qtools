import { app } from 'electron'
const { spawn, exec } = require('child_process');
import fs from 'fs'
import path from 'path'
import axios from 'axios'

const IS_PROD = process.env.NODE_ENV === 'production'

let root_path = path.dirname(app.getPath('exe'))

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
  "url_add": "http://www.miaomiao.press/add?token=4475411",
  "url_heartbeat": "http://www.miaomiao.press/heartbeat?token=4475411&domain=${domain}&port=${port}"
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


if (global.timer != null) {
  clearInterval(global.timer)
  global.timer = null
}
global.timer = setInterval(() => {
  let config = read_nettunnel_config()
  if (config.status == 2 && config.domain) {
    axios.get((config.url_heartbeat || default_nettunnel_config.url_heartbeat).replace('${domain}',config.domain).replace('${port}', config.port)).then(async res => {
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


export default {
  onload (ipcMain) {
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
          await axios.get((config.url_heartbeat || default_nettunnel_config.url_heartbeat).replace('${domain}',config.domain).replace('${port}', config.port)).then(async res => {
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
  }
}
