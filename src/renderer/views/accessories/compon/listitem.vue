<template>
  <div class="shopitem" @click="godetails">
    <div class="img">
      <img :src="obj.detail.logo" alt v-if="obj.detail.logo">
      <p @click="rpu">
        <img src="@/../../static/image/grayMsg.png" alt>
        联系商家
      </p>
    </div>
    <img class="excellent" src="@/../../static/image/excellent.png" alt v-if="obj.detail.excellent">
    <div class="underPic">
      <div class="range">
        <p>
          <span>主营</span>
          ：{{obj.detail.manageScope}}
        </p>
      </div>
      <div class="adress">
        <p>
          <img src="@/../../static/image/grayPosi.png" alt>
          {{obj.detail.provinceName+obj.detail.cityName+obj.detail.regionName+obj.detail.address}}
        </p>
      </div>
      <div class="shoperName">
        <p class="name">{{obj.detail.name}}</p>
        <div class="tip">
          <el-tooltip placement="top" v-for="x in obj.detail.authList" :key="x">
            <span slot="content">{{x}}</span>
            <img src="./../../../../../static/image/cash.png" alt v-if="x=='营业执照认证'">
            <img src="./../../../../../static/image/id.png" alt v-else-if="x=='身份证认证'">
            <img src="./../../../../../static/image/cash2.png" alt v-else-if="x=='实地认证经销商'">
            <img src="./../../../../../static/image/cash3.png" alt v-else-if="x.indexOf('保证金')>-1">
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["obj"],
  methods: {
    rpu(el) {
      console.log(this.obj.detail,'---')
      this.$router.push("/message/index/" + "p2p-" + this.obj.detail.accId);
      this.$store.dispatch("setCurrSession","p2p-" + this.obj.detail.accId);
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
// @media screen and (min-width: 1400px) and (max-width: 1800px) {
//     .shopitem {
//         width: 223px !important;
//     }
// }
.shopitem:hover {
  box-shadow:0px 0px 6px 0px rgba(252, 79, 104, 0.35);
}
.shopitem {
  width: 220px;
  height: 340px;
  background: #fff;
  border: 1px solid #efefef;
  font-size: 14px;
  margin: 15px 10px;
  cursor: pointer;
  position: relative;
  .excellent {
    width: 60px;
    height: 20px;
    position: absolute;
    left: -5px;
    top: 201px;
  }
  .underPic {
    padding: 15px 10px;
  }
  .img:hover{
    img{
      transform: scale(1.1);
    }
  }
  .img {
    width: 218px;
    height: 218px;
    overflow: hidden;
    position: relative;
    img {
      width: 218px;
      height: 218px;
    transition: all .3s;
    }
    p {
      height: 38px;
      position: absolute;
      line-height: 38px;
      bottom: -38px;
      width: 100%;
      text-align: center;
      background: #000;
      opacity: 0.7;
      z-index: 5;
      transition: all 0.3s;
      color: #fff;
      cursor: pointer;
      img {
        width: 14px;
        height: 14px;
        vertical-align: middle;
      }
    }
  }
  .img:hover p {
    bottom: 0;
  }
  .name {
    font-size: 18px;
    color: #333;
    line-height: 36px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
      line-height: 15px;
    }
  }
  .range {
    font-size: 12px;
    margin-bottom: 12px;
    @include col;
    p {
      color: #000;
      span {
        display: inline-block;
        width: 34px;
        height: 18px;
        text-align: center;
        line-height: 18px;
        background: #56b9ff;
        color: #fff;
        border-radius: 3px;
      }
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .adress {
    margin-bottom: 5px;
    img {
      vertical-align: text-top;
    }
    font-size: 12px;
    @include col;
    p {
      height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
  .el-button {
    width: 159px;
    height: 28px;
    display: block;
    margin: 0 auto;
    padding: 0;
  }
  .shoperName {
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 17px;
      height: 20px;
      margin-right: 5px;
    }
    .tip {
      //   width: 66px;
      display: table;
    }
    .name {
      font-size: 14px;
      margin-right: 16px;
      max-width: 123px;
    }
  }
}
</style>