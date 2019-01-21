
<template>
  <div class="u-msg clearfix clearfloat" id="u-msg"
    :class="{
      'item-me': msg.flow==='out',
      'item-you': msg.flow==='in',
      'item-time': msg.type==='timeTag',
      'item-tip': msg.type==='tip',
      'session-chat': type==='session',
      'bg':bg
    }">
    <el-checkbox v-if="(msg.flow==='in'|| msg.flow==='out') && msgShow" :label="msg" @change.native="bgchange"> &nbsp; </el-checkbox>
    <v-contextmenu ref="contextmenu" :data-id='dataID' 
      :show="contextMenuVisible"  @update:show="(show) => contextMenuVisible = show">
      <v-contextmenu-item @click="copy">复制</v-contextmenu-item>
      <!-- <v-contextmenu-item @click="paste">粘粘</v-contextmenu-item> -->
      <v-contextmenu-item @click="selectorMore">多选</v-contextmenu-item>
      <v-contextmenu-item @click="retransmissionMsg">转发</v-contextmenu-item>
      <v-contextmenu-item @click="deleteMsg">删除</v-contextmenu-item>
    </v-contextmenu>
    <div v-if="msg.type==='timeTag'" class="timeTag">
      <p>{{msg.showText}}</p>
    </div>
    <div v-else-if="msg.type==='tip'" class="tip">{{msg.showText}}</div>
    <div v-else-if="msg.type==='notification' && msg.scene==='team'" class="notification">{{msg.showText}}</div>
    <div  class="clearfix"
      v-else-if="msg.flow==='in' || msg.flow==='out'"
      :idClient="msg.idClient"
      :time="msg.time"
      :flow="msg.flow"
      :type="msg.type"
      @contextmenu="contextmenu($event,msg)"
      v-contextmenu:contextmenu
    >
      <a class="msg-head" v-if="msg">
        <img class="icon u-circle" v-if="msg.avatar" :src="msg.avatar" @click="openUserDetail(msg)" >
        <img class="icon u-circle" v-else src="@/../../static/image/DefaultUserIcon.png" @click="openUserDetail(msg)">
        <div class="triangleBox"><span class="triangle"></span></div>
      </a>
      <p class="msg-user" v-else-if="msg.type!=='notification'"><em>{{msg.showTime}}</em>{{msg.from}}</p>
      <div v-if="msg.type==='text'" class="msg-text" v-html="msg.showText" @contextmenu="selAll"></div>
      <div v-else-if="msg.type==='custom-type1'" class="msg-text" ref="mediaMsg"></div>
      <div v-else-if="msg.type==='custom-type3'" class="msg-text" ref="mediaMsg"></div>
      <div v-else-if="msg.type==='image'" class="msg-text msg-pics" ref="mediaMsg" @click.stop="showFullImg(msg.originLink,$event)"></div>
      <div v-else-if="msg.type==='video'" class="msg-text msg-video" ref="mediaMsg" @click="getUrl">
        <img src="@/../../static/image/vplay.png">
      </div>
      <!-- flexbetween -->
      <div v-else-if="msg.type==='audio'" class="msg-text audioBox flexbetween" @click="playAudio(msg.audioSrc)">
        <div class="audioImage">
          <img :src="currImage" alt="">
        </div>
        <div>{{msg.showText}}</div>
      </div>
      <div v-else-if="msg.type==='file'" class="msg-text msg-file"><a :href="msg.fileLink" target="_blank"><i class="el-icon-document"></i>{{msg.showText}}</a></div>
      <div v-else-if="msg.type==='robot'" class="msg-text" :class="{'msg-robot': msg.robotFlow!=='out' && !isRobot}">
        <div v-if="msg.robotFlow==='out'">{{msg.showText}}</div>
        <div v-else-if="msg.subType==='bot'">
          <!-- 多次下发的机器人消息 -->
          <div v-for="(tmsgs,index) in msg.message" :key="index">
            <!-- 多个机器人模板 -->
            <div v-for="(tmsg,index) in tmsgs" :key="index">
              <div v-if="tmsg.type==='text'">
                <p>{{tmsg.text}}</p>
              </div>
              <div v-else-if="tmsg.type==='image'">
                <p>
                  <img :src="tmsg.url" @click="copyImage(this)">
                </p>
              </div>
              <div v-else-if="tmsg.type==='url'">
                <a :class="tmsg.style" :href="tmsg.target" target="_blank">
                  <div v-if="tmsg.image">
                    <p v-for="(tmsg2,index) in tmsg.image" :key="index">
                      <img :src="tmsg2.url">
                    </p>
                  </div>
                  <div v-if="tmsg.text">
                    <p v-for="(tmsg2,index) in tmsg.text" :key="index">{{tmsg2.text}}</p>
                  </div>
                </a>
              </div>
              <div v-else-if="tmsg.type==='block'">
                <a :class="tmsg.style" :params="tmsg.params" :target="tmsg.target" @click="sendRobotBlockMsg(tmsg, msg)">
                  <div v-if="tmsg.image">
                    <p v-for="(tmsg2,index) in tmsg.image" :key="index">
                      <img :src="tmsg2.url">
                    </p>
                  </div>
                  <div v-if="tmsg.text">
                    <p v-for="(tmsg2,index) in tmsg.text" :key="index">{{tmsg2.text}}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="msg.subType==='faq'">
          <!--p>{{msg.message.question}}</p-->
          <p>{{msg.message.answer}}</p>
        </div>
        <span v-if="msg.robotFlow!=='out' && !isRobot" class="msg-link">
          <a class="link-right" @click="continueRobotMsg(msg.content.robotAccid)">继续对话</a>
        </span>
      </div>
      <span v-else-if="msg.type==='notification'" class="msg-text notify">{{msg.showText}}</span>
      <span v-else class="msg-text" v-html="msg.showText"></span>
      <span v-if="msg.status==='fail'" class="msg-failed"><i class="el-icon-warning"></i></span>
       <!-- :href='`#/msgReceiptDetail/${msg.to}-${msg.idServer}`' -->
      <a v-if="teamMsgUnRead >=0" class='msg-unread' >{{teamMsgUnRead>0 ? `${teamMsgUnRead}人未读`: '全部已读'}}</a>
    </div>
  </div>
</template>

<script type="text/javascript">
const { clipboard, nativeImage } = require("electron");
import util from "@/utils";
import config from "@/configs";
import emojiObj from "@/configs/emoji";
import viewer from "viewerjs/dist/viewer.min.js";
import "viewerjs/dist/viewer.min.css";
import Bus from "@/utils/bus.js";
export default {
  props: {
    type: String, // 类型，chatroom, session
    rawMsg: {
      type: Object,
      default: {}
    },
    userInfos: {
      type: Object,
      defaul: {}
    },
    myInfo: {
      type: Object,
      default: {}
    },
    isRobot: {
      type: Boolean,
      default: false
    },

    msgShow: {
      type: Boolean,
      default: false
    },
    isHistory: {
      type: Boolean,
      default: false
    },
    isbg:{
      
    }
  },
  data() {
    return {
      bg:false,
      checked: false,
      msg: "",
      isFullImgShow: false,
      currentAudio: null,
      currImage: "@/../../static/image/audio.png",
      textMsg: "",
      dataID: null,
      contextMenuVisible: false,
      msgIdClient: null,
      msgType: null,
      msgTypeState: null,
      imgUrl: null,
      isShowMsg: false,
      retransmission: null
    };
  },
  computed: {
    robotInfos() {
      return this.$store.state.robotInfos;
    },
    teamMsgUnRead() {
      var obj =
        !this.isHistory &&
        this.msg.needMsgReceipt &&
        this.msg.flow === "out" &&
        this.$store.state.teamMsgReads.find(
          item => item.idServer === this.msg.idServer
        );

      return obj ? parseInt(obj.unread) : -1;
    }
  },
  beforeMount() {
    let item = Object.assign({}, this.rawMsg);
    // 标记用户，区分聊天室、普通消息
    if (this.type === "session") {
      if (item.flow === "in") {
        if (item.type === "robot" && item.content && item.content.msgOut) {
          // 机器人下行消息
          let robotAccid = item.content.robotAccid;
          item.avatar = this.robotInfos[robotAccid].avatar;
          item.isRobot = true;
        } else if (item.from !== this.$store.state.userUID) {
          item.avatar =
            (this.userInfos[item.from] && this.userInfos[item.from].avatar) ||
            config.defaultUserIcon;
          //todo  如果是未加好友的人发了消息，是否能看到名片
        } else {
          item.avatar = this.myInfo.avatar;
        }
      } else if (item.flow === "out") {
        item.avatar = this.myInfo.avatar;
      }
    } else {
      // 标记时间，聊天室中
      item.showTime = util.formatDate(item.time);
    }
    if (item.type === "timeTag") {
      // 标记发送的时间
      item.showText = item.text;
    } else if (item.type === "text") {
      // 文本消息
      item.showText = util.escape(item.text);
      if (/\[[^\]]+\]/.test(item.showText)) {
        let emojiItems = item.showText.match(/\[[^\]]+\]/g);
        emojiItems.forEach(text => {
          let emojiCnt = emojiObj.emojiList.emoji;
          if (emojiCnt[text]) {
            item.showText = item.showText.replace(
              text,
              `<img class="emoji-small" width=23 style="vertical-align: middle;" src="${
                emojiCnt[text].img
              }">`
            );
          }
        });
      }
    } else if (item.type === "custom") {
      let content = JSON.parse(item.content);
      // type 1 为猜拳消息
      if (content.type === 1) {
        let data = content.data;
        // let resourceUrl = config.resourceUrl;
        // item.showText = `<img c
        // lass="emoji-middle" src="${resourceUrl}/im/play-${data.value}.png">`
        // item.type = "custom-type1";
        // item.imgUrl = `${resourceUrl}/im/play-${data.value}.png`;
        // type 3 为贴图表情
      } else if (content.type === 3) {
        let data = content.data;
        let emojiCnt = "";
        if (emojiObj.pinupList[data.catalog]) {
          emojiCnt = emojiObj.pinupList[data.catalog][data.chartlet];
          // item.showText = `<img class="emoji-big" src="${emojiCnt.img}">`
          item.type = "custom-type3";
          item.imgUrl = `${emojiCnt.img}`;
        }
      } else {
        item.showText = util.parseCustomMsg(item);
        if (item.showText !== "[自定义消息]") {
          item.showText += ",请到手机或电脑客户端查看";
        }
      }
    } else if (item.type === "image") {
      // 原始图片全屏显示
      item.originLink = item.file.url;
    } else if (item.type === "video") {
      // ...
    } else if (item.type === "audio") {
      item.audioSrc = item.file.mp3Url;
      item.showText = Math.round(item.file.dur / 1000) + '"';
    } else if (item.type === "file") {
      item.fileLink = item.file.url;
      item.showText = item.file.name;
    } else if (item.type === "notification") {
      if (item.scene === "team") {
        item.showText = util.generateTeamSysmMsg(item);
      } else {
        //对于系统通知，更新下用户信息的状态
        item.showText = util.generateChatroomSysMsg(item);
      }
    } else if (item.type === "tip") {
      //对于系统通知，更新下用户信息的状态
      item.showText = item.tip;
    } else if (item.type === "robot") {
      let content = item.content || {};
      let message = content.message || [];
      if (!content.msgOut) {
        // 机器人上行消息
        item.robotFlow = "out";
        item.showText = item.text;
      } else if (content.flag === "bot") {
        item.subType = "bot";
        message = message.map(item => {
          if (item.type === "template") {
            // 在vuex(store/actions/msgs.js)中已调用sdk方法做了转换
            return item.content.json;
          } else if (item.type === "text" || item.type === "answer") {
            // 保持跟template结构一致
            return [
              {
                type: "text",
                text: item.content
              }
            ];
          } else if (item.type === "image") {
            // 保持跟template结构一致
            return [
              {
                type: "image",
                url: item.content
              }
            ];
          }
        });
        item.message = message;
      } else if (item.content.flag === "faq") {
        item.subType = "faq";
        item.query = message.query;
        let match = message.match.sort((a, b) => {
          // 返回最匹配的答案
          return b.score - a.score;
        });
        item.message = match[0];
      }
    } else {
      item.showText = `[${util.mapMsgType(item)}],请到手机或电脑客户端查看`;
    }
    this.msg = item;
  },
  mounted() {
    let item = this.msg;
    // 有时序问题的操作
    this.$nextTick(() => {
      let media = null;
      if (item.type === "image") {
        // 图片消息缩略图
        media = new Image();
        media.src = item.file.url;
        media.style.width = 180 + "px";
        new viewer(media, {});
      } else if (item.type === "custom-type1") {
        // 猜拳消息
        media = new Image();
        media.className = "emoji-middle";
        media.src = item.imgUrl;
      } else if (item.type === "custom-type3") {
        // 贴图表情
        media = new Image();
        media.className = "emoji-big";
        media.src = item.imgUrl;
      } else if (item.type === "video") {
        if (/(mov|mp4|ogg|webm|video)/i.test(item.file.ext)) {
          media = document.createElement("img");
          media.src = item.file.url + "?vframe";
          media.style.width = "100%";
          media.style.height = "auto";
          media.autoStart = false;
          media.preload = "metadata";
          // media.controls = "controls";
        } else {
          let aLink = document.createElement("a");
          aLink.href = item.file.url;
          aLink.target = "_blank";
          aLink.innerHTML = `<i class="el-icon-document"></i>${item.file.name}`;
          this.$refs.mediaMsg.appendChild(aLink);
        }
      }
      if (media) {
        if (this.$refs.mediaMsg) {
          this.$refs.mediaMsg.appendChild(media);
        }
        media.onload = () => {
          this.$emit("msg-loaded");
        };
        media.onerror = () => {
          this.$emit("msg-loaded");
        };
      } else {
        this.$emit("msg-loaded");
      }
    }); // end this.nextTick
  },
  methods: {
    selAll() {},
    //背景色togo
    bgchange(el){
      this.bg=!this.bg;
    },
    // revocateMsg(vNode) {
    //   // 在会话聊天页
    //   if (this.$store.state.currSessionId) {
    //     if (vNode && vNode.data && vNode.data.attrs) {
    //       let attrs = vNode.data.attrs;
    //       if (attrs.type === "robot") {
    //         return;
    //       }
    //       // 自己发的消息
    //       if (attrs.flow === "out") {
    //         let that = this;
    //         this.$vux.confirm.show({
    //           title: "确定需要撤回消息",
    //           onCancel() {},
    //           onConfirm() {
    //             that.$store.dispatch("revocateMsg", {
    //               idClient: attrs.idClient
    //             });
    //           }
    //         });
    //       }
    //     }
    //   }
    // },
    selectorMore() {
      this.$store.commit("updateSelectBox", {
        isShow: true
      });
      // this.msgShow = !this.msgShow;
      // this.$emit("tell-modal");
      // console.log("asdfghjkl");
    },
    getUrl(el) {
      // console.log(el.currentTarget.children[1]);
      var str = el.currentTarget.children[1].src;
      var arr = str.split("?vframe")[0];
      this.$emit("pushURL", { url: arr, blean: true });
    },
    sendRobotBlockMsg(msg, originMsg) {
      if (this.isHistory) {
        // 在历史消息中，不进行机器人交互
        return;
      }
      let body = "[复杂按钮模板触发消息]";
      if (msg.text && msg.text.length === 1) {
        body = msg.text[0].text;
      }
      let robotAccid = originMsg.content.robotAccid;
      if (!this.isRobot) {
        body = `@${this.robotInfos[robotAccid].nick} ${body}`;
      }
      if (this.type === "session") {
        this.$store.dispatch("sendRobotMsg", {
          type: "link",
          scene: originMsg.scene,
          to: originMsg.to,
          robotAccid,
          // 机器人后台消息
          params: msg.params,
          target: msg.target,
          // 显示的文本消息
          body
        });
      } else if (this.type === "chatroom") {
        this.$store.dispatch("sendChatroomRobotMsg", {
          type: "link",
          robotAccid,
          // 机器人后台消息
          params: msg.params,
          target: msg.target,
          // 显示的文本消息
          body
        });
      }
    },
    continueRobotMsg(robotAccid) {
      this.$store.dispatch("continueRobotMsg", robotAccid);
    },
    showFullImg(src, el) {
      this.$store.dispatch("showFullscreenImg", {
        src
      });
      this.$emit("pushPicURL", { url: src, blean: true });
    },
    playAudio(src) {
      if (!this.currentAudio) {
        this.currentAudio = new Audio(src);
        this.currentAudio.play();
        this.currImage = "@/../../static/image/audio.gif";
        this.currentAudio.onended = () => {
          this.currImage = "@/../../static/image/audio.png";
          this.currentAudio = null;
        };
      }
    },
    getBase64Image(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var dataURL = canvas.toDataURL("image/png");
      return dataURL;
      // return dataURL.replace("data:image/png;base64,", "");
    },
    copy($event) {
      if (this.$store.state.im.currSessionId) {
        if (this.textMsg !== "") {
          clipboard.writeText(this.textMsg);
        }
        if (this.imgUrl !== "") {
          Bus.$emit("sendImgUrl", this.imgUrl);
        }
      }
    },
    paste() {
      if (this.msgTypeState == "text") {
        clipboard.readText(this.textMsg);
      } else if (this.msgTypeState == "image" && this.imgUrl !== "") {
        // nativeImage.createFromDataURL
        console.log("img");
        // var img = document.createElement("img");
        // img.src = this.imgUrl;
        // img.onload = function() {
        //   var data = this.getBase64Image(img);
        //   var imageBase64 = clipboard.writeBuffer(data);
        //   clipboard.writeImage(imageBase64);
        //   clipboard.readImage();
        // };
        // this.imgUrl
      } else {
        console.log("paste");
      }
    },
    //删除消息
    deleteMsg() {
      if (this.msgIdClient !== null || this.msgIdClient !== undefined) {
        Bus.$emit("deleteMsg", this.msgIdClient);
      }
    },
    contextmenu(event, msg) {
      this.dataID = event.timeStamp;
      setTimeout(() => {
        if (document.querySelectorAll(".v-contextmenu").length !== 0) {
          for (
            let i = 0;
            i < document.querySelectorAll(".v-contextmenu").length;
            i++
          ) {
            let item = document.querySelectorAll(".v-contextmenu")[i];
            let k = 0;
            if (
              document
                .querySelectorAll(".v-contextmenu")
                [i].getAttribute("data-id") == this.dataID
            ) {
              k = i;
              document
                .querySelectorAll(".v-contextmenu")
                [i].setAttribute(
                  "style",
                  `display: block;top:${event.pageY}px;left:${event.pageX}px`
                );
            }
            if (i != k) {
              document
                .querySelectorAll(".v-contextmenu")
                [i].setAttribute("style", "display:none;top:0;left:0");
            }
          }
        }
      }, 100);

      // 选中字体代码
      this.msgType = msg;
      this.msgIdClient = msg.idClient;
      // 处理文本消息
      if (msg.type == "text") {
        console.log("说明当前是在文本上右键");
        this.textMsg = msg.text;
        this.msgTypeState = "text";
        this.retransmission = msg.text;
      } else if (msg.type == "image" && msg.file.url) {
        console.log("说明当前是在图片上复制");
        this.msgTypeState = "image";
        this.imgUrl = msg.file.url;
        this.retransmission = msg;
        // var img = document.createElement("img");
        // img.setAttribute("crossOrigin", "anonymous");
        // img.src = this.imgUrl;
        // img.onload = function() {
        //   var data = this.getBase64Image(img);
        //   var image = nativeImage.createFromPath("@/../../static/touxiang.jpeg");
        //   clipboard.writeImage(image);
        //   clipboard.readImage();
        // }.bind(this);
        // this.$store.commit("copyImgsrc",)
      } else {
        console.log(msg.type);
        this.msgTypeState = "";
        console.log("当前消息类型不处理");
        return;
      }
    },
    openUserDetail(msg) {
      console.log(msg);
      Bus.$emit("openimage", msg);
    },
    copyImage() {
      div.contentEditable = "true";
      var controlRange;
      if (document.body.createControlRange) {
        controlRange = document.body.createControlRange();
        controlRange.addElement(div);
        controlRange.execCommand("Copy");
      }
      div.contentEditable = "false";
    },
    //转发
    retransmissionMsg() {
      if (this.retransmission !== null) {
        console.log(this.msg, "转发时的信息");
        Bus.$emit("openSendContactBox", this.msg);
      }
    }
  },
  watch:{
    isbg(val){
      val==true?null:
      this.bg=false;
      console.log("程序执行到这里")
    }
  }
};
</script>

<style scoped lang="scss">
.msg-text .emoji-small {
  width: 23px;
  vertical-align: middle;
}
.u-msg {
  overflow-y: auto;
  padding: 10px 0 10px 20px;
  position: relative;
  .el-checkbox {
    position: absolute;
    left: 0%;
    top: 43%;
  }
  .timeTag {
    font-size: 12px;
    margin: 10px 0;
    p {
      display: inline-block;
      background-color: #dadada;
      padding: 3px;
      border-radius: 4px;
      color: #fff;
    }
  }
  .audioBox {
    .audioImage {
      width: 24px;
      height: 24px;
      border: none;
      img {
        width: 100%;
        height: 100%;
        border: none;
      }
    }
  }
}
.msg-video {
  width: 220px;
  height: 138px;
  position: relative;
  img {
    display: inline-block;
    z-index: 5;
    position: absolute;
    top: 50%;
    margin-top: -22px;
    left: 50%;
    margin-left: -22px;
  }
}
.msg-file {
  width: 295px;
  height: 66px;
}
.item-me > div {
  float: right;
  img {
    width: 44px;
    height: 44px;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    cursor: pointer;
  }
  .msg-head {
    float: right;
    position: relative;
    .triangleBox {
      width: 0;
      height: 0;
      border-width: 6px 6px 0;
      border-style: solid;
      border-color: #e1e1e1 transparent transparent;
      position: absolute;
      left: -15px;
      top: 10px;
      transform: rotate(-90deg);
      span.triangle {
        display: block;
        width: 0;
        height: 0;
        border-width: 7px 6px 0;
        border-style: solid;
        border-color: #ff6749 transparent transparent;
        /*黄 透明 透明 */
        position: absolute;
        top: -8px;
        left: -6px;
      }
    }
  }
  .msg-text {
    max-width: 585px;
    display: inline-block;
    font-size: 16px;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    padding: 10px 4px;
    margin-right: 12px;
    word-wrap: break-word;
    cursor: pointer;
    background-color: #ff6749;
    color: #fff;
    user-select: all;
  }
}

.item-you > div {
  float: left;
  margin-top: 10px;
  img {
    width: 44px;
    height: 44px;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
  }
  .msg-head {
    float: left;
    position: relative;
    .triangleBox {
      width: 0;
      height: 0;
      border-width: 6px 6px 0;
      border-style: solid;
      border-color: #e1e1e1 transparent transparent;
      position: absolute;
      right: -15px;
      top: 10px;
      transform: rotate(90deg);
      span.triangle {
        display: block;
        width: 0;
        height: 0;
        border-width: 7px 6px 0;
        border-style: solid;
        border-color: white transparent transparent;
        /*黄 透明 透明 */
        position: absolute;
        top: -8px;
        left: -6px;
      }
    }
  }
  .msg-text {
    display: inline-block;
    font-size: 14px;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    padding: 10px 8px;
    margin-left: 12px;
    word-wrap: break-word;
    cursor: pointer;
    user-select: all;
    line-height: 20px;
  }
}
.item-time {
  width: 100%;
  text-align: center;
}
.bg{
  background: #e0e0e0;
}
</style>
<style>
.el-message {
  z-index: 5000;
}
</style>
