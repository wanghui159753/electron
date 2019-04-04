<template>
  <div class="buyList scrollbar">
    <list :quoteList="list"></list>
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
import { getMyEnquiryPage } from "@/api/quote/quote.js";
export default {
  name: "Release",
  components: { list, pager },
  data() {
    return {
      list: []
    };
  },
  methods: {
    getList(i) {
      getMyEnquiryPage({
        pageNo: i || 1,
        pageSize: 10
      }).then(res => {
        this.list = res.data;
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
  height: calc(100vh - 160px);
  overflow: auto;
}
</style>