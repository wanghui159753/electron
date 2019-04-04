<template>
    <div class="bgc">
        <div class="showArea">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.bgc {
  position: fixed;
  top: 30px;
  left: 180px;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 50;
  .showArea {
    cursor: pointer;
    position: absolute;
    width: 520px;
    top: 0;
    right: 0;
    bottom: 0;
    background: #e5e5e5;
    overflow: hidden;
    transition: all 0.5s;
  }
}
</style>
