import { app, dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { SocksClient } from 'socks'

const IS_PROD = process.env.NODE_ENV === 'production'

let root_path = path.dirname(app.getPath('exe'))

if (!IS_PROD) {
  root_path =  path.join(__dirname)
}

global.browser = null

let proxy_config_file = 'netproxy.json'
let default_proxy_config = {
  "ip": "",
  "port": "",
  "status": "0",
  "localIP": "127.0.0.1",
  "localPort": "10800",
  "username": "",
  "password": "",
}

function read_proxy_config() {
  let proxy_config = default_proxy_config
  if (fs.existsSync(path.join(root_path, proxy_config_file))) {
    try {
      proxy_config = JSON.parse(fs.readFileSync(path.join(root_path, proxy_config_file)))
    } catch {}
  } else {
    fs.writeFileSync(path.join(root_path, proxy_config_file), JSON.stringify(proxy_config))
  }
  return proxy_config
}

function save_proxy_config(proxy_config) {
  fs.writeFileSync(path.join(root_path, proxy_config_file), JSON.stringify(proxy_config))
  return proxy_config
}

// let config = read_proxy_config()
// if (config.ip && config.port && config.status == 2) {
//   startProxy(config)
// }


async function testSpeed(data = [], sys) {
  for (const e of data) {
    let result = await new Promise(async (r) => {
      try {
        const start_time = new Date();

        const options = {
          proxy: {
            host: e.ip,
            port: parseInt(e.port),
            type: 5
          },

          command: 'connect',
          timeout: 3000,
          destination: {
            host: 'google.com',
            port: 80,
          }
        };

        const info = await SocksClient.createConnection(options)
        info.socket.on('error', () => {})
        const end_time = new Date();
        const latency = end_time - start_time;
        console.log(`Proxy is working. Latency: ${latency} ms`);
        // 关闭连接
        info.socket.end()
        r({status: 'success', latency})
      } catch (error) {
        r({status: 'fail', latency: -1, message: error.message})
      }
    })
    e.latency = result.latency
  }
  sys.sender.send('testSpeed', data)
}

export default {
  onload (ipcMain) {
    ipcMain.on('connectProxy', async (sys, msg) => {
      console.log(msg)
      let config = read_proxy_config()
      if (msg.action === 'connect') {
        if (!msg.ip || !msg.port) {
          dialog.showMessageBox({
            type: 'error',
            title: '错误消息',
            message: '未选择代理'
          })
          config.status = 0
        } else {
          config.ip = msg.ip
          config.port = msg.port
          try {
            // await startBrowserWithSocksProxy(config)
            config.status = 2
          } catch (e) {
            dialog.showMessageBox({
              type: 'error',
              title: '错误消息',
              message: e.message
            })
          }
        }
        if (config.status != 2) {
          config.status = 0
          try {
            // await stopBrowserWithSocksProxy()
          } catch (e) {
          }
        }
        save_proxy_config(config)
      } else if (msg.action === 'close') {
        try {
          // await stopBrowserWithSocksProxy()
        } catch (e) {
        }
        config.status = 0
        save_proxy_config(config)
      }
      sys.sender.send('getProxyConfig', read_proxy_config())
    })

    ipcMain.on('getProxyConfig', (sys, msg) => {
      sys.sender.send('getProxyConfig', read_proxy_config())
    })

    ipcMain.on('testSpeed', (sys, msg) => {
      testSpeed(msg, sys)
    })
  }
}