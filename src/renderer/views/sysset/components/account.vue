<template>
  <div class="account-con">
    <ul>
      <li>
        <span>修改密码：</span>
        <el-button type="info" plain @click="changepwd =!changepwd">点击设置</el-button>
      </li>
      <li>
        <span>切换账号：</span>
        <el-button type="info" plain @click="outlogin">退出登录</el-button>
      </li>
      <li>
        <span>清除缓存：</span>
        <el-button type="info" plain @click="clearCache">清除</el-button>
      </li>
      <li>
        <span>消息免打扰：</span>
        <el-switch v-model="value" active-color="#FC684F" inactive-color="#eee" @change="check"></el-switch>
      </li>
    </ul>
    <div class="bg" v-if="changepwd" >
      <div @click="changepwd = !changepwd" style="position: absolute;top: 0;bottom: 0;width: 80%;"></div>
      <div class="account-right">
        <div class="account-right-header">
          <h3>设置密码</h3>
          <p class="el-icon-close" @click="changepwd =!changepwd"></p>
        </div>
        <div class="account-right-phone">
          <p>当前手机号码：{{ usernum ? usernum.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"):""}}</p>
        </div>
        <div class="account-right-verif">
          <p>验证码</p>
          <el-input placeholder="请输入验证码" v-model="verifNum" clearable></el-input>

          <button @click="getVerif" :disabled="isdisabled">{{sendText}}</button>
        </div>

        <div class="account-right-pwd">
          <p>新密码</p>
          <el-input placeholder="设置新密码" v-model="passNew" clearable prop="passNew" type="password"></el-input>
          <el-tooltip
            class="item"
            effect="light"
            content="密码不少于6位"
            placement="bottom"
            v-if="passCheck !== passNew"
          >
            <div style="width: 400px;position: absolute;height: 20px; margin-top: 39px;"></div>
          </el-tooltip>
        </div>
        <div class="account-right-pwd">
          <p>确定密码</p>

          <el-input placeholder="请再次输入" v-model="passCheck" clearable type="password"></el-input>
          <el-tooltip
            class="item"
            effect="light"
            content="两次密码不一致"
            placement="bottom"
            v-if="passCheck !== passNew"
          >
            <div style="width: 400px;position: absolute;height: 20px; margin-top: 39px;"></div>
          </el-tooltip>
        </div>
        <div class="account-right-btn">
          <el-button type="primary" plain :disabled="disabled" @click="sbmitPwd">确定修改</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const session = require("electron").remote.session;
const { ipcRenderer } = require("electron");
import { mapGetters } from "vuex";
import { retrieveSendCode, subNewPsw } from "@/api/user/accountMobile";
import { getLocal, removeLocal } from "@/utils/localstorage";
import cookie from "@/utils/cookie";
import { logout } from "@/api/user/login.js";
import { removeToken } from "@/utils/auth";
export default {
  name: "account",
  data() {
    return {
      value: "",
      verifNum: "",
      changepwd: false,
      passNew: "",
      passCheck: "",
      usernum: "",
      sendText: "获取验证码",
      isdisabled: false,
      disabled: false
      // code:200
    };
  },
  watch: {
    verifNum(){
     this.disabled = false;
    },
    passCheck() {
      if (this.passCheck !== this.passNew) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    }
  },
  beforeMount() {
    ipcRenderer.send("getAudio");
    ipcRenderer.on("returnAudio", (e, boo) => {
      this.value = boo;
    });
  },
  mounted() {
    // this.usernum
    this.disabled = true;
    this.usernum = this.$store.state.im.myInfo.tel;
  },
  methods: {
    check(val) {
      ipcRenderer.send("closeAudio", this.value);
    },
    sbmitPwd() {
      subNewPsw({
        mobile: this.usernum,
        code: this.verifNum,
        newPassword: this.passCheck
      }).then(req => {
        if (req.code == 200) {
          // this.usernum = "";
          this.verifNum = "";
          this.passCheck = "";
          this.passNew = "";
          this.disabled = false;
          this.changepwd = false;
          this.$message.success("密码修改成功");
        }
      });
    },
    getVerif(e) {
      retrieveSendCode({
        mobile: this.usernum
      }).then(req => {
        this.$message.success("发送成功，请注意查收");
        // this.code=req.code
        this.timedown();
      });
    },
    timedown() {
      let num = 60;
      let time = setInterval(() => {
        if (num > 0) {
          this.sendText = --num + "S";
        } else {
          this.code = "401";
          clearInterval(time);
        }
      }, 1000);
    },
    clearCache() {
      this.$confirm("确定清除缓存？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        center: true
      })
        .then(() => {
          removeLocal("carlist");
          removeLocal("allCar");
          removeLocal("myshop");
          this.$message({
            type: "success",
            message: "清除成功!"
          });
        })
    },
    outlogin() {
      console.log(this.$store.state.app.loading);
      this.$confirm("确定退出登录？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        center: true
      }).then(() => {
        // removeLocal("imtoken");
        // removeLocal("imuid");
        // removeLocal("loginToken");
        // cookie.delCookie("uid");
        // cookie.delCookie("sdktoken");
        // this.$router.push("/login");
        // this.$store.state.im.nim=null;
        this.$store.dispatch("logout");
        this.$store.dispatch("FedLogOut").then(() => {
          location.reload();
        });
        logout();
        session.defaultSession.cookies.set(
          {
            url: "https://xdpx.zjxdpx.com",
            name: "token",
            expirationDate: new Date().getTime() + 60 * 60 * 24 * 7,
            value: ""
          },
          function(params) {
            if (!params) {
              session.defaultSession.flushStorageData();
            }
          }.bind(this)
        );
        this.$store.state.app.loading = true;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.account-con {
  padding: 10px 30px;
  font-size: 15px;
  .el-switch__core {
    border: 1px solid #ddd !important;
  }
  li {
    list-style: none;
    margin: 10px;
  }
  .el-button {
    padding: 8px 20px;
    width: 100px;
  }
}
.bg {
  position: fixed;
  top: 80px;
  left: 180px;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  .account-right {
    position: absolute;
    top: 0;
    right: 0;
    width: 450px;
    height: 100%;
    font-weight: bold;
    background-color: rgb(238, 238, 238);
    .account-right-header {
      background-color: rgb(210, 210, 210);
      height: 50px;
      text-align: center;
      h3 {
        height: 100%;
        line-height: 50px;
      }
      p {
        position: absolute;
        right: 10px;
        top: 15px;
      }
    }
    .account-right-phone {
      background-color: white;
      p {
        color: #bbb;

        text-align: left;
        padding: 20px 22px;
        font-size: 14px;
      }
    }
    .account-right-verif {
      display: flex;
      padding: 15px 0 15px 22px;
      margin: 10px 0;
      background-color: white;
      p {
        width: 100px;
        line-height: 40px;
      }
      button {
        border: 0;
        background-color: white;
        width: 150px;
        color: #ee4d04;
        padding-left: 15px;
        border-left: 1px solid #eee;
      }
    }
    .account-right-pwd {
      background: white;
      display: flex;
      margin-top: 1px;
      padding: 0 20px;
      // border-bottom:1px solid #999;
      p {
        width: 100px;
        text-align: left;
        line-height: 50px;
      }
    }
    .account-right-btn {
      height: 100%;
      position: relative;
    }
  }
}
</style>
<style>
.account-con .el-switch__core {
  border: 1px solid #ddd !important;
}
.account-right-btn .el-button--primary {
  background-color: rgba(240, 240, 240);
  color: #999;
  border: 1px solid rgb(220, 220, 220);
  width: 210px !important;
  position: absolute;
  left: 0;
  right: 0;
  top: 15%;
  margin: auto;
  padding: 12px 0 !important;
}
.account-right .el-input__inner {
  border: 0 !important;
  font-size: 16px;
  padding-right: 0;
  height: 100%;
}
.el-message-box--center {
  padding-bottom: 0;
  width: 25%;
  border: 0;
  border-radius: 10px;
}
.el-message-box--center .el-message-box__content {
  padding: 20px 40px;
}
.el-message-box--center .el-message-box__header {
  display: none !important;
}
.el-message-box--center .el-message-box__btns {
  padding: 0;
  width: 100%;
}
.el-message-box--center .el-message-box__btns button {
  border-color: #dcdfe6;
  background-color: white;
  color: #666;
  width: 50%;
  margin: 0;
  border-radius: 0;
}
.el-message-box--center .el-message-box__btns button:hover {
  color: rgb(28, 113, 241);
}
.el-message-box--center .el-message-box__btns button:nth-of-type(2) {
  border-left: 0;
}
</style>


