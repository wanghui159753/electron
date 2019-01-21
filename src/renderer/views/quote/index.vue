<template>
    <div class="quote scrollbar">
        <div class="quote-top">
            <el-menu :default-active="activeIndex" :router="true" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index="/quote/index/one">急需报价</el-menu-item>
                <el-menu-item index="/quote/index/two">与我相关</el-menu-item>
            </el-menu>
            <div class="quote-top-right">
                <CurrentUserInfo class="userHead"></CurrentUserInfo>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
import CurrentUserInfo from "@/components/CurrentUserInfo/CurrentUserInfo.vue";
export default {
  name: "Quote",
  data() {
    return {
      activeIndex: "/quote/index/one"
    };
  },
  components: {
    CurrentUserInfo
  },
  methods: {
    handleSelect(val) {
      console.log(val);
    }
  },
  watch: {
    activeIndex() {
      this.activeIndex = this.$route.path;
    }
  },
  created() {
    this.activeIndex = this.$route.path;
  }
};
</script>
<style lang="scss" scoped>
.quote {
  background-color: #f3f3f3;
  height: calc(100vh - 80px);
  ul {
    li {
      line-height: 78px !important;
      height: 78px !important;
    }
  }
  .quote-top {
    background-color: #f3f3f3;
    position: relative;
    height: 78px;
    line-height: 78px;
    .el-menu {
      display: flex;
      justify-content: center;
      border: none;
      .el-menu-item {
        color: #291c1c;
        font-size: 22px;
        height: auto;
        line-height: 78px;
      }
    }
    .quote-top-right {
      width: 200px;
      position: absolute;
      right: 0px;
      top: 15px;
      display: flex;
      justify-content: flex-end;
      .quote-top-right-i {
        width: 40px;
        height: 40px;
        border-radius: 50px;
        img {
          width: 100%;
          border-radius: 50px;
        }
      }
      .quote-top-right-t {
        line-height: 78px;
      }
    }
  }
}
</style>
<style>
.userHead .infoBox img {
  border-radius: 5px !important;
}
.userHead .infoAccount p{
  font-size: 13px;
}
</style>
