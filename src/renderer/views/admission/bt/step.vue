<template>
    <div class="stept">
        <div class="steps">
            <div class="ico" :class="{step1:num>=0}">
                <img src="@/../../static/image/Essential information.png" alt="">
            </div>
            <p>1、基本信息</p>
        </div>
        <div class="line" :class="{step1:num>0}"></div>
        <div class="steps">
            <div class="ico"  :class="{step2:num>=1}">
                <img src="@/../../static/image/Authentication information.png" alt="">
            </div>
            <p>2、认证信息</p>
        </div>
        <div class="line2" :class="{step2:num>1}"></div>
        <div class="steps">
            <div class="ico" :class="{step3:$route.fullPath=='/admission/index/resultSucc',step4:$route.fullPath=='/admission/index/resultError'}">
                <img src="@/../../static/image/To examine.png" alt="">
            </div>
            <p :class="{wordColor:$route.fullPath=='/admission/index/resultError'}">{{msg}}</p>
        </div>
    </div>
</template>
<script>
import { setLocal } from "@/utils/localstorage.js";
import { getMyShop } from "@/api/admission/admission";
export default {
  props: ["num"],
  data() {
    return {
      status: ""
    };
  },
  computed: {
    msg() {
      if (this.num < 2) {
        return "3、审核中";
      } else if (this.num == 2 && this.status == "OK") {
        return "3、审核成功";
      } else if (this.num == 2 && this.status == "AWAIT") {
        return "3、审核中";
      } else {
        return "3、审核失败";
      }
    }
  },
  created() {
    getMyShop().then(res => {
      this.status = res.data;
      setLocal("myshop", JSON.stringify(res.data));
    });
  }
};
</script>
<style lang="scss" scoped>
.stept {
  width: 920px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  position: relative;
  .steps {
    .ico {
      width: 50px;
      height: 50px;
      margin: 0 auto;
      background: #cccccc;
      border-radius: 50%;
      text-align: center;
      padding-top: 10px;
      position: relative;
      z-index: 51;
      img {
        display: block;
        margin: 0 auto;
      }
    }
    p {
      width: 118px;
      height: 37px;
      box-shadow: 1px 2px 8px -3px #000;
      text-align: center;
      line-height: 37px;
      font-size: 18px;
      margin-top: 13px;
      border-radius: 5%;
    }
  }
  .line,
  .line2 {
    position: absolute;
    top: 25px;
    width: 355px;
    height: 6px;
    background: #cccccc;
    z-index: 50;
  }
  .line {
    margin: 0 !important;
    left: 83px;
  }
  .line2 {
    right: 83px;
  }
}
.step1 {
  background: #0074be !important;
}
.step2 {
  background: #41bed3 !important;
}
.step3 {
  background: #82c927 !important;
}
.step4 {
  background: #ff0000 !important;
}
.wordColor {
  color: #ff0000;
}
</style>

