<template>
    <div class="pad">
      <div class="line">
          <p>基本信息 <span>(<i class="el-icon-star-on"></i>为必填项)</span></p>
          <el-button type="primary" class="look" @click="show">查看示意图</el-button>
        </div>
        <div class="rows">
            <div class="left left1">身份证/营业执照<br><span>必填</span></div>
            <div class="right">
                <p>仅支持JPG、PNG格式</p>  
                <div>
                    <label>
                      <div class="hoveit">
                        <img :src="IDENTITY[0]" ref='img0' alt="图片加载失败">
                        <p>点击上传</p>
                      </div>
                        <p>法人身份证（正面）</p>
                        <input type="file" class="filse" @change="readPic($event,0,IDENTITY)">
                    </label>
                    <label>
                      <div class="hoveit">
                        <img :src="IDENTITY[1]" ref='img1' alt="图片加载失败">
                        <p>点击上传</p>
                      </div>
                        <p>法人身份证（反面）</p>
                        <input type="file" class="filse" @change="readPic($event,1,IDENTITY)">
                    </label>
                    <label>
                      <div class="hoveit">
                        <img :src="IDENTITY[2]" ref='img2' alt="图片加载失败">
                        <p>点击上传</p>
                      </div>
                        <p>法人手持身份证照</p>
                        <input type="file" class="filse" @change="readPic($event,2,IDENTITY)">
                    </label>

                </div>  
            </div>    
        </div>  
        <div class="rows">
            <div class="left left1">上传实地照片<br><span>必填</span></div>
            <div class="right">
                <p>仅支持JPG、PNG格式</p>  
                <div>
                    <label>
                      <div class="hoveit">
                        <img :src="FIELD[0]" ref='img4' alt="图片加载失败">
                        <p>点击上传</p>
                      </div>
                        <p>店铺门头</p>
                        <input type="file" class="filse" @change="readPic($event,0,FIELD)">
                    </label>
                    <label>
                      <div class="hoveit">
                        <img :src="FIELD[1]" ref='img5' alt="图片加载失败">
                        <p>点击上传</p>
                      </div>
                        <p>店铺照片</p>
                        <input type="file" class="filse" @change="readPic($event,1,FIELD)">
                    </label>
                    <label>
                      <div class="hoveit">
                        <img :src="FIELD[2]" ref='img6' alt="图片加载失败">
                        <p>点击上传</p>
                      </div>
                        <p>店铺照片</p>
                        <input type="file" class="filse" @change="readPic($event,2,FIELD)">
                    </label>
                </div>  
            </div>    
        </div> 
      <div class="rows">
            <div class="left left1">上传营业执照 <br><span>必填</span></div>
            <div class="right">
                <p>仅支持JPG、PNG格）</p>  
                <div>
                    <label>
                      <div class="hoveit">
                        <img :src="IDENTITY[3]" ref='img3' alt="图片加载失败">
                        <p>点击上传</p>
                      </div>
                        <p>营业执照</p>
                        <input type="file" class="filse" @change="readPic($event,3,IDENTITY)">
                    </label>
                </div>  
            </div>    
        </div> 
        <div class="rows">
            <div class="left left2">上传代理认证<br><span>选填</span></div>
            <div class="right">
                <p>仅支持JPG、PNG格式）<span>选填</span></p>  
                <div class="only">
                    <label v-for='(x,index) in AGENCY' :key="index">
                      <div class="hoveit">
                        <img :src="AGENCY[index]" ref='img7' alt="图片加载失败">
                        <p>点击上传</p>
                      </div>
                        <input type="file" class="filse" @change="readPic($event,index,AGENCY)">
                    </label>
                    <label>
                        <p>继续添加&gt;</p>
                        <input type="file" @change="getmore($event,AGENCY)" class="filse">
                    </label>
                </div>  
            </div>    
        </div> 
        <div class="rows">
            <div class="left left2">上传商标认证<br><span>选填</span></div>
            <div class="right">
                <p>仅支持JPG、PNG格式<span>选填</span></p>  
                <div class="only">
                    <label v-for='(x,index) in BRAND' :key="index">
                      <div class="hoveit">
                        <img :src="BRAND[index]" ref='img7' alt="图片加载失败">
                        <p>点击上传</p>
                      </div>
                        <input type="file" class="filse" @change="readPic($event,index,BRAND)">
                    </label>
                    <label>
                        <p>继续添加&gt;</p>
                        <input type="file" @change="getmore($event,BRAND)"  class="filse">
                    </label>
                </div>  
            </div>     
        </div>
        <div class="xieyi rows">
            <div class="left"></div>
            <label class="right">
                <el-checkbox v-model="ischeck"></el-checkbox>
                <p>我已阅读并同意<a href="###">《心动配讯平台服务协议》</a></p>
            </label>
        </div>

        <div class="updata rows">   
          <div class="left"></div> 
            <el-button type="primary" @click="upinfo" class="right">
                上传审核
            </el-button>
        </div>
        <floward v-model="showlook" v-show='showlook'></floward>
    </div>    
</template>
<script>
var req = require("@/utils/upPic");
import floward from "./floward";
import axios from "axios";
import request from "@/utils/request";
import { Loading } from "element-ui";
import { setTimeout } from "timers";
import viewer from "viewerjs/dist/viewer.min.js";
import "viewerjs/dist/viewer.min.css";
import { getLocal } from "@/utils/localstorage.js";
import { upinFo, revise } from "@/api/admission/admission.js";
export default {
  data() {
    return {
      isone: false,
      ischeck: false,
      showlook: false,
      IDENTITY: [
        "@/../../static/image/onface.png",
        "@/../../static/image/orface.png",
        "@/../../static/image/Hand ID card.png",
        "@/../../static/image/Business license.png"
      ],
      FIELD: [
        "@/../../static/image/Shop door.png",
        "@/../../static/image/Shop photos.png",
        "@/../../static/image/Shop photos.png"
      ],
      AGENCY: ["@/../../static/image/Agency certification.png"],
      BRAND: ["@/../../static/image/Trademark authentication.png"]
    };
  },
  watch: {
    $route(from, to) {
      this.getup(to);
    }
  },
  components: { floward },
  methods: {
    getup(from) {
      if (from.params.isone == 1) {
        this.isone = true;
        let obj = getLocal("myshop");
        obj = JSON.parse(obj);
        let arr1 = [],
          arr2 = [],
          arr3 = [],
          arr4 = [];
        arr1 = obj.authList.filter(item => {
          return item.type == "IDENTITY";
        });
        arr1.length ? (this.IDENTITY = arr1[0].imageList) : this.IDENTITY;
        arr2 = obj.authList.filter(item => {
          return item.type == "FIELD";
        });
        arr2.length ? (this.FIELD = arr2[0].imageList) : this.FIELD;
        arr3 = obj.authList.filter(item => {
          return item.type == "AGENCY";
        });
        arr3.length ? (this.AGENCY = arr3[0].imageList) : this.AGENCY;
        arr4 = obj.authList.filter(item => {
          return item.type == "BRAND";
        });
        arr4.length ? (this.BRAND = arr4[0].imageList) : this.BRAND;
      }
    },
    readPic(el, n, ar) {
      req.up(el.target, this, res => {
        if (res) {
          res.status == 200
            ? ar.splice(
                n,
                1,
                "http://cdn.xindongpeixun.com/" + res.data.data.key
              )
            : null;
        }
        el.target.value = "";
      });
    },
    getmore(el, ar) {
      req.up(el.target, this, res => {
        ar.push("http://cdn.xindongpeixun.com/" + res.data.data.key);
        el.target.value = "";
      });
    },
    show() {
      let box = document.createElement("div");
      let img = document.createElement("img");
      img.src = "@/../../static/image/SketchMap.png";
      box.appendChild(img);
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
    upinfo() {
      var peo = refalse(this.IDENTITY),
        peo2 = refalse(this.FIELD),
        peo3 = refalse(this.AGENCY),
        peo4 = refalse(this.BRAND);
      function refalse(arr) {
        var flag = arr.some(item => {
          return item.indexOf("@");
        });
        return flag;
      }
      var obj = [];
      console.log(peo, peo2, peo3, peo4, this.ischeck);
      if (peo && peo2 && this.ischeck) {
        console.log(1);
        if (peo3 && peo4) {
          console.log(2);
          obj.push(
            {
              imageList: this.IDENTITY,
              type: "IDENTITY"
            },
            {
              imageList: this.FIELD,
              type: "FIELD"
            },
            {
              imageList: this.AGENCY,
              type: "AGENCY"
            },
            {
              imageList: this.BRAND,
              type: "BRAND"
            }
          );
        } else if (peo3) {
          console.log(3);
          obj.push(
            {
              imageList: this.IDENTITY,
              type: "IDENTITY"
            },
            {
              imageList: this.FIELD,
              type: "FIELD"
            },
            {
              imageList: this.AGENCY,
              type: "AGENCY"
            }
          );
        } else if (peo4) {
          console.log(4);
          obj.push(
            {
              imageList: this.IDENTITY,
              type: "IDENTITY"
            },
            {
              imageList: this.FIELD,
              type: "FIELD"
            },
            {
              imageList: this.BRAND,
              type: "BRAND"
            }
          );
        } else {
          obj.push(
            {
              imageList: this.IDENTITY,
              type: "IDENTITY"
            },
            {
              imageList: this.FIELD,
              type: "FIELD"
            }
          );
        }

        this.$store.state.formable.authList = obj;
        var obj2 = this.$store.state.formable;
        var obj1 = {
          address: obj2.address,
          authList: obj2.authList,
          idCard: obj2.idCard,
          logo: obj2.logo,
          manageScopeList: obj2.manageScopeList,
          mobile: obj2.mobile,
          name: obj2.name,
          nature: obj2.nature,
          paper: obj2.paper
        };
        if (this.isone) {
          console.log(1);
          revise(obj1)
            .then(res => {
              this.$message.success("上传成功");
              this.$router.push("/admission/index");
            })
            .catch(res => {
              this.$message.error(res.msg);
              console.log(res);
            });
        } else {
          upinFo(obj1)
            .then(res => {
              this.$message.success("上传成功");
              res.cord == 200 ? this.$router.push("/admission/index") : null;
            })
            .catch(res => {
              this.$message.error("您已提交过了，请勿重复提交");
              this.$router.push("/admission/index");
            });
        }
      } else {
        this.$alert("请填写完必填选项", "温馨提示", {
          confirmButtonText: "确定",
          type: "warning",
          callback: close => {}
        });
      }
    }
  },
  created() {
    console.log(this.$route, "强路由");
    this.getup(this.$route);
  }
};
</script>
<style lang="scss" scoped>
.rows .right .hoveit {
  position: relative;
  width: 230px;
  height: 160px;
  margin: 0;
  overflow: hidden;
  p {
    position: absolute;
    height: 30px;
    width: 100%;
    background: #fff;
    color: #666;
    font-size: 14px;
    top: 0;
    left: 0;
    line-height: 30px;
    margin-top: 160px;
  }
}
.rows .right .hoveit:hover p {
  transition: all 0.1s;
  margin-top: 110px;
}
.line {
  max-width: 1200px;
  margin: 30px auto 50px;
  text-align: right;
  p {
    font-size: 24px;
    border-bottom: 1px solid #fb6f0f;
    text-align: left;
    margin-bottom: 5px;
    span {
      font-size: 16px;
      color: #f00;
    }
  }
}
label {
  width: 50px;
  overflow: hidden;
}
.filse {
  position: absolute;
  left: -999px;
  overflow: hidden;
}
.rows {
  display: flex;
  max-width: 1200px;
  overflow: hidden;
  margin: 0 auto;
  .left {
    font-size: 18px;
    height: 208px;
    width: 158px;
    margin-right: 40px;
    span {
      color: #ff0000;
      font-size: 14px;
      margin-left: 1em;
    }
  }
  .right {
    color: #999999;
    max-width: 1000px;
    p {
      font-size: 14px;
    }
    div {
      margin-top: 10px;
      overflow: hidden;
      label {
        float: left;
        width: 200px;
        height: 190px;
        margin-right: 40px;
        img {
          width: 200px;
          height: 140px;
          border-radius: 5%;
        }
        p {
          font-size: 14px;
          text-align: center;
        }
      }
    }
  }
}
.only {
  p {
    float: left;
    line-height: 160px;
  }
}
.xieyi {
  .left {
    height: 16px;
  }
  .right {
    width: 500px;
    margin-left: 1em;
    label {
      float: left;
    }
    p {
      float: left;
      height: 16px;
    }
    .el-checkbox {
      width: 24px;
    }
  }
  p {
    cursor: pointer;
    display: inline-block;
    a {
      color: #ff6749;
    }
  }
}
.el-checkbox {
  vertical-align: middle;
}
.updata {
  padding: 42px 0;
  .right {
    width: 280px;
    height: 50px;
    color: #fff;
  }
  .el-button {
    margin-left: 1em;
    width: 240px;
  }
}
.el-message-box__title {
  text-align: center;
  span {
    display: inline-block;
  }
}
.rows .left2 {
  padding-left: 1em;
  span {
    margin: 0;
  }
}
.left1:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
.pad{
  padding: 0 20px;
}
</style>
<style>
html .el-loading-parent--hidden {
  overflow: auto !important;
}
</style>
