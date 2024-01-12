<template>
  <div style="display: flex; flex-direction: column; height: calc(100vh - 10px);">
    <div class="back" @click="goIndex"><svg-icon icon-class="app-back" /></div>
    <div class="webview-site">
      <el-input v-model="inputSrc" @change="changeSrc" placeholder="请输入网址"></el-input>
    </div>
    <div class="webview-body">
      <div class="webview-loading" v-show="didLoading" v-loading="didLoading"></div>
      <webview :src="src" v-show="!didLoading" class="webview" ref="webview" :allowpopups="false"></webview>
    </div>
  </div>
</template>
<script>
import { remote } from 'electron'
export default {
  name: 'cn.miao7.browser',
  path: 'features/browser',
  showName: '浏览器',
  desc: '浏览器',
  repo: 'http://github.com/xx/xx',
  icon: '',
  type: 'System', // System\Picture\Network
  hide: false,
  data () {
    return {
      src: 'https://www.iyf.tv',
      inputSrc: 'https://www.iyf.tv',
      didLoading: false,
      isInit: true,
      webview: null
    }
  },
  methods: {
    changeSrc () {
      if (this.inputSrc) {
        if (!this.inputSrc.startsWith('http://') && !this.inputSrc.startsWith('https://')) {
          this.inputSrc = 'http://' + this.inputSrc
        }
        this.src = this.inputSrc
      }
    },
    goIndex () {
      this.$router.go(-1)
    },
    currentWindow () {
      return remote.getCurrentWindow()
    },
    init () {
      var win = this.currentWindow()
      if (this.webview) {
        this.webview.addEventListener('enter-html-full-screen', () => {
          win.setFullScreen(true)
        })
        this.webview.addEventListener('leave-html-full-screen', () => {
          win.setFullScreen(false)
        })
        // 连接发生变化时触发
        // this.webview.addEventListener('load-commit', () => {
        //   // console.log('load-commit')
        // })
        // this.webview.addEventListener('did-finish-load', () => {
        //   console.log('did-finish-load')
        // })
        // this.webview.addEventListener('did-fail-load', () => {
        //   console.log('did-fail-load')
        // })
        this.webview.addEventListener('did-start-loading', () => {
          console.log('did-start-loading')
          this.didLoading = true
        })
        this.webview.addEventListener('did-stop-loading', () => {
          console.log('did-stop-loading')
          setTimeout(() => {
            this.didLoading = false
          }, 500)
        })
        this.webview.addEventListener('will-redirect', (detail) => {
          console.log('will-redirect')
          this.inputSrc = detail.url
        })
        this.webview.addEventListener('did-navigate', (detail) => {
          console.log('did-navigate', detail)
          this.inputSrc = detail.url
        })
        this.webview.addEventListener('did-redirect-navigation', (detail) => {
          console.log('did-redirect-navigation')
          this.inputSrc = detail.url
        })
        // 处理a target=_blank的连接
        this.webview.addEventListener('new-window', (e) => {
          this.src = e.url
          this.inputSrc = e.url
        })
      }
    }
  },
  mounted () {
    this.webview = this.$refs.webview
    this.init()
    this.webview && this.webview.addEventListener('dom-ready', () => {
      if (this.isInit) {
        this.webview.reloadIgnoringCache()
      }
      this.isInit = false
    })
  }
}
</script>
<style type="text/css" scoped>
.back {
  height: 30px;
  padding-left: 10px;
  font-size: 20px;
  line-height: 30px;
  border: 1px solid #ccc;
}
  .webview-body,
  .webview{
    display: flex;
    height: 100%;
    width: 100%;
  }
  .webview-loading{
    position: fixed;
    height: 24px;
    width: 24px;
    z-index: 100;
    top: 220px;
    right: 0;
    left: 0;
    margin: 0 auto;
  }
  .webview-loading .el-loading-mask{
    background-color: transparent;
  }
  .webview-loading .el-loading-spinner{
    top: 0;
    margin-top: 0;
  }
  .webview-loading .el-loading-spinner .circular{
    width: 24px;
    height: 24px;
  }
</style>
