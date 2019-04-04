<template>
  <div class="opcityBg">
    <slot></slot>
  </div>
</template>
<script>
export default {
    name:'cccBgc'
};
</script>
<style lang="scss" scoped>
.opcityBg {
  position: fixed;
  top: 30px;
  left: 180px;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;
}
</style>
<style>
  .opcityBg .el-dialog__wrapper{
    position: absolute;
    left: 0;
  }
</style>
