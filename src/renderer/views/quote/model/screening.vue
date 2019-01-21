<template>
    <bg>
        <header>
            <p>清空</p>
            <p class="tit">筛选</p>
            <p>确认</p>
        </header>
        <div class="type">
            <div class="brand">
                <div class="total">
                    <p class="fix">受理品牌</p>
                    <p>不限品牌<i class="el-icon-arrow-right"></i></p>
                </div>
            </div>
            <div class="area">
                <div class="total">
                    <p class="fix">受理地区</p>
                    <p>不限地区<i class="el-icon-arrow-right"></i></p>
                </div>
            </div>
            <div class="classify">
                <div class="total">
                    <p class="fix">受理配件分类</p>
                    <p>不限分类<i class="el-icon-arrow-right"></i></p>
                </div>
            </div>
        </div>
    </bg>
</template>
<script>
import bg from "./background";
export default {
  components: { bg }
};
</script>
<style lang="scss" scoped>
@mixin fl {
  display: flex;
  justify-content: space-between;
}
// header {
//   height: 60px;
//   line-height: 60px;
//   padding: 0 20px;
//   font-size: 16px;
//   color: #fc684f;
//   @include fl;
//   .tit {
//     font-size: 18px;
//     color: #333;
//   }
// }
.type > div {
  padding: 0 20px;
  background: #fff;
  margin-bottom: 10px;
}
.type {
  .total {
    height: 80px;
    line-height: 80px;
    @include fl;
    p {
      font-size: 18px;
      color: #999;
    }
    .fix {
      color: #333;
    }
  }
}
</style>
