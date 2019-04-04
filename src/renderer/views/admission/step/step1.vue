<template>
  <div>
    <div class="line">
      <p>
        认证信息
        <span>
          (
          <i class="el-icon-star-on"></i>为必填项)
        </span>
      </p>
    </div>
    <el-form ref="form" label-width="110px" :model="forms" class="formTab" :rules="rules">
      <el-form-item label="选择类型" prop="idChoose">
        <el-radio-group v-model="forms.idChoose" fill="#FF6749">
          <el-radio :label="0">个人</el-radio>
          <el-radio :label="1">企业</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公司名称" class="uslabel" prop="names">
        <el-input placeholder="请输入公司名称或个人姓名" v-model="forms.names"></el-input>
      </el-form-item>
      <el-form-item label="证件号" class="uslabel" prop="num">
        <el-input placeholder="请输入证件号" v-model="forms.num"></el-input>
      </el-form-item>
      <el-form-item label="主营分类" class="uslabel" prop="type">
        <el-input placeholder="请选择品牌  如：奔驰、宝马" @focus="togoshow" v-model="forms.type"></el-input>
      </el-form-item>
      <el-form-item label="所在地区" class="uslabel" prop="locate">
        <el-cascader
          :options="options"
          :show-all-levels="true"
          placeholder="请选择地区"
          filterable
          @change="chang"
          v-model="forms.locate"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" class="uslabel" prop="addresses">
        <el-input placeholder="请输入详细地址" v-model="forms.addresses"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" class="uslabel" prop="phone">
        <el-input placeholder="请输入联系电话" v-model="forms.phone"></el-input>
        <el-button
          type="primary"
          class="vCode"
          @click="sendCode"
          :disabled="isdisabled"
          :class="{bg:!isdisabled}"
          v-if="!ischangeNum"
        >{{yzm}}</el-button>
      </el-form-item>
      <el-form-item label="手机验证码" class="uslabel" prop="paperNum" v-if="!ischangeNum">
        <el-input placeholder="请输入正确有效的6位手机验证码" v-model="forms.paperNum" @blur="getpapers"></el-input>
      </el-form-item>
      <el-form-item label="头像" class="uslabel" prop="headPic">
        <div class="headPic">
          <p>仅支持JPG、PNG格式</p>
          <label id="upHead">
            <img :src="logo" ref="img0" alt="图片加载失败">
            <input type="file" class="dis" @change="readPic($event,0)">
          </label>
        </div>
      </el-form-item>
      <el-form-item prop="Agreement" class="posi">
        <el-checkbox v-model="forms.Agreement">
          我已阅读并同意
          <a href class="xieyi">《心动配讯平台服务协议》</a>
        </el-checkbox>
      </el-form-item>
      <el-form-item class="el posi">
        <el-button type="primary" @click.native="next" class="next">下一步</el-button>
      </el-form-item>
    </el-form>
    <car-list v-show="iscar" @getcar="getcar"></car-list>
    <div class="clips" v-show="clipshow">
      <vueCropper
        ref="cropper"
        :img="clip.img"
        :outputSize="1"
        :outputType="clip.outputType"
        :canScale="true"
        :autoCrop="true"
        :autoCropWidth="130"
        :autoCropHeight="130"
        :fixedBox="true"
        :canMove="true"
        :canMoveBox="false"
      ></vueCropper>
      <div>
        <el-button type="primary" @click="clipshow=false">取消</el-button>
        <el-button type="primary" @click="up">裁切</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import VueCropper from "vue-cropper";
import { countdown } from "@/utils/countdown";
import carList from "./car.vue";
import request from "@/utils/request";
import { getOne } from "@/api/basicData/basicData.js";
var req = require("@/utils/upPic");
import { getLocal } from "@/utils/localstorage.js";
import { getPaper, sendCode, getarea } from "@/api/admission/admission.js";

export default {
  data() {
    return {
      clip: {
        img: "",
        outputType: "png"
      },
      clipshow: false,
      address: {
        address: "",
        cityId: 0,
        cityName: "",
        latitude: 0,
        longitude: 0,
        provinceId: 0,
        provinceName: "",
        regionId: 0,
        regionName: ""
      },
      name: "",
      cartype: null,
      idCard: "",
      mobile: "",
      nature: 0,
      logo: require("../../../../../static/image/DefaultUserIcon.png"),
      imageUrl: "",
      options: [],
      rules: {
        names: [
          { required: true, message: "请输入公司或个人名称", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        locate: [
          {
            required: true,
            message: "所在地区不能为空"
          }
        ],
        num: [
          {
            required: true,
            message: "请填写身份证或营业执照号码"
          },
          {
            min: 15,
            max: 18,
            message: "长度在 15 到 18 个字符"
          },
          {
            pattern: /^(a-Z|\w){15,18}$/,
            message: "请输入正确证件号"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择品牌 如：奔驰、宝马"
          }
        ],
        idChoose: [
          {
            required: true,
            message: "请选择身份"
          }
        ],
        phone: [
          {
            required: true,
            message: "手机号码不能为空"
          },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号"
          }
        ],
        addresses: [
          {
            required: true,
            message: "请填写详细地址"
          }
        ],
        Agreement: [
          {
            required: true,
            message: "请阅读并同意协议"
          }
        ],
        headPic: [
          {
            required: true,
            message: "请上传头像"
          }
        ],
        paperNum: [
          {
            required: true,
            message: "请输入手机验证码"
          },
          {
            pattern: /^\d{6}$/,
            message: "验证码必须是6位数字"
          }
        ]
      },
      forms: {
        names: "",
        locate: "",
        num: null,
        type: "",
        idChoose: 0,
        phone: "",
        addresses: "",
        Agreement: "",
        headPic: "@/../../static/image/DefaultUserIcon.png",
        paper: "",
        paperNum: ""
      },
      isone: false,
      iscar: false,
      manageScopeList: null,
      yzm: "获取验证码",
      isdisabled: true,
      ischangeNum: false
    };
  },
  components: { carList, VueCropper },
  watch: {
    "forms.phone"(val) {
      let tet = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      this.isdisabled = !tet.test(val);
      if (this.$route.params.isone == 1) {
        this.ischangeNum = this.oldPhone != val ? false : true;
      }
    },
    $route(to, from) {
      this.modify(from);
    }
  },
  methods: {
    //反向写入数据
    modify(from) {
      if (from.params.isone == 1) {
        this.ischangeNum = true;
        this.isone = true;
        let obj = getLocal("myshop");
        obj = JSON.parse(obj);
        this.address = obj.address;
        this.manageScopeList = obj.manageScopeList;
        this.forms.locate = [
          obj.address.provinceId + "," + obj.address.provinceName,
          obj.address.cityId + "," + obj.address.cityName,
          obj.address.regionId + "," + obj.address.regionName
        ];
        this.forms.phone = obj.mobile;
        this.oldPhone = obj.mobile;
        this.forms.names = obj.name;
        this.forms.idChoose = obj.nature;
        this.forms.addresses = obj.address.address;
        this.forms.type = obj.manageScopeList
          .map(item => {
            return item.labelName;
          })
          .join(" ");
        this.logo = obj.logo;
        this.forms.num = obj.idCard;
      }
    },
    up() {
      //裁切图片上传
      this.clipshow = false;
      this.$refs.cropper.getCropBlob(data => {
        req.up(
          { files: [data] },
          this,
          res => {
            this.logo =res
          },
          document.getElementById("upHead")
        );
      });
    },
    // 获取票据
    getpapers() {
      if (/^\w{6}$/.test(this.forms.paperNum)) {
        getPaper({
          code: this.forms.paperNum,
          mobile: this.forms.phone
        }).then(res => {
          this.forms.paper = res.data.paper;
        });
      }
    },
    //获取验证码
    sendCode() {
      const that = this;
      sendCode({
        mobile: this.forms.phone
      })
        .then(res => {
          this.$message.success("发送成功,请注意查收。");
          this.forms.paper = res.data.paper;
          countdown(that, this.isdisabled, "yzm");
        })
        .catch(error => {
          this.$message.error("验证码发送失败");
        });
    },
    getBase64Image(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var dataURL = canvas.toDataURL("image/png");
      return dataURL;
    },
    readPic(el, n) {
      // 图片裁切
      var obj = this.clip;
      var n = new FileReader();
      n.readAsDataURL(el.target.files[0]);
      n.onload = () => {
        obj.img = n.result;
        this.clip = obj;
        this.clipshow = true;
      };
    },
    next() {
      this.address.address = this.forms.addresses;
      let remaked = this.ischangeNum ? true : this.forms.paper;
      this.$refs.form.validate(res => {
        if (res && remaked) {
          if (this.isone) {
            this.$router.push("/admission/index/step2/1");
          } else {
            this.$router.push("/admission/index/step2/0");
          }
          Object.assign(this.$store.state.formable, {
            address: this.address,
            manageScopeList: this.manageScopeList,
            mobile: this.forms.phone,
            name: this.forms.names,
            nature: this.forms.idChoose,
            logo: this.logo,
            idCard: this.forms.num,
            paper: this.forms.paper
          });
        } else if (!remaked) {
          this.$message.warning("手机号码验证失败，请重新发送");
        } else {
          this.$message.warning("请填写完表单");
        }
      });
    },
    getcar(obj) {
      this.iscar = obj.is;
      //经营范围列表
      this.manageScopeList = obj.s;
      let str = "";
      obj.s.forEach((item, index) => {
        str += item.labelName + (index == obj.s.length - 1 ? "" : "/");
      });
      this.cartype = str;
      this.forms.type = str;
    },
    chang(res) {
      this.address.provinceId = res[0].split(",")[0];
      this.address.provinceName = res[0].split(",")[1];
      this.address.cityId = Number(res[1].split(",")[0]);
      this.address.cityName = res[1].split(",")[1];
      this.address.regionId = Number(res[2].split(",")[0]);
      this.address.regionName = res[2].split(",")[1];
    },
    togoshow(el) {
      el.currentTarget.blur();
      this.iscar = !this.iscar;
      return false;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
      }
      return isJPG && isLt1M;
    }
  },
  created() {
    this.$route.params.isone == 1 ? this.modify(this.$route) : null;
    getarea().then(res => {
      this.options = getOne(res.data,3);
    });
  }
};
</script>
<style
<style lang="scss" scoped>
.bg {
  background: #ff6749 !important;
}
#upHead {
  height: 130px;
  display: block;
  width: 130px;
}
.clips {
  position: fixed;
  top: 0;
  left: 180px;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 500;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  div {
    width: 300px;
    margin: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-button {
      width: 100px;
      height: 40px;
      padding: 0;
    }
  }
  .vue-cropper {
    background: #fff;
    width: 300px;
    height: 300px;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.formTab {
  width: 650px;
  margin: 0 auto;
  margin-top: 83px;
  input {
    width: 476px;
    height: 40px;
  }
}

.el-cascader__label {
  width: 100%;
}

.formTab .dis {
  height: 0;
  margin-left: -9999px;
}

.xieyi {
  color: #ff6749;
}

p {
  font-size: 16px;
  color: #999999;
}

.el-button {
  width: 280px;
  height: 50px;
}

.headPic {
  img {
    border-radius: 3px;
    width: auto;
    height: 130px;
  }
}

.el-input {
  width: 476px;
  height: 40px;
}

.next {
  width: 240px;
  height: 50px;
}
</style>
<style>
html .el-loading-parent--hidden {
  overflow: auto !important;
}

.posi {
  margin-left: -150px;
}

.el-form-item .el-form-item__label {
  text-align: left;
  font-size: 17px;
}

.posi .el-radio__label {
  font-size: 16px;
}

.posi .el-radio__inner {
  width: 24px;
  height: 24px;
}

.el {
  margin-bottom: 0;
  padding-bottom: 22px;
}

.formTab .el-form-item__content {
  padding-left: 50px;
  position: relative;
}

.formTab .el-form-item uslabel {
  margin: 0 auto;
}

.formTab .el-form-item__error {
  margin-left: 50px;
}

.el-form-item__content .vCode {
  width: 120px;
  height: 38px;
  background: #cccccc;
  font-size: 16px;
  display: inline-block;
  text-align: center;
  border-radius: 3px;
  position: absolute;
  right: 15px;
  top: 1px;
  cursor: pointer;
  border: 0;
  padding: 0;
}

.line {
  width: 900px;
  margin: 0 auto;
  margin-top: 50px;
  line-height: 64px;
}

.line p {
  font-size: 24px;
  color: #333;
  border-bottom: 1px solid #fb6f0f;
}

.line p span {
  font-size: 16px;
  color: #f00;
}

.el-cascader .el-input {
  width: 476px;
}
</style>

