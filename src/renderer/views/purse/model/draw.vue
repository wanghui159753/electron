<template>
<div class="draw">
     <el-dialog
     title="提现记录"
     :visible.sync="dialogTableVisible" 
     :center='true' 
    width="90%"
     modal
     :modal-append-to-body="false" 
     :close-on-click-modal="false"   
      custom-class="draw"
      :show-close="false"
    > 
    <i class="el-icon-close" @click="$emit('closeTable')"></i>
        <el-table :data='drawData'>
            <el-table-column property="outBizNo" label="订单号码" width="180"></el-table-column>
            <el-table-column property="amount" label="金额" width="100"></el-table-column>
            <el-table-column property="status" label="状态" width="100"></el-table-column>
             <el-table-column property="applyAccount" label="提现账号" width="170"></el-table-column>
            <el-table-column property="createTime" label="申请时间" width="200"></el-table-column>
            <el-table-column property="failMsg" label="其他"></el-table-column>
        </el-table>
            <pager  @sizeChange="sizeChange" :total="pages"></pager>
    </el-dialog>
</div>
</template>
<script>
import {parseTime} from "@/utils/index.js";
import pager from "@/components/pager/pager";
import { drawList } from "@/api/myorder/index.js";

export default {
  props:['dialogTableVisible'],
  components: { pager },
  data() {
    return {
        drawData:[],
        pages:0
    };
  },
  methods: {
      getDraw(page){
        drawList({
            pageNo:page || 1
        }).then((result) => {
                this.pages = result.data.pages*10
                this.drawData = result.data.records.map(item=>{
                    item.createTime = parseTime(item.createTime);
                    item.applyAccount = (item.type == "ALIPAY" ? '支付宝 ':'微信 ') + item.applyAccount
                    item.amount = '￥' + (item.amount/100).toFixed(2);
                    item.status = this.changeStatus( item.status )
                    return item
                })
            })
      },
      sizeChange(i){
          this.getDraw(i)
      },
      changeStatus(status){
          switch(status){
                case 'PENDING':
                return '受理中'
                case 'FAIL':
                return '提现失败'
                case 'OK':
                return '提现成功'
                case 'PAU_DURING':
                return '打款中'
          }
      },
  },
  mounted() {
      this.getDraw()
  }
};
</script>
<style lang="scss" >
.draw{ 
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    margin-top:4vh !important;
    height: 90%;
    .page{
        position: absolute;
        left:0;
        border:0;
    }
  .el-dialog__wrapper{
     position:absolute;
     .el-dialog__header{
         background: #F5F5F5;
         font-weight: 900;
         padding:10px;
         position: relative;
         
     }
     .el-dialog__body{
         margin:10px;
         padding:0;
         border:1px solid #E6E6E6;
         >i{
             position: absolute;
             top:7px;
             right: 10px;
             font-size: 25px;
             cursor: pointer;
         }
         .el-table__header-wrapper th{
             background: #FFF8ED;
             padding:5px;
         }
         tbody th:nth-of-type(2){
             color: #FF6749;
         }
     }
  }
}

</style>