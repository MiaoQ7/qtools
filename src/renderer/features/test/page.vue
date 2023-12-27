<template>
  <div>
    <div class="back" @click="goIndex"><svg-icon icon-class="app-back" /></div>
    <div class="page">
      <div>
        这是一个插件页面 TEST
        <div @click="openDialog">{{ $t('Click Me!') }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { remote } from 'electron'
export default {
  name: 'cn.miao7.test',
  path: 'features/test',
  showName: '测试',
  desc: '描述',
  repo: 'http://github.com/xx/xx',
  icon: '',
  type: 'System', // System\Picture\Network
  hide: true,
  data () {
    return {
      remote
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
}
</style>
