<template>
  <div class="index">
    <div class="nav-bar">
      <div class="nav-bar-item" :class="selectType == '' ? 'selected' : ''" @click="changeSelectType('')"><svg-icon className="nav-bar-icon" icon-class="type-store" />全部</div>
      <div class="nav-bar-item" :class="selectType == item.name ? 'selected' : ''" v-for='(item) in appTypes' @click="changeSelectType(item.name)" :key='item.name'><svg-icon className="nav-bar-icon" :icon-class="item.icon" />{{item.name}}</div>
    </div>

    <div class="nav-user">
      <svg-icon className="nav-user-icon" icon-class="type-back" />
      <div class="nav-user-name">QTOOLS用户</div>
    </div>

    <div class="main-content">
      <div>BannerBannerBannerBannerBannerBannerBannerBannerBannerBannerBannerBannerBannerBannerBannerBannerBannerBannerBannerBannerBannerBannerBannerBanner</div>
      <div>APP LIST {{ selectType }}</div>
    </div>
  </div>
</template>

<script>
// const ipc = require('electron').ipcRenderer
export default {
  data () {
    return {
      selectType: '',
      appTypes: [
        { name: '系统', icon: 'type-book' },
        { name: '图片', icon: 'type-video' },
        { name: '网络', icon: 'type-bed' }
      ]
    }
  },
  methods: {
    changeSelectType (type) {
      if (this.selectType === type) {
        return
      }
      this.selectType = type
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
  line-height: 50px;
  border-radius: 5px;
  padding: 0 20px;
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
</style>
