<template>
  <div>
    <div class="back" @click="goIndex"><svg-icon icon-class="app-back" /></div>
    <div class="page">
      <div>
        <h3>内网穿透工具</h3>
        <el-form :label-position="right" label-width="80px" :model="localData">
          <el-form-item label="内网IP">
            <el-input v-model="localData.ip"></el-input>
          </el-form-item>
          <el-form-item label="内网端口">
            <el-input v-model="localData.port"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="openConnect==0" type="primary" @click="onSubmit">开始连接</el-button>
            <el-button v-if="openConnect==1" type="primary" @click="close">连接中</el-button>
            <el-button v-if="openConnect==2" type="primary" @click="close">断开连接</el-button>
            <!-- <el-button type="primary" @click="onSubmit">开始连接</el-button> -->
            <!-- <el-button>取消</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { remote } from 'electron'
export default {
  name: 'nettunel-plugin',
  data () {
    return {
      remote,
      localData: {
        ip: '127.0.0.1',
        port: '8080'
      },
      openConnect: 0 // 0 未连接 1 连接中 2 连接成功
    }
  },
  methods: {
    openDialog () {
      this.remote.dialog.showMessageBox(this.remote.getCurrentWindow(), {
        title: this.$t('info'),
        message: this.$t('Click Me!'),
        detail: this.$t('Click Me!'),
        buttons: ['确定']
      })
    },
    goIndex () {
      this.$router.go(-1)
    },
    onSubmit () {
      // 启动frpc 连接
      if (this.openConnect !== 0) {
        return
      }
      this.openConnect = 2
    },
    close () {
      this.openConnect = 0
    }
  }
}
</script>
<style>
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
