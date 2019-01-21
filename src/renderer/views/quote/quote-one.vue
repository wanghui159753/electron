<template>
    <div class="quote-one">
        <div class="quote-one-top">
            <ul class="condition">
              <li>地区：<span>福建 厦门</span></li>
              <li>品牌：<span>别克</span></li>
              <li>配件：<span>点火系、底盘系统、变速箱及离合</span></li>
            </ul>
            <div class="quote-one-screen">
                <img src="../../../../static/image/screen.png" alt="">
                <span>筛选</span>
            </div>
        </div>
        <one-list></one-list>
        <!-- <screening></screening> -->
        <!-- <brand></brand> -->
        <!-- <city></city> -->
        <parts></parts>
    </div>
</template>

<script>
import OneList from "./model/quoteOneList";
import screening from "./model/screening";
import brand from "./model/brand";
import city from "./model/city";
import parts from "./model/parts";
export default {
  data() {
    return {
      radio3: 1
    };
  },
  components: {
    OneList,
    screening,
    brand,
    city,
    parts
  }
};
</script>

<style lang="scss" scoped>
.quote-one-top {
  cursor: pointer;
  background: #ffffff;
  display: flex;
  justify-content: flex-end;
  .quote-one-screen {
    img {
      width: 16px;
      vertical-align: text-bottom;
    }
    span {
      display: inline-block;
      color: #291c1c;
      font-size: 16px;
      line-height: 60px;
      margin-right: 30px;
    }
  }
}
.condition {
  display: flex;
  justify-content: space-between;
  li {
    list-style: none;
    margin-right: 30px;
    font-size: 14px;
    line-height: 60px;
    span {
      color: #fc684f;
    }
  }
}
</style>
<style lang="scss">
.quote-one {
  .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 25px 0 0 25px;
  }
  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0 25px 25px 0;
  }
}
</style>


