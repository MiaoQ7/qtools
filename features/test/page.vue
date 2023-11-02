<template>
  <div>
    这是一个插件页面1111111111233344
    <div @click="openDialog">{{ $t('Click Me!') }}</div>
  </div>
</template>
<script>

export default {
  name: 'test-plugin',
  props: {
    remote: {
      type: Object
    }
  },
  data () {
    return {
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
    }
  }
}
</script>
<style>

</style>
