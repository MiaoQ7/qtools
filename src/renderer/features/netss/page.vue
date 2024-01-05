<template>
  <div>
    <div class="back" @click="goIndex"><svg-icon icon-class="app-back" /></div>
    <div class="page">
      <div>
        <div style="display: flex; justify-content: space-between; margin: 20px 10px;">
          <span style="font-size: 16px; font-weight: bold;">网络代理工具</span>
          <el-button type="text" @click="load" size="tiny">刷新</el-button>
        </div>
        <el-table
          highlight-current-row
          @current-change="handleCurrentChange"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="ip"
            label="ip"
            width="180">
          </el-table-column>
          <el-table-column
            prop="port"
            label="端口"
            width="180">
          </el-table-column>
          <el-table-column
            prop="password"
            label="密码">
          </el-table-column>
          <el-table-column
            prop="encrypt"
            label="加密">
          </el-table-column>
        </el-table>
        <div>
          <!-- <div style="margin-top: 10px;">
            {{ openConnect==2 ? `http://${remoteConfig.localIP}:${remoteConfig.localPort}  =>  socks5://${remoteConfig.ip}:${remoteConfig.port}` : '' }}
          </div> -->
          <div style="margin-top: 10px; text-align: right">
            <el-select v-model="proxyMode" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" @click="onSubmit">打开代理</el-button>
            <!-- <el-button v-if="openConnect==1" type="primary">连接中...</el-button>
            <el-button v-if="openConnect==2" type="primary" @click="close">断开连接</el-button>
            <el-button v-if="openConnect==3" type="primary" @click="close">关闭中...</el-button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { remote } from 'electron'
import axios from 'axios'
const ipc = require('electron').ipcRenderer
export default {
  name: 'cn.miao7.netss',
  path: 'features/netss',
  showName: '网络代理',
  desc: '基于shadowsocks的网络代理',
  repo: 'http://github.com/xx/xx',
  icon: '',
  type: 'Network', // System\Picture\Network
  hide: false,
  data () {
    return {
      remote,
      openConnect: 0, // 0 未连接 1 连接中 2 连接成功 3 关闭中
      remoteConfig: {},
      tableData: [],
      currentRow: null,
      proxyMode: 1, // 0禁用 1pac 2全局
      options: [
        { label: '禁用', value: 0 },
        { label: 'PAC', value: 1 },
        { label: '全局', value: 2 }
      ]
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      this.currentRow = null
      axios.get('https://ngrok.miao7.cn/ss/list?token=4475411&pageSize=5').then(res => {
        this.tableData = res.data.data
        this.currentRow = res.data.data.lenght > 0 ? res.data.data[0] : null
      })
    },
    goIndex () {
      this.$router.go(-1)
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    onSubmit () {
      // if (this.openConnect !== 0) {
      //   return
      // }
      if (!this.currentRow) {
        this.remote.dialog.showMessageBox(this.remote.getCurrentWindow(), {
          title: '提示',
          message: '请选择代理',
          detail: '',
          buttons: ['确定']
        })
        return
      }
      this.openConnect = 1
      ipc.send('openSS', { action: 'connect', ...this.currentRow, proxyMode: this.proxyMode })
    },
    close () {
      this.openConnect = 3
      ipc.send('openSS', { action: 'close' })
    },
    openBrowser (url) {
      ipc.send('openBrowser', url)
    }
  }
}
</script>
<style scoped>
.back {
  height: 30px;
  padding-left: 10px;
  font-size: 20px;
  line-height: 30px;
  border: 1px solid #ccc;
}
.page {
  padding: 10px;
  padding-left: 50px;
  padding-right: 50px;

}
</style>
