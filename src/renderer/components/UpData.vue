<template>
  <div class="updata-con">
    <div class="progress">
      <div class="progress-car" id="carImg">
        <img src="../../../static/image/che(1).gif">
      </div>

      <div class="progress-body">
        <img src="../../../static/image/lunzi.gif" class="progress-img" align="top">
        <el-progress
          :text-inside="true"
          :stroke-width="18"
          :percentage="downloadPercent"
          status="success"
          class="progress-main"
          :show-text="false"
        ></el-progress>
        <p>{{downloadPercent}}%</p>
      </div>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
const remote = require('electron').remote; 
export default {
  data() {
    return {
      downloadPercent: 0,
      percent: 0
    };
  },
  computed: {},
  mounted() {
    //  ipcRenderer.on('refresh',()=>{
    //     this.$confirm("更新失败\n请重新下载", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     showClose: false,
    //     center: true
    //   })
    //     .then(() => {
    //        location.reload();
    //     }).catch(()=>{
    //        var window = remote.getCurrentWindow();
    //        ipcRenderer.send('showWindow')
    //         window.close();
    //     })
    //  })
    ipcRenderer.on('isUpdateNow',(e)=>{
       this.$confirm("更新完成\n请重新安装", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        center: true
      })
        .then(() => {
          console.log('3333')
           ipcRenderer.send('isUpdateNowTime')
        }).catch(()=>{
          var window = remote.getCurrentWindow();
          ipcRenderer.send('showWindow')
          window.close();
        })
      
    })
    this.isupdata();
  },
  methods: {
    isupdata() {
      let carImg = document.getElementById("carImg");
      let title = document.querySelector(".custom-outer-border");
      title.style.display = "none";
      ipcRenderer.send("checkForUpdate");
      ipcRenderer.on("downloadProgress", (event, progressObj) => {
        let percent = Number(progressObj.percent || 0);
        if (percent > this.downloadPercent) {
          let left = Math.floor(percent) > 15 ? Math.floor(percent) - 15 : 0;
          carImg.style.left = left + "%";
          this.downloadPercent = percent.toFixed(2);
        }
      });
    }
  }
};
</script>

<style type="text/css" lang="scss">
.updata-con {
  // margin-top: 50px;
  height: 100%;
  width: 100%;
  background-color: white;
  position: relative;
  .progress {
    width: 300px;
    height: 50px;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .progress-loading {
      position: absolute;
      top: -152px;
      left: 15px;
      img {
        border-style: none;
        width: 282px;
      }
    }
    .progress-car {
      position: absolute;
      width: 71px;
      height: 32px;
      top: -30px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.progress-body {
  position: relative;
  p {
    position: absolute;
    bottom: -90px;
    left: 43%;
    color: #666;
  }
  .progress-img {
    width: 45px;
    height: 45px;
    position: absolute;
    right: 0;
    top: 5px;
    z-index: 99;
  }
  .progress-main {
    position: absolute;
    height: 55px;
    width: 100%;
  }
}
</style>
<style>
.progress-main .el-progress-bar,
.el-progress-bar__outer {
  height: 100% !important;
  width: 301px;
  background-color: rgba(257, 227, 147, 0.8);
  padding: 2.5px;
  border-radius: 30px;
}
.progress-main .el-progress-bar .el-progress-bar__inner {
  position: relative;
  background-color: rgba(255, 168, 0, 0.8);
}
.progress-main .el-progress-bar .el-progress-bar__innerText {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  margin-top: 12px;
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
