<template>
    <div class="item">
        <el-col :span="8" class="carInfo">
            <img src="@/../../static/image/bmw.png" alt="">
            <div class="carname">
                <p>别克（昂科拉）2018款 28T 手...</p>
                <p class="frame">LGWED2A299E007834</p>
            </div>
        </el-col>
        <el-col :span="4" class="Accessories">
            <div v-for="x in 8" :key="x">
                <img src="@/../../static/image/The little mark1.png" alt="">
                <p>发动机电脑盒</p>
            </div>
        </el-col>
        <el-col :span="4" class="pic">
            <div>
                <img src="@/../../static/image/car.jpg" alt="">
                <p>共1张</p>
            </div>
            
        </el-col>
        <el-col :span="4" class="buyer">
            <p class="buyerInfo">小王汽修（福建 厦门）</p>
            <p class="time">2018-09-03 19:07</p>
        </el-col>
        <el-col :span="4" class="actived">
            <el-button type="primary">报价</el-button>
            <p class="num">已报价人数：<span>99</span></p>
        </el-col>
    </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.item > div {
  display: flex;
}
@mixin fl {
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
@mixin center {
  justify-content: center;
  flex-direction: column;
}
.item {
  padding: 20px 0;
  line-height: 24px;
  border-bottom: 1px solid #cccccc;
  display: flex;
  justify-content: space-around;
  font-size: 14px;
  .carInfo {
    margin-left: 40px;
    color: #333;
    align-items: center;
    .carname {
      display: flex;
      @include center;
    }
    img {
      margin-right: 12px;
    }
    .frame {
      color: #fc684f;
    }
  }
  .Accessories {
    flex-direction: column;
    div {
      img {
        width: 16px;
        height: 16px;
        vertical-align: middle;
      }
      p {
        display: inline-block;
      }
    }
  }
  .pic {
    @include center;
    div {
      width: 90px;
      height: 90px;
      position: relative;
      overflow: hidden;
      p {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 20px;
        text-align: center;
        color: #fff;
        width: 100%;
        line-height: 20px;
        background: rgba(0, 0, 0, 0.3);
      }
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .buyer {
    @include fl;
    align-items: flex-start;
    color: #666;
  }
  .actived {
    @include fl;
    align-items: flex-start;
    color: #666;
    .el-button {
      width: 130px;
      height: 40px;
      font-size: 16px;
    }
    span {
      color: #fc684f;
    }
  }
}
</style>
