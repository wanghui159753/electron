<template>
    <div class="chatEditor">
        <div class="bottom">
              <div class="bottom-fun">
                  <ul>
                      <li>
                        <div>
                          <!-- @click="showEmoji = !showEmoji" -->
                          <el-tooltip class="item" effect="light" content="发送表情" placement="bottom-start">
                            <img src="@/../../static/image/emoji.png" alt="表情图片" @click.stop="showEmoji" >
                          </el-tooltip>
                        </div>
                          <transition name="fade">
                            <div class="boxShow">
                             <Emojies 
                                :type="type"
                                :scene="scene"
                                :to="to"
                                v-show="isEmojiShown"
                                v-on:add-emoji="addEmoji"
                                v-on:hide-emoji="hideEmoji"
                                v-on:blur="hideEmoji"
                             ></Emojies>
                             </div>
                          </transition> 
                      </li>
                      <li>
                          <el-tooltip class="item" effect="light" content="发送图片" placement="bottom-start">
                            <img src="@/../../static/image/sendimg.png" alt="" >
                          </el-tooltip>
                          <input type="file" ref="openFile" id="file" accept="image/*" @change="openFile" name="openFile" >
                      </li>
                      <!-- <li>
                        <vueCropper
                          ref="cropper"
                          :img="option.img"
                          :outputType="option.outputType"
                          :canScale="true"
                          :autoCrop="true"
                          :autoCropWidth="130"
                          :autoCropHeight="130"
                          :fixedBox="true"
                          :canMove="true"
                          :canMoveBox="false"
                          ></vueCropper>
                          <el-tooltip class="item" effect="light" content="截图" placement="bottom-start">
                            <img @click="screenshot" src="@/../../static/image/sendbuy.png" alt="">
                          </el-tooltip>
                      </li> -->
                      <!-- <li @click="paymentData.show=true" class="item-li">
                          <el-tooltip class="item" effect="light" content="发送求购" placement="bottom-start">
                            <img src="@/../../static/image/sendbuy.png" alt="">
                          </el-tooltip>
                      </li>
                      <li class="item-li" >
                          <el-tooltip class="item" effect="light" content="开单收款" placement="bottom-start">
                            <img src="@/../../static/image/receipt.png" alt="">
                          </el-tooltip>
                      </li>
                      <li @click="partsData.show=true" class="item-li">
                          <el-tooltip class="item" effect="light" content="发送车型" placement="bottom-start">
                            <img src="@/../../static/image/sendcartype.png" alt="" >
                          </el-tooltip>
                      </li> -->
                  </ul>
                  <div class="clearfix">
                      <img class="b-f-img" src="@/../../static/image/adduser.png" alt="" @click="chatAddFriends">
                      <el-button type="primary" size="mini" @click="submit">发送</el-button>
                  </div>
              </div>
              <div class="bottom-input">
                <!-- 添加获取焦点事件 是为了关闭emoji框 -->
                <!-- 
                  <el-input type="textarea" v-model="value"  @keyup.enter.native="submit" @focus="editBlur" class="textarea" name="file" id="file"></el-input>
                -->
                <!-- v-model="value" -->
                <quill-editor class="textarea" 
                name="file" id="files" v-model="value" ref="area" :options="editorOption" @keyup.enter.native="submit" @focus="editBlur"></quill-editor>
              </div>
            </div>
        <transition>
          <pay-ment :paymentData="paymentData"></pay-ment>
       </transition>
       <transition>
          <parts-shop :partsData="partsData"></parts-shop>
       </transition>
    </div>
</template>

<script>
var md5 = require("@/utils/md5.js");
// const {clipboard} = require('electron');
import {quilleditor, Quill} from "vue-quill-editor";
// import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
import PartsShop from "@/views/message/template/partsShop.vue";
import PayMent from "@/views/message/template/payment.vue";
import Emojies from "@/components/ChatEmoji2.vue";
import Bus from "@/utils/bus.js";
export default {
  components: {
    PartsShop,
    PayMent,
    Emojies,
    quilleditor
    // VueCropper
  },
  props: {
    type: String,
    scene: String,
    to: String
  },
  data() {
    return {
      editorOption: {
        placeholder: "",
        modules: {
          // ImageExtend: {
          //   loading: true,
          //   name: 'img',
          //   size: 2 // 单位为M, 1M = 1024KB
          //   // action: uploadFile(),
          //   // headers: (xhr) => {
          //   // },
          //   // response: (res) => {
          //   //   return res.info
          //   // }
          // },
          toolbar: ['image', 'video']
        }
      },
      isEmojiShown: false,
      value: "",
      file: null,
      partsData: {
        show: false
      },
      paymentData: {
        show: false
      },
      accept: "",
      content: ""
      // option: {
      //     img: 'https://avatars3.githubusercontent.com/u/15681693',
      //     size: 100,
      //     full: false,
      //     outputType: 'png',
      //     canMove: true,
      //     fixedBox: false,
      //     original: false,
      //     canMoveBox: true,
      //     autoCrop: true,
      //     // 只有自动截图开启 宽度高度才生效
      //     autoCropWidth: 200,
      //     autoCropHeight: 150,
      //     centerBox: false,
      //     high: true
      //   },
    };
  },
  computed: {
    //富文本实例
    quill() {
      return this.$refs.area.quill;
    }
  },
  methods: {
    addEmoji(emojiName) {
      this.value += emojiName;
      this.hideEmoji();
    },
    hideEmoji() {
      this.isEmojiShown = false;
    },
    showEmoji(event) {
      this.isEmojiShown = !this.isEmojiShown;
    },
    openFile() {
      let filePath = this.$refs.openFile; //图片路径
      console.log(filePath, "filePath");
      console.log(filePath.value, ".........");
      if (
        filePath.value.substr(-4) == ".png" ||
        filePath.value.substr(-4) == ".jpg"
      ) {
        if (filePath) {
          this.$store.dispatch("sendFileMsg", {
            scene: "p2p",
            to: this.to,
            fileInput: filePath
          });
        }
      } else {
        this.$message.warning("请上传png,jpg格式的图片");
        return;
      }
    },
    getSimpleText(html) {
      var re1 = new RegExp("<.+?>", "g"); //匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
      var msg = html.replace(re1, ""); //执行替换成空字符
      return msg;
    },
    submit() {
      /*
      var file = document.getElementsByClassName("ql-editor")[0]
      console.log(file)
      var img = document.createElement("img");
      img.src = "@/../../static/image/touxiang.jpeg";
      img.style.width = "120px";
      img.style.height = "120px";
      file.appendChild(img);
      return false; 
      */
      console.log("this.value", this.value);
      let dispose = this.getSimpleText(this.value);
      console.log('dispose', dispose)
      if(dispose){
        if (/^\s*$/.test(dispose)) {
          this.$message.warning("请输入消息后发送");
          this.value = "";
          return;
        }
        if (dispose.length > 400) {
          this.$message.warning("输入内容较多，请分批输入。");
          return;
        }
        // console.log('this.to', this.to);
        this.$store.dispatch("sendMsg", {
          type: "text",
          scene: "p2p",
          to: this.to,
          text: dispose.replace(/\s+/g, "")
        });
      }
      if(this.file){
        this.$store.dispatch("previewFileMsg", {
          scene: "p2p",
          to: this.to,
          file: this.file
        });
      }
      this.value = "";
      this.file = "";
    },
    editBlur() {
      if (this.isEmojiShown == true) {
        this.isEmojiShown = false;
      }
    },
    onDrag: function(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    onDrop: function(e) {
      e.stopPropagation();
      e.preventDefault();
      var dt = e.dataTransfer;
      for (var i = 0; i !== dt.files.length; i++) {
        this.uploadFile(dt.files[i]);
      }
    },
    pasteHandle: function(e) {
      // this.option.img = 'aaaa'
      console.log('e', e)
      // var dt = e.dataTransfer;
      // console.log('dt--------', dt)
      let clipboardData = e.clipboardData
        let i = 0
        let items, item, types
        console.log('clipboardData', clipboardData)
        if (clipboardData) {
            items = clipboardData.items;
            if (!items) {
                return;
            }
            // console.log('items', items)
            item = items[0];
            console.log('item', item)
            types = clipboardData.types || [];

            for (; i < types.length; i++) {
                if (types[i] === 'Files') {
                  item = items[i];
                    break;
                }
            }
            if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
                  console.log('cccccc')
                // const myfile = item.getAsFile();
                // let self = this
                // 如果图片限制大小
                // if (self.config.size && self.file.size >= self.config.size * 1024 * 1024 && self.config.loading) {
                //     self.quillLoading.classList.remove('extend-upload-success')
                //     self.quillLoading.classList.add('extend-upload-warning-color')
                //     self.quillLoading.innerHTML = '图片大小超过限制'
                //     setTimeout(function () {
                //         self.quillLoading.classList.remove('extend-upload-warning-color')
                //         self.quillLoading.classList.add('extend-upload-success')
                //     }, 1500)
                //     return
                // }
                // this.previewFile();
                Bus.$off('fileUrl')
                this.sendFileInput(item.getAsFile());
                Bus.$on("fileUrl", result => {
                  if (result !== null || result !== undefined) {
                    console.log('pppp', this.value)
                    this.file = result;
                    // 获取vue-quill-editor对象光标位置，插入图片，使光标在右边
                    let myQuill = this.$refs.area.quill;
                    let index = myQuill.getSelection().index;
                    myQuill.insertEmbed(index, 'image', result.url)
                    myQuill.setSelection(index + 1);
                  }
                });
                
            }
        }
    },
    uploadFile: function(file) {
      Bus.$off('fileUrl')
      this.sendFileInput(file);
      Bus.$on("fileUrl", result => {
        if (result !== null || result !== undefined) {
          console.log('pppp', this.value)
          // if(this.value===''){
          //   this.value = `<img src=${result.url}>`;
          // }else{
            // this.value += `<img src=${result.url}>`;
          // }
          this.file = result;
          // 获取vue-quill-editor对象光标位置，插入图片，使光标在右边
          let myQuill = this.$refs.area.quill;
          let index = myQuill.getSelection().index;
          myQuill.insertEmbed(index, 'image', result.url)
          myQuill.setSelection(index + 1);
        }
      });
    },
    sendFileInput(file) {
      console.log('file=====', file)
      this.$refs.sendFileInput = file.path;
      console.log('his.$refs.sendFileInput', file.path)
      this.$store.dispatch("sendFileMsg", {
        scene: "p2p",
        to: this.to,
        file
      });
    },
    chatAddFriends() {
      this.$emit("openaddFriend", this.to);
    }
  },
  created() {
    document.addEventListener("click", e => {
      if (!this.$el.contains(e.target)) {
        this.isEmojiShown = false;
      }
    });
//     var toolbar = this.$refs.area.quill.getModule('toolbar');
// toolbar.addHandler('image',function(){
//     var fileInput = this.container.querySelector('input.ql-image[type=file]');
//     if (fileInput == null) {
//         fileInput = document.createElement('input');
//         fileInput.setAttribute('type', 'file');
//         fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
//         fileInput.classList.add('ql-image');
//         fileInput.addEventListener('change', function () {
//             if (fileInput.files != null && fileInput.files[0] != null) {
//                 var formData = new FormData();
//                 formData.append('file', fileInput.files[0]);
//                 $.ajax({
//                     url: '/upload',
//                     type: 'POST',
//                     cache: false,
//                     data: formData,
//                     processData: false,
//                     contentType: false
//                 }).done(function(res) {
//                    var range=quill.getSelection(true);
//                    quill.insertEmbed(range.index, 'image', "/public/upload/"+res.url);
//                    quill.setSelection(range.index+1);
//                 }).fail(function(res) {});
//             }
//         });
//         this.container.appendChild(fileInput);
//     }
//     fileInput.click();
 
// });
  },
  mounted() {
    // console.log('webContents', global.webContents)
    this.$refs.area.quill.focus();
    let dropbox = document.querySelector(".textarea");
    dropbox.addEventListener("dragenter", this.onDrag, false);
    dropbox.addEventListener("dragover", this.onDrag, false);
    dropbox.addEventListener("drop", this.onDrop, false);
    // document.addEventListener("cut", this.cut, false);
    // dropbox.addEventListener("paste", this.pasteHandle, false);
    this.$refs.area.quill.root.addEventListener("paste", this.pasteHandle, false);
    Bus.$on("sendImgUrl", content => {
      console.log("收到Img的url");
      if (content) {
        let file = document.getElementsByClassName("ql-editor")[0];
        let img = document.createElement("img");
        img.src = content;
        img.style.width = "120px";
        img.style.height = "120px";
        file.appendChild(img);
      }
      return;
    });
  },
  watch:{
    img: {
      handler(newValue) {
        console.log('newValue', newValue);
      }
  }

  },
};
</script>
<style scoped lang="scss">
.chatEditor {
  height: 100%;
  .quill-editor {
    height: 100%;
  }
}
.bottom {
  height: 100%;
  .bottom-fun {
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    .b-f-img {
      float: left;
      width: 30px;
      margin-right: 10px;
      cursor: pointer;
    }
    li {
      display: inline-block;
      width: 40px;
      padding: 0 4px;
      cursor: pointer;
      position: relative;
      img {
        width: 100%;
      }
      #file {
        width: 33px;
        height: 30px;
        position: absolute;
        top: 1px;
        opacity: 0;
        border: 1px solid red;
        overflow: hidden;
      }
      // emoji动画
      .fade-enter-active,
      .fade-leave-active {
        transition: opacity 0.5s;
      }
      .fade-enter,
      .fade-leave-active {
        opacity: 0;
      }
      .fade-move {
        transition: transform 0.4s;
      }
    }
    .item-li:last-child {
      width: 48px;
    }
  }
  .bottom-input {
    height: 100%;
    position: relative;
    .el-textarea {
      background-color: #f3f3f3 !important;
    }
    .textarea {
      background-color: #f3f3f3 !important;
      height: 100%;
      overflow: hidden;
      width: 100%;
    }
    .files {
      position: absolute;
      top: 10px;
      left: 10px;
      opacity: 0;
      display: none;
    }
  }
}
</style>
<style>
.bottom-input .el-textarea .el-textarea__inner {
  background-color: #f3f3f3 !important;
  border: 1px solid #f3f3f3 !important;
}
chatlist input[type="file"] {
  color: transparent;
}
</style>
