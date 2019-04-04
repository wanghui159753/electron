<template>
    <header class="headers">
        <span @click="back"  class="el-icon-arrow-left">返回</span>
        <p>{{tit}}</p>
        <div>
        </div>
    </header>
</template>
<script>
export default {
  data() {
    return {
      tit: ""
    };
  },
  watch: {
    $route(to, from) {
      if (to.fullPath == "/admission/index/Record") {
        this.tit = "历史审核记录";
      } else if (
        to.fullPath == "/admission/index/step1/1" ||
        to.fullPath == "/admission/index/step1/0"
      ) {
        this.tit = "填写基本信息";
      } else if (
        to.fullPath == "/admission/index/step2/1" ||
        to.fullPath == "/admission/index/step2/0"
      ) {
        this.tit = "入驻商铺认证信息";
      } else if (to.fullPath == "/admission/index/resultSucc") {
        this.tit = "审核成功";
      } else if (to.fullPath == "/admission/index/resultError") {
        this.tit = "审核失败";
      } else if (to.fullPath == "/admission/index/onAudit") {
        this.tit = "审核中";
      } else {
        this.tit = "报价详情";
      }
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  },
  created() {
    if (this.$route.name == "circleDetails"||'quotationDetail') {
      this.tit = "报价详情";
    }
  }
};
</script>
<style lang="scss">
.headers {
  cursor: pointer;
  display: flex;
  text-align: center;
  justify-content: space-between;
  height: 58px;
  padding: 0 20px;
  width: 100%;
  line-height: 58px;
  margin-bottom: 20px;
  background: #fff;
  color: #333;
  p {
    font-size: 18px;
    font-weight: 600;
  }
  .el-icon-arrow-left {
    line-height: 58px;
    font-weight: 700;
  }
}
.headers .el-icon-arrow-left::before {
  font-size: 24px;
    vertical-align: middle;
}
</style>
