<template>
  <div id="app">
    <div id="app-bar">
      <div id="app-title">
        QTOOLS
      </div>
      <div id="app-action">
        <div
          class="app-action-button"
          @click="win.minimize()"
        >
          <svg-icon icon-class="app-hidden" />
        </div>
        <!-- <div
          class="app-action-button"
          @click="autoMaximize()"
        >
          <svg-icon icon-class="app-fullsize" />
        </div> -->
        <div
          class="app-action-button button-red"
          @click="win.close()"
        >
          <svg-icon icon-class="app-exit" />
        </div>
      </div>
    </div>

    <div id="content">
      <div id="routers">
        <router-link to="/" />
      </div>
      <router-view />
      <!-- <locale-changer style="position: fixed; right: 30px; top: 50px;" /> -->
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
// import localeChanger from 'components/localeChanger'
const ipc = require('electron').ipcRenderer

export default {
  // components: {
  //   localeChanger
  // },
  data () {
    return {
      win: remote.getCurrentWindow(),
      originSize: true
    }
  },
  mounted () {
    const lang = 'zh'
    this.$i18n.locale = lang
    ipc.send('appLanguageChange', lang)
    ipc.on('isUpdateNow', (event, versionInfo) => {
      this.$confirm('检测到新版本' + versionInfo.version + ',是否立即升级？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ipc.send('updateNow')
      }).catch(() => {
      })
      // this.$confirm({
      //   title: '提示',
      //   content: '检测到新版本' + versionInfo.version + ',是否立即升级？',
      //   ok: '确定',
      //   cancel: '取消',
      //   onOk () {
      //     ipc.send('updateNow')
      //   },
      //   onCancel (tx) { }
      // })
    })
    ipc.send('checkForUpdate', {})
  },
  methods: {
    autoMaximize () {
      if (this.originSize) this.win.maximize()
      else this.win.restore()
      this.originSize = !this.originSize
    },
    closeWin () {
      remote.dialog.showMessageBox(this.win, {
        title: this.$t('提示'),
        message: this.$t('完全退出'),
        detail: this.$t('完全退出'),
        buttons: ['确定']
      })
    }
  }
}
</script>

<style lang="less">
body {
  margin: 0;
}

// 取消一些默认效果，使得应用看起来更加原生
// Cancel default effects to make apps look more native
input { outline: none; }

a { outline: none; text-decoration: none; -webkit-user-drag: none; color: #000000; }

img { -webkit-user-drag: none; }

#app {
  height: calc(100vh - 10px);
  width: calc(100vw - 10px);
  background-color: #ffffff;
  color: #000000;
  // ok
  font-family: 'Microsoft YaHei', 'Avenir', 'Helvetica', 'Arial', 'sans-serif';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -moz-user-select: none;
  -webkit-user-select: none;
  // 如果你想让应用中的所有文字无法被选取，就设为none
  // If you want all text in the app to be unselectable, set it to none
  user-select: none;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0,0,0,0.3);
  margin: 5px;
}

#app-bar {
  background-color: #ffffff;
  color: #000000;
  display: flex;
  // 如果你想让某区域可以拖动，将其设为drag
  // 但是设为drag的区域无法被点击，请注意
  // 可以设置为no-drag来恢复点击
  // If you want to make a region draggable, set it to drag
  // But the area set as drag cannot be clicked, please note
  // can be set to no-drag to resume clicks
  -webkit-app-region: drag;
  height: 42px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
}

#app-title {
  flex: 1;
  padding: 7px 15px;
  font-size: 12px;
  line-height: 28px;
}

#app-action {
  padding: 0;
  font-size: 16px;
  display: flex;
  -webkit-app-region: no-drag;
  text-align: center;
  margin: 5px;
}

.app-action-button {
  padding: 0 10px;
  color: #000;
  transition: .2s ease;
  opacity: 0.7;
  line-height: 32px;
}

.app-action-button:hover {
  background-color: #999;
  opacity: 1;
}

.app-action-button:active {
  background-color: #333;
}

.button-red:hover {
  background-color: red;
}

.button-red:active {
  background-color: #C11818;
}

// #routers {
  // padding: 80px;
  // text-align: center;

  // a {
  //   font-weight: bold;
  //   color: #2B8059;

  //   &.router-link-exact-active {
  //     color: #42b983;
  //   }
  // }
// }
</style>
