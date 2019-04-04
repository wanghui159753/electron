<template>
  <div class="login-container scrollbar">
    <div class="login-container-bg"></div>
    <div class="login-content">
      <div>
        <router-view :isUpdata="dialogVisible"></router-view>
      </div>
    </div>
    <!-- <div id="mask"> -->
    <div class="mask-content">
      <el-dialog
        :title="imprint"
        :show-close="isshowcloseBtn"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :modal="true"
        :lock-scroll="false"
        width="30%"
        top="40vh"
        center
      >
        <!-- <div class="progress" v-if="show">
               <p>{{downloadMsg}}</p>
               <el-progress :text-inside="true" :stroke-width="18" :percentage="downloadPercent" status="success"></el-progress>
             </div>
        -->
        <div v-if="desclist" class="desclist">
          <p v-for="(list,index) in desclist" :key="index">{{list}}</p>
        </div>
        <div v-else>
          <p>暂无更新描述</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" v-if="isshowcloseBtn" @click="cancalUpdateBox">取消</el-button>
          <el-button @click.once="isUpdated">{{currstate}}</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
var packageJSON = require("../../../../package.json");
const ipcRenderer = require("electron").ipcRenderer;
import { isvalidUsername } from "@/utils/validate";
import { autoUpdateVersion } from "@/api/basicData/basicData.js";
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
      show: false,
      imprint: "",
      dialogVisible: false,
      isshowcloseBtn: false,
      desclist: null,
      currstate: "立即升级"
    };
  },
  created() {
    this.getUpdatelist();
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
              this.$router.push({ path: "/message/index/:sessionId" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    isUpdated() {
      // this.$store.commit("updateAutoUpdateState", false);
      // this.dialogVisible = false;
      this.currstate = "正在下载";
      this.show = true;
      var that = this;
      // this.dialogFormVisible = true;
      that.$electron.ipcRenderer.send("checkForUpdate");
      that.$electron.ipcRenderer.once("message", (event, text) => {
        that.downloadMsg = text;
        if (text == "现在使用的就是最新版本，不用更新") {
          that.show = false;
        }
      });
      ipcRenderer.send("openUpdataWindow");
      //  ipcRenderer.on("downloadProgress", (event, progressObj)=> {
      //       console.log(progressObj);
      //       // this.downloadPercent = progressObj.percent || 0;
      //   });
      // that.$electron.ipcRenderer.once(
      //   "downloadProgress",
      //   (event, progressObj) => {
      //     console.error(progressObj,"-------------")
      //     if (progressObj) {
      //       that.downloadPercent =
      //         parseInt(progressObj.percent.toFixed(2)) || 0;
      //     }
      //   }
      // );
    },
    cancalUpdateBox() {
      // this.$store.commit("updateAutoUpdateState", false);
      this.dialogVisible = false;
    },
    getUpdatelist() {
      var versions = packageJSON.version.replace(/\./g, "");
      const parm = {
        platform: "PC",
        version: "0"
      };
      autoUpdateVersion(parm)
        .then(res => {
          if (res.code == 200 && res.msg == "success") {
            let newVersion = res.data.newVersion;
            if (newVersion.length == versions.length) {
              if (parseInt(newVersion) > parseInt(versions)) {
                this.dialogVisible = true;
              }
            } else if (newVersion.length > versions.length) {
              let num = newVersion.length - versions.length;
              for (var i = 0; i < num; i++) {
                versions += "0";
              }
              if (parseInt(newVersion) > parseInt(versions)) {
                this.dialogVisible = true;
              }
            }
            if (!res.data.force) {
              this.isshowcloseBtn = true;
            }
            this.imprint =
              (res.data.newVersion + "").split("").join(".") +
              " " +
              "版本更新描述";
            this.desclist = res.data.descList;
          }
        })
        .catch(error => {
          console.log("自动更新出错,错误信息:", error);
        });
    }
  },
  watch: {
    dialogVisible() {
      if (!this.dialogVisible) {
        this.show = false;
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scopde>
.login-container {
  height: calc(100% - 30px);
  .login-container-bg {
    position: fixed;
    top: 30px;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    background: url("../../../../static/image/bg.png") 0 0 no-repeat;
    background-size: 100% 100%;
    z-index: -999999;
  }
  .mask-content {
    z-index: 99;
    .desclist {
      line-height: 18px;
    }
    .progress {
      width: 100%;
      position: relative;
      top: -20px;
      p {
        text-align: center;
        color: #ff6749;
      }
    }
  }
}
</style>
<style>
.login-container .el-dialog__wrapper {
  z-index: 9999 !important;
}
</style>