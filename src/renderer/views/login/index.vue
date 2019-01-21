<template>
  <div class="login-container">
    <div class="login-container-bg">
      <div class="progress" v-if="show">
        <p>{{downloadMsg}}</p>
        <el-progress :text-inside="true" :stroke-width="18" :percentage="downloadPercent" status="success"></el-progress>
      </div>
    </div>
    <div class="login-content">
      <div>
        <router-view></router-view>
      </div>
      <footer>
        <p>浙江心动网络科技有限公司技术支持</p>
      </footer>
    </div>
     <el-dialog :title="imprint" :visible.sync="dialogVisible " :lock-scroll="false" width="30%" top="40vh" center>
        <div>
           <p>1.更新部分Bug</p>
           <p>2.增加页面流畅性</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isUpdated">立即升级</el-button>
          <el-button type="primary" @click="cancalUpdateBox">取消</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
const ipcRenderer = require("electron").ipcRenderer;
import { isvalidUsername } from "@/utils/validate";
import { setTimeout } from "timers";
export default {
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "admin"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      pwdType: "password",
      downloadMsg: "",
      downloadPercent: 0,
      show: true,
      imprint: "0.0.8版本更新说明",
      dialogVisible: false
    };
  },
  created() {
    // console.log(this.$route);
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    isUpdated() {
      // this.$store.commit("updateAutoUpdateState", false);
      this.dialogVisible = false;
      this.$electron.ipcRenderer.send("isUpdateNow");
    },
    cancalUpdateBox() {
      // this.$store.commit("updateAutoUpdateState", false);
      this.dialogVisible = false;
    }
  },
  mounted() {
    var that = this;
    // this.dialogFormVisible = true;
    that.$electron.ipcRenderer.send("checkForUpdate");
    that.$electron.ipcRenderer.on("message", (event, text) => {
      console.log(arguments);
      console.log(text, "text");
      that.downloadMsg = text;
      if (text == "现在使用的就是最新版本，不用更新") {
        that.show = false;
      }
    });
    that.$electron.ipcRenderer.on("downloadProgress", (event, progressObj) => {
      console.log(progressObj);
      if (progressObj) {
        that.downloadPercent = parseInt(progressObj.percent.toFixed(2)) || 0;
      }
    });
  },
  watch: {
    downloadPercent() {
      if (this.downloadPercent == 100) {
        // this.$store.commit("updateAutoUpdateState");
        this.dialogVisible = true;
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scopde>
.login-container {
  .login-container-bg {
    position: fixed;
    top: 30px;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    background: url("../../../../static/image/bg.jpg") 0 0 no-repeat;
    background-size: 100% 100%;
    z-index: -999999;
    .progress {
      width: 30%;
      margin-left: 35vw;
      margin-right: 35vw;
      position: relative;
      top: 30px;
      p {
        text-align: center;
        color: #ff6749;
      }
    }
  }
  footer {
    text-align: center;
    font-size: 18px;
  }
}
</style>
<style>
.login-container .el-dialog__wrapper {
  z-index: 9999 !important;
}
</style>