<template>
  <div class="version-con">
    <div class="version-body" v-if="!show">
      <img src="../../../../../static/image/xdpx.png">
      <p>当前版本号：{{versionNum}}</p>
      <el-button @click="updataVersion" :disabled="disabled">{{disabled?'已是最新':'检查更新'}}</el-button>
      <el-button @click="show = !show">平台服务协议</el-button> 
    </div>
    <div class="webView" v-if="show">
      <webview class="scrollbar" src="http://wx.zjxdpx.com/?from=singlemessage#/platform" style="width:95%; height:calc(100% - 70px);margin:auto"> </webview>
      <el-button @click="show = !show">已阅读</el-button>
    </div>
  </div>
</template>

<script>
import { autoUpdateVersion } from "@/api/basicData/basicData.js";
const ipcRenderer = require("electron").ipcRenderer;

const path = require("path");
const fs = require("fs");
export default {
  name: "version",
  data() {
    return {
      versionNum: "0",
      disabled: false,
      show:false
    };
  },
  methods: {
    updataVersion() {
      this.$electron.ipcRenderer.send("checkForUpdate");
      ipcRenderer.send("openUpdataWindow");
    }
  },
  mounted() {
    ipcRenderer.send('getversion');
    ipcRenderer.on('getversion',(e,data)=>{
         let { version } = data;
        this.versionNum = version + "";
        autoUpdateVersion({
          platform: "PC",
          version: this.versionNum.replace(/\./g,'')
        }).then(result => {
          this.disabled = !result.data.update;
        });
      })
  },
};
</script>

<style lang="scss">
.version-con {
  height: 100%;
  width: 100%;
  position: relative;
  .webView{
    height: 80%;
    width: 100%;
    padding:20px 0 ;
    .el-button {
      margin: 50px auto;
      display: block;
    }
  }
  .version-body {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 120px;
    width: 130px;
    img {
      width: 80px;
      height: 80px;
      margin: auto;
      display: block;
    }
    p {
      padding: 20px 0;
      font-size: 14px;
      text-align: center;
    }
    > span {
      font-size: 15px;
      display: block;
      text-align: center;
      color: #aaa;
      margin-bottom: 10px;
      cursor: pointer;
    }
    button {
      width: 100%;
      height: 40px;
      text-decoration: underline;
      margin: 5px 0;
    }
  }
}
</style>
