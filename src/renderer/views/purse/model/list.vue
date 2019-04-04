<template>
  <div class="purse_list">
    <div class="purse_list_header">
      <h3>合计 ：</h3>
      <span>收入</span>
      <strong style="color:red">￥{{plus|exNum}}</strong>
      <span>支出</span>
      <strong style="color:green">￥{{sub|exNum}}</strong>
    </div>
    <div class="purse_list_table">
        <el-row class="head">
            <el-col :span="7">时间</el-col>
            <el-col :span="4">类型</el-col>
            <el-col :span="6">金额</el-col>
             <el-col :span="6">来源</el-col>
            <!--<el-col :span="5">交易对象</el-col>-->
        </el-row>
        <el-row class="body" v-for=" (x,index) in billList " :key='index'>
            <el-col :span="7">{{x.createTime|parseTime}}</el-col>
            <el-col :span="4">{{x.sign =='SUB' ?'支出':'收入'}}</el-col>
            <el-col :span="6" :style='(x.sign =="SUB" ? "color:green":"color:red") + ";font-weight:900"'>{{x.sign =='SUB' ?'-':'+'}}{{x.amount|exNum}}</el-col>
             <el-col :span="6">{{x.title + (x.label?' ('+x.label+')':'')}}</el-col>
            <!--<el-col :span="5"><img  src="../../../../../static/image/avatar.png"/> <span>某某修理厂</span></el-col>-->
        </el-row>
    </div>
    <pager @sizeChange="sizeChange" :total="pages"></pager>
  </div>
</template>
<script>
import { billPage } from "@/api/myorder/index.js";
import {parseTime} from "@/utils/index.js";
import pager from "@/components/pager/pager";
export default {
  props:['plus','sub'],
  components: { pager },
  data() {
    return {
      billList:[],
      pages:0
    };
  },
  methods: {
    ajaxBill(i){
     billPage({
       pageNo:i || 1
     }).then(res=>{
      this.pages = res.data.pages*10;
     this.billList = res.data.records;
    })
    },
    sizeChange(i){
        this.ajaxBill(i)
    }
  },
  mounted() {
    this.ajaxBill()
  }
};
</script>
<style lang="scss" >
.purse_list {
  height: 100%;
  background: white;
  .purse_list_header {
    overflow: hidden;
    padding: 30px 15px 5px 15px;
    span {
      font-size: 16px;
      padding-left: 20px;
      line-height: 26px;
      height: 26px;
      float: left;
    }
    strong {
      font-size: 23px;
      float: left;
    }
    h3 {
      float: left;
    }
  }
  .purse_list_table{

      .el-col{
          overflow: hidden;
          img{
              width: 26px;
              height: 26px;
              float: left;
              border-radius: 5px;
              margin:15px 0;
          }
          span{
              float: left;
                padding-left:10px;
          }
      }
      .head{
          background: #E6E6E6;
          height: 48px;
          line-height: 48px;
          color:#666;
          padding:0 20px;
      }
      .body{
          height: 55px;
           padding:0 20px;
            line-height: 55px;
            border-bottom: 1px solid #e6e6e6;
      }
  }
}
</style>