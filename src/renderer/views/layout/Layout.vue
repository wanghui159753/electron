<template>
  <div class="app-wrapper">
      <sidebar class="sidebar-container"></sidebar>
      <div class="main-container">
        <app-main></app-main>
      </div>
  </div>
</template>

<script>
import { Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
export default {
  name: 'layout',
  components: {
    Sidebar,
    AppMain
  },
  created(){
    console.log(this.$store.state)
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    }
    // classObj() {
    //   return {
    //     hideSidebar: !this.sidebar.opened,
    //     withoutAnimation: this.sidebar.withoutAnimation,
    //     mobile: this.device === 'mobile'
    //   }
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: absolute;
  top: 30px;
  bottom: 0;
  width: 100%;
  overflow: auto;
}
</style>
