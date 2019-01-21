<template>
    <div class="comdition">
        <div class="left">
            <img src="@/../../static/image/search.png" alt="图片加载失败">
            <input placeholder="搜索经销商" class="sear" v-model="putinfo" @keyup.enter="search">
            <el-button type="primary" @click="search">搜索</el-button>
        </div>
        <div class="center" @click="$emit('input',true)">
            <img :src="brand?brand.logo:''" alt="图片加载失败" v-if="brand">
            <p>{{brand?brand.name:"当前未选择车型"}}</p>
            <span>【切换】</span>
        </div>
        <div class="right">
            <el-button type="primary" @click="reset">重置</el-button>
            <el-button type="primary" @click="$router.push('/admission/index')" v-if="!myinfo.autoSellerEnter">我要入驻</el-button>
            <el-button type="primary" @click="$router.push('/accessories/details/'+myinfo.autoSellerId)" v-else>我的店铺</el-button>
        </div>
    </div>
</template>
<script>
import request from "@/utils/request";
export default {
  props: ["brand"],
  data() {
    return {
      putinfo: "",
      myinfo: {}
    };
  },
  methods: {
    search() {
      this.$emit("keyword", this.putinfo);
    },
    reset() {
      this.$emit("reset");
    }
  },
  watch: {
    brand(val) {
      console.log(val, "-------------------");
    }
  },
  created() {
    request({
      url: "merchant/merchant/session/info",
      method: "get"
    }).then(res => {
      this.myinfo = res.data;
    });
  }
};
</script>
<style lang="scss" scoped>
@mixin fl {
  float: left;
}
.comdition {
  padding: 24px 40px 18px 40px;
  display: flex;
  border-bottom: 1px solid #bfbfbf;
  justify-content: space-between;
  div {
    height: 50px;
    line-height: 50px;
  }
  .left {
    padding-top: 4px;
    position: relative;
    .sear {
      @include fl;
      width: 223px;
      height: 36px;
      border: 0;
      outline: 0;
      border-radius: 4px;
      background: #e0e0e0;
      text-indent: 2em;
      vertical-align: middle;
    }
    img {
      width: 21px;
      position: absolute;
      left: 5px;
      top: 11px;
      z-index: 20;
    }
    .el-button {
      @include fl;
      width: 64px;
      height: 36px;
      margin-left: 24px;
      padding: 0;
    }
  }
  .center {
    cursor: pointer;
    font-size: 18px;
    img {
      @include fl;
      width: 50px;
    }
    p {
      @include fl;
      color: #333;
      margin: 0 7px 0 21px;
    }
    span {
      @include fl;
      color: #ff6749;
    }
  }
}
.right {
  .el-button {
    width: 110px;
    height: 37px;
  }
}
</style>
