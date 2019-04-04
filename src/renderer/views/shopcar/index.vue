<template>
  <div>
    <had >
      <div class="tit">我的采购单</div>
    </had>
    <list :quoteList="list"  class="buyList scrollbar"></list>
    <div class="page">
      <el-pagination
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="list.total"
        background
        @current-change="getList"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import list from "../quote/model/quoteOneList";
import pager from "@/components/pager/pager";
import had from "../shopping/model/hed";
import { getMyEnquiryPage } from "@/api/quote/quote.js";
export default {
  name: "Release",
  components: { list, pager ,had},
  data() {
    return {
      list: []
    };
  },
  methods: {
    getList(i) {
        this.$store.commit('setLoading',true)
      getMyEnquiryPage({
        pageNo: i || 1,
        pageSize: 10
      }).then(res => {
        this.list = res.data;
          this.$store.commit('setLoading',false)
      });
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style scoped lang="scss">
.buyList {
  height: calc(100vh - 130px);
}
.tit {
  text-align: center;
  width: 100%;
  color: #000;
  font-weight: 600;
  background: #dedede;
}
</style>