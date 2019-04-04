<template>
    <div class="shopinfo">
        <div class="basicInfo">
            <h2>基本信息</h2>
            <div class="name">
                <div class="ushed">
                    <img :src="upus.logo" alt="">
                    <p>{{upus.name}}</p>
                </div>
                <div class="again">
                    <el-button type="primary" :disabled="upus.status=='AWAIT'" @click="gostep1">重新修改审核></el-button>
                    <p @click="lookhistory">历史审核记录></p>
                </div>
            </div>
            <div class="info">
                <div class="left">
                    <div>
                        <p class="fix">证件号</p>
                        <p class="atc">{{upus.idCard}}</p>
                    </div>
                    <div class="act">
                        <p class="fix">主营分类</p>
                        <p class="atc"><span v-for="(i,index) in upus.manageScopeList"
                                             :key="index">{{i.labelName}} </span></p>
                    </div>
                    <div class="act">
                        <p class="fix">联系号码</p>
                        <p class="atc">{{upus.mobile}}</p>
                    </div>
                </div>
                <div class="right">
                    <div>
                        <p>所在地区</p>
                        <p class="act">{{upus.address.provinceName+upus.address.cityName+upus.address.regionName}}</p>
                    </div>
                    <div>
                        <p>详细地址</p>
                        <p class="act">{{upus.address.address}}</p>
                    </div>
                </div>
            </div>
            <div class="documents" v-if="upus.authList.length">
                <h2>证件信息</h2>
                <div class="idCard">
                    <p>身份证</p>
                    <ul>
                        <li @click="lookPic(0,upus.authList[0].imageList)">
                            <div>
                                <img :src="upus.authList[0].imageList[0]" alt="">
                            </div>
                            <p>法人身份证（正面）</p>
                        </li>
                        <li @click="lookPic(1,upus.authList[0].imageList)">
                            <div>
                                <img :src="upus.authList[0].imageList[1]" alt="">
                            </div>
                            <p>法人身份证（反面）</p>
                        </li>
                        <li @click="lookPic(2,upus.authList[0].imageList)">
                            <div>
                                <img :src="upus.authList[0].imageList[2]" alt="">
                            </div>
                            <p>法人手持身份证照</p>
                        </li>
                    </ul>
                </div>
                <div class="shoppic">
                    <p>实地照片</p>
                    <ul>
                        <li @click="lookPic(0,upus.authList[1].imageList)">
                            <div>
                                <img :src="upus.authList[1].imageList[0]" alt="">
                            </div>
                            <p>店铺门头</p>
                        </li>
                        <li @click="lookPic(1,upus.authList[1].imageList)">
                            <div>
                                <img :src="upus.authList[1].imageList[1]" alt="">
                            </div>
                            <p>店铺照片</p>
                        </li>
                        <li @click="lookPic(2,upus.authList[1].imageList)">
                            <div>
                                <img :src="upus.authList[1].imageList[2]" alt="">
                            </div>
                            <p>店铺照片</p>
                        </li>
                    </ul>
                </div>
                <div>
                    <p>营业执照 </p>
                    <ul>
                        <li @click="lookPic(3,upus.authList[0].imageList)">
                            <div>
                                <img :src="upus.authList[0].imageList[3]" alt="">
                            </div>
                            <p>有效营业执照</p>
                        </li>
                    </ul>
                </div>
                <div v-if="upus.authList[2]">
                    <p v-if="upus.authList[2].type=='AGENCY'">代理认证</p>
                    <p v-else>商标认证</p>
                    <ul>
                        <li v-for="(x,index) in upus.authList[2]?upus.authList[2].imageList:[]"
                            @click="lookPic(index,upus.authList[2].imageList)" :key="index">
                            <div>
                                <img :src="x" alt="">
                            </div>
                            <p v-if="upus.authList[2].type=='AGENCY'">代理认证</p>
                            <p v-else>商标认证</p>
                        </li>
                    </ul>
                </div>
                <div v-if="upus.authList[3]">
                    <p>商标认证</p>
                    <ul>
                        <li v-for="(x,index) in upus.authList[3]?upus.authList[3].imageList:[]"
                            @click="lookPic(index,upus.authList[3].imageList)" :key="index">
                            <div>
                                <img :src="x" alt="">
                            </div>
                            <p>商标认证</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getLocal } from "@/utils/localstorage";
import { setInterval, clearInterval } from "timers";
import { lookPhoto } from "@/api/admission/admission";

export default {
  data() {
    return {
      upus: null
    };
  },
  methods: {
    gostep1() {
      this.$router.push("/admission/index/step1/1");
    },
    lookhistory() {
      this.$router.push("/admission/index/Record");
    },
    lookPic(i, arr) {
      lookPhoto(i, arr);
    }
  },
  created() {
    var time;
    if (getLocal("myshop")) {
      this.upus = JSON.parse(getLocal("myshop"));
    } else {
      time = setInterval(() => {
        if (getLocal("myshop")) {
          clearInterval(time);
          this.upus = JSON.parse(getLocal("myshop"));
        }
      }, 100);
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin htag {
  h2 {
    font-size: 20px;
    color: #ff6749;
    border-bottom: 1px solid #ff6749;
    line-height: 46px;
    text-align: left;
  }
}
@mixin ptag {
  div {
    overflow: hidden;
    p {
      float: left;
      width: 120px;
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: 30px;
    }
    .act {
      width: 326px;
      color: #343434;
    }
  }
}
.piczoo .shopinfo {
  cursor: pointer;
  margin: 0 auto;
  padding: 0 90px;
  .basicInfo {
    @include htag;
    .name {
      overflow: hidden;
      color: #333;
      padding-top: 40px;
      .ushed {
        float: left;
        img {
          float: left;
          width: 110px;
          height: 110px;
          margin-right: 40px;
          border-radius: 3%;
        }
        p {
          float: left;
          font-size: 18px;
          line-height: 130px;
        }
      }
      .again {
        float: right;
        text-align: center;
        font-size: 14px;
        .el-button {
          width: 130px;
          height: 40px;
          padding: 0;
          line-height: 40px;
        }
        p {
          line-height: 40px;
        }
      }
    }

    .info {
      font-size: 16px;
      color: #999;
      overflow: hidden;
      margin-top: 30px;
      .left {
        float: left;
        border-right: 1px solid #ff6749;
        padding-right: 40px;
        div {
          overflow: hidden;
          p {
            float: left;
            text-align: left;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            line-height: 30px;
          }
          .fix {
            width: 120px;
          }
          .act {
            color: #343434;
          }
          .atc {
            max-width: 500px;
            color: #343434;
          }
        }
      }
      .right {
        float: left;
        margin-left: 60px;
        @include ptag;
      }
    }
  }
}

.documents {
  div {
    .right {
      float: left;
      margin-left: 60px;
      @include ptag;
    }
  }
}

.atc {
  max-width: 500px;
  min-width: 150px;
  color: #343434;
}
.documents {
  div {
    p {
      font-size: 16px;
      text-align: left;
      color: #333;
      line-height: 64px;
    }
    ul {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      li {
        list-style: none;
        margin-right: 30px;
        div {
          height: 160px;
          overflow: hidden;
          border-radius: 3%;
          background: #dedede;
        }
        img {
          width: 200px;
        }
        p {
          text-align: center;
          font-size: 14px;
          color: #999;
        }
      }
    }
  }
}
</style>
