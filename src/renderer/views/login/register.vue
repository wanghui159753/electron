<template>
	<div class="login container">
		<div class="logo">
			<div class="brand1">
				<img src="@/../../static/image/brand1.png" alt="">
			</div>
			<div class="brand2">
				<img src="@/../../static/image/brand2.png" alt="">
				<div class="title">
					<p>后台管理注册</p>
					<p>houtaiguanli</p>
				</div>
			</div>
		</div>
		<el-form ref="form" :model="form" :rules="rules" >
			<el-form-item label="手机号" prop="mobile">
				<div class="icon">
					<img src="@/../../static/image/mobile.png" alt="">
				</div>
				<el-input v-model="form.mobile" placeholder="输入手机号" ></el-input>
			</el-form-item>
			<el-form-item label="验证码" prop="code">
				<div class="icon">
					<img src="@/../../static/image/code.png" alt="">
				</div>
				<el-input v-model="form.code" placeholder="请输入验证码" ></el-input>
				<div class="sendcode">
					<el-button @click="sendIdentifying" v-bind:disabled="isdisabled">{{sendText}}</el-button>
				</div>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<div class="icon">
					<img src="@/../../static/image/psw.png" alt="">
				</div>
				<el-input :type="pwdType" v-model="form.password" placeholder="请输入6-12位数字加字母的密码" ></el-input>
        <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
			</el-form-item>
      <el-form-item>
        <el-dialog
          :visible.sync="dialogVisible"
          width="30%"
          model="false"
          :append-to-body="true"
          >
          <div class="typeL">
            <div v-for="(item,index) in userType" class="typeI" :key="index" >
              <h3>{{item.name}}</h3>
              <el-button v-for="(x,y) in item.children" @click="shop(x.id)" :key="y">{{x.name}}</el-button>
            </div>
          </div>
        </el-dialog>
      </el-form-item>
			<el-form-item>
				<el-checkbox v-model="checked">我已阅读</el-checkbox>
				<div class="agree">《心动用户配讯使用协议》</div>
			</el-form-item>
			<el-form-item>
				 <div id="register">
				 	<el-button class="register" @click="submitRegister">注册</el-button>
				 </div>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import { countdown } from "@/utils/countdown"; //验证码倒计时
import { setInterval } from "timers";
const request = require("@/api/user/accountMobile");
export default {
  name: "generallogin",
  data() {
    return {
      form: {
        mobile: "",
        code: "",
        password: "",
        identityId: ""
      },
      userType:[],
      checked: "",
      sendText: "发送验证码",
      isdisabled: false,
      dialogVisible: false,
      pwdType: "password",
      loading: false,
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
  methods: {
    submitRegister() {
      if (this.checked == undefined || this.checked == false) {
        this.$message.warning("请先勾选用户协议后继续操作！");
      } else if (
        this.form.mobile == "" ||
        this.form.code == "" ||
        this.form.password == ""
      ) {
        this.$message.warning("请输入相关信息后进行提交");
      } else {
        if (this.form.identityId == "") {
          this.dialogVisible = true;
          return;
        } else {
          this.dialogVisible = false;
        }
      }
    },
    // 发送验证码方法
    sendIdentifying() {
      const that = this;
      if (this.form.mobile !== "") {
        const params = {
          mobile: this.form.mobile
        };
        request.sendCode(params).then(res => {
          if (res.code == 200) {
            this.$message.success("发送成功，请注意查收");
            countdown(that, this.isdisabled, "sendText");
          }
        });
      } else {
        this.$message.warning("请输入相关信息后进行提交");
        return;
      }
    },
    shop(el) {
      this.dialogVisible = false;
      this.form.identityId = el;
      this.sendReq();
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    sendReq() {
      console.log(this.form);
      this.loading = true;
      request
        .registerMobile(this.form)
        .then(res => {
          if (res.code == 200) {
            this.loading = false;
            this.$message.success("注册成功，页面即将跳转。请登录！");
            this.$router.push("/login/generallogin");
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    }
  },
  created(){
     request.userType().then((res)=>{
        res.code==200?this.userType=res.data:null
     })

  }
};
</script>

<style scoped lang="scss">
.typeL{
  overflow:hidden;
}
.el-dialog__body{
  padding:30px 0;
}
.el-dialog{
  z-index:100;
}
.typeI{
  overflow:hidden;
  font-size:12px;
  width:50%;
  text-align:center;
  color:#AFA4A1;
  float:left;
  h3{
    border-bottom:1px solid #AAAAAA;
    padding:0 0 15px 0;
    color:#FF7553
  }
  button{
    display:block;
    margin:0 auto;
    border:0;
    color:#AFA4A1;
  }
}
.container {
  width: 559px;
  padding-bottom: 30px;
  margin: 70px auto;
  background-color: #fff;
  border-radius: 18px;
  box-shadow: 0px 9px 10px #d9d9d9;
  position: relative;
  .logo {
    width: 270px;
    height: 150px;
    margin: 0 auto !important;
    display: flex;
    justify-content: space-between;
    padding-top: 30px;
    .brand1 {
      width: 60px;
      height: 60px;
      .brand .img {
        width: 100%;
        height: 100%;
      }
    }
    .brand2 {
      width: 187px;
      position: relative;
      img {
        width: 80%;
        padding: 16px 0px 0px 0px;
      }
      .title {
        text-align: center;
        font-size: 22px;
        font-weight: 800;
        color: #787474;
        position: absolute;
        top: 54px;
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
    z-index: 100;
    left: 8px;
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
#register .el-button {
  width: 443px;
  background: linear-gradient(0deg, #fb780e 0%, #f93812 100%);
  color: #fff;
}
.sendcode .el-button {
  border: none;
  color: #fb780e;
  position: absolute;
  top: 44px;
  right: 10px;
  padding: 8px 0;
}
</style>
<style>
.login .el-input .el-input__inner {
  padding-left: 30px !important;
  padding-right: 30px !important;
}

.login .el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border: 1px solid #fa5110;
}

.agree {
  display: inline-block;
  color: #666;
  cursor: pointer;
}

.login .el-checkbox__inner {
  border: 1px solid #fa5110;
}

.login .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #fa5110;
  border-color: #fa5110;
}

.login .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #fa5110 !important;
}

.el-checkbox__input.is-checked .el-checkbox__label {
  color: #666;
}
.login .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #fa5110;
}
</style>