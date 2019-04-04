<template>
    <div class="noThing">
        <div>
            <img src="@/../../static/image/nothing.png" alt="">
            <p>没有找到合适的数据</p>
        </div>
    </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.noThing {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-size: 14px;
    text-align: center;
  }
  img{
    width: 100%;
  }
}
</style>
