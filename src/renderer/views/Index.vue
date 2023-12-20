<template>
  <div class="index">
    <div class="nav-bar">
      <div class="nav-bar-item" :class="selectType == '' ? 'selected' : ''" @click="changeSelectType('')"><svg-icon className="nav-bar-icon" icon-class="type-store" />{{ $t('All Apps') }}</div>
      <div class="nav-bar-divide"></div>
      <div class="nav-bar-item" :class="selectType == item.name ? 'selected' : ''" v-for='(item) in appTypes' @click="changeSelectType(item.name)" :key='item.name'><svg-icon className="nav-bar-icon" :icon-class="item.icon" />{{ $t(item.name) }}</div>
    </div>

    <div class="nav-user">
      <svg-icon className="nav-user-icon" icon-class="type-back" />
      <div class="nav-user-name">{{ $t('QTOOLS USER') }}</div>
    </div>

    <div class="main-content">
      <div class="main-banner">
        <div></div>
      </div>
      <div class="main-title">{{ $t('App List') }}</div>
      <div class="main-app">
        <div class="main-app-item" @click="selectApp(item)" v-for="(item) in appList.filter(e => !selectType || selectType === e.type)" :key="item.name">
          <div class="main-app-item-logo">
            <img :src="item.icon || blankImg" />
          </div>
          <div class="main-app-item-right">
            <div class="main-app-item-name">{{ item.name }}</div>
            <div class="main-app-item-desc">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// const ipc = require('electron').ipcRenderer
import blankImg from '@/assets/404.jpeg'

export default {
  data () {
    return {
      selectType: '',
      appTypes: [
        { name: 'System', icon: 'type-book' },
        { name: 'Picture', icon: 'type-video' },
        { name: 'Network', icon: 'type-bed' }
      ],
      appList: [
        {
          icon: '',
          name: '内网穿透1',
          description: '基于ngrok实现的，一个简单的内网穿透客户端',
          type: 'Network',
          appId: 'cn.miao7.nettunnel',
          path: 'features/nettunnel',
          repo: 'https://npmjs.org/xxx/xxx'
        },
        {
          icon: '',
          name: '测试',
          description: 'DEMO',
          type: 'Network',
          appId: 'cn.miao7.test',
          path: 'features/test',
          repo: 'https://npmjs.org/xxx/xxx'
        }
        // ,
        // {
        //   icon: '',
        //   name: '内网穿透2',
        //   description: '基于ngrok实现的，一个简单的内网穿透客户端',
        //   type: 'Picture'
        // },
        // {
        //   icon: '',
        //   name: '内网穿透3',
        //   description: '基于ngrok实现的，一个简单的内网穿透客户端',
        //   type: 'System'
        // },
        // {
        //   icon: '',
        //   name: '内网穿透4',
        //   description: '基于ngrok实现的，一个简单的内网穿透客户端',
        //   type: 'Picture'
        // },
        // {
        //   icon: '',
        //   name: '内网穿透5',
        //   description: '基于ngrok实现的，一个简单的内网穿透客户端',
        //   type: 'Picture'
        // },
        // {
        //   icon: '',
        //   name: '内网穿透6',
        //   description: '基于ngrok实现的，一个简单的内网穿透客户端',
        //   type: 'System'
        // }
      ],
      blankImg
    }
  },
  methods: {
    changeSelectType (type) {
      if (this.selectType === type) {
        return
      }
      this.selectType = type
    },
    selectApp (app) {
      console.log(app)
      this.$router.push({ name: app.appId })
    }
  }
}
</script>

<style>
.index {
  display: flex;
}
.nav-bar {
  width: 20%;
  height: 100vh;
  /* box-shadow: 5px 0 10px rgba(0, 0, 0, 0.5); */
  background-color: #fff;
  border-right: 1px solid #ccc;
  padding: 5px 10px;
}
.nav-bar-item {
  color: #000;
  font-size: 14px;
  line-height: 40px;
  border-radius: 5px;
  padding: 0 20px;
}
.nav-bar-divide {
  border: 1px solid #ccc;
  margin: 5px 10px;
}
.nav-bar-item:hover {
  cursor: pointer;
}
.nav-bar-item.selected {
  background: rgb(66, 69, 255);
  color: #fff;
}
.nav-bar-icon {
  margin-right: 10px;
}

.nav-bar-item.selected .nav-bar-icon {
  color: #fff;
}
.nav-user {
  border-top: 1px solid #ccc;
  position: absolute;
  width: 20%;
  height: 70px;
  top: calc(100vh - 95px);
  left: 5px;
  background-color: #fff;
  padding: 5px 9px;
  line-height: 80px;
}
.nav-user-icon {
  font-size: 30px;
  margin-right: 10px;
  margin-left: 10px;
}
.nav-user-name {
  display: inline-block;
}
.main-content {
  height: calc(100vh - 60px);
  width: 78%;
  overflow: hidden;
  word-wrap: break-word;
  /* background: red; */
}
.main-banner {
  /* background: #000; */
  height: 200px;
  padding: 10px;
  overflow: hidden;
}
.main-banner div {
  width: 100%;
  height: 200px;
  border-radius: 5px;
  background-color: #f0f0f0;
  background-image: url('~assets/banner.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}
.main-title {
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
}
.main-app {
  display: flex;
  flex-wrap: wrap;
}
.main-app-item {
  width: 250px;
  height: 90px;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0,0,0,0.3);
  margin: 10px 10px;
  display: flex;
}
.main-app-item-logo, .main-app-item-right {
  display: inline-block;
}
.main-app-item-logo img {
  width: 80px;
  height: 80px;
  padding: 5px;
}
.main-app-item-right {
  width: 150px;
  padding: 5px;
}
.main-app-item-desc {
  font-size: 12px;
  padding: 5px 0;
}
</style>
