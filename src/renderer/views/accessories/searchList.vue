<template>
  <div class="searList" v-if="search">
    <header>
      <p class="el-icon-arrow-left" @click="back">返回</p>
      <h3>汽配经销商搜索</h3>
      <p class="searlist_change" @click="$router.push('/accessories/list')"> <img src="../../../../static/image/change.png" ><span>切换品牌</span> </p>
    </header>
    <div class="computedHeight scrollbar">
      <list :search="search"></list>
      <pager :total="search.total||0" :size="40"  v-if="search.total>40"></pager>
    </div>
  </div>
</template>
<script>
import list from "./compon/list";
import pager from "@/components/pager/pager";
import { keyWord } from "@/api/accessories/index.js";
export default {
  data() {
    return {
      search: null
    };
  },
  components: { list, pager },
  created() {
      console.log(this.$route)
    this.search = {
      pageNo: 1,
      pageSize: 40,
      keyword: this.$route.query.keyWord
    };
    this.searchList();
  },
  methods: {
    searchList() {
        this.$store.commit('setLoading',true)
      keyWord(this.search).then(res => {
        this.search = res.data;
          this.$store.commit('setLoading',false)
      });
    },
    back() {
      history.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.searList {
  height: calc(100%);
  background: #fff;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    .searlist_change{
      color:#FF6749;
      font-size:15px;
      cursor: pointer;
      position: relative;
      img{
        width: 20px;
        height: 20px;
        position: absolute;
        top:0;
        bottom:0;
        margin: auto;
      }
      span{
        padding-left:23px;
      }
    }
  }
  .computedHeight {
    height: calc(100% - 60px);
    .page{
      position: initial;
    }
  }
  p {
    font-size: 20px;
    font-weight: 600;
  }
}
</style>
