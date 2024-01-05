import { ipcMain, dialog, app } from 'electron'
const { exec } = require('child_process');
import fs from 'fs'
import path from 'path'

let files = require.context('./business', true, /\.js$/)
let root_path = path.dirname(app.getPath('exe'))

const IS_PROD = process.env.NODE_ENV === 'production'

const openDefaultBrowser = function (url) {
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

const { autoUpdater } = require('electron-updater');

const feedUrl = 'https://download.miaomiao.press/'
let mainWindow = null
let versionInfo = ''
// Object.defineProperty(app, 'isPackaged', {
//   get() {
//     return true;
//   }
// });

fs.writeFileSync(path.join(root_path, 'update.log'), '')

function sendUpdateMessage(text) {
  fs.appendFileSync(path.join(root_path, 'update.log'), JSON.stringify(text))
  mainWindow.win && mainWindow.win.webContents.send('message', text)
}

function updateHandle(window, feedUrl) {
  mainWindow = window;
  //设置更新包的地址
  autoUpdater.setFeedURL(feedUrl);
  //监听升级失败事件
  autoUpdater.on('error', function (error) {
      sendUpdateMessage({
          cmd: 'error',
          message: error
      })
  });
  //监听开始检测更新事件
  autoUpdater.on('checking-for-update', function (message) {
      sendUpdateMessage({
          cmd: 'checking-for-update',
          message: message
      })
  });
  //监听发现可用更新事件
  autoUpdater.on('update-available', function (message) {
      sendUpdateMessage({
          cmd: 'update-available',
          message: message
      })
  });
  //监听没有可用更新事件
  autoUpdater.on('update-not-available', function (message) {
      sendUpdateMessage({
          cmd: 'update-not-available',
          message: message
      })
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
      sendUpdateMessage({
          cmd: 'download-progress',
          message: progressObj
      })
  });
  //下载完成监听，处理事件
  autoUpdater.on('update-downloaded', (ev, info) => {
    // 收到renderer进程确认更新
    ipcMain.on('updateNow', (e, arg) => {
      console.log('开始更新')
      autoUpdater.quitAndInstall() // 包下载完成后，重启当前的应用并且安装更新
    })
    // 主进程向renderer进程发送是否确认更新
    mainWindow.win && mainWindow.win.webContents.send('isUpdateNow', versionInfo)
  })
}

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

    ipcMain.on('openBrowser', (sys, msg) => {
      openDefaultBrowser(msg)
    })

    ipcMain.on('checkForUpdate', (sys, msg) => {
      console.log('=======checkForUpdate')
      updateHandle(appManager.windowManager.mainWindow, feedUrl)
      let checkInfo = autoUpdater.checkForUpdates()
      checkInfo.then(function (data) {
        versionInfo = data.versionInfo // 获取更新包版本等信息
      })
    })

    files.keys().map((key) => {
      const component = files(key).default
      component.onload(ipcMain)
    })
  }
}

export default new IpcEvents()
