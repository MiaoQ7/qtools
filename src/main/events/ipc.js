import { ipcMain, dialog, app } from 'electron'
const { exec } = require('child_process');

let files = require.context('./business', true, /\.js$/)

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


    files.keys().map((key) => {
      const component = files(key).default
      component.onload(ipcMain)
    })
  }
}

export default new IpcEvents()
