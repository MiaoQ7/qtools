import { app } from 'electron'

class AppEvents {
  create (appManager) {
    this.appManager = appManager
    this.windowManager = appManager.windowManager

    const gotTheLock = app.requestSingleInstanceLock()
    if (!gotTheLock) {
      app.quit()
      return
    }
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (!this.windowManager.mainWindow.win) {
        this.windowManager.mainWindow.createWindow()
      }

      this.windowManager.mainWindow.win.restore()
      this.windowManager.mainWindow.win.moveTop()
    })

    app.on('activate', () => {
      if (this.windowManager.mainWindow.win === null) {
        console.log('Main window is null!')
      }
    })

    /* 在Electron加载前需要进行初始化
    Before electron app is ready, we should initial */
    app.on('ready', async () => {
      appManager.initApp()
    })

    /* app退出之前执行
    Do something before we quit */
    app.on('before-quit', () => {
      appManager.tray.destroy()
    })

    // 所有窗口都被关闭
    app.on('window-all-closed', () => {
      this.windowManager.mainWindow.win = null

      if (process.platform === 'darwin') {
        return
      }
      // 设置app托盘菜单 / Set the app tray
      appManager.tray.setToolTip('QTOOLS')
      // appManager.tray.displayBalloon({
      //   title: '嗨~',
      //   content: '我在这里哦，并没有退出',
      //   noSound: true
      // })
    })
  }
}

export default new AppEvents()
