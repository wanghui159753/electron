<template>
    <div class="vin-right scrollbar">
      <div class="copy">
        <div class="center">
          <p>{{baseinfo.vin}}</p>
          <p class="copyico" @click="copy"><img src="@/../../static/image/copy.png" alt=""> 复制</p>
        </div>
        <!-- <div class="right">
          <p><img src="@/../../static/image/gift.png" alt=""> 有奖反馈</p>
        </div> -->
      </div>
        <div class="vin-right-top">
          <img :src="baseinfo.brandImgUrl||'http://cdn.xindongpeixun.com/oss/20181013/19574c5dd64045aea57cde7f139acf19.png'" width="100" alt="">
          <div class="info">
            <h4>{{baseinfo.manufacturers}}</h4>
            <p>{{baseinfo.brand +' '+ baseinfo.series +' '+ baseinfo.salesName}}</p>
            <span>(信息仅供参考)</span>
          </div>
        </div>
        <div class="gothere">
          <div class="left">
            <span>更多服务</span>
            <!-- <el-button size='mini' @click="$router.push({name:'purchase',query:{vin:dataVin.baseInfo.vin.toUpperCase()}})"><img src="@/../../static/image/shopcar.png" alt=""> 买配件</el-button> -->
             <el-button size='mini' @click="$router.push({name:'searchList',query:{keyWord:dataVin.baseInfo.brand}})"><img src="@/../../static/image/shopcar.png" alt=""> 汽配经销商</el-button>
          </div>
          <p></p>
          <div class="right">
             <!-- <el-button  size='mini'><img src="@/../../static/image/msg.png" alt=""> 意见反馈</el-button> -->
          </div>
        </div>
        <div class="vin-right-bottom" v-if="tableData.length">
            <div class="oneInfo" v-for="(item,index) in tableData" :key="index">
              <p class="name">{{item.key||'无'}}</p>
              <p class="value">{{item.value||'无'}}</p>
            </div>
        </div>
    </div>
</template>

<script>
const { clipboard } = require("electron");
export default {
  props: ["dataVin"],
  data() {
    return {
      imgsData: [
        "@/../../../static/image/avatar.png",
        "@/../../../static/image/touxiang.jpeg"
      ],
      num: 0
    };
  },
  computed: {
    baseinfo(val) {
      let obj = this.dataVin.baseInfo;
      obj.vin = obj.vin.toUpperCase();
      return obj;
    },
    tableData(val) {
      return this.dataVin.detailInfo;
    }
  },
  methods: {
    copy() {
      clipboard.writeText(this.baseinfo.vin);
      this.$message.success("复制成功");
    },
    prev() {
      if (this.num == 0) {
        this.num = this.imgsData.length;
      }
      this.num--;
    },
    next() {
      if (this.num == this.imgsData.length - 1) {
        this.num = -1;
      }
      this.num++;
    }
  }
};
</script>

<style lang="scss" scoped>
  @media screen and (min-width: 1000px) {
    .oneInfo{
      width: 50% !important;
      p{
        width: 50% !important;
      }
    }
  }
@media screen and (min-width: 1200px) {
  .oneInfo{
    width: 50% !important;
  }
}
@media screen and (min-width: 1500px) {
  .oneInfo{
    width: 33.33% !important;
  }
}
@media screen and (min-width: 1800px) {
  .oneInfo{
    width: 25% !important;
  }
}
.vin-right {
  overflow: auto;
  padding-bottom: 40px;
  background: #f0f0f0;
  .gothere {
    display: flex;
    justify-content: space-between;
    height: 58px;
    line-height: 58px;
    background: #fff;
    font-size: 14px;
    padding: 0 20px;
    img {
      vertical-align: bottom;
    }
  }
  .copy {
    position: relative;
    height: 58px;
    line-height: 58px;
    background: #fff;
    font-size: 14px;
    color: #000;
    img {
      vertical-align: middle;
    }
    .center {
      font-weight: 600;
      position: relative;
      width: 140px;
      margin: 0 auto;
      text-align: center;
      .copyico {
        cursor: pointer;
        font-weight: 500;
        position: absolute;
        right: -70px;
        top: 0;
      }
    }
    .right {
      width: 99px;
      height: 28px;
      border: 1px solid #ccc;
      border-radius: 5px;
      line-height: 26px;
      padding: 0 11px;
      position: absolute;
      right: 50px;
      top: 15px;
    }
  }
  .vin-right-top {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 10px 30px;
    div {
      text-align: center;
      h4 {
        font-size: 20px;
        color: #ff6749;
        line-height: 50px;
      }
      span {
        font-size: 14px;
        color: #999;
        line-height: 30px;
      }
    }
  }
  .vin-right-bottom {
    border-bottom: none;
    // border-top:1px solid #ccc;
    display: flex;
    flex-wrap: wrap;
    padding: 0 45px 60px 45px;
    margin: 0 auto;
    margin-top: 20px;
    .oneInfo {
      width: 50%;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      line-height: 40px;
      height: 40px;
      text-align: center;
      display: flex;
      border-right: 1px solid #ccc;
      margin-top:-1px;
      margin-left: -1px;
      font-size: 14px;
      .name {
        width: 120px;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        color:#666;
      }
      .value {
        width: calc(100% - 120px);
        background: #fff;
      }
    }
  }
}
</style>