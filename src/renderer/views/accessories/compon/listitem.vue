<template>
    <div class="shopitem" @click="godetails">
        <img :src="obj.detail.logo" alt="">
        <p class="name">{{obj.detail.name}}</p>
        <div class="attestation">
            <el-tooltip placement="top">
                <span slot="content">5000保证金</span>
                <img src="@/../../static/image/cash.png" alt="">
            </el-tooltip>
            <el-tooltip content="实地认证" placement="top">
                <img src="@/../../static/image/cash2.png" alt="">
            </el-tooltip>
            <el-tooltip content="优秀商户" placement="top">
                <img src="@/../../static/image/cash3.png" alt="">
            </el-tooltip>  
        </div>  
        <div class="range">
            
            <p><span>经营范围</span>：{{obj.detail.manageScope}}</p>
        </div>  
        <div class="adress">
            
            <p><span>店铺地址</span>：{{obj.detail.provinceName+obj.detail.cityName+obj.detail.regionName+obj.detail.address}}</p>
        </div> 
        <el-button type="primary" @click.native="rpu">发消息</el-button>
    </div>   
</template>
<script>
export default {
  props: ["obj"],
  methods: {
    rpu(el) {
      this.$router.push("/message/index/" + "p2p-" + this.obj.detail.accId);
      el.stopPropagation();
    },
    godetails() {
      this.$router.push("/accessories/details/" + this.obj.autoSellerId);
    }
  },
  created() {}
};
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1400px) and (max-width: 1800px) {
  .shopitem {
    width: 223px !important;
  }
}
.shopitem {
  width: 230px;
  height: 383px;
  padding: 15px 23px 23px 23px;
  background: #fff;
  border-radius: 5px;
  margin: 5px 10px 5px 0;
  img {
    width: 175px;
    height: 175px;
    display: block;
    overflow: hidden;
    transition: all 0.5s;
    border-radius: 5px;
    margin: 0 auto;
  }
  img:hover {
    transform: scale(1.1);
  }
  .name {
    font-size: 18px;
    color: #333;
    line-height: 36px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
  }
  .attestation {
    height: 28px;
    img {
      width: 22px;
      height: 22px;
      float: left;
      margin-right: 7px;
      border-radius: 5px;
    }
  }
  @mixin col {
    span {
      color: #ff6479;
    }
    p {
      color: #999;
      line-height: 30px;
    }
  }
  .range {
    font-size: 15px;
    @include col;
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .adress {
    font-size: 15px;
    @include col;
    p {
      height: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: wrap;
    }
  }
  .el-button {
    width: 159px;
    height: 28px;
    display: block;
    margin: 0 auto;
    padding: 0;
  }
}
</style>