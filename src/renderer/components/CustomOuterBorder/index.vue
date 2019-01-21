<template>
    <div class="custom-outer-border">
         <div class="nav-title">
            <div class="left">
                 
            </div>
            <div class="right" style="-webkit-app-region: no-drag">
               <div class="list" @click="minimize">
                   <img src="../../../../static/image/small.png" alt="图片加载失败">
               </div>
               <div class="list" @click="maximization">
                    <img src="../../../../static/image/big.png" alt="图片加载失败">
               </div>
               <div class="list last" @click="close">
                    <img src="../../../../static/image/off.png" alt="图片加载失败">
               </div>
            </div>
        </div> 
    </div>
</template>
<script>
const { ipcRenderer } = require("electron");
export default {
  name: "CustomOuterBorder",
  methods: {
    //  窗口最小化
    minimize() {
      this.$electron.ipcRenderer.send("minimize");
    },
    // 窗口最大化
    maximization() {
      this.$electron.ipcRenderer.send("maximization");
    },
    // 窗口关闭
    close() {
      this.$electron.ipcRenderer.send("close");
    }
  },
};
</script>
<style scoped lang="scss">
.custom-outer-border {
  -webkit-app-region: drag;
  .nav-title {
    display: flex;
    justify-content: space-between;
    .left {
      padding-left: 40px;
    }
    .right {
      display: flex;
      justify-content: space-between;
      .list {
        width: 36px;
        height: 30px;
        margin: 0 auto;
        padding: 4px 10px 0 10px;
      }
      .list:hover {
        background-color: #e5e5e5;
      }
      .last:hover {
        background-color: #e81123 !important;
      }
      .list image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
