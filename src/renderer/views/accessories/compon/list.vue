<template>
  <div>
    <div class="list" v-if="business.records">
      <item v-for="(i,index) in business?business.records:[]" :obj="i" :key="index"></item>
    </div>
    <div class="nothing" v-else>
      <div>
        <img src="@/../../static/image/nothing.png" alt="图片加载失败">
        <p>没有找到合适的数据！</p>
      </div>
    </div>
  </div>
</template>
<script>
import item from "./listitem";
import request from "@/utils/request";
export default {
  props: ["search"],
  components: { item },
  data() {
    return {
      business: {}
    };
  },
  watch: {
    search(obj) {
      this.business = obj;
    }
  },
  created() {
    this.business = this.search;
  },
  mounted(){
    if( document.querySelector(".scrollbar")){
      document.querySelector(".scrollbar").scrollTop = this.$route.meta.scollTopPosition;
    } 
  }
};
</script>
<style lang="scss" scoped>
.list,
.nothing {
  display: flex;
  flex-wrap: wrap;
}
.nothing {
  height: 500px;
  justify-content: center;
  align-items: center;
  p {
    font-size: 24px;
    color: #666;
  }
}
.list {
  padding: 20px 18px;
}
</style>
