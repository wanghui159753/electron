<template>
    <div class="quote-list">
        <ul class="title">
          <el-col :span="8" class="type">车型、车架</el-col>
          <el-col :span="4">配件清单</el-col>
          <el-col :span="4">图片附件</el-col>
          <el-col :span="4">买家</el-col>
          <el-col :span="4">操作</el-col>
        </ul>
        <item v-for="x in 5" :key="x"></item>
        <div class="page">
          <el-pagination
            :page-size="20"
            layout="prev, pager, next, jumper"
            :total="10"
            background
            >
          </el-pagination>
        </div>

    </div>
</template>

<script>
import item from "./quoteOneListItem";
export default {
  components:{item}
}
</script>

<style lang="scss" scoped>
.title{
  display: flex;
  justify-content: space-around;
    background: linear-gradient(#E7E7E7, #F9F9F9);
  .type{
    margin-left: 40px;
  }
  font-size: 14px;
  color: #333;
  font-weight: 600;
  line-height: 49px;
  border-bottom: 1px solid rgba(243, 243, 243, 0);
}
.page{
  padding: 25px;
  text-align: center;
}
</style>

