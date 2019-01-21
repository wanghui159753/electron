<template>
	<div class="accountlogin container">
		<div class="logo">
			<div class="brand1">
				<img src="@/../../static/image/brand1.png" alt="">
			</div>
			<div class="brand2">
				<img src="@/../../static/image/brand2.png" alt="">
				<div class="title">
					<p>后台管理登录</p>
					<p>HOUTAIGUANLI</p>
				</div>
			</div>
		</div>
      <div class="loginContent">
			 <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="账号登录" name="first">
              <el-form ref="form1" :model="form1" :rules="rules">
                <el-form-item label="用户名" prop="mobile">
                    <div class="icon"><img src="@/../../static/image/user.png" alt=""></div>
                    <el-input v-model="form1.mobile" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <div class="icon"><img src="@/../../static/image/psw.png" alt=""></div>
                    <el-input :type="pwdType" v-model="form1.password" placeholder="请输入密码" @keyup.enter.native="submitEntry('form1')"></el-input>
                    <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
                </el-form-item>
                <el-form-item>
                  <div class="forgot">
                      <div>
                        <el-form-item>
                            <el-checkbox v-model="checked" ></el-checkbox>
                            <div class="agree" @click="isRemempsw">记住密码</div>
                        </el-form-item>
                      </div>
                      <router-link class="forgotpsw" to="/login/retrievepsw">
                        <p>忘记密码</p>
                      </router-link>
                  </div>
                 </el-form-item>
                  <el-form-item>
                    <div class="usernamelogin">
                      <el-button class="register" @click="submitEntry('form1')">登录</el-button>
                    </div>
                  </el-form-item>
                  <el-form-item> 
                      <label for="">您也可以进行
                        <el-popover
                        placement="top"
                        trigger="click"
                        >
                          <div class="qrcode-container">
                            <!-- <qrcode></qrcode> -->
                          </div>
                          <span slot="reference" class="qrcode">扫一扫</span>
                      </el-popover> 直接登录</label>
                      <router-link to="/login/register" class="usernameregister"> 
                      <el-button class="register">注册</el-button>
                    </router-link>
                  </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :disabled="true"></el-tab-pane>
        <el-tab-pane :disabled="true"></el-tab-pane>
        <el-tab-pane :disabled="true"></el-tab-pane>
        <el-tab-pane :disabled="true"></el-tab-pane>
        <el-tab-pane label="短信登录" name="second" >
             	<el-form ref="form2" :model="form2" :rules="rules2">
                 <el-form-item label="手机号" prop="mobile">
                  <div class="icon">
                    <img src="@/../../static/image/mobile.png" alt="">
                  </div>
                  <el-input v-model="form2.mobile" placeholder="输入手机号"></el-input>
			        </el-form-item>
              <el-form-item label="验证码" prop="code">
                  <div class="icon">
                    <img src="@/../../static/image/code.png" alt="">
                  </div>
                  <el-input v-model="form2.code" placeholder="请输入验证码"></el-input>
                  <div class="sendcode">
                    <el-button v-bind:disabled="isdisabled" @click="sendCode">{{sendText}}</el-button>
                  </div>
              </el-form-item>
                <el-form-item>
                  <div class="messageLogin">
                    <el-button class="register" @click="entry('form2')">登录</el-button>
                  </div>
              </el-form-item>
               </el-form>
        </el-tab-pane>
      </el-tabs>
      <div class="left-content">
      <div class="mobile-content">
          <img src="@/../../static/image/mobilebg.png" alt="">
      </div>
      <div class="qrcode-content">
          <p class="qrcode-title">App内部扫码登录</p>
          <div class="qrcode">
              <qrcode @input="strs" v-if="isReLoad"></qrcode>
              <img src="@/../../static/image/markread.jpg" width="176" alt="" v-if="!isReLoad" class="sussesPic">
              <p v-if="!isReLoad" @click="isReLoad=true">刷新二维码</p>
          </div> 
          <div id="descinfo">
               <div class="imgage">
                 <img src="@/../../static/image/bigsao.png" alt="">
               </div>
               <div class="descfooter">
                 <p>打开<span class="color">心动配讯APP</span></p>
                 <p>使用<span class="color">扫一扫</span>登录</p> 
               </div>
          </div> 
      </div>
      <div class="message">
         <div class="sao">
           <img src="@/../../static/image/saoyisao.png" alt="">
         </div>
         <div class="title">
           <p>扫一扫</p>
         </div>
      </div>
    </div>
		</div>
    <!-- 左侧扫码框 -->
	</div>
</template>
<script>
const ipcRenderer = require("electron").ipcRenderer;
import { countdown } from "@/utils/countdown";
import { setLocal, getLocal, removeLocal } from "@/utils/localstorage.js";
import { setInterval } from "timers";
import { login, registerMobile, sendCode, polling } from "@/api/user/login";
const request = require("@/api/user/accountMobile");
import { imlogin } from "@/api/im/login.js";
import qrcode from "./qrcode.vue";
import { error } from "util";
export default {
  name: "accountlogin",
  data() {
    return {
      num: 0,
      timer: null,
      form1: {
        mobile: "",
        password: ""
      },
      form2: {
        mobile: "",
        code: ""
      },
      isload: false,
      checked: "",
      activeName: "first",
      pwdType: "password",
      sendText: "发送验证码",
      isdisabled: false,
      isloading: false,
      entryState: 0,
      dialogFormVisible: false,
      //是否显示刷新验证码
      isReLoad: true,
      rules: {
        mobile: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^[0-9a-zA-Z]{6,16}$/,
            message: "请输入6-16位的数字和字母的密码"
          }
        ]
      },
      rules2: {
        mobile: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号"
          }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          {
            pattern: /^\d{6}/,
            message: "请输入6位数字的验证码"
          }
        ]
      }
    };
  },
  components: {
    qrcode: qrcode
  },
  beforeMount() {
    // this.isTokenExpire();
  },
  methods: {
    strs(i) {
      this.timer = i;
      this.sokit(i);
    },
    sokit() {
      polling(this.timer).then(res => {
        if (res.data.status == "SCANNED") {
          this.num++;
          if (this.num == 1) {
            this.$message.success("扫描成功，请在手机上确认");
            this.isReLoad = false;
            removeLocal("loginToken");
            removeLocal("imuid");
            removeLocal("imtoken");
          }
        }
        if (res.data.status !== "CONFIRM") {
          //只要没登陆就一直轮询，需要额外状态打破
          this.isload ? null : this.sokit();
        } else {
          this.$message.success("登录成功");
          if (res.data.token) {
            setLocal("loginToken", JSON.stringify(res.data));
          }
          this.$store.state.user.token = res.data.token;
          this.getIm();
          this.isload = true;
          this.$router.push("/");
        }
      });
    },
    handleClick(tab, event) {},
    onDecode(content) {
      this.paused = true;
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    // 普通的账号密码登录
    submitEntry(form1) {
      this.$refs[form1].validate(valid => {
        if (valid) {
          // this.$refs[form1].resetFields();
          if (this.checked == true) {
            this.entryState = 2;
            console.log("当前是记住密码状态的登录");
            this.sendRequest();
          } else if (this.checked == "" || this.checked == undefined) {
            this.entryState = 1;
            console.log("说明当前是未记住密码状态的登录");
            this.sendRequest();
          } else {
            console.log("12345678");
          }
        } else {
          return;
        }
      });
    },
    sendRequest() {
      const that = this;
      let data = {
        mobile: this.form1.mobile,
        password: this.form1.password
      };
      this.loading = true;
      this.$store
        .dispatch("Login", data)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            if (res.code == 200 && this.entryState == 1) {
              this.$message.success("登录成功");
              if (res.data.jwtToken) {
                setLocal("loginToken", JSON.stringify(res.data.jwtToken));
              }
              // 请求im服务器
              this.getIm();
              console.log("页面即将跳转");
              this.isload = true;
              this.$router.push("/");
            } else if (res.code == 200 && this.entryState == 2) {
              this.$message.success("登录成功");
              setLocal("loginToken", JSON.stringify(res.data.jwtToken));
              this.getIm();
              this.isload = true;
              this.$router.push({ path: "/" });
            } else {
              console.log(
                "当前是没有点击记住密码，点击了登录并且出错才会打印的。"
              );
            }
          } else {
            this.$message.success("" + res.data.msg + "");
          }
        })
        .catch(error => {
          console.log("账号密码登录出错:" + error);
          this.loading = false;
        });
    },
    getIm() {
      this.$store
        .dispatch("ImLogin")
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            setLocal("imuid", res.data.accid);
            setLocal("imtoken", res.data.token);
            this.$store.dispatch("connect");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    sendCode() {
      const that = this;
      const params = {
        mobile: this.form2.mobile
      };
      request
        .loginSendCode(params)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.$message.success("发送成功,请注意查收。");
            countdown(that, this.isdisabled, this.sendText);
          }
        })
        .catch(error => {
          console.log("验证码发送失败");
          console.log(error);
        });
    },
    entry(form2) {
      this.$refs[form2].validate(valid => {
        if (valid) {
          const data = {
            mobile: this.form2.mobile,
            code: this.form2.code
          };
          this.$store.dispatch("MobileLogin", data).then(res => {
            console.log(res);
            if (res.code == 200) {
              this.$message.success("登录成功");
              if (res.data.jwtToken) {
                setLocal("loginToken", JSON.stringify(res.data.jwtToken));
              }
              this.getIm();
              this.isload = true;
              this.$router.push("/");
            }
          });
        }
      });
    },
    isRemempsw() {
      this.checked = !this.checked;
    },
    isTokenExpire() {
      if (
        getLocal("loginToken") !== undefined ||
        getLocal("loginToken") == ""
      ) {
        const tokenData = JSON.parse(getLocal("loginToken"));
        const hisTokenTime = new Date(tokenData.expirationTime).getTime();
        const curTokenTime = new Date().getTime();
        if (curTokenTime > hisTokenTime) {
          this.$store
            .dispatch("refreshToken")
            .then(res => {
              console.log(res);
              if (res.code == 200) {
                setLocal("loginToken", JSON.stringify(res.data.jwtToken));
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      } else {
        return false;
      }
    }
  }
};
</script>
<style scoped lang="scss">
$layout: flex;
$mode: space-between;
$bglin: linear-gradient(0deg, #fb780e 0%, #f93812 100%);
* {
  -moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.container {
  width: 40%;
  max-width: 559px;
  padding-bottom: 30px;
  margin: 70px auto;
  background-color: #fff;
  border-radius: 18px;
  box-shadow: 0px 9px 10px #d9d9d9;
  position: relative;
  .loginContent {
    width: 100%;
  }
  .logo {
    width: 200px;
    margin: 0 auto !important;
    display: $layout;
    justify-content: $mode;
    padding-top: 20px;
    padding-bottom: 20px;
    .brand1 {
      width: 60px;
      height: 60px;
      padding-top: 3px;
      img {
        width: 100%;
      }
    }
    .brand2 {
      width: 130px;
      position: relative;
      img {
        width: 100%;
        padding: 16px 0px 0px 0px;
      }
      .title {
        text-align: center;
        font-size: 17px;
        color: #787474;
        line-height: 30px;
      }
    }
  }
  .left-content {
    position: absolute;
    top: 191px;
    left: -265px;
    padding-left: 30px;
    .qrcode-content {
      max-width: 362px;
      width: 100%;
      background-color: #fff;
      padding-bottom: 20px;
      border-top-left-radius: 5%;
      border-bottom-left-radius: 5%;
      .qrcode-title {
        color: #666666;
        text-align: center;
        padding: 40px;
      }
      .qrcode {
        padding-top: 10px;
        width: 250px;
        height: 250px;
        margin: 0 auto;
        p {
          text-align: center;
          line-height: 40px;
          cursor: pointer;
        }
      }
      #descinfo {
        width: 188px;
        margin: 0 auto;
        // display: $layout;
        // justify-content: $mode;
        // position: absolute;
        // bottom: 44px;
        // left: 88px;
        .imgage {
          width: 43px;
          height: 43px;
          float: left;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .descfooter p {
          text-align: left;
          line-height: 20px;
          font-size: 16px;
          letter-spacing: 1px;
          .color {
            color: #fc6648;
          }
        }
      }
    }
    .mobile-content {
      width: 120%;
      position: absolute;
      left: -196px;
      top: 45px;
      img {
        width: 100%;
      }
    }
    .message {
      width: 93px;
      height: 93px;
      background: url("../../../../static/image/message.png") 100% 100%
        no-repeat;
      position: absolute;
      top: 25px;
      left: 0px;
      .sao {
        width: 20px;
        height: 20px;
        margin: 18px auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .title {
        text-align: center;
        p {
          font-size: 12px;
          color: #fff;
        }
      }
    }
  }
}
.el-form {
  width: 80%;
  margin: 0 auto;
  .el-form-item {
    margin-bottom: 0;
    position: relative;
  }
  .icon {
    position: absolute;
    top: 45px;
    z-index: 9999;
    left: 8px;
  }
  .el-input .el-input__inner {
    padding-left: 30px !important;
  }
  .qrcode {
    color: #2ba4cf;
    border: none;
    border-bottom: 1px solid #2ba4cf;
    cursor: pointer;
  }
  .forgot {
    display: $layout;
    justify-content: $mode;
    .forgotpsw {
      color: #2ea8d2;
      cursor: pointer;
      p {
        font-size: 14px;
      }
    }
  }
  .qrcode-container {
    width: 120px;
    height: 120px;
    display: inline-block;
    background-color: #f5f5f5;
    display: none;
  }
  .show-pwd {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 40px;
  }
  .el-form-item {
    padding-bottom: 10px;
  }
}

.container:before {
  position: absolute;
  z-index: -1;
  left: 20px;
  bottom: 10px;
  width: 80%;
  height: 20px;
  content: "";
  transform: skew(-18deg) rotate(-3deg);
  -webkit-transform: skew(-18deg) rotate(-3deg);
  -moz-transform: skew(-18deg) rotate(-3deg);
  box-shadow: 0 20px 10px #d9d9d9;
}

.container:after {
  position: absolute;
  z-index: -2;
  right: 20px;
  bottom: 10px;
  width: 80%;
  height: 20px;
  content: "";
  transform: skew(18deg) rotate(3deg);
  -webkit-transform: skew(18deg) rotate(3deg);
  -moz-transform: skew(18deg) rotate(3deg);
  box-shadow: 0 20px 10px #d9d9d9;
}
.left-content:before {
  position: absolute;
  z-index: -1;
  left: 20px;
  bottom: 10px;
  width: 80%;
  height: 20px;
  content: "";
  transform: skew(-18deg) rotate(-3deg);
  -webkit-transform: skew(-18deg) rotate(-3deg);
  -moz-transform: skew(-18deg) rotate(-3deg);
  box-shadow: 0 20px 10px #d9d9d9;
}
.left-content:after {
  position: absolute;
  z-index: -2;
  right: 20px;
  bottom: 10px;
  width: 80%;
  height: 20px;
  content: "";
  transform: skew(18deg) rotate(3deg);
  -webkit-transform: skew(18deg) rotate(3deg);
  -moz-transform: skew(18deg) rotate(3deg);
  box-shadow: 0 20px 10px #d9d9d9;
}
.usernamelogin .el-button {
  width: 100%;
  background: $bglin;
  color: #fff;
  margin: 10px 0;
}
.messageLogin .el-button {
  width: 100%;
  background: $bglin;
  color: #fff;
  margin: 80px 0;
}
.usernameregister .el-button {
  width: 100%;
  background: $bglin;
  color: #fff;
  margin-top: 10px;
}

.sendcode .el-button {
  border: none;
  color: #fb780e;
  position: absolute;
  top: 44px;
  right: 10px;
  padding: 8px 0;
}
.sussesPic {
  display: block;
  margin: 0 auto;
  border: 1px solid #f4f4f4;
}
</style>
<style>
.accountlogin .el-input .el-input__inner {
  padding-left: 30px !important;
}
.accountlogin .el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border: 1px solid #fa5110;
}
.agree {
  display: inline-block;
  color: #2ea8d2;
  cursor: pointer;
}
.accountlogin .el-checkbox__inner {
  border: 1px solid #fa5110;
}

.accountlogin .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #fa5110;
  border-color: #fa5110;
}

.accountlogin .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #fa5110 !important;
}

.el-checkbox__input.is-checked .el-checkbox__label {
  color: #666;
}
.accountlogin .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #fa5110;
}
.accountlogin .el-tabs__header {
  padding: 0 80px;
}
</style>