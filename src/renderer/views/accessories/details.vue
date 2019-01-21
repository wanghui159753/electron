<template>
<div v-if="info" class="info">
    <header>
        <div class="left" @click="back">
            <img src="@/../../static/image/back.png" alt="">
            <span>店铺列表</span>
        </div>
        <p>店铺详情</p>
        <div>
            <img :src="myinfo.logo" alt="图片加载失败">
            <span>
                {{myinfo.name}}
            </span>
        </div>
    </header>
    <div class="stores">
        <div class="hPic">
            <div class="ltd">
                <img :src="info.logo" alt="加载失败">
                <div class="ltdName">
                    <p>{{info.name}}</p>
                    <div>
                        <span>浏览{{info.browse}}次</span>
                        <span>成交{{info.trades}}次 </span>
                        <span>好评{{info.score}}%</span>
                    </div>
                    <el-rate
                      v-model="info.score/20"
                      disabled
                    ></el-rate>
                </div>
            </div>
            <!-- <div class="line"></div> -->
            <!-- <div class="mark">
                <img src="@/../../static/image/mark.png" alt="">
                <el-button type="primary">店铺二维码</el-button>
            </div> -->
            <div class="right">
                <el-button type="primary" @click="collect" v-if="info.collect">已收藏</el-button>
                <el-button type="primary" @click="collect" v-else>收藏</el-button>
                <el-button type="primary">举报</el-button>
            </div>
        </div>
        <div class="storeinfo">
            <div class="info">
               <div>
                    <p>售后保证金</p>
                    <p class="bsdata">5000.00元</p>
                </div>
                <div class="line"></div>
                <div class="moreInfo">
                    <p>经营范围</p>
                    <p class="bsdata" :title="info.manageScope">{{info.manageScope}}</p>
                </div>
            </div>
            <div class="info">
                <div>
                    <p>优惠活动</p>
                    <p class="bsdata">{{info.activitie?info.activitie:"暂无活动"}}</p>
                </div>
                <div class="line"></div>
                <div class="moreInfo">
                    <p>店铺地址 <img src="@/../../static/image/position.png" width="12" height="15" alt=""></p>
                  <p class="bsdata" :title="info.address.provinceName+info.address.cityName+info.address.regionName+info.address.address">{{info.address.provinceName+info.address.cityName+info.address.regionName+info.address.address}}</p>
                </div>
            </div>
        </div>
        <ul class="connect">
            <li v-if="info.phone">
                <img src="@/../../static/image/tel.png" alt="">
                <div>
                    <p>联系电话</p>
                    <div>{{info.phone}}</div>
                </div>
            </li>
            <li v-if="info.phone" :class="{noborder:!info.wechat||!info.qq}">
                <img src="@/../../static/image/phone.png" alt="">
                <div>
                    <p>手机</p>
                    <div>{{info.phone}}</div>
                </div>
            </li>
            <li v-if="info.qq" :class="{noborder:!info.wechat}">
                <img src="@/../../static/image/qq.png" alt="">
                <div>
                    <p>QQ</p>
                    <div>{{info.qq}}</div>
                </div>
            </li>
            <li :class="{noborder:info.phone&&info.qq}"  v-if="info.wechat">
                <img src="@/../../static/image/wechat.png" alt="">
                <div>
                    <p>微信</p>
                    <div>{{info.wechat}}</div>
                </div>
            </li>
            <li v-if="!(info.phone||info.qq||info.wechat)" class="noborder">
              暂无联系方式
            </li>
        </ul>
    </div>
    <!-- 轮播图 -->
    <div class="banner">
        <el-carousel indicator-position="outside" @click.native="lookPic" v-if="info.bannerList.length" height="430px">
            <el-carousel-item v-for="item in info.bannerList" :key="item.image">
            <img :src="item.image" alt="图片加载失败">
            </el-carousel-item>
        </el-carousel>
    </div>
    <div class="credentials" ref="pic">
        <h2>认证信息</h2>
        <ul class="pic">
            <li>
                <div class="piclist">
                  <img :src="info.autoSellerAuthList[0].imageList[0]" alt="图片加载失败" @click="lookPic(0)">
                </div>
                <p>身份证/营业执照</p>
                <div><i class="el-icon-success"></i> 个人版 </div>
                <el-button type="primary" @click="lookPic(0)">查看</el-button>
            </li>
            <li>
                <div class="piclist">
                  <img :src="info.autoSellerAuthList[1].imageList[0]" alt="图片加载失败" @click="lookPic(1)">
                </div>
                <p>实地认证 </p>
                <div><i class="el-icon-success"></i> 已认证  </div>
                <el-button type="primary" @click="lookPic(1)">查看</el-button>
            </li>
            <li v-if="info.autoSellerAuthList[2]">
                <div class="piclist">
                  <img :src="info.autoSellerAuthList[2].imageList[0]" alt="图片加载失败" @click="lookPic(2)">
                </div>
                <p>代理认证</p>
                <div><i class="el-icon-success"></i> 已认证  </div>
                <el-button type="primary" @click="lookPic(2)">查看</el-button>
            </li>
            <li v-if="info.autoSellerAuthList[3]">
                <div class="piclist">
                  <img :src="info.autoSellerAuthList[3].imageList[0]" alt="图片加载失败" @click="lookPic(3)">
                </div>
                <p>商标认证 </p>
                <div><i class="el-icon-success"></i> 已认证  </div>
                <el-button type="primary" @click="lookPic(3)">查看</el-button>
            </li>
        </ul>
    </div>
    <!-- 用户评论 -->
    <comment :id="$route.params.id"></comment>
</div>
</template>
<script>
import comment from "./compon/comment";
import request from "@/utils/request";
import viewer from "viewerjs/dist/viewer.min.js";
import "viewerjs/dist/viewer.min.css";
import { getLocal, setLocal } from "@/utils/localstorage";
export default {
  components: {
    comment
  },
  data() {
    return {
      info: null,
      myinfo: {}
    };
  },
  methods: {
    lookPic(i) {
      console.log(typeof i);
      let box = document.createElement("div");
      if (typeof i == "number") {
        this.info.autoSellerAuthList[i].imageList.forEach(item => {
          let img = document.createElement("img");
          img.src = item;
          console.log(item, "图片");
          box.appendChild(img);
        });
      } else {
        this.info.bannerList.forEach(item => {
          let img = document.createElement("img");
          img.src = item.image;
          box.appendChild(img);
        });
      }
      let showimg = new viewer(box, {
        hidden() {
          this.viewer.destroy();
          document.body.removeChild(box);
        }
      });
      box.style.display = "none";
      document.body.appendChild(box);
      showimg.show();
      showimg.full();
    },
    back() {
      history.back();
    },
    collect() {
      request({
        url: "/merchant/auto/seller/push/collect/call",
        data: {
          id: 56
        },
        method: "post"
      }).then(res => {
        this.info.collect
          ? this.$message.success("已取消收藏")
          : this.$message.success("收藏成功");
        this.info.collect = !this.info.collect;
      });
    }
  },
  created() {
    this.myinfo = JSON.parse(getLocal("myshop"));
    console.log(this.myinfo);
    request({
      url: "/merchant/auto/seller/detail",
      params: {
        autoSellerId: this.$route.params.id
      },
      method: "get"
    }).then(res => {
      console.log(res);
      this.info = res.data;
    });
  }
};
</script>
<style lang="scss" scoped>
@mixin h {
  line-height: 21px;
  border-left: 3px solid #ff6749;
  margin: 10px 0;
  color: #333333;
  line-height: 35px;
  padding-left: 1em;
}
@mixin shadow {
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 0px 14px -2px #000;
}
@mixin fx {
  display: flex;
  justify-content: space-between;
}
header {
  cursor: pointer;
  @include fx;
  height: 78px;
  font-size: 12px;
  color: #2b3a40;
  padding: 0 20px;
  line-height: 78px;
  p {
    font-size: 24px;
  }
  .left {
    span {
      font-size: 18px;
    }
    img {
      width: 29px;
      height: 29px;
      vertical-align: middle;
      position: relative;
      top: -5px;
    }
  }
  div {
    height: 46px;
    img {
      vertical-align: middle;
      width: 44px;
      height: 44px;
    }
    span {
      font-size: 13px;
    }
  }
}
.stores {
  @include shadow;
  display: flex;
  flex-direction: column;
  padding: 20px 50px;
  margin: 0 20px;
  .hPic,
  .connect {
    width: 100%;
    @include fx;
    justify-content: flex-start;
  }
  .hPic {
    display: flex;
    justify-content: space-between;
    .ltd {
      overflow: hidden;
      img {
        width: 67px;
        height: 67px;
        margin-right: 20px;
        float: left;
      }
      .ltdName {
        float: left;
        font-size: 24px;
        color: #333333;
        line-height: 24px;
        font-weight: 600;
        div {
          display: flex;
          span {
            font-size: 14px;
            color: #fb780e;
            margin-right: 1em;
            font-weight: 500;
          }
        }
      }
    }
    .mark {
      img {
        width: 66px;
        height: 66px;
      }
      .el-button {
        display: block;
        padding: 0;
      }
    }
    .right {
      .el-button {
        padding: 0;
        width: 86px;
        height: 35px;
      }
    }
    .line {
      margin: 12px 5px;
      width: 2px;
      height: 37px;
      background: #a0a0a0;
    }
  }
  .storeinfo {
    font-size: 19px;
    color: #333333;
    line-height: 48px;
    .info {
      overflow: hidden;
      width: 100%;
      .moreInfo {
        width: 50%;
      }
      .line {
        width: 2px;
        background: #a0a0a0;
        height: 37px;
        margin: 24px 0;
        margin-right: 42px;
      }
      div {
        float: left;
        width: 240px;
        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .bsdata {
      font-size: 15px;
      color: #666666;
      line-height: 16px;
    }
  }
  .connect {
    margin-left: -15px;
    .noborder {
      border: 0;
      color: #333333;
    }
    li {
      list-style: none;
      overflow: hidden;
      padding: 0 15px;
      border-right: 2px solid #a0a0a0;
      img {
        width: 42px;
        height: 42px;
        float: left;
      }
      div {
        float: left;
        margin-left: 20px;
        p {
          font-size: 19px;
          color: #333333;
        }
        div {
          font-size: 15px;
          margin: 0;
          color: #666666;
        }
      }
    }
  }
}
.banner {
  width: 100%;
  @include fx;
  padding: 0 20px;
  margin: 20px 0;
  .el-carousel {
    width: 100%;
    border-radius: 5px;
    position: relative;
  }
  img {
    width: 100%;
    border-radius: 5px;
    position: absolute;
    top:-45%;
  }
}
.credentials {
  display: flex;
  margin: 0 20px;
  flex-direction: column;
  h2 {
    @include h;
  }
  .pic {
    padding: 47px 0 13px 0;
    @include shadow;
    text-align: center;
    width: 100%;
    @include fx;
    justify-content: space-around;
    .piclist {
      width: 120px;
      height: 80px;
      overflow: hidden;
      img {
        width: 100%;
      }
    }

    p {
      font-size: 16px;
      color: #333333;
      line-height: 45px;
    }
    .el-button {
      width: 54px;
      height: 24px;
      padding: 0;
    }
    div {
      font-size: 14px;
      color: #fb780e;
      margin-bottom: 13px;
    }
  }
}
li {
  list-style: none;
}
img {
  border-radius: 5%;
}
.banner h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}
</style>
<style>
.el-carousel__indicators--outside {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  left: 0 !important;
}
.el-carousel__indicators--outside li {
  padding: 0;
  margin:10px;
  border-radius: 50%;
  background: #a4a4a4;
}
.el-carousel__indicators--outside li button {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: transparent;
  opacity: 0.5;
}
.is-active {
  background: #fff !important;
}
</style>

