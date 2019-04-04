<template>
<div id="picLooker" v-contextmenu:contextmenu @contextmenu="stop">
    <v-contextmenu ref="contextmenu" class="contextmenuTextArea">
        <v-contextmenu-item @click="paste">保存</v-contextmenu-item>
        <v-contextmenu-item @click="copy">复制</v-contextmenu-item>
    </v-contextmenu>
</div>
</template>
<script>
const { ipcRenderer, remote, clipboard, nativeImage } = require("electron");
import viewer from "viewerjs/dist/viewer.min.js";
import "viewerjs/dist/viewer.min.css";
const fs = require("fs");
export default {
  data() {
    return {
      arr: null,
      viewer: null
    };
  },
  mounted() {
    document.addEventListener("keyup", this.closeIt);
    this.lookPhoto(0);
  },
  methods: {
    stop(e){
      e.stopPropagation()
    },
    closeIt(e) {
      if (e.keyCode == 27) {
        remote.getCurrentWindow().hide();
      }
    },
    copy() {
      this.toBase64(dataURL => {
        clipboard.writeImage(nativeImage.createFromDataURL(dataURL));
      });
    },
    toBase64(fn) {
      var img = new Image();
      var that = this;
      var canvas = document.createElement("CANVAS");
      var ctx = canvas.getContext("2d");
      img.crossOrigin = "Anonymous";
      img.src = this.viewer.images[this.viewer.index].src;
      img.onload = function() {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        fn(dataURL);
        canvas = null;
      };
    },
    lookPhoto(i, arr) {
      let box = document.createElement("div");
      arr=arr||['http://image.xindongpeixun.com/brand1.png'];
      arr.forEach(item => {
        let img = document.createElement("img");
        img.src = item.image || item;
        box.appendChild(img);
      });
      let showimg = new viewer(box, {
        button: false,
        fullscreen: false,
        backdrop: "static",
        container: picLooker
      });
      box.style.display = "none";
      picLooker.appendChild(box);
      showimg.view(i||0);
      showimg.show();
      this.viewer = showimg;
      ipcRenderer.once("newArr", (event, data) => {
        showimg.destroy();
        this.arr = data;
        this.lookPhoto(this.arr.index, this.arr.pic);
      });
    },
    paste() {
      remote.dialog.showSaveDialog(
        {
          filters: [
            {
              name: "Images",
              extensions: ["png", "jpg", "gif"]
            }
          ]
        },
        path => {
          if (path) {
            this.toBase64(function(dataURL) {
              fs.writeFile(
                path,
                Buffer.from(
                  dataURL.replace("data:image/png;base64,", ""),
                  "base64"
                ),
                () => {}
              );
            });
          }
        }
      );
    }
  }
};
</script>
<style lang="scss">
#picLooker {
  height: calc(100% - 30px);
  position: relative;
  overflow: hidden;
  .viewer-fixed {
    position: absolute;
  }
}
</style>