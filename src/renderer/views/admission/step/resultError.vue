<template>
    <div class="piczoo">
        <div class="reson">
            <img src="@/../../static/image/resErr.png" alt="">
            <p><i class="el-icon-warning"></i>审核失败，请重新完善审核信息</p>
        </div>
        <div class="reason reson">
            <p class="left">失败原因：</p>
            <div class="right">
                <p v-for="x in rease.messageList" :key="x"><i></i>{{x}}</p>
            </div>
        </div>
        <div class="reset reson">
            <el-button type="primary" @click="onagain">重新申请</el-button>
        </div>
        <info></info>
    </div>
</template>
<script>
import info from "./upinfo";
import { getLocal } from "@/utils/localstorage.js";
export default {
  data() {
    return {
      rease: []
    };
  },
  created() {
    this.$emit("input", 2);
    this.localRease();
  },
  actived() {
    this.$emit("input", 2);
    this.localRease();
  },
  components: {
    info
  },
  methods: {
    onagain() {
      this.$router.push("/admission/index/step1/0");
    },
    localRease() {
      let rease = JSON.parse(getLocal("myshop")).audit;
      this.rease = rease;
    }
  }
};
</script>
<style lang="scss" scoped>
.piczoo {
  width: 100%;
  margin-top: 82px;
}
.piczoo > .reson {
  width: 500px;
  margin: 0 auto;
  color: #ff6749;
  font-size: 20px;
  text-align: center;
  img {
    width: 150px;
    height: 150px;
  }
  p {
    i {
      margin-right: 9px;
      position: relative;
      bottom: 3px;
    }
  }
}

.piczoo .reason {
  overflow: hidden;
  font-size: 18px;
  color: #999;
  padding-top: 41px;
  .left {
    display: inline-block;
    color: #666;
    vertical-align: top;
    margin-top: 3px;
  }
  .right {
    display: inline-block;
    width: 300px;
    text-align: left;
    p {
      color: #999;
      line-height: 30px;
      i {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ff6749;
      }
    }
  }
}
.reset {
  padding-top: 70px;
  text-align: center;
  .el-button {
    width: 280px;
    height: 50px;
  }
}
</style>
