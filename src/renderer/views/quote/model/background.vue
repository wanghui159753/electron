<template>
    <div class="bg">
        <div class="showArea">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.bg {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  .showArea {
    position: absolute;
    width: 520px;
    top: 0;
    right: 0;
    bottom: 0;
    background: #E5E5E5;
    overflow: auto;
  }
}
</style>
