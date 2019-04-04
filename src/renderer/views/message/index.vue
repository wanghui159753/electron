<template>
    <div class="message">
        <div class="message-title">
            <div class="m-t-left">
                <div class="m-t-left-input">
                    <el-input v-model="input" placeholder="请输入内容" size="mini" prefix-icon="el-icon-search"></el-input>
                    <img src="@/../../static/image/close.png" width="15" alt v-show="input" @click="input=''">
                </div>
                <!-- <div class="m-t-left-img" @click="openaddBox">
                                    <img src="@/../../static/image/adduser.png" alt="">
                </div>-->
            </div>
            <div class="m-t-right" @click="openUserInfoDetail" v-show="currCheckName">
                <div>
                    {{currCheckName}}
                    <span
                            v-if="teamMemberNum !='' && teamMemberNum !=0 && teamMemberNum !=undefined && teamMemberNum !=null"
                    >({{ teamMemberNum}})</span>
                </div>
                <p @click="menuShow=true" class="menuMore">
                    <img src="@/../../static/image/point.png">
                </p>
            </div>
        </div>
        <div class="message-container flexbetween" v-loading="loading">
            <keep-alive>
                <div class="left outer-container">
                    <div class="inner-container" ref="chatListTop">
                        <ul class="content">
                            <v-contextmenu ref="contextmenu1" class="contextmenu-left">
                                <v-contextmenu-item @click="deletemenu(deleteIdex)">删除</v-contextmenu-item>
                            </v-contextmenu>
                            <li
                                    v-for="(item,index) in sessionlist"
                                    :key="index"
                                    @click="handleClick(index)"
                                    v-contextmenu:contextmenu1
                                    @contextmenu="deleteIdex = item.id"
                            >
                                <div
                                        slot="label"
                                        class="m-title flexbetween"
                                        :class="{active: activeName == index}"
                                        @click="sendUserInfo(item,index)"
                                        @contextmenu="contextmenuShow(index,$event)"
                                >
                                    <div class="m-title-left flexbetween">
                                        <div class="t-l-img">
                                            <!-- userInfos[item.to].avatar @/../../static/image/touxiang.jpeg-->
                                            <img :src="item.avatar || defaultImg">
                                        </div>
                                        <div class="t-l-conter">
                                            <h5 style="height:30px;">{{item.alias ? item.alias:item.name}}</h5>
                                            <p v-if="!item.edtiorValue&&!item.notice">{{item.lastMsgShow}}</p>
                                            <p v-else>
                                                <span style="color:red">{{item.edtiorValue?'[草稿]':'[有人@我]'}}</span>
                                                {{(item.edtiorValue||'').replace(/<.+?>/g,'')||item.notice}}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="m-title-right">{{item.updateTimeShow}}</div>
                                </div>
                                <el-badge v-show="item.unread > 0" :value="item.unread" :max="99"
                                          class="badge"></el-badge>
                            </li>
                        </ul>
                    </div>
                </div>
            </keep-alive>
            <!-- 右侧好友消息  -->
            <keep-alive>
                <!-- 群聊的菜单 -->
                <div class="right" v-if="currSessionId">
                    <right-page
                            @addShow="addShow"
                            @changeIndex="changerouter"
                            v-model="menuShow"
                            v-if="menuShow"
                            :sessionId="sessionId"
                    ></right-page>
                    <split-pane
                            v-on:resize="resize"
                            :min-percent="20"
                            :default-percent="70"
                            split="horizontal"
                    >
                        <template slot="paneL">
                            <!-- 消息列表   :sessions="currsession"  :chatlist="chatlist"  :currsessionId="currsessionID"  -->
                            <chat-list
                                    type="session"
                                    :userInfos="userInfos"
                                    :myInfo="myInfo"
                                    :msglist="msglist"
                                    @msgs-loaded="msgsLoaded"
                                    @tell-more="msgSectionMore"
                                    @removeMsg="delMsg"
                                    @selMsg="selMsg"
                                    :msgdialogVisible="msgdialogVisible"
                            ></chat-list>
                        </template>
                        <!-- 输入框 -->
                        <template slot="paneR">
                            <!-- @changev ="changeEdtior"  草稿 -->
                            <chat-editor
                                    @changev="changeEdtior"
                                    @changeIndex="changerouter(applyInquiry)"
                                    @goTop="goTop"
                                    type="session"
                                    v-show="!msgSectionShow"
                                    ref="area"
                                    :scene="scene"
                                    :to="to"
                                    @openaddFriend="openadd"
                                    @sendcard="sendcard"
                                    @seller="inventory=true"
                            ></chat-editor>
                            <div class="forward-msg" v-show="msgSectionShow">
                                <i @click="selectShowCloce">
                                    <img src="@/../../static/image/del.png" alt>
                                </i>
                                <ul class="forward-msg-ul">
                                    <li @click="everyRetransmission">
                                        <div>
                                            <img src="@/../../static/image/zhuanfa.png" alt>
                                        </div>
                                        <p class="ul-text">转发</p>
                                    </li>
                                </ul>
                                <ul class="forward-msg-ul">
                                    <li @click="selectShowCloce">
                                        <div>
                                            <img src="@/../../static/image/quxiao.png" alt>
                                        </div>
                                        <p class="ul-text">取消</p>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </split-pane>
                </div>
                <div v-else class="nothing">
                    <img src="@/../../static/image/vinDefault.png" alt="">
                </div>
            </keep-alive>
        </div>
        <!-- 联系人详情组件已弃用，待删除-->
        <transition>
            <!-- <contact-detail :contactshowBox="contactshowBox"></contact-detail > -->
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
            <!-- 搜索出来的结果 -->
            <div class="res scrollbar" v-if="friendlist.length">
                <div class="search-result flexbetween" v-for="(list,index) in friendlist" :key="index">
                    <div class="flexbetween">
                        <div class="seach-icon">
                            <img :src="list.icon" alt="搜索头像">
                        </div>
                        <div class="nick">
                            <p>
                                {{list.name}}
                                <span>({{list.mobile}})</span>
                            </p>
                        </div>
                    </div>
                    <div class="clickSearch">
                        <el-button @click="addfriends(list)">添加好友</el-button>
                    </div>
                </div>
            </div>
            <div v-if="!friendlist.length" class="res">暂无数据</div>
        </div>
        <el-dialog :append-to-body="false" title="添加朋友" :visible.sync="addFridentdialogVisible" class="addFridentdialogVisible">
            <el-form :model="marker" size="mini">
                <el-form-item label>
                    <el-input
                            type="textarea"
                            placeholder="请输入验证信息，我是"
                            :autosize="{ minRows: 6, maxRows: 8}"
                            v-model="marker.ps"
                    ></el-input>
                </el-form-item>
                <el-form-item label>
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
            <el-dialog
                    :visible.sync="applyInquiry.show"
                    v-if="applyInquiry.show"
                    class="inquiry"
                    :append-to-body="false"
                    :modal="false"
                    width="240px"
                    height="474px"
                    center
            >
                <Inquiry
                        @openaddFriend="openadd"
                        v-model="applyInquiry.show"
                        :applyInquiry="applyInquiry"
                        @talkto="insertSession"
                        @shareCard="shareCard"
                        @changeIndex="applyInquiry.show=false"
                ></Inquiry>
            </el-dialog>
        </div>
        <el-dialog class="msg-select-dialog" :visible.sync="msgdialogVisible" :append-to-body="false" width="570px">
            <input placeholder="请输入" class="input-search" v-model="searchName">
            <div class="msg-select-div">
                <div class="center left scrollbar" id="connector">
                    <el-checkbox-group
                            class="checkGrop"
                            v-for="(item,index) in forwardList"
                            :key="index"
                            v-model="checkboxGroupmsg"
                            @change="msg_Forward(checkboxGroupmsg,item)"
                            size="small"
                    >
                        <label class="forwardUser">
                            <el-checkbox :label="item.id.substring(4) || item.account.substring(4)"
                                         border></el-checkbox>
                            <img :src="item.avatar" alt width="33" height="33">
                            <span class="name" v-if="item.name">{{item.name}}</span>
                            <span class="name" v-else>{{item.id}}</span>
                        </label>
                    </el-checkbox-group>
                </div>
                <div class="right scrollbar">
                    <h3>已选择了{{checkboxGroupmsg.length}}个联系人</h3>
                    <p v-if="checkboxGroupmsg.length==0">请选择联系人.......</p>
                    <p v-else>
            <span v-for="(item,i) in retransmissionlist" :key="i">
              <img :src="item.avatar" alt width="33" height="33">
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
        <div class="diaBox">
            <el-dialog
                    width="570px"
                    height="524px"
                    v-if="groupAdd"
                    :visible.sync="groupAdd"
                    :modal-append-to-body="false"
                    :append-to-body="false"
            >
                <group-add
                        @changeIndex="changerouter"
                        v-model="groupAdd"
                        :addType="addType"
                        :to="to"
                        :shareCardObj="shareCardObj"
                        @seller="seller=arguments[0]"
                ></group-add>
            </el-dialog>
        </div>
        <el-dialog
                width="900px"
                v-if="inventory"
                :visible.sync="inventory"
                :modal-append-to-body="false"
                :append-to-body="false"
                :center="true"
                custom-class="created-inventory">
            <h4 slot="title">生成配件清单</h4>
            <sendInventory v-model="inventory" :seller="seller" @chooseSeller="addType='seller';groupAdd=true"></sendInventory>
        </el-dialog>
    </div>
</template>
<script>
    import {loadSupport} from "@/api/im/user";
    import {backScene} from "@/api/im/baseMethod";
    import groupAdd from "./template/chattingGroupAdd";
    import rightPage from "./template/rightPage";
    import Bus from "@/utils/bus.js";
    import {setLocal, getLocal} from "@/utils/localstorage.js";
    import util from "@/utils";
    import ChatList from "./chatlist";
    import ContactDetail from "./template/contactDetail";
    import {mapGetters} from "vuex";
    import {loadUserPage} from "@/api/im/user.js";
    import ChatEditor from "@/components/Chat/ChatEditor.vue";
    import splitPane from "vue-splitpane";
    import Inquiry from "@/components/Chat/Inquiry";
    import {friendAndDialog} from "@/api/im/baseMethod.js";
    import {inputPaste, inputCopy} from "@/utils/copy.js";
    import sendInventory from './template/creatInventory'

    const {remote} = require("electron");
    const {Menu, MenuItem} = remote;
    export default {
        name: "Message",
        data() {
            return {
                //im清单生成使用
                seller:[],
                inventory:false,
                //群组添加显示控制
                defaultImg:"https://cdn.xindongpeixun.com/oss/20181017/d871a7d7268644b8b7f47d3a4fb8ad32.png",
                edtior: "",
                edtiorImg: "",
                groupAdd: false,
                menuShow: false,
                addType: "",
                //转发搜索关键字,
                input: "",
                searchName: "",
                value: "",
                //好友搜索输入值
                iptValue: "",
                //名片分享对象
                shareCardObj: null,
                // auto: null,
                //多选转发消息列表
                selMsgs: null,
                // 选择联系人
                checkboxGroupmsg: [],
                msgdialogVisible: false,
                // msgSectionShow: false,
                // 聊天记录
                unread: "",
                activeName: 0,
                currsession: {},
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
                everyContentMsg: null,
                deleteIdex: null
            };
        },
        components: {
            ChatList,
            ContactDetail,
            ChatEditor,
            splitPane,
            Inquiry,
            groupAdd,
            rightPage,
            sendInventory
        },
        methods: {
            shareCard(obj) {
                this.addType = "shareCard";
                this.groupAdd = true;
                this.shareCardObj = obj;
            },
            contextmenuShow(index, e) {
                if (index == this.activeName) {
                    e.stopPropagation();
                }
            },
            insertSession(param) {
                let flag = true;
                for (let i = 0; i < this.sessionlist.length; i++) {
                    if (this.sessionlist[i].id == param) {
                        flag = false;
                        this.activeName = i;
                        this.sendUserInfo(this.sessionlist[i], i);
                        return;
                    }
                }
                if (flag) {
                    let scene;
                    let userInfoId;
                    if (/^p2p-/.test(param)) {
                        userInfoId = param.replace(/^p2p-/, "");
                        scene = "p2p";
                    } else if (/^team-/.test(param)) {
                        scene = "team";
                        userInfoId = param.replace(/^team-/, "");
                    } else {
                        scene = "p2p";
                        userInfoId = param;
                        this.applyInquiry.show = false;
                        this.menuShow = false;
                    }
                    this.$store.dispatch("insert", {
                        scene: scene,
                        to: userInfoId,
                        done: () => {
                            this.sendUserInfo(this.sessionlist[0], 0);
                        }
                    });
                }
            },
            changeEdtior(obj) {
                if (obj.value !== undefined && obj.value.indexOf("placeImgs") != -1) {
                    this.edtior = obj.value.replace(/placeImgs/g, "[图片]");
                    this.edtiorImg = obj.old;
                } else {
                    this.edtior = obj.value;
                    this.edtiorImg = "";
                }
            },
            sendcard(obj) {
                this.groupAdd = obj.boo;
                this.addType = obj.type;
            },
            goTop() {
                let msgbox = document.getElementById("msgbox");
                msgbox.scrollTop = msgbox.scrollHeight;
                msgbox = null;
                this.handleClick(0);
                this.$refs.chatListTop.scrollTop = 0;
            },
            addShow(obj) {
                this.groupAdd = true;
                this.addType = obj.form;
            },
            changerouter(args) {
                this.handleClick(0);
                this.applyInquiry.show = false;
                this.$refs.chatListTop.scrollTop = 0;
                if (args) {
                    if (args.teamId == this.im.currSessionId.substring(5)) {
                        this.sendUserInfo(this.sessionlist[1])
                        return
                    }
                    if (args.teamId) {
                        this.insertSession('team-' + args.teamId)
                        return
                    }
                }
                args = args || this.applyInquiry || {data: this.im.currChatroomInfo};
                this.sessionlist.forEach((v, i) => {
                    if (v.to == args.data.account || v.to == args.data.teamId) {
                        this.sendUserInfo(v, 0);
                    }
                });
            },
            toJSON(e) {
                if (!e.content) {
                    return e;
                }
                if (typeof e.content.msgContent == "object") {
                    e.type = "custom";
                    e.content.msgContent = JSON.stringify(e.content.msgContent);
                    if (typeof e.content == "object") {
                        e.content = JSON.stringify(e.content);
                    }
                }
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
                    if (val.id == item.id) {
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
            // 关闭多选
            selectShowCloce() {
                // this.msgSectionShow = false;
                this.$store.commit("updateSelectBox", {
                    isShow: false
                });
                this.msgdialogVisible = this.msgdialogVisible == false ? null : false;
            },
            handleClick(ind) {
                this.sessionlist[ind].unread = 0;
                this.input = "";
                this.msgSectionShow = false;
                this.$nextTick(() => {
                    this.$refs.area.quill.focus();
                });
                this.activeName = ind;
                this.msgdialogVisible = this.msgdialogVisible == false ? null : false;
                this.$nextTick(()=>{
                    this.$refs.area.value =
                        this.sessionlist[ind].edtiorValue &&
                        this.sessionlist[ind].edtiorValue.indexOf("[图片]") == -1
                            ? this.sessionlist[ind].edtiorValue
                            : this.sessionlist[ind].edtiorImg;
                })
                this.sessionlist[ind].edtiorValue = "";
                this.sessionlist[ind].edtiorImg = "";
            },
            sendUserInfo(item) {
                // 如果有备注信息取备注，没有的话取默认
                this.$store.commit("setCurrSessionInfo", this.im.userInfos[(item.id + '').substring(4)] || item);
                if (item.id.indexOf("team") > -1) {
                    this.$store.dispatch("getChatGroup", {id: item.id});
                    this.$store.state.im.teamlist.forEach(val => {
                        if (val.teamId == item.to) {
                            this.$store.commit("setChatroomInfos", val);
                        }
                    });
                } else {
                    this.$store.commit("setTeamMembers", []);
                }
                this.value = "";
                this.sessionId = item.id;
                this.$store.dispatch("setCurrSession", item.id);
                this.contactshowBox.data = item;
                this.sessionName = item.name;
                Bus.$emit("sendmsgdata", this.msglist);
                Bus.$emit("clearRich", "");
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
            },
            openaddBox() {
                this.addType = "created";
                this.groupAdd = true;
            },
            closeBox() {
                this.addBox = false;
                this.searchfrineds = "";
                this.friendlist = [];
            },
            addfriends(item) {
                this.closeBox();
                this.searchfrineds = "";
                this.addFridentdialogVisible = true;
                this.marker.account = item.accid;
            },
            msgsLoaded() {
            },
            deletemenu(vm, event) {
                if (this.deleteIdex != this.im.currSessionId) {
                    this.$store.dispatch("deleteSession", this.deleteIdex);
                    this.deleteIdex = null;
                } else {
                    this.$message.warning("当前会话不可删除");
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
                if (this.im.currSessionId || data) {
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
                if (this.checkboxGroupmsg.length !== 0) {
                    if (this.everyContentMsg.constructor.name == "Object") {
                        this.toJSON(this.everyContentMsg);
                        this.retransmissionlist.forEach(item => {
                            if (item.account || item.id) {
                                this.$store.dispatch("forwardMsg", {
                                    scene: item.scene || backScene(item.id, 1),
                                    to: item.account || backScene(item.id, 0),
                                    msg: this.everyContentMsg
                                });
                            }
                        });
                    } else if (this.everyContentMsg.constructor.name == "Array") {
                        //循环联系人
                        this.retransmissionlist.forEach(item => {
                            //循环消息
                            this.everyContentMsg.forEach(e => {
                                this.toJSON(e);
                                this.$store.dispatch("forwardMsg", {
                                    scene: item.scene || backScene(item.id, 1),
                                    to: item.account || backScene(item.id, 0),
                                    msg: e
                                });
                            });
                        });
                    }
                    this.retransmissionlist = [];
                    this.checkboxGroupmsg = [];
                    this.everyContentMsg = "";
                    this.msgSectionShow = false;
                    this.$message.success("转发成功");
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
            }
        },
        computed: {
            ...mapGetters(["sessions", "msgs", "im"]),
            goToUnread() {
                return this.$store.state.user.dbclick;
            },
            setError() {
                return this.$store.state.im.error;
            },
            currCheckName() {
                if (this.im.currSessionInfo) {
                    return (
                        this.im.currSessionInfo.alias ||
                        this.im.currSessionInfo.name ||
                        this.im.currSessionInfo.nick ||
                        this.im.currSessionInfo.id
                    );
                } else return false;
            },
            sessionId: {
                get: function () {
                    if (this.currsessionID !== null || this.currsessionID !== undefined) {
                        return this.currsessionID;
                    } else {
                        return this.sessions[0].id;
                    }
                },
                set: function (newValue) {
                    this.currsessionID = newValue;
                }
            },
            currSessionId(){
                return this.$store.state.im.currSessionId;
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
                    return this.sessionId.indexOf("p2p") > -1 ? "p2p" : "team";
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
                let sessionlist = this.sessions;
                for (var i = 0; i < sessionlist.length; i++) {
                    if (sessionlist[i].id == this.im.currSessionId) {
                        this.activeName = i;
                        this.sessionId = sessionlist[i].id;
                    }
                }
                if (this.input != "") {
                    return sessionlist.filter(v => {
                        if (v.name) {
                            return v.name.indexOf(this.input) !== -1;
                        }
                    });
                }
                return sessionlist;
            },
            forwardList() {
                return friendAndDialog(this, util);
            },
            msglist() {
                return this.$store.state.im.currSessionMsgs;
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
                    if (this.$store.state.im.isShowSelectBox) {
                    }
                    return this.$store.state.im.isShowSelectBox;
                },
                set(val) {
                    this.$store.state.im.isShowSelectBox = val;
                }
            },
            getSupper(){
                //客服好像暂时没啥用；
                if(getLocal('supper')){
                    getLocal('supper')
                }else
                loadSupport().then(res => {
                    setLocal("supper", JSON.stringify(res.data.allAccId));
                });
            },
            teamMemberNum: {
                get() {
                    if (!this.im.currSessionInfo) return;
                    if (this.im.currSessionInfo.scene == "team") {
                        return this.im.currChatroomInfo.memberNum;
                    }
                },
                set() {
                }
            }
        },
        watch: {
            goToUnread() {
                for (let i = 0; i < this.sessionlist.length; i++) {
                    if (this.sessionlist[i].unread) {
                        this.$refs.chatListTop.scrollTop = 71 * i;
                        break;
                    }
                }
            },
            searchfrineds() {
                if (this.searchfrineds == "") {
                    this.friendlist = [];
                    this.friendlistBox = false;
                }
            },
            setError(val) {
                if (val) {
                    this.$message.error("聊天服务器连接失败，请重试");
                    this.$store.commit("setError", null);
                }
            },
            activeName(newval, oldval) {
                if (this.edtior !== "" && newval !== oldval && newval !== 0) {
                    this.sessionlist[oldval].edtiorValue = this.edtior;
                    this.sessionlist[oldval].edtiorImg = this.edtiorImg;
                    this.edtior = "";
                    this.edtiorImg = "";
                }
            }
        },
        created() {
            this.$store.commit('setLoading', true)
            window.oncontextmenu = null;
            const reg = /\d$/g;
            const param = this.$route.params.sessionId;
            if (!reg.test(param)) {
                if (this.sessions.length > 0) {
                    this.$store.commit("setCurrSessionInfo", null);
                }
            } else {
                this.sessionId = param;
                this.insertSession(param);
                this.$store.dispatch("setCurrSession", param);
                this.$store.commit("setCurrSessionInfo", this.sessionlist[0]);
            }
        },
        mounted() {
            this.sessionlist.forEach(val => {
                if (val) {
                    val.edtiorValue = "";
                    val.edtiorImg = "";
                }
            });
            Bus.$on("openimage", content => {
                let obj = {data: {}, show: false};
                // 判断是否多选，非多选状态下触发该事件
                if (!this.$store.state.im.isShowSelectBox) {
                    if (
                        content.from !== null ||
                        content.account ||
                        content.id.substring(4)
                    ) {
                        this.$store.dispatch("searchUsers", {
                            accounts: content.from || content.account || content.to,
                            done: users => {
                                // in   out send
                                obj.data.alias = users[0].alias;
                                obj.data.account = users[0].account;
                                obj.data.avatar = users[0].avatar;
                                obj.data.createTime = users[0].createTime;
                                obj.data.custom = users[0].custom;
                                obj.data.gender = users[0].gender;
                                obj.data.nick = users[0].nick;
                                obj.data.sign = users[0].sign;
                                obj.data.tel = users[0].tel;
                                obj.data.updateTime = users[0].updateTime;
                                obj.data.isFriend = users[0].isFriend;
                                obj.show = true;
                                obj.data.nickInTeam = content.nickInTeam;
                                this.applyInquiry = obj;
                            }
                        });
                        this.applyInquiry.show = true;
                    }
                }
            });
            Bus.$on(
                "openSendContactBox",
                function (content) {
                    let resultContent = null;
                    if (content) {
                        resultContent = content;
                    }
                    this.msgdialogVisible = true;
                    this.everyContentMsg = resultContent;
                    resultContent = null;
                }.bind(this)
            );
            this.$store.commit('setLoading', false)
        },
        beforeDestroy() {
            Bus.$off("openimage");
            Bus.$off("openSendContactBox");
            this.$store.dispatch("resetCurrSession");
            const menu = new Menu();
            let target = null;
            window.oncontextmenu = e => {
                e.preventDefault();
                target = e.target;
                menu.popup({window: remote.getCurrentWindow()});
            };
            menu.append(
                new MenuItem({
                    label: "复制",
                    click(...args) {
                        console.log(target.nodeName);
                        inputCopy(target);
                    }
                })
            );
            menu.append(
                new MenuItem({
                    label: "粘贴",
                    click($event) {
                        inputPaste(target);
                    }
                })
            );
        }
    };
</script>

<style scoped lang="scss">
    .outer-container,
    .content {
        user-select: none;
        width: 250px;
        height: calc(100vh - 98px);
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

    .m-t-left .m-t-left-input {
        width: 100%;
        img {
            position: absolute;
            right: 5px;
            top: 7px;
            cursor: pointer;
        }
    }

    .message {
        height: 100%;
        position: relative;
        .message-title {
            padding: 10px;
            display: flex;
            justify-content: space-between;
            position: relative;
            background: #fbfbfb;
            .m-t-left {
                width: 240px;
                height: 48px;
                display: flex;
                justify-content: space-between;
                align-items: center;
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
                .m-t-left-input {
                    position: relative;
                }
            }
            .m-t-right {
                width: calc(100% - 265px - 10px);
                text-align: center;
                line-height: 48px;
                cursor: pointer;
                position: relative;
                .menuMore {
                    width: 20px;
                }
                div {
                    width: 85%;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    margin: 0 auto;
                }
                p {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 50px;
                    img {
                        margin-top: 24px;
                    }
                }
            }
            .rightAvatar {
                position: absolute;
                right: 10px;
                top: 0px;
            }
        }
        .message-container {
            height: calc(100% - 68px);
            background: #fff;
            .left {
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
                                    font-size: 14px;
                                    line-height: 28px;
                                    color: #343232;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    width: 150px;
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
                            color: #ccc;
                            flex: 0 0 38px !important;
                            position: absolute;
                            right: 10px;
                        }
                    }
                }
            }
            .right {
                width: calc(100% - 250px);
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
                        text-align: center;
                        p {
                            width: 100%;
                        }
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
            z-index: 999;
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
                        border: 1px solid #ff6749 !important;
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
        .input-search {
            -webkit-appearance: none;
            background-color: #fff;
            background-image: none;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            color: #606266;
            display: inline-block;
            font-size: inherit;
            height: 40px;
            line-height: 40px;
            outline: 0;
            padding: 0 15px;
            margin-bottom: 10px;
            -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            width: 100%;
        }
        .addremarksbox {
            width: 450px;
            height: 240px;
            position: absolute;
            top: 30%;
            left: 30%;
            background-color: #e1e1e1;
            z-index: 999;
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
    .nothing{
        width: calc(100% - 250px);
        background: #f9f9f9 ;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
<style lang="scss">
    .inquiry .el-dialog__body {
        padding-top: 0px;
    }

    .inquiry .el-dialog__header {
        padding: 0;
    }

    .message {
        .el-dialog__wrapper{
            left: 180px;
        }
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
                    height: 300px;
                    overflow: auto;
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
                    height: 300px;
                    overflow: auto;
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

    .msg-select-div .el-checkbox-group:hover {
        background: #ccc;
        z-index: 222;
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
        z-index: 999;
    }

    .bg .el-dialog__body .el-input {
        width: 48%;
        display: block;
        margin-bottom: 5px;
        input {
            background: #fff;
        }
    }

    .forwardUser .el-checkbox__inner {
        width: 18px !important;
        height: 18px !important;
        border-radius: 50%;
    }

    .ul-text {
        width: 35px;
        text-align: center;
    }

    .forwardUser .el-checkbox__inner::after {
        left: 6px;
        top: 2px;
        height: 8px !important;
    }
</style>