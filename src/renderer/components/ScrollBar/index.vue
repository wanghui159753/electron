<template>
  <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll" >
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{top: top + 'px'}">
      <div class="sysLogo">
        <div class="logoBox">
          <img src="@/../../static/image/logo.png" alt="图片加载失败">
        </div>
        <div class="desc">
          <p class="title">后台管理系统</p>
          <p class="small-desc">Content Manage System</p>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
const delta = 15;

export default {
  name: "scrollBar",
  data() {
    return {
      top: 0
    };
  },
  methods: {
    handleScroll(e) {
      // console.log(window.decodeURIComponent)
      // console.log(decodeURIComponent(escape(str)))
      const eventDelta = e.wheelDelta || -e.deltaY * 3;
      const $container = this.$refs.scrollContainer;
      const $containerHeight = $container.offsetHeight;
      const $wrapper = this.$refs.scrollWrapper;
      const $wrapperHeight = $wrapper.offsetHeight;
      if (eventDelta > 0) {
        this.top = Math.min(0, this.top + eventDelta);
      } else {
        if ($containerHeight - delta < $wrapperHeight) {
          if (this.top < -($wrapperHeight - $containerHeight + delta)) {
            this.top = this.top;
          } else {
            this.top = Math.max(
              this.top + eventDelta,
              $containerHeight - $wrapperHeight - delta
            );
          }
        } else {
          this.top = 0;
        }
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/variables.scss";

.scroll-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: $menuBg;
  .scroll-wrapper {
    position: absolute;
    width: 100% !important;
    height: 100%;
  }
}
.sysLogo {
  // width:100%;
  // overflow:hidden;
  padding: 18px 0px;
  background: #222d32;
  .logoBox {
    width: 100%;
    text-align: center;
    padding: 10px 0px;
    img {
      display: inline-block;
    }
  }
  .desc {
    text-align: center;
    .title {
      font-size: 18px;
      color: #ff6749;
    }
    .small-desc {
      color: #ff6749;
      font-size: 12px;
      line-height: 20px;
    }
  }
}
</style>
