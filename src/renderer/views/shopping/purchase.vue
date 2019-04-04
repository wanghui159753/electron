<template>
<div class="publish scrollbar">
    <div class="details">
        <div class="carInfo">
            <h4><p>选择车辆信息<span>(<i> * </i>为必填项)</span></p></h4>
            <div class="sel">
                <div class="left">
                    <span>填写车架号</span>
                    <el-input type="text" v-model="publish.vin" placeholder="请输入17位车架号（选填）" maxlength="17"></el-input>
                    <el-button @click="search" type="primary">搜索</el-button>
                </div>
                <div class="right">
                    <span>*车型选择</span>
                    <div v-if="publish.vehicleBrand&&publish.vehicleSerie">
                      <div class="borderCCC">
                          <img :src="publish.logo" width="50" alt="">
                          <div>
                              <p class="brandName">{{publish.vehicleBrand}} {{publish.vehicleSerie}}</p>
                              <p>{{publish.vehicleModel}}</p>
                          </div>
                      </div>
                      <div class="reselection" @click="showCar">
                          重新选择>
                      </div>
                    </div>
                    <div v-else  class="borderCCC ounBor"  @click="showCar">
                      <p>无车架号，选择车型></p> 
                    </div>
                </div>
            </div>
        </div>
        <div class="orderList">
            <h4><p>选择车辆信息<span>(添加不少于一项)</span></p></h4>
            <div class="table">
                <div class="top">
                    <el-col :span="3">排序</el-col>
                    <el-col :span="12">配件名称</el-col>
                    <el-col :span="4">操作</el-col>
                    <el-col :span="5" style="cursor:pointer;" @click.native="delPart"><img src="@/../../static/image/rubish.png" alt=""> 清空全部</el-col>
                </div>
                <div class="list" v-for="(item,x) in publish.partList" :key="x" :class="{addBg:x%2}">
                    <el-col :span="3">{{x+1}}</el-col>
                    <el-col :span="12">
                        <div class="addParts" @click="isShow=true">{{item.subName||'请添加配件>'}} <img src="@/../../static/image/replace.png" alt=""></div>
                    </el-col>
                    <el-col :span="4"><img src="@/../../static/image/delpic.png" alt="" @click="delPart(x)"></el-col>
                    <el-col :span="5"></el-col>
                </div>
                <div class="addMore"  @click.native="isShow=true">
                    <span>+</span>添加配件
                </div>
            </div>
        </div>
        <div class="pic">
            <h4><p>照片、备注<span>(选填)</span></p></h4>
            <div class="pic">
                <p>照片：</p>
                <div class="upPic" ref="labels">
                    <label>
                        <input type="file" multiple @change="upPhoto">
                        <span>+</span>
                        <p>{{publish.imageList.length}}/9张</p>
                    </label>
                </div>
                <div class="imgList" v-for="(item,x) in publish.imageList" :key='x'>
                    <img src="@/../../static/image/del.png" alt="" width="26" class="img" @click="delIndex(x)">
                    <img @click.stop="lookPic (x)" :src="item" width="100" height="80" alt="">
                </div>
            </div>
            <div class="remark">
                <p>备注：</p>
                <textarea placeholder="请填写需要额外说明的信息（100字符以内）" v-model="publish.remark" name="" id="" cols="30" rows="10"></textarea>
            </div>
        </div>
    </div>
    <div class="send">
        <el-button type="primary" @click="sendRequest"><img src="@/../../static/image/Plane.png" alt=""> 发布需求</el-button>
    </div>
    <sel-car v-show="selShow" v-model='publish' @close='selShow=false'></sel-car>
    <el-dialog
      :visible.sync="dialogVisible"
      width="500px"
      top='30vh'
      center
      :modal='false'>
      <span slot="title">温馨提示</span>
      <p><i class="el-icon-warning"></i> 是否放弃发布？</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="cansel(1)">放 弃</el-button>
        <el-button type="primary" @click="cansel">继续发布</el-button>
      </span>
    </el-dialog>
    <parts v-model="publish.partList" v-if="isShow" @hid='isShow=false'></parts>
    <frames v-model="frameShow" v-if="frameShow" :vin="vin"></frames>
</div>
</template>

<script>
var up = require("@/utils/upPic");
import { getMyEnquiryDetail, publish } from "@/api/quote/quote";
import selCar from "./model/pulb";
import parts from "./model/parts";
import { vin } from "@/api/quote/quote";
import { getLocal } from "@/utils/localstorage";
import { lookPhoto } from "@/api/admission/admission";
import { getMyShop } from "@/api/admission/admission";
import frames from "../quote/model/framNumber";
export default {
  name: "purchase",
  components: { selCar, parts,frames},
  methods: {
    showCar() {
      this.selShow = true;
    },
    delPart(i) {
      typeof i == "number"
        ? this.publish.partList.splice(i, 1)
        : (this.publish.partList = []);
    },
    lookPic(i) {
      lookPhoto(i, this.publish.imageList);
    },
    delIndex(i) {
      this.publish.imageList.splice(i, 1);
    },
    upPhoto(e) {
      up.up(
        e.target,
        this,
        str => {
          this.publish.imageList.push(res);
        },
        this.$refs.labels
      );
    },
    search() {
      if (this.publish.vin.length == 17) {
        vin({
          vin: this.publish.vin
        }).then(res => {
            this.frameShow = true;
            this.vin = this.publish.vin;
          this.publish.vehicleBrand = res.data.baseInfo.brand;
          this.publish.vehicleSerie = res.data.baseInfo.series;
          this.publish.vehicleModel =res.data.detailInfo[1].value+'款 '+res.data.baseInfo.salesName;
          this.publish.logo = res.data.baseInfo.brandImgUrl ||'http://cdn.xindongpeixun.com/oss/20181013/19574c5dd64045aea57cde7f139acf19.png';
        });
      } else {
        this.$message.warning("车架号错误，请检查");
      }
    },
    cansel(i) {
      this.dialogVisible = false;
      this.flag(i == 1 ? true : false);
    },
    getQuote() {
      getMyEnquiryDetail({
        enquiryId: this.$route.query.id
      }).then(res => {
        this.publish = res.data;
      });
    },
    sendRequest() {
      if (this.publish.partList.length && this.publish.vehicleSerie) {
        var str;
        getMyShop()
          .then(res => {
            str = res.data;
          })
          .then(() => {
            this.publish.province = str.address.provinceName;
            this.publish.city = str.address.cityName;
            this.publish.region = str.address.regionName;
            this.publish.vin = this.publish.vin || null;
            return publish(this.publish);
          })
          .then(res => {
            this.isSend = true;
            this.$router.push("/shopping/index/release");
          });
      } else {
        this.publish.partList.length
          ? null
          : this.$message.warning("配件不能为空");
        this.publish.vehicleSerie
          ? null
          : this.$message.warning("车辆信息不能为空");
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getQuote();
    } else if (this.$route.query.vin) {
      this.publish.vin = this.$route.query.vin;
      this.search();
    }
  },
  data() {
    return {
       vin: "",
      selShow: false,
      dialogVisible: false,
      isShow: false,
      publish: {
        city: "",
        imageList: [],
        logo: "",
        partList: [],
        province: "",
        region: "",
        remark: "",
        vehicleBrand: "",
        vehicleModel: "",
        vehicleSerie: "",
        vin: ""
      },
      flag: null,
      isSend: false,
       frameShow: false,
    };
  },
  beforeRouteLeave(to, form, next) {
    if (this.isSend) {
      next();
    } else {
      this.dialogVisible = true;
      this.flag = next;
    }
  }
};
</script>

<style lang='scss' scoped>
.el-dialog {
  width: 500px;
  p {
    text-align: center;
    font-size: 18px;
  }
  .el-button {
    margin: 0 50px;
  }
}
.publish {
  height: calc(100vh - 160px);
  overflow: auto;
  padding-top: 40px;
  .el-icon-warning {
    color: #fc684f;
  }
}
.details {
  padding-left: 40px;
  width:1000px;
  .sel {
    overflow: hidden;
    font-size: 14px;
    padding: 16px 0;
    line-height: 31px;
    .left {
      font-size: 0;
      float: left;
      margin-right: 70px;
      span {
        font-size: 14px;
        margin-right: 9px;
        float: left;
      }
      .el-button {
        width: 80px;
        height: 36px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        padding: 0;
      }
    }
    .right {
      float: left;
      .reselection {
        cursor: pointer;
        height: 100%;
        line-height: 64px;
        color: #fc684f;
        margin-left: 10px;
      }
      img {
        float: left;
        margin: 5px 10px 5px 10px;
      }
      span {
        float: left;
        margin-right: 10px;
      }
      .ounBor {
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 300px;
        text-indent: 2em;
        p {
          text-decoration: underline;
          color: #fc684f;
        }
      }
      div {
        cursor: pointer;
        float: left;
        .borderCCC {
          float: left;
          border: 1px solid #ccc;
          width: 300px;
          border-radius: 5px;
        }
        span {
          float: left;
          margin-right: 10px;
        }
      }
      p {
        font-size: 12px;
      }
      .brandName {
        font-size: 16px;
      }
    }
  }
  .orderList {
    width: 66.4%;
    text-align: center;
    h4 {
      border: 0;
    }
    .top {
      background: #fc684f;
      height: 40px;
      line-height: 40px;
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;
      color: #fff;
      img {
        vertical-align: text-top;
      }
    }
    .list,
    .addMore {
      cursor: pointer;
      height: 56px;
      line-height: 56px;
      border: 1px solid #ccc;
      border-top: 0;
    }
    .list {
      .addParts {
        position: relative;
        border: 1px solid #ccc;
        border-radius: 5px;
        height: 36px;
        line-height: 36px;
        margin-top: 10px;
        text-indent: 2em;
        text-align: left;
        font-size: 14px;
        cursor: pointer;
        img {
          position: absolute;
          right: 11px;
          top: 7px;
        }
      }
    }
    .addMore {
      color: #fc684f;
      text-decoration: underline;
      span {
        margin-right: 6px;
        display: inline-block;
        border: 1px solid #ccc;
        width: 16px;
        height: 16px;
        vertical-align: text-top;
        line-height: 16px;
      }
    }
  }
  .pic {
    color: #666;
    overflow: hidden;
    h4 {
      overflow: hidden;
    }
    p {
      float: left;
    }
    .pic {
      padding-top: 40px;
    }
    .upPic {
      float: left;
      position: relative;
      width: 100px;
      height: 80px;
      border: 1px dashed #ccc;
      margin-left: 20px;
      label {
        width: 100px;
        height: 80px;
        text-align: center;
        input {
          display: none;
        }
        span {
          display: block;
          margin: 0 auto;
          margin-top: 25px;
          width: 30px;
          height: 30px;
          border: 1px dashed #ccc;
          line-height: 30px;
        }
      }
      p {
        position: absolute;
        width: 100%;
        text-align: center;
        bottom: 1px;
        left: 0;
        font-size: 12px;
      }
    }
    .imgList {
      position: relative;
      float: left;
      margin-left: 20px;
      width: 100px;
      height: 80px;
      border-radius: 5px;
      .img {
        position: absolute;
        right: -13px;
        top: -13px;
      }
      img {
        border-radius: 3px;
      }
    }
  }
  .remark {
    padding-top: 40px;
    padding-bottom: 80px;
    textarea {
      width: 884px;
      height: 80px;
      border: 1px solid #999999;
      margin-left: 20px;
      font-size: 14px;
      color: #000;
      resize: none;
      border-radius: 3px;
      padding: 22px 0 0 31px;
      outline: 0;
    }
  }
}
.send {
  position: fixed;
  bottom: 0;
  left: 180px;
  width: calc(100% - 180px);
  background: #fff;
  height: 83px;
  text-align: center;
  border-top: 1px solid #ccc;
  .el-button {
    width: 120px;
    height: 40px;
    margin-top: 20px;
    img {
      vertical-align: middle;
    }
  }
}
h4 {
  font-size: 18px;
  border-bottom: 1px solid #cccccc;
  padding: 10px 0;
  text-align: left;
  color: #000;
  i {
    color: #fc0d1b;
  }
  p {
    font-size: 18px;
    padding-left: 7px;
    border-left: 3px solid #fc684f;
    span {
      margin-left: 10px;
    }
  }
  span {
    font-size: 14px;
  }
}
.addBg {
  background: #f5f5f5;
}
</style>
<style lang="scss">
.sel .el-input {
  width: 220px;
  height: 36px;
  .el-input__inner {
    height: 36px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
