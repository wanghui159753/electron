<template>
  <div class="message">
        <div class="message-title">
            <div class="m-t-left">
                <el-input v-model="input" placeholder="请输入内容" size="mini" suffix-icon="el-icon-search"></el-input>
                <div class="m-t-left-img" @click="openaddBox">
                    <img src="@/../../static/image/adduser.png" alt="">
                </div>
            </div>
            <div class="m-t-right" @click="openUserInfoDetail" v-show="currCheckName">
               {{currCheckName}}<i class="el-icon-arrow-right"></i>
            </div>
            <div class="rightAvatar">
              <CurrentUserInfo></CurrentUserInfo>
            </div>
        </div>
        <div class="message-container flexbetween" v-loading="loading">
            <keep-alive>
                <div class="left outer-container">
                    <div class="inner-container">
                        <ul class="content">
                           <v-contextmenu ref="contextmenu">
                              <v-contextmenu-item  @click="deletemenu(activeName)">删除</v-contextmenu-item>
                            </v-contextmenu>
                            <li  v-for="(item,index) in sessionlist" :key="index" @click="handleClick(index)" v-contextmenu:contextmenu @contextmenu="curClear(index)">
                              <div slot="label" class="m-title flexbetween" :class="{active: activeName == index}" @click="sendUserInfo(item,index)">
                                    <div class="m-title-left flexbetween">
                                        <div class="t-l-img">
                                          <!-- userInfos[item.to].avatar @/../../static/image/touxiang.jpeg-->
                                          <img :src="item.avatar">
                                        </div>
                                        <div class="t-l-conter">
                                          <h5 style="height:30px;">{{item.name}}</h5>
                                          <p>{{item.lastMsgShow}}</p>
                                        </div>
                                    </div>
                                    <div class="m-title-right">{{item.updateTimeShow}}</div>
                                </div>
                                <el-badge v-show="item.unread > 0" :value="item.unread" :max="99" class="badge"></el-badge>
                            </li> 
                        </ul>
                    </div>
                </div>
            </keep-alive>  
                <!-- 右侧好友消息  -->
               <div class="right">
                <split-pane v-on:resize="resize" :min-percent='20' :default-percent='70' split="horizontal">
                    <template slot="paneL">
                      <!-- 消息列表   :sessions="currsession"  :chatlist="chatlist"  :currsessionId="currsessionID"  -->
                        <chat-list  type="session" :msglist="msglist"  :userInfos="userInfos" :myInfo="myInfo" 
                        @msgs-loaded="msgsLoaded" @tell-more="msgSectionMore" @removeMsg="delMsg" @selMsg="selMsg" :msgdialogVisible="msgdialogVisible"></chat-list>
                    </template>
                    <!-- 输入框 -->
                    <template slot="paneR">
                      <chat-editor type="session" v-if="!msgSectionShow"  ref="area" :scene="scene" :to="to" @openaddFriend="openadd"></chat-editor>
                      <div class="forward-msg" v-if="msgSectionShow">
                        <i @click="selectShowCloce"><img src="@/../../static/image/del.png" alt=""></i>
                        <ul class="forward-msg-ul">
                          <li @click="everyRetransmission">
                            <div><img src="@/../../static/image/zhuanfa.png" alt=""></div>
                            <p>转发</p>
                          </li>
                        </ul>
                      </div>
                    </template>
                  </split-pane>
              </div> 
        </div>
        <!-- 联系人详情组件-->
        <transition>
          <contact-detail :contactshowBox="contactshowBox"></contact-detail >
        </transition>
        <!--添加好友容器-->
        <div class="add-box" v-if="addBox">
          <div class="closeBox" @click="closeBox">
            <i class="el-icon-close"></i>
          </div>
          <!-- 添加好友成功的提示信息 -->
          <div class="add-msg flexbetween">
            <div class="add-title">加好友</div>
          </div>
          <!-- 添加好友的输入框 -->
          <div class="inputfiled flexbetween">
             <el-input v-model="searchfrineds" :clearable="true" placeholder="请输入昵称或者手机号" @change="friendlist=[]" @keyup.enter.native="getSeachResult"></el-input>
              <div class="searchBtn">
                <el-button @click="getSeachResult">搜索</el-button>
              </div>
          </div>
          <!-- 搜索出来的结果 -->
          <div class="res">
            <div class="search-result flexbetween" v-if="friendlist.length" v-for="(list,index) in friendlist" :key="index">
                 <div class="flexbetween">
                    <div class="seach-icon">
                      <img :src="list.icon" alt="搜索头像">
                    </div>
                    <div class="nick">
                      <p>{{list.name}}<span>({{list.mobile}})</span></p>
                    </div>
                 </div>
               <div class="clickSearch">
                  <el-button @click="addfriends(list)">添加好友</el-button>
               </div>
            </div>
            
          </div>
          <div v-if="!friendlist.length" class="res">暂无数据</div>
        </div>
        <el-dialog title="添加朋友" :visible.sync="addFridentdialogVisible" class="addFridentdialogVisible">
          <el-form :model="marker" size="mini">
            <el-form-item label="">
              <el-input type="textarea" placeholder="请输入验证信息，我是" :autosize="{ minRows: 6, maxRows: 8}" v-model="marker.ps" ></el-input>
            </el-form-item>
            <el-form-item label="">
              <p>你需要发送验证请求，对方通过之后才能添加其为朋友</p>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="confirmAddFriends">确定添加</el-button>
            <el-button size="mini" type="primary" @click="addFridentdialogVisible = false">取消添加</el-button>
          </div>
        </el-dialog>
        <!-- 点击头像 -->
        <div>
          <Inquiry :applyInquiry="applyInquiry"></Inquiry>
        </div>
         <el-dialog
          class="msg-select-dialog"
          :visible.sync="msgdialogVisible"
          width="50%">
          <el-input v-model="iptValue"></el-input>
          <div class="msg-select-div">
            <!-- <div class="left">
              <h3>好友列表:</h3>
              <el-checkbox-group class="checkGrop" :class="{bg:auto==index}" @click.native="togoBg(index)" v-for="(item,index) in selectContactList" :key="index" v-model="checkboxGroupmsg" @change="msg_Forward(checkboxGroupmsg,item)" size="small">
                 <label class="forwardUser">
                   <el-checkbox :label="item.account" border></el-checkbox>
                   <img :src="item.avatar" alt="" width="33" height="33">
                   <span class="name" v-if="item.alias">{{item.alias}}</span>
                   <span class="name" v-else-if="item.nick">{{item.nick}}</span>
                   <span class="name" v-else>{{item.account}}</span>
                 </label>
                
              </el-checkbox-group>
            </div> -->
             <!-- @click.native="togoBg2(index)" -->
            <div class="center left" @mousewheel="scrollList" id="connector">

              <el-checkbox-group class="checkGrop" :class="{bg:auto2==index}" @click.native="togoBg2(index)" v-for="(item,index) in sessionlist" :key="index" v-model="checkboxGroupmsg" @change="msg_Forward(checkboxGroupmsg,item)" size="small">
                 <label class="forwardUser">
                   <el-checkbox :label="item.id.substring(4)" border></el-checkbox>
                   <img :src="item.avatar" alt="图片加载失败" width="33" height="33">
                   <span class="name" v-if="item.name">{{item.name}}</span>
                   <span class="name" v-else>{{item.id}}</span>
                 </label>
                
              </el-checkbox-group>
            </div>
            <div class="right">
              <h3>已选择了{{checkboxGroupmsg.length}}个联系人</h3>
              <p v-if="checkboxGroupmsg.length==0">请选择联系人.......</p>
              <p v-else>
                <span v-for="(item,i) in retransmissionlist" :key="i">
                  <img :src="item.avatar" alt="图片加载失败" width="33" height="33">
                   <span class="name" v-if="item.alias">{{item.alias}}</span>
                   <span class="name" v-else-if="item.nick">{{item.nick}}</span>
                   <span class="name" v-else-if="item.name">{{item.name}}</span>
                    <span class="name" v-else>{{item.id}}</span>
                  <i @click="Forward_close(item,i)" class="el-icon-close"></i> 
                </span>
              </p>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeRretransmission">取 消</el-button>
            <el-button type="primary" @click="enteRretransmission">确 定</el-button>
          </span>
        </el-dialog>
    </div> 
</template>
<script>
const { ipcRenderer } = require("electron");
import Bus from "@/utils/bus.js";
import { setLocal, getLocal } from "@/utils/localstorage.js";
import util from "@/utils";
import ChatList from "./chatlist";
import ContactDetail from "./template/contactDetail";
import { mapGetters } from "vuex";
import { loadUserPage } from "@/api/im/user.js";
import ChatEditor from "@/components/Chat/ChatEditor.vue";
import config from "@/configs";
import splitPane from "vue-splitpane";
import { setTimeout } from "timers";
import Inquiry from "@/components/Chat/Inquiry";
import CurrentUserInfo from "@/components/CurrentUserInfo/CurrentUserInfo.vue";
import { userInfo } from "os";
// import { connect } from 'http2';
export default {
  name: "Message",
  data() {
    return {
      //多选联系人数组
      
      //好友搜索输入值
      iptValue:"",
      // auto: null,
      auto2: null,
      //多选转发消息列表
      selMsgs: null,
      // 选择联系人
      checkboxGroupmsg: [],
      msgdialogVisible: false,
      // msgSectionShow: false,
      // 聊天记录
      unread: "",
      activeName: 0,
      input: "",
      chatlist: [],
      currsession: {},
      currCheckName: "",
      contactshowBox: {
        show: false,
        data: {}
      },
      islastInd: false,
      searchfrineds: "",
      addBox: false,
      friendlist: [],
      friendlistBox: false,
      currsessionID: this.$route.params.sessionId,
      newMsglist: this.$store.state.im.currSessionMsgs,
      sessionName: "",
      addremarksbox: true,
      addFridentdialogVisible: false,
      marker: {},
      applyInquiry: {
        show: false,
        data: {}
      },
      loading: false,
      retransmissionlist: [],
      everyContentMsg: null
    };
  },
  components: {
    ChatList,
    ContactDetail,
    ChatEditor,
    splitPane,
    Inquiry,
    CurrentUserInfo
  },
  methods: {
    //滚动消息转发列表
    scrollList(el) {
      //msg-select-div
      let scrollBox = document.getElementById("connector");
      // el.deltaY>0?scrollBox.scrollTop=5:scrollBox.scrollTop=15;
      // console.log(scrollBox.scrollTop,el.deltaY>0,el)
      // scrollBox.scrollTop=100;
    },
    //背景切换
    // togoBg(index) {
    //   this.auto = index;
    //   this.auto2 = null;
    // },
    togoBg2(index) {
      console.log(index);
      this.auto2 = index;
    },
    //删除选中消息
    delMsg(index) {
      if (
        this.msglist[index - 1].type == "timeTag" &&
        index == this.msglist.length - 1
      ) {
        this.msglist.splice(index - 1, 2);
      } else {
        this.msglist.splice(index, 1);
      }
      this.$message.success("删除成功");
    },
    curClear(i) {
      this.activeName == i ? null : (this.activeName = null);
    },
    // 转发选择联系人
    msg_Forward(val, list) {
      if (this.retransmissionlist.length < 10) {
        let index1;
        this.retransmissionlist.some((item, index) => {
          let itemId = item.account ? item.account : item.id.substring(4);
          let listId = list.account ? list.account : list.id.substring(4);
          itemId == listId ? (index1 = index) : null;
          return itemId == listId;
        })
          ? this.retransmissionlist.splice(index1, 1)
          : this.retransmissionlist.push(list);
      } else {
        this.$message.warning("最多可添加九个联系人");
      }
    },
    Forward_close(val, index) {
      this.retransmissionlist.forEach((item, index) => {
        if (
          val.account
            ? item.account
            : item.id == item.account ? item.account : item.id
        ) {
          this.retransmissionlist.splice(index, 1);
        }
        return false;
      });
      this.checkboxGroupmsg.splice(index, 1);
    },
    // 是否显示输入框
    msgSectionMore() {
      // this.msgSectionShow = true;
    },
    // 关闭转发
    selectShowCloce() {
      // this.msgSectionShow = false;
      this.$store.commit("updateSelectBox", {
        isShow: false
      });
      this.msgdialogVisible = this.msgdialogVisible == false ? null : false;
    },
    handleClick(ind) {
      this.msgSectionShow = false;
      this.$refs.area.quill.focus();
      this.activeName = ind;
      this.msgdialogVisible = this.msgdialogVisible == false ? null : false;
    },
    sendUserInfo(item, index) {
      // 如果有备注信息取备注，没有的话取默认
      if (item.name !== "") {
        this.currCheckName = item.name;
      } else {
        this.currCheckName = item.lastMsg.fromNick;
      }
      this.sessionId = item.id;
      this.$store.dispatch("setCurrSession", item.id);
      this.contactshowBox.data = item;
      this.sessionName = item.name;
      Bus.$emit("sendmsgdata", this.msglist);
      this.$store.dispatch("getLocalMsgs", {
        sessionId: item.id
      });
    },
    openUserInfoDetail() {
      if (this.contactshowBox.data !== {}) {
        this.contactshowBox.show = !this.contactshowBox.show;
      } else {
        return;
      }
    },
    resize() {
      console.log("resize");
    },
    getListInd() {
      const index = getLocal("ind");
      if (this.islastInd) {
        this.activeName = index;
        this.currCheckName = this.sessions[index].lastMsg.fromNick;
      }
    },
    openaddBox() {
      this.addBox = !this.addBox;
    },
    closeBox() {
      this.addBox = false;
      this.searchfrineds = "";
      this.friendlist = [];
    },
    getSeachResult() {
      if (this.searchfrineds == "") {
        this.$message.warning("请输入查询条件后进行搜索");
        return;
      } else if (Number(this.searchfrineds)) {
        if (this.searchfrineds.length != 11) {
          this.$message.warning("请输入11位手机号码");
          return;
        }
      }
      if (this.friendlist.length > 0) {
        return;
      }
      const params = {
        keyword: this.searchfrineds.replace(/\s+/g, "")
      };
      this.friendlist = [];
      loadUserPage(params).then(res => {
        if (res.code == 200) {
          res.data.records.forEach(item => {
            this.friendlist.push(item);
          });
        }
      });
    },
    addfriends(item) {
      this.closeBox();
      this.searchfrineds = "";
      this.addFridentdialogVisible = true;
      this.marker.account = item.accid;
    },
    msgsLoaded() {
      console.log("msgsLoaded");
    },
    deletemenu(vm, event) {
      if (
        this.activeName !== null &&
        this.activeName !== undefined &&
        (this.sessionName !== null && this.sessionName !== undefined)
      ) {
        if (this.sessionId !== null) {
          this.$store.dispatch("deleteSession", this.sessionId);
          this.activeName = null;
          this.sessionName = null;
        }
      } else {
        this.$message.warning("请选中会话后操作");
        return;
      }
    },
    // 确认添加好友
    confirmAddFriends() {
      //marker.ps为备注详情
      this.$store.dispatch("applyFriend", this.marker);
      this.marker = {};
      this.$message.success("已发送申请");
      this.addFridentdialogVisible = false;
    },
    openadd(data) {
      var currUserInfos = this.im.userInfos[data];
      if (this.im.currSessionId) {
        if (currUserInfos.isFriend) {
          this.$message.warning("当前已经是好友。");
          return;
        } else {
          this.marker.account = data;
          this.addFridentdialogVisible = true;
        }
      }
    },
    enteRretransmission() {
      //everyContentMsg存储选择的信息
      console.log(
        this.retransmissionlist,
        "当前已选择的人的信息",
        this.everyContentMsg,
        "当前所选信息"
      );
      if (this.checkboxGroupmsg.length !== 0) {
        if (this.everyContentMsg.constructor.name == "Object") {
          this.retransmissionlist.forEach(item => {
            if (item.account || item.id) {
              this.$store.dispatch("forwardMsg", {
                scene: this.everyContentMsg.scene,
                to: item.account ? item.account : item.id.substring(4),
                msg: this.everyContentMsg
              });
            }
          });
        } else if (this.everyContentMsg.constructor.name == "Array") {
          //循环联系人
          this.retransmissionlist.forEach(item => {
            //循环消息
            this.everyContentMsg.forEach(e => {
              this.$store.dispatch("forwardMsg", {
                scene: e.scene,
                to: item.account ? item.account : item.id.substring(4),
                msg: e
              });
            });
          });
        }
        this.retransmissionlist = [];
        this.checkboxGroupmsg = [];
        this.everyContentMsg = "";
        this.msgSectionShow = false;
      } else {
        this.$message.error("请选择联系人后转发");
        return false;
      }
      this.msgdialogVisible = this.msgdialogVisible == false ? null : false;
    },
    closeRretransmission() {
      this.retransmissionlist = [];
      this.checkboxGroupmsg = [];
      this.everyContentMsg = "";
      this.msgdialogVisible = this.msgdialogVisible == false ? null : false;
    },
    everyRetransmission() {
      this.selMsgs.length
        ? Bus.$emit("openSendContactBox", this.selMsgs)
        : this.$message.warning("你还未选择任何消息");
    },
    selMsg(obj) {
      this.selMsgs = obj;
      console.log(obj, "接收到的消息");
    }
  },
  computed: {
    ...mapGetters(["sessions"]),
    ...mapGetters(["msgs"]),
    ...mapGetters(["im"]),
    sessionId: {
      get: function() {
        if (this.currsessionID !== null || this.currsessionID !== undefined) {
          return this.currsessionID;
        } else {
          return this.sessions[0].id;
        }
      },
      set: function(newValue) {
        this.currsessionID = newValue;
      }
    },
    userInfos() {
      return this.$store.state.im.userInfos;
    },
    myInfo() {
      // return this.im.myInfo;
      return this.$store.state.im.myInfo;
    },
    myPhoneId() {
      return `${this.im.userUID}`;
    },
    scene() {
      const reg = /\d$/g;
      const that = this;
      if (reg.test(this.sessionId)) {
        return util.parseSession(this.sessionId).scene;
      } else {
        return;
      }
    },
    to() {
      const reg = /\d$/g;
      const that = this;
      if (reg.test(this.sessionId)) {
        return util.parseSession(that.sessionId).to;
      } else {
        return;
      }
    },
    sessionlist() {
      // 当前的会话列表:
      var that = this;
      let sessionlist = this.im.sessionlist.map(item => {
        if (item.unread > 0) {
          ipcRenderer.send("triggerAudio");
          ipcRenderer.send("isTwinkle");
          ipcRenderer.send("triggerAudio");
          ipcRenderer.on("sendState", function(event, data) {
            if (data) {
              ipcRenderer.send("receiveMsg");
            }
          });
        }
        item.name = "";
        item.avatar = "";
        if (item.scene === "p2p") {
          let userInfo = null;
          if (item.to !== this.myPhoneId) {
            userInfo = this.userInfos[item.to];
          } else {
            return false;
          }
          if (userInfo) {
            item.name = util.getFriendAlias(userInfo);
            item.avatar = userInfo.avatar;
          }
        }
        let lastMsg = item.lastMsg || {};
        if (lastMsg.type === "text") {
          item.lastMsgShow = lastMsg.text || "";
        } else if (lastMsg.type === "custom") {
          item.lastMsgShow = util.parseCustomMsg(lastMsg);
        } else if (
          lastMsg.scene === "team" &&
          lastMsg.type === "notification"
        ) {
          item.lastMsgShow = util.generateTeamSysmMsg(lastMsg);
        } else if (util.mapMsgType(lastMsg)) {
          item.lastMsgShow = `[${util.mapMsgType(lastMsg)}]`;
        } else {
          item.lastMsgShow = "";
        }
        if (item.lastMsg) {
          item.lastMsg.time
            ? (item.updateTimeShow = util.formatDate(item.lastMsg.time, true))
            : null;
        }
        return item;
      });
      //  触发声音
      return sessionlist.filter(item => item.lastMsg);

    },
    msglist() {
      let msgs = this.$store.state.im.currSessionMsgs;
      return msgs;
    },
    selectContactList() {
      var that = this;
      var selectData = [];
      that.im.friendslist.forEach(item => {
        if (item.isFriend) {
          selectData.push(that.im.userInfos[item.account]);
        } else {
          return;
        }
      });
      return selectData;
    },
    msgSectionShow: {
      get() {
        return this.$store.state.im.isShowSelectBox;
      },
      set(val) {
        this.$store.state.im.isShowSelectBox = val;
      }
    }
  },
  watch: {
    iptValue(val){
      console.log(val)
    },
    msgdialogVisible(val) {
      console.log(val, "新值");
    },
    searchfrineds() {
      if (this.searchfrineds == "") {
        this.friendlist = [];
        this.friendlistBox = false;
      }
    }
  },
  created() {
    /**
     * 如果不是以数字结尾,就选中当前列表的第一项
     * 如果是以数字结尾，就先循环当前会话，如果会话有当前的联系人信息，就选中联系人
     * 如果是以数字结尾，当前会话列表没有该联系人的会话，则需要创建该会话
     */
    const reg = /\d$/g;
    const param = this.$route.params.sessionId;
    console.log(param);
    if (!reg.test(param)) {
      if (this.sessions.length > 0) {
        this.sessionId = this.sessions[0].id;
      }
    } else {
      this.sessionId = param;
      for (let i = 0; i < this.sessionlist.length; i++) {
        if (this.sessionlist[i].id == param) {
          this.activeName = i;
          this.sendUserInfo(this.sessionlist[i], i);
          break;
        }
        if (reg.test(param)) {
          if (/^p2p-/.test(param)) {
            let userInfoId = param.replace(/^p2p-/, "");
            let that = this;
            this.$store.dispatch("sendMsg", {
              type: "text",
              scene: "p2p",
              to: userInfoId,
              text: "您好"
            });
            this.$store.commit("getUser", { id: userInfoId });
            // this.$store.dispatch("searchUsers", {
            //   accounts: userInfoId
            // });
          }

          break;
        }
      }
    }
  },
  mounted() {
    this.$store.dispatch("setCurrSession", this.sessionId);
    Bus.$on("openimage", content => {
      if (content.from !== null) {
        this.$store.dispatch("searchUsers", {
          accounts: content.from,
          done: users => {
            //in   out send
            this.applyInquiry.data.account = users[0].account;
            this.applyInquiry.data.avatar = users[0].avatar;
            this.applyInquiry.data.createTime = users[0].createTime;
            this.applyInquiry.data.custom = users[0].custom;
            this.applyInquiry.data.gender = users[0].gender;
            this.applyInquiry.data.nick = users[0].nick;
            this.applyInquiry.data.sign = users[0].sign;
            this.applyInquiry.data.tel = users[0].tel;
            this.applyInquiry.data.updateTime = users[0].updateTime;
          }
        });
        this.applyInquiry.show = true;
      }
    });
    Bus.$on(
      "openSendContactBox",
      function(content) {
        let resultContent = null;
        if (content) {
          resultContent = content;
        }
        this.msgdialogVisible = true;
        this.everyContentMsg = resultContent;
        resultContent = null;
      }.bind(this)
    );
  },
  updated() {
    // console.log("updated", this.sessionId);
  },
  destroyed() {
    this.$store.dispatch("resetCurrSession");
  }
};
</script>

<style scoped lang="scss">
.outer-container,
.content {
  width: 280px;
  height: calc(100vh - 130px);
  li {
    cursor: pointer;
    position: relative;
    .badge {
      position: absolute;
      right: 10px;
      top: 55px;
    }
  }
}
.active {
  background-color: #e0e0e0;
  border-right: 2px solid #ff6749;
}
.message {
  overflow: hidden;
  height: 100%;
  position: relative;
  .message-title {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    position: relative;
    background: #fbfbfb;
    .m-t-left {
      width: 256px;
      display: flex;
      justify-content: space-between;
      .el-input {
        margin-right: 10px;
        color: #7b8da0;
      }
      .m-t-left-img {
        width: 30px;
        cursor: pointer;
        img {
          width: 100%;
        }
      }
    }
    .m-t-right {
      width: calc(100% - 265px - 10px);
      text-align: center;
      line-height: 30px;
      cursor: pointer;
    }
     .rightAvatar {
        position: absolute;
        right: 10px;
        top: 0px;
      }
  }
  .message-container {
    height: 100%;
    background: #fff;
    .left {
      height: 100%;
      position: relative;
      ul {
        li {
          list-style: none;
        }
        .m-title {
          line-height: normal;
          padding: 10px 13px;
          border-bottom: 1px solid #e0e0e0;
          .m-title-left {
            color: #343232;
            .t-l-img {
              width: 48px;
              height: 48px;
              background-color: #999999;
              img {
                width: 100%;
                height: 100%;
                border-radius: 4px;
              }
            }
            .t-l-conter {
              padding-left: 10px;
              text-align: left;
              h5 {
                font-size: 18px;
                line-height: 28px;
                color: #343232;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 180px;
              }
              p {
                width: 160px;
                font-size: 12px;
                line-height: 20px;
                color: #888584;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
          .m-title-right {
            line-height: 48px;
            font-size: 12px;
            color: #524f4e;
            flex: 0 0 38px !important;
            position: absolute;
            right: 10px;
          }
        }
      }
    }
    .right {
      width: calc(100% - 275px);
      .forward-msg {
        padding: 10px;
        background-color: #f5f5f5;
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          position: absolute;
          right: 0;
          top: 0px;
          width: 25px;
          height: 25px;
          padding: 5px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        ul.forward-msg-ul {
          width: 100%;
          li {
            font-size: 12px;
            text-align: center;
            width: calc(100% / 2 - 100px);
            list-style: none;
            margin: 0 auto;
            div {
              background-color: white;
              padding: 10px;
              border-radius: 50px;
              width: 35px;
              height: 35px;
              margin: 0 auto;
              margin-bottom: 10px;
            }
            div:hover {
              opacity: 0.7;
            }
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
  .add-box {
    position: absolute;
    top: 30%;
    left: 20%;
    z-index: 999999;
    width: 649px;
    background-color: #fff;
    box-shadow: 0px 0px 8px 6px #ddd !important;
    // -webkit-app-region: drag;
    .closeBox {
      position: absolute;
      right: 6px;
      top: 6px;
      cursor: pointer;
    }
    .add-msg {
      width: 40%;
      margin: 0 40%;
      padding: 10px 0;
      .add-title {
        text-align: center;
      }
      .add-icon {
        width: 36px;
        height: 36px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .add-title {
        font-size: 26px;
        color: #515151;
      }
    }
    .inputfiled {
      width: 461px;
      height: 56px;
      margin: 0 auto;
      padding: 8px;
      .searchBtn {
        margin-left: -5px;
        display: inline-block;
        z-index: 5;
        .el-button {
          padding: 12px 36px;
          background-color: #ff6749;
          border:1px solid #ff6749 !important;
          color: #fff;
          border-top-left-radius: 0 !important;
          border-bottom-left-radius: 0 !important;
        }
      }
    }
    .res {
      max-height: 63 * 4px;
      overflow: auto;
      margin: 20px auto;
      width: 425px;
      .search-result {
        padding: 8px 2px;
        border-bottom: 1px solid #dedede;
        .seach-icon {
          width: 46px;
          height: 46px;
          margin-right: 12px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .nick {
          padding-top: 20px;
        }
        .clickSearch .el-button {
          margin-top: 3px;
          background-color: #ff6749;
          color: #fff;
        }
      }
    }
  }
  .addremarksbox {
    z-index: 999999;
    width: 450px;
    height: 240px;
    position: absolute;
    top: 30%;
    left: 30%;
    background-color: #e1e1e1;
    z-index: 999999;
    .remark-title {
      border: 1px solid red;
      .left {
        color: #4c4a4a;
      }
      .closeBtn {
        width: 22px;
        height: 22px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.message {
  .el-input__inner {
    background-color: #e0e0e0;
  }
  .inputfiled {
    .el-input__inner {
      background-color: #fff !important;
    }
  }
  .el-tabs--left .el-tabs__header.is-left {
    margin-right: 0px;
  }
  .bottom-input {
    .el-textarea {
      height: 100%;
      .el-textarea__inner {
        height: 100%;
        border: 1px solid white;
      }
    }
  }
  .el-dialog__header {
    background: #e5e5e5;
  }
  .el-dialog {
    .el-form {
      .el-form-item {
        .el-form-item__label {
          padding: 0px;
        }
      }
    }
    .bg-input-w {
      position: relative;
      .el-textarea__inner {
        min-height: 145px !important;
      }
      .el-button {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    }
  }
  .parts-submit {
    position: absolute;
    bottom: 0px;
    width: 100%;
    left: 0px;
    border-radius: 0px;
  }
  .payment {
    .payment-money {
      .el-input__inner {
        height: auto;
        line-height: 83px;
        background-color: white;
      }
      .el-input__prefix {
        line-height: 86px;
        color: #666;
      }
      .el-input--prefix {
        .el-input__inner {
          padding-left: 100px;
        }
      }
    }
  }
  .msg-select-dialog {
    .el-dialog__header {
      background: #fff;
    }
    .msg-select-div {
      height: 300px;
      overflow: hidden;
      display: flex;
      justify-content: space-around;
      div {
        position: relative;
        h3 {
          position: absolute;
          top: -20px;
          left: 0;
        }
      }
      div.left {
        width: 48%;
        margin-right: 4%;
        min-height: 200px;
        border: 1px solid #e1e1e1;
        .el-checkbox {
          display: block;
          margin-left: 0px !important;
          border: none !important;
          padding: 20px 10px;
          height: auto;
        }
      }
      div.right {
        width: 48%;
        min-height: 200px;
        padding: 10px;
        border: 1px solid #e1e1e1;
        p {
          span {
            display: block;
            overflow: hidden;
            height: 60px;
            line-height: 60px;
            span {
              float: left;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 50%;
            }
            img {
              float: left;
              margin-right: 13px;
              position: relative;
              top: 13px;
              border-radius: 10%;
            }
            i {
              float: right;
              padding: 2px;
              border-radius: 50px;
              border: 1px solid #e5e5e5;
              position: relative;
              top: 20px;
            }
          }
        }
      }
    }
  }
}
.forwardUser {
  display: inline-block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .el-checkbox {
    float: left;
    .el-checkbox__label {
      display: none;
    }
  }
  img {
    float: left;
    position: relative;
    top: 13px;
    margin-right: 13px;
    border-radius: 10%;
  }
  .name {
    float: left;
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 50%;
  }
}
.v-modal {
  display: none;
}
.checkGrop {
  line-height: 60px;
  height: 60px;
}
.bg {
  background: #e0e0e0;
}
.el-dialog__body .el-input {
  width: 48%;
  display: block;
  margin-bottom:5px;
  input {
    background: #fff;
  }
}
</style>