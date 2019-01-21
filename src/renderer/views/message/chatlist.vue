<template>
    <div class="chatlist scrollbar clearfix" id="msgbox">
      <div ref="msglist" > 
          <ul>
               <!-- <li class="isMoreHistory"  @click="getHistoryMsgs">
                加载更多
              </li>
             <li class="isMoreHistory" >
                已无更多记录
              </li>-->
          </ul> 
          <el-checkbox-group v-model="checkList" @change="updateSelectContent">
            <label v-for="msg in msglist" 
                :key="msg.idClient">
              <chat-item
                :isbg="isbg"
                :type="type"
                :msgShow='msgShow'
                :rawMsg="msg"
                :userInfos="userInfos"
                :myInfo="myInfo"
                :isHistory='isHistory'
                @tell-modal="selectMore"
                @msg-loaded="msgLoaded"
                @pushURL="getURL"
            ></chat-item>
           </label>
           </el-checkbox-group>
      </div>
      <videoPlear v-show="blean" v-model="blean" :url="url"></videoPlear>
    </div>
</template>
<script>
import Bus from "@/utils/bus.js";
import { mapGetters } from "vuex";
import splitPane from "vue-splitpane";
import ChatEditor from "@/components/Chat/ChatEditor.vue";
import { setTimeout, setInterval, clearTimeout } from "timers";
import util from "@/utils";
import ChatItem from "@/components/Chat/ChatItem";
import videoPlear from "@/components/Chat/videoPlear";
export default {
  components: {
    splitPane,
    ChatEditor,
    ChatItem,
    videoPlear
  },
  data() {
    return {
      checkList: [],
      partsData: {
        show: false
      },
      paymentData: {
        show: false
      },
      data: [],
      ins: [],
      out: [],
      blean: false,
      url: "",
      // type: "",
      isEmojiShown: false
    };
  },
  props: {
    type: String,
    msglist: {
      type: Array,
      default: []
    },
    myInfo: {
      type: Object,
      default: {}
    },
    isHistory: {
      type: Boolean,
      default: false
    },
    msgSectionShow: {
      type: Boolean,
      default: false
    },
    userInfos: {
      type: Object,
      default: {}
    },
    msgdialogVisible:{
      type:Boolean,
      default:true
    }
  },
  watch: {
    msgSectionShow() {
      if (this.msgSectionShow) {
        this.msgShow = true;
      } else {
        this.msgShow = false;
      }
    },
     isbg(val){
       val?null:this.checkList=[];
     }
  },
  methods: {
    selectMore() {
      // this.msgShow = true;
      // this.$emit("tell-more");
    },
    getURL(obj) {
      this.url = obj.url;
      this.blean = obj.blean;
    },
    selectEmoji(code) {
      this.showEmoji = false;
      this.value += code;
      console.log("code", code);
    },
    resize() {
      console.log("resize");
    },
    getHistoryMsgs() {
      if (this.canLoadMore) {
        this.$store.dispatch("getHistoryMsgs", {
          scene: this.scene,
          to: this.to
        });
      }
    },
    msgLoaded() {
      console.log("chatlist--msgLoaded");
    },
    updateSelectContent() {
      this.$emit("selMsg",this.checkList)
      console.log(this.checkList, "选择的消息");
    }
  },
  computed: {
    ...mapGetters(["msgs"]),
    ...mapGetters(["im"]),
    canLoadMore() {
      return !this.$store.state.im.noMoreHistoryMsgs;
    },
    scene() {
      return util.parseSession(this.sessionId).scene;
    },
    msgShow() {
      // console.log(this.$store.state.im.isShowSelectBox);
      return this.$store.state.im.isShowSelectBox;
    },
    isbg(){
      let flag=this.msgdialogVisible;
      return flag;
    }
  },

  updated() {
    // this.scroll();
    // let msgbox = document.getElementById("msgbox");
    // let img = msgbox.getElementsByTagName("img");
    // img.forEach(item => {
    //   item.onload = () => {
    //     msgbox.scrollTop = msgbox.scrollHeight;
    //   };
    // });
    // msgbox.scrollTop = msgbox.scrollHeight;
    window.document.body.addEventListener("click", () => {
      this.isEmojiShown = false;
    });
  },
  mounted() {
    console.log(this.msgdialogVisible,"当前布尔值")
    var msgdata = null;
    var obj = {};
    Bus.$on("sendmsgdata", result => {
      if (result !== null || result !== undefined) {
        msgdata = result;
      }
    });
    Bus.$on("deleteMsg", content => {
      if (content !== null || content !== undefined) {
        if (msgdata !== null) {
          console.log("content", content);
          console.log(msgdata, "msgdata");
          msgdata.forEach((el, index) => {
            if (el.idClient == content) {
              obj.msg = msgdata[index];
              this.$store.dispatch("deleteMsg", obj);
              this.$emit("removeMsg",index)
            }
          });
        }
      }
    });
  }
};
</script>
<style scoped lang="scss">
.chatlist {
  height: 100%;
  overflow: auto;
  background-color: #F3F3F3;
}
// .top {
//   width: 100%;
//   height: 100%;
//   overflow: auto;
//   padding: 10px 20px;
// }
// .top::-webkit-scrollbar {
//   width: 8px;
//   height: 14px;
//   padding: 0 5px;
// }

// .top::-webkit-scrollbar-thumb {
//   border-radius: 999px;
//   border: 1px solid transparent;
// }

// .top::-webkit-scrollbar-thumb {
//   background-color: #ccc;
//   min-height: 20px;
//   background-clip: content-box;
// }
// .chatlist .t-c-u-left {
//   margin-right: 40px;
//   text-align: left;
// }
// .chatlist .t-c-u-right {
//   margin-top: 20px;
//   text-align: right;
//   margin-left: 40px;
//   .c-img {
//     float: right !important;
//   }
//   .c-conter {
//     max-width: 590px;
//     float: right !important;
//     margin-top: 6px;
//   }
// }
// .chatlist {
//   height: calc(100% - 200px);
//   background-color: #f3f3f3;
//   overflow-y: scroll;
//   .isMoreHistory {
//     list-style: none;
//     text-align: center;
//     cursor: pointer;
//   }

/* 右侧离场 动画   enter入场动画  leave离开动画 */
// .fade-leave-active,
// .fade-enter-active {
//   transition: all 2s;
// }

// .fade-enter {
//   transform: translate(-100%, 0);
//   opacity: 0;
// }

// .fade-enter-to {
//   transform: translate(0, 0);
//   opacity: 1;
// }
// .fade-leave {
//   transform: translate(0, 0);
//   opacity: 1;
// }
// .fade-leave-to {
//   transform: translate(-100%, 0);
//   opacity: 0;
// }
// }
#msgbox {
  background: #f3f3f3;
}
</style>

