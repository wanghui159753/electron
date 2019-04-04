<template>  

<div class="sysset-con">
  	<p>设置</p>
    <div class="sysset-tab">
      
      <el-tabs v-model="activeName">
         <el-tab-pane label="账号设置" name="first" class="scrollbar">
           <account></account>
         </el-tab-pane>
        <el-tab-pane label="收货地址" name="second" class="scrollbar">
          <addresslist></addresslist>
        </el-tab-pane>
         <el-tab-pane label="个人基本设置" name="third" class="scrollbar" v-if="!show">
          <personal ></personal>
        </el-tab-pane>
        <template v-else>
          <el-tab-pane label="店铺设置" name="third"  class="scrollbar" style="height: calc( 100vh - 140px);">
          <shopset></shopset>
        </el-tab-pane>
         <el-tab-pane label="轮播图片" name="fourth"  class="scrollbar">
          <banner></banner>
        </el-tab-pane>
        </template>
        
        <el-tab-pane label="版本信息" :name="show ? 'fifth':'fourth'" class="scrollbar">
          <version></version>
        </el-tab-pane>
      </el-tabs>
    </div>
</div>

</template>
<script>
import account from "./components/account";
import addresslist from "./components/address";
import shopset from "./components/shopset";
import version from "./components/version";
import banner from "./components/banner";
import personal from "./components/personal";
import { getScopetype } from "@/api/accessories/index.js";
export default {
  name: "sysset",
  data() {
     return {
        activeName: 'first',
        show:false,
      };
  },
   components: {
    account,
    addresslist,
    shopset,
    version,
    banner,
    personal
  },
  mounted() {
    getScopetype().then(result => {
      this.show = result.data.type;
    });
  },
  computed: {
  },
    created(){
      this.activeName=this.$route.query.activeName||'first'
    },
  methods: {}
};
</script>
<style lang="scss" scoped>
.sysset-con {
  height: calc( 100vh - 148px);
  width: 100%;
  > p {
    background-color: #ddd;
    font-weight: bold;
    text-align: center;
    width: 100%;
    line-height: 50px;
    height: 50px;
  }
  .sysset-tab {
    padding: 15px 30px;
    width: 100%;
    .scrollbar{
       height:calc( 100vh - 30vh);
    }
    .el-tabs {
      width: 100% !important;
    }
  }
}
</style>
<style>
</style>


