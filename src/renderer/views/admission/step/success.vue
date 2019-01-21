<template>
    <div class="piczoo">
        <div>
            <img src="@/../../static/image/resSucc.png" alt="">
            <p><i class="el-icon-success"></i>审核成功，快去看看自己的店铺信息吧</p>
        </div> 
        <upinfo></upinfo>
    </div>
</template>
<script>
import upinfo from "./upinfo";
export default {
  components: {
    upinfo
  },
  actived() {
    this.$emit("input", 2);
  },
  created() {
    this.$emit("input", 2);
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
        color: greenyellow;
        margin-top: 45px;
      }
    }
  }
}
.el-button {
  width: 280px;
  height: 50px;
}
.piczoo .mydian {
  margin-top: 60px;
}
</style>