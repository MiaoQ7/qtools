<template>
  <div>
    <div class="back" @click="goIndex"><svg-icon icon-class="app-back" /></div>
    <div class="page">
      <component :is="currentComponent" :remote="remote"></component>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
export default {
  data () {
    return {
      currentComponent: null,
      remote
    }
  },
  mounted () {
    this.loadComponent()
  },
  methods: {
    async loadComponent () {
      const component = await import('../../../features/test')
      this.currentComponent = component.default.page
    },
    goIndex () {
      this.$router.go(-1)
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
}
</style>
