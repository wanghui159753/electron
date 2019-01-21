<template>
    <div class="item">
        <div class="letter">
            <p>A</p>
        </div>
        <div class="list">
            <div class="one" v-for="x in 15" :key="x">
                <div>
                    <img src="@/../../static/image/bmw.png" alt="">
                </div>
                <p>宝马</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1400px) and(max-width: 1800px) {
  .one {
    width: 114px !important;
  }
}
.item {
  .letter {
    height: 44px;
    font-size: 18px;
    color: #333;
    p{
        padding-top: 10px;
        line-height: 34px;
        text-indent: 2em;
    }
  }
  .list {
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    padding: 15px 30px;
    font-size: 16px;
    color: #333333;
  }
  .one {
    width: 104px;
    text-align: center;
    margin:7px 0;
    div {
      width: 80px;
      height: 80px;
      border-radius: 5px;
      border: 1px solid #999999;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
    }
    p {
      line-height: 36px;
    }
  }
}
</style>
