<template>
    <header>
      <div class="position">
        <span>当前位置：</span>
        <span>{{cityname}}</span>
        <el-button class="iscity" type="primary" @click="$emit('input',true)">选择城市</el-button>
      </div>
      <p>汽配经销商</p>
      <div class="perpleIf">
        <img :src="storinfo.logo" alt="图片加载失败">
        <span>{{storinfo.name}}</span>
      </div>
    </header>
</template>
<script>
import { getLocal, setLocal } from "@/utils/localstorage";
import { getMyShop } from "@/api/admission/admission";
import request from "@/utils/request";
export default {
  props: ["cityname"],
  data() {
    return {
      storinfo: null
    };
  },
  created() {
    if (getLocal("myshop")) {
      this.storinfo = JSON.parse(getLocal("myshop"));
    } else {
      getMyShop().then(res => {
        this.storinfo = res.data;
        setLocal("myshop", JSON.stringify(res.data));
      });
    }
  },
  mounted() {
    document.body.onclick = el => {
      el.target.className.indexOf("iscity") !== -1 ||
      el.target.parentNode.className.indexOf("iscity") !== -1
        ? null
        : this.$emit("input", false);
    };
  }
};
</script>
<style lang="scss" scoped>
header {
  cursor: pointer;
  display: flex;
  text-align: center;
  justify-content: space-between;
  height: 78px;
  padding: 0 40px;
  width: 100%;
  line-height: 78px;
  background: #fff;
  .position {
    font-size: 28px;
    color: #fb780e;
    .el-button {
      width: 110px;
      height: 37px;
    }
  }
  p {
    font-size: 22px;
  }
  span {
    font-size: 18px;
  }
  div {
    span {
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    img {
      width: 44px;
      height: 44px;
      vertical-align: middle;
      border-radius: 10%;
    }
  }
}
</style>
