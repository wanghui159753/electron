<template>
    <div class="piczoo">
        <div>
            <img src="@/../../static/image/Audit.png" alt="">
            <p><i class="el-icon-warning"></i>审核中，请耐心等待...</p>
        </div>
        <upinfo></upinfo>
    </div>
</template>
<script>
import upinfo from "./step/upinfo";
export default {
  created() {
    this.pu();
  },
  components: {
    upinfo
  },
  methods: {
    pu() {
      this.$emit("input", 2);
    }
  },
  activated() {
    this.pu();
  },
    created(){
      this.pu()
    }
};
</script>
<style lang="scss" scoped>
.piczoo {
  width: 100%;
  margin-top: 44px;
  div {
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
      }
    }
  }
}
</style>
