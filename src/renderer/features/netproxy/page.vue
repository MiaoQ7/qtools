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
            prop="type"
            label="类型">
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="最近可用时间">
          </el-table-column>
          <el-table-column
            label="延迟">
            <template slot-scope="scope">
              {{ scope.row.latency ? `${scope.row.latency}ms` : '测速中' }}
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 10px; display: flex; justify-content: space-between;">
          <div style="margin-top: 10px;">
            {{ openConnect==2 ? `http://${remoteConfig.localIP}:${remoteConfig.localPort}  =>  socks5://${remoteConfig.ip}:${remoteConfig.port}` : '' }}
          </div>
          <div>
            <el-button type="primary" @click="onSubmit">打开浏览器</el-button>
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
import moment from 'moment'
const ipc = require('electron').ipcRenderer
export default {
  name: 'cn.miao7.netproxy',
  path: 'features/netproxy',
  showName: '网络代理',
  desc: '基于http的网络代理',
  repo: 'http://github.com/xx/xx',
  icon: '',
  type: 'Network', // System\Picture\Network
  hide: true,
  data () {
    return {
      remote,
      openConnect: 0, // 0 未连接 1 连接中 2 连接成功 3 关闭中
      remoteConfig: {},
      tableData: [],
      currentRow: null
    }
  },
  mounted () {
    this.load()
    // ipc.on('getProxyConfig', (event, arg) => {
    //   console.log(arg)
    //   this.remoteConfig = arg
    //   if (arg.status) {
    //     this.openConnect = parseInt(arg.status)
    //   } else {
    //     this.openConnect = 0
    //   }
    // })
    // ipc.send('getProxyConfig')
    ipc.on('testSpeed', (event, arg) => {
      this.tableData = arg
    })
  },
  methods: {
    load () {
      this.currentRow = null
      axios.get('https://ngrok.miao7.cn/list?token=4475411&pageSize=5').then(res => {
        this.tableData = res.data.data.slice(0, 5).map(e => {
          const updateTime = moment(e.updateTime, 'YYYYMMDD HH:mm:ss').add(8, 'hours').fromNow()
          e.updateTime = updateTime
          return e
        })

        ipc.send('testSpeed', this.tableData)
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
      ipc.send('connectProxy', { action: 'connect', ip: this.currentRow.ip, port: this.currentRow.port })
    },
    close () {
      this.openConnect = 3
      ipc.send('connectProxy', { action: 'close' })
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
