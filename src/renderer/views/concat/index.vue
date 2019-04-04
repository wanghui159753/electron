<template >
  <div class="page selectMenu-list" v-loading="loading">
    <div class="msg-list">
      <el-tabs v-model="activeName">
        <div class="m-t-left">
          <el-input placeholder="请输入搜索条件" class="syl" v-model="filterText"></el-input>
          <div class="m-t-left-img" @click="openaddBox">
            <img src="@/../../static/image/adduser.png">
          </div>
        </div>
        <el-tree
          :data="data"
          class="selectMenu"
          node-key="id"
          :filter-node-method="filterNode"
          ref="tree2"
          :expand-on-click-node="true"
          @node-click="nodeClick"
          :highlight-current="true"
          :default-expanded-keys="[3]"
        >
          <div class="tree-container" slot-scope="{ node, data }">
            <div class="tree-left">
              <div class="tree-left-img">
                <img :src="data.avatar || data.logo || defaultImg" alt>
              </div>
              <div class="tree-left-title">
                <p class="tree-left-title-one">{{data.alias || data.name}}</p>
              </div>
            </div>

            <div class="tree-right" v-if="data.alias == '新好友'">
              <el-badge v-show="unread > 0" :value="unread" :max="99" class="badge"></el-badge>
            </div>
          </div>
        </el-tree>
      </el-tabs>
    </div>
    <div
      class="nothing"
      v-if="!(teamMemberslist.show || sysMsglist.show || currentCheckUserInfo.show)"
    >
      <img src="@/../../static/image/vinDefault.png" width="300">
    </div>
    <div class="wicket" v-if="sysMsglist.show">
      <div class="n-con">
        <p>新朋友</p>
        <ul>
          <li v-for="(item,index) in sysMsglist.data" :key="index" class="tree-container">
            <div class="tree-left">
              <div class="tree-left-img">
                <img :src="item.fromIcon" @click="friendImg(item)">
              </div>
              <div class="tree-left-title">
                <p style="height:30px;">{{item.fromName}}</p>
                <p>{{item.message}}</p>
              </div>
            </div>
            <!-- v-if="item.state=='WAIT'" :disabled="item.accid == $store.state.im.myInfo.account"-->
            <p v-if="item.state=='WAIT'">
              <el-button
                type="warning"
                size="mini"
                @click="showCard(item)"
                :disabled="item.fromAccid == item.toAccid"
              >接受</el-button>
            </p>
            <p
              v-else
              style="color:#999;font-size:14px;line-height:50px;width:90px;height:50px;line-height:50px"
            >已添加</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="wicket" v-if="teamMemberslist.show">
      <p>群人数：{{teamMemberslist.data.length}}</p>
      <ul class="team_con scrollbar" >
        <li v-for="(item,index) in teamMemberslist.data" :key="index">
          <div>
            <img :src="item.avatar || defaultImg" @click="cImg(item)">
          </div>
          <p style="font-size:12px;" :title="item.nick">{{item.nick}}</p>
        </li>
      </ul>
      <div class="wicket">
        <el-button
          type="primary"
          size="medium"
          style="margin:auto;display:block"
          @click="teamMsg(teamMemberslist)"
        >发消息</el-button>
      </div>
    </div>
    <div class="wicket" v-if="currentCheckUserInfo.show" :key="Math.random()">
      <div class="friendsDetail">
        <div class="introduce">
          <div class="introduction-title">
            <p>{{currentCheckUserInfo.data.alias ? currentCheckUserInfo.data.alias:currentCheckUserInfo.data.nick}}</p>
            <span
              class="earnest"
            >{{currentCheckUserInfo.data.custom?currentCheckUserInfo.data.custom.identityName:"未认证"}}</span>
          </div>
          <div class="currentUserInfoAvatar">
            <img :src="currentCheckUserInfo.data.avatar">
          </div>
        </div>
        <div id="userInfoBox">
          <p
            v-if="currentCheckUserInfo.data.account"
          >介绍：{{currentCheckUserInfo.data.sign? currentCheckUserInfo.data.sign : '好友很懒还未添加签名'}}</p>
          <!--currentCheckUserInfo.data.custom.identityName province -->
          <p
            v-if="currentCheckUserInfo.data.custom"
          >地区：{{currentCheckUserInfo.data.custom.province}}-{{currentCheckUserInfo.data.custom.city}}</p>
          <p v-else>地区：暂无地区信息</p>
          <p
            v-if="currentCheckUserInfo.data.custom"
          >身份：{{currentCheckUserInfo.data.custom.identityName}}</p>
          <p v-else>身份：未认证用户</p>
        </div>
        <div class="send-msg">
          <el-button
            type="success"
            class="chatInfo"
            @click="sendMessage(currentCheckUserInfo.data.account || currentCheckUserInfo.data.accid,currentCheckUserInfo.data)"
          >发消息</el-button>
          <el-button
            type="success"
            class="chatInfo"
            @click="enter"
            v-if="currentCheckUserInfo.data.account"
          >进入店铺</el-button>
          <el-button
            type="success"
            class="chatInfo"
            @click="remarks"
            v-if="!currentCheckUserInfo.data.accid"
          >添加备注</el-button>
          <el-button
            type="success"
            class="chatInfo"
            @click="changeSupport"
            v-if="currentCheckUserInfo.data.accid"
          >切换客服</el-button>
          <el-button
            type="success"
            class="chatInfo"
            @click="applySupport(currentCheckUserInfo.data.accid)"
            v-if="currentCheckUserInfo.data.accid"
          >添加好友</el-button>
        </div>
      </div>
    </div>
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
        <el-input
          v-model="searchfrineds"
          :clearable="true"
          placeholder="请输入昵称或者手机号"
          @change="friendlist=[]"
          @keyup.enter.native="getSeachResult"
        ></el-input>
        <div class="searchBtn">
          <el-button @click="getSeachResult">搜索</el-button>
        </div>
      </div>
      <!-- 搜索出来的结果 -->
      <div class="res scrollbar" v-if="friendlist.length">
        <div class="search-result flexbetween" v-for="(list,index) in friendlist" :key="index">
          <div class="flexbetween">
            <div class="seach-icon">
              <img :src="list.icon">
            </div>
            <div class="nick">
              <p>
                {{list.name}}
                <span>({{list.mobile}})</span>
              </p>
            </div>
          </div>
          <div class="clickSearch">
            <el-button
              @click="addfriends(list)"
              :disabled="list.accid == $store.state.im.myInfo.account"
            >添加好友</el-button>
          </div>
        </div>
      </div>
      <div v-if="!friendlist.length" class="res">暂无数据</div>
    </div>
    <el-dialog title="添加朋友" :visible.sync="addFridentdialogVisible" class="addFridentdialogVisible">
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
        <el-button size="mini" type="primary" @click="confirmAddFriends()">确定添加</el-button>
        <el-button size="mini" type="primary" @click="addFridentdialogVisible = false">取消添加</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="applyInquiry.show"
      v-if="applyInquiry.show"
      class="inquiry"
      :modal="false"
      width="240px"
      height="474px"
      center
    >
      <div class="inquiry" >
        <div slot="title" class="title-user-img">
          <img :src="applyInquiry.data.avatar">
          <p>{{applyInquiry.data.nick || applyInquiry.data.name || applyInquiry.data.alias}}</p>
        </div>
        <div class="center-user">
          <p
            v-if="applyInquiry.data.ps"
          >验证信息：{{applyInquiry.data.ps ? applyInquiry.data.ps: "暂无验证信息"}}</p>
          <!--applyInquiry.custom.identityName province -->
          <p v-if="applyInquiry.data.ps">备注名：暂无备注名</p>
          <p v-if="applyInquiry.data.custom">身份：{{ applyInquiry.data.custom.identityName}}</p>
          <p v-else>身份：暂无身份说明</p>
          <p
            v-if="applyInquiry.data.custom"
          >所在地 ：{{applyInquiry.data.custom.province}}-{{applyInquiry.data.custom.city}}</p>
          <p v-else>所在地：暂无地区信息</p>
        </div>
        <div class="bottom-user">
          <p v-if="applyInquiry.data.ps">
            <el-button type="primary" size="mini" @click="addFriend(applyInquiry)">通过验证</el-button>
          </p>
          <p v-else>
            <el-button
              type="primary"
              size="mini"
              @click="addFridentdialogVisible=true"
              :disabled="applyInquiry.data.isFriend"
            >{{applyInquiry.data.isFriend?'已是好友':'加好友'}}</el-button>
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const request = require("@/api/im/friend");
import { mapGetters, Store } from "vuex";
import { setLocal, getLocal } from "@/utils/localstorage";
import Bus from "@/utils/bus.js";
import {
  onUpdateSession,
  updateTeamMembers
} from "@/store/modules/im/mutations/index.js";
import { loadUserPage, loadSupport, changeSupport } from "@/api/im/user.js";
import {
  loadfriendPage,
  deletefriend,
  sysfriend,
  confirmfriend
} from "@/api/im/friend.js";
import util from "@/utils";
import { throws } from "assert";
import { isArray } from "util";
export default {
  name: "im",
  inject: ["reload"],
  data() {
    return {
      loading: true,
      defaultImg:
        "https://cdn.xindongpeixun.com/oss/20181017/d871a7d7268644b8b7f47d3a4fb8ad32.png",
      fullscreenLoading: false,
      timer: null,
      supportList: [],
      num: 1,
      applyInquiry: {
        show: false,
        data: {}
      },
      data: [
        {
          id: 1,
          alias: "新好友",
          friendsNum: "",
          children: []
        },
        {
          id: 2,
          alias: "官方客服",
          friendsNum: "",
          children: []
        },
        {
          id: 4,
          alias: "心动群聊",
          friendsNum: "",
          children: []
        },
        {
          id: 3,
          alias: "我的好友",
          friendsNum: "",
          children: []
        }
      ],
      defaultProps: {
        children: "children",
        label: "alias"
      },
      activeName: "second",
      filterText: "",
      currentCheckUserInfo: {
        data: {},
        show: false
      },
      addBox: false,
      searchfrineds: "",
      friendlist: [],
      addFridentdialogVisible: false,
      marker: {},
      teamMemberslist: {
        show: false,
        data: []
      },
      sysMsglist: {
        data: [],
        show: false
      }
    };
  },
  methods: {
    applySupport(accid) {
      this.addFridentdialogVisible = true;
      this.marker.account = accid;
    },
    changeSupport() {
      changeSupport({ newSupportAccId: this.supportList[this.num ] }).then(
        req => {
          if (req.code == 200) {
            this.num = this.num == this.supportList.length - 1 ? 0 : ++this.num;
            this.getSupport(1);
          }
        }
      );
    },
    friendImg(item) {
      if (item.state == "CONFIRM") {
        this.sysMsglist.show = false;
        this.currentCheckUserInfo.show = true;
        this.getsyslist(item).then(req => {
          this.currentCheckUserInfo.data = req;
        });
        this.currentCheckUserInfo.data.nick = item.fromName;
      } else {
        this.$message.warning("请先同意申请后再进行聊天");
      }
    },
    cImg(item) {
      this.applyInquiry.show = true;
      this.applyInquiry.data = item;
      this.marker.account = item.account;
      console.log(this.applyInquiry.data);
    },
    teamMsg(val) {
      this.$router.push({
        path: `/message/index/team-${val.data[0].teamId}`
      });
    },
    addFriend(item) {
      let account = item.data.fromAccid
        ? item.data.fromAccid
        : item.data.account;
      confirmfriend({ fromAccid: account });
      this.$store.dispatch("addFriend", { account, ps: item.data.ps });
      this.$message.success("已同意好友申请");
      item.show = false;
      if (this.unread > 0) {
        this.unread = 0;
        this.$store.state.im.sysMsgs = [];
      }
      this.conformity();
      this.reload();
    },
    showCard(item) {
      this.getsyslist(item).then(req => {
        console.log(req, "26-/--/-/-/");
        this.applyInquiry.data = req;
        this.applyInquiry.show = true;
      });
    },
    confirmAddFriends() {
      //marker.ps为备注详情
      let params = {
        message: this.marker.ps,
        toAccid: this.marker.account
      };
      sysfriend(params).then(res => {
        this.$message.success("已发送申请");
        this.$store.dispatch("applyFriend", this.marker);
        this.marker = {};
        this.addFridentdialogVisible = false;
        this.applyInquiry.show = false;
      });
    },
    getSeachResult() {
      console.log(this.$store.state.im);
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
    openaddBox() {
      this.addBox = !this.addBox;
    },
    closeBox() {
      this.addBox = false;
      this.searchfrineds = "";
      this.friendlist = [];
    },
    enter() {
      if (
        this.currentCheckUserInfo.data.custom &&
        this.currentCheckUserInfo.data.custom.autoSellerId
      ) {
        this.$router.push(
          "/accessories/details/" +
            this.currentCheckUserInfo.data.custom.autoSellerId
        );
      } else this.$message.warning("此用户没有商铺");
    },
    addfriends(item) {
      this.closeBox();
      this.searchfrineds = "";
      this.addFridentdialogVisible = true;
      this.marker.account = item.accid;
    },
    remarks() {
      this.$prompt("请输入备注", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /.{1,15}/,
        inputErrorMessage: "最少1个字符,最多15个字符",
        inputPlaceholder: this.currentCheckUserInfo.data.name,
        inputValue: this.currentCheckUserInfo.data.alias
      }).then(res => {
        console.log(res);
        this.$store.dispatch("updateFriend", {
          account:
            this.currentCheckUserInfo.data.account ||
            this.currentCheckUserInfo.data.accid,
          alias: res.value.replace(/\s+/g, "")
        });
        this.currentCheckUserInfo.data.alias = res.value;
        this.data[3].children.forEach((item, index) => {
          item.account == this.currentCheckUserInfo.data.account
            ? this.currentCheckUserInfo.data
            : item;
        });
      });
    },
    handleClick(val) {},
    filterNode(value, data) {
      if (!value) return true;
      if (data.alias) {
        // nick过滤
        return data.alias.indexOf(value) !== -1;
      }
    },
    nodeClick(node, data) {
      let that = this;
      const userInfo = data.data;
      if (node.alias == "新好友") {
        this.teamMemberslist.show = false;
        this.sysMsglist.show = true;
        this.currentCheckUserInfo.show = false;
        this.unread = 0;
        this.$store.state.im.sysMsgs = [];
      } else if (userInfo.teamId) {
        let arr = null ;
        this.teamMemberslist.data = [];
        this.$store.dispatch("getTeamMembers", {
          teamId: userInfo.teamId,
          done: (res, req) => {
          arr = req.members;
          if (isArray(arr)) {
              arr.forEach((v, i) => {
                that.$store.dispatch("searchUsers", {
                  accounts: v.account,
                  done: user => {
                    v.isFriend = this.im.userInfos[v.account]
                      ? this.im.userInfos[v.account].isFriend
                      : "";
                    v.nick = user[0].nick;
                    v.avatar = user[0].avatar;
                    if (typeof user[0].custom == "string") {
                      v.custom = JSON.parse(user[0].custom);
                    } else {
                      v.custom = user[0].custom;
                    }
                  this.teamMemberslist.data.push(v)
                  }
                });
              });
              this.$nextTick(()=>{
                this.teamMemberslist.show = true;
                this.currentCheckUserInfo.show = false;
                this.sysMsglist.show = false;
              })
              
              }
          }
        });
          
      } else if (userInfo.account) {
        this.currentCheckUserInfo.show = true;
        this.teamMemberslist.show = false;
        this.sysMsglist.show = false;
        this.$store.dispatch("searchUsers", {
          accounts: userInfo.account,
          done: userAddressinfo => {
            if (userAddressinfo[0]) {
              if (data.level !== 1) {
                this.currentCheckUserInfo.data = userInfo;
                this.currentCheckUserInfo.data.custom = userAddressinfo[0]
                  .custom
                  ? JSON.parse(userAddressinfo[0].custom)
                  : "";
              } else {
                return;
              }
            }
          }
        });
      } else if (userInfo.accid) {
        this.currentCheckUserInfo.show = true;
        this.teamMemberslist.show = false;
        this.sysMsglist.show = false;
        this.currentCheckUserInfo.data = userInfo;
      }
    },
    sendMessage(userID, session) {
      if (userID == "" || userID == undefined || userID == null) {
        this.$message.warning("请先选择好友进行聊天。");
        return;
      } else {
        this.$router.push({
          path: `/message/index/p2p-${userID}`
        });
        const currsession = "p2p-" + userID;

        this.$store.dispatch("setCurrSession", currsession);
      }
    },
    addCustomFriends() {
      var that = this;
      var list = {};
      if (that.friendslist.length > 0) {
        var friend = that.friendslist;
        for (var item in that.im.userInfos) {
          for (var list in friend) {
            if (friend[list].account == that.im.userInfos[item].account) {
              that.im.userInfos[item].alias = friend[list].alias;
            }
          }
        }
      }
    },
    getMembers() {
      let that = this;
      this.im.teamlist.forEach((userInfo, index) => {
        userInfo.avatar =
          userInfo.avatar ||
          "https://cdn.xindongpeixun.com/oss/20181024/e3ec3b3166114bbcab92e064202ab0b5.png";
        
      });
    },
    getsyslist(item) {
      return new Promise((resolve, reject) => {
        this.$store.dispatch("searchUsers", {
          accounts: item.fromAccid,
          done: res => {
              console.log(res,'........')
            item.alias = item.fromName;
            item.account = item.fromAccid;
            item.avatar = item.fromIcon;
            item.createTime = item.createTime;
            item.gender = res[0].gender;
            item.nick = res[0].nick;
            item.sign = res[0].sign;
            item.tel = res[0].tel;
            item.ps = item.message;
            item.updateTime = item.updateTime;
            item.custom =
              typeof res[0].custom == "string"
                ? JSON.parse(res[0].custom)
                : res[0].custom;
            resolve(item);
          }
        });
      });
    },
    conformity() {
      return new Promise((resolve, reject) => {
        this.getMembers();
        var arry = [];
        var that = this;
        loadfriendPage().then(res => {
          res.data.records.map(v => {
            v.fromIcon =
              v.fromIcon ||
              "https://cdn.xindongpeixun.com/oss/20181017/d871a7d7268644b8b7f47d3a4fb8ad32.png";
          });
          this.sysMsglist.data = res.data.records.reverse();
        });
        let friendNum = Object.keys(that.im.userInfos).length;
        for (const key in that.im.userInfos) {
          arry.push({
            account: that.im.userInfos[key].account,
            alias: that.im.userInfos[key].alias,
            avatar:
              that.im.userInfos[key].avatar ||
              "https://cdn.xindongpeixun.com/oss/20181017/d871a7d7268644b8b7f47d3a4fb8ad32.png",
            nick: that.im.userInfos[key].nick,
            birth: that.im.userInfos[key].birth,
            email: that.im.userInfos[key].email,
            gender: that.im.userInfos[key].gender,
            isFriend: that.im.userInfos[key].isFriend,
            nick: that.im.userInfos[key].nick,
            sign: that.im.userInfos[key].sign,
            tel: that.im.userInfos[key].tel,
            updateTime: that.im.userInfos[key].updateTime,
            valid: that.im.userInfos[key].valid
          });
        }

        this.data[2].children = this.im.teamlist;
        this.data[2].children.forEach(v => {
          return (v.alias = v.name);
        });
        this.data[3].children = arry.filter(item => item.isFriend);
        resolve(this.data);
      });
    },
    getSupport(num) {
      loadSupport().then(req => {
        this.supportList = req.data.allAccId;
        let obj = {
          accid: req.data.userSupport.accid,
          alias: req.data.userSupport.name,
          avatar: req.data.userSupport.logo,
          custom: {
            identityName: req.data.userSupport.identityName,
            city: req.data.userSupport.city,
            province: req.data.userSupport.province
          }
        };
        this.data[1].children = [obj];
        num&&this.nodeClick({alias:'客服'},{data:obj})
      }).catch(()=>{});
    }
  },
  computed: {
    ...mapGetters(["im"]),
    unread: {
      get() {
        var sysmsg = 0;
        let arr = this.$store.state.im.sysMsgs.filter(v => {
          return v.type == "applyFriend";
        });
        if (arr.length > 0) {
          sysmsg += arr.length;
        }
        // console.log(this.$store.state.im.sysMsgUnread.applyFriend,"-*-*-**-*-*-*")
        return sysmsg;
      },
      set(a) {
        return a;
      }
    },
    passFriendApply: {
      get() {
        let passfriend = this.$store.state.im.sysMsgUnread.passFriendApply;

        return passfriend;
      },
      set(a) {
        return a;
      }
    },
    myuserUID() {
      return `${this.$store.state.im.userUID}`;
    },
    userInfos() {
      return this.im.userInfos;
    },
    friendslist() {
      // return this.im.friendslist;
      return this.im.friendslist.filter(item => {
        let account = item.account;
        let thisAttrs = this.im.userInfos[account];
        let alias = thisAttrs.alias ? thisAttrs.alias.trim() : "";
        item.alias = alias || thisAttrs.nick || account;
        if (!thisAttrs.isFriend || thisAttrs.isBlack) {
          return false;
        }
        return true;
      });
    },
    teamlist() {
      return this.im.teamlist;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
    unread() {
      loadfriendPage().then(res => {
        this.sysMsglist.data = res.data.records.reverse();
      });
    },
    passFriendApply() {
      this.data[3].children = this.im.userInfos.filter(item => item.isFriend);
    }
  },
  created() {
    this.getSupport();
    this.addCustomFriends();
    this.conformity().then(res=>{
      this.loading =false;
    });
  },
  beforeDestroy() {
    this.$off();
    Object.assign(this.$data, this.$options.data())
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$BorderE0: 1px solid #e0e0e0;

.team_con {
  width: 100%;
  height: 70%;
  margin: 40px;
  display: flex;
  flex-direction: row;
  flex-flow: wrap;

  li {
    list-style: none;
    float: left;
    width: 70px;
    height: 100px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #ccc;
    img {
      width: 50px;
      height: 50px;
      display: block;
    }
    p {
      width: 100%;
      height: 30px;
      line-height: 30px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.inquiry {
  padding-top: 20px;

  .title-user-img {
    text-align: center;
    position: relative;
    height: 61px;
    img {
      width: 45px;
      height: 45px;
      border-radius: 5px;
      vertical-align: middle;
      position: absolute;
      left: 25px;
    }
    p {
      position: absolute;
      left: 85px;
      top: 15px;
    }
  }
  .center-user {
    padding: 0px 5px;
    p {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 5px 10px;
      line-height: 28px;
    }
    .el-button--text {
      padding: 0px;
      color: #333;
    }
    .el-input {
      width: 54%;
    }
  }
  .bottom-user {
    text-align: center;
    padding-top: 20px;
    p {
      margin-bottom: 10px;
    }
    .el-button {
      width: 50%;
    }
  }
}
.n-con {
  padding: 20px;
  position: relative;
  p {
    text-align: center;
  }
  ul {
    width: 70%;
    position: absolute;
    left: 0;
    right: 0;
    li {
      margin-left: 100px;
      padding: 10px 0;
      list-style: none;
      border-bottom: 2px solid #e9e9e9;
      div {
        justify-content: none;
      }
    }
    .el-button {
      padding: 5px;
      display: block;
      background-color: #ff6749;
      height: 30px;
      width: 60px;
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
.m-t-left {
  width: 100%;
  height: 48px;
  padding-right: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .m-t-left-img {
    width: 30px;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
}
.el-tree-node__children {
  .tree-container {
    padding-left: 40px !important;
  }
}
.chatInfo {
  background-color: #ff6749;
  border-color: #ff6749;
}
.chatInfo:hover {
  opacity: 0.8;
}
.page {
  position: fixed;
  display: flex;
  height: 96.5vh;
  justify-content: space-between;
  border: 1px solid #f3f3f3;
  padding: 0;
  background: #f3f3f3;
  .nothing {
    width: 100%;
    background: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tree-container {
    display: flex;
    width: 100%;
    padding: 10px 12px;
    justify-content: space-between;
    margin-left: 31px;
    .tree-right {
      p {
        font-size: 12px;
        color: #524f4e;
        padding: 0;
      }
      .tree-right-date {
        line-height: 52px;
      }
      .tree-right-num {
        line-height: 20px;
      }
    }
    .tree-left {
      display: flex;
      justify-content: space-between;
      .tree-left-img {
        width: 50px;
        height: 50px;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        img {
          width: 50px;
          height: 50px;
          border-radius: 4px;
        }
      }
      .tree-left-title {
        padding: 0px 10px;
        h5 {
          font-size: 18px;
          color: #343232;
        }
        p {
          font-size: 12px;
          color: #888584;
          text-align: left;
        }
        .tree-left-title-two {
          padding-top: 10px;
        }
      }
    }
  }
  .tree-right-num {
    margin-right: 25px;
  }
  .msg-list {
    padding: 0 6px;
    // -webkit-app-region: drag;
    border-right: $BorderE0;
    flex:0 0 282px;
    background: #fff;
  }
  .wicket {
    flex:1;
    height: 100%;
    position: relative;
    background: #f3f3f3;
    > p {
      text-align: center;
      height: 60px;
      line-height: 60px;
      font-size: 20px;
    }
    .friendsDetail {
      width: 372px;
      height: 300px;
      position: relative;
      left: 25%;
      top: 25%;
      p {
        padding-bottom: 13px;
        text-align: left;
      }
      .introduce {
        display: flex;
        justify-content: space-between;
        padding-bottom: 13px;
        border-bottom: 1px solid #ccc;
        .introduction-title {
          position: relative;
          .earnest {
            background-color: #ff6749;
            color: #fff;
            padding: 2px;
            font-size: 14px;
            border-radius: 4px;
            width: 36px;
            span {
              text-align: left;
            }
          }
        }
        .currentUserInfoAvatar {
          width: 48px;
          height: 48px;
          padding-bottom: 2px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 4px;
          }
        }
      }
      .send-msg {
        margin-top: 12px;
        text-align: center;
      }
      #userInfoBox {
        p {
          padding: 8px 0;
        }
      }
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.selectMenu-list .el-tabs {
  height: 100%;
  width: 270px;
  .el-tabs__header {
    display: none;
  }
  .el-tabs__content {
    overflow-y: auto;
    top: 0;
    bottom: 0;
    position: absolute;
    width: 270px;
    height: calc(100vh - 30px);
  }
  .el-tabs__content::-webkit-scrollbar {
    width: 1px;
  }
}

.el-tree-node__content {
  border-bottom: 1px solid #e0e0e0;
  position: relative;
  overflow: hidden;
  .el-tree-node__expand-icon {
    position: absolute;
  }
  .el-tree-node__expand-icon:before {
    height: 40px;
    margin: auto;
    padding: 10px 0;
    display: inline-block;
  }
  .tree-container:before {
    content: url("../../../../static/image/icon4.png");
    position: absolute;
    top: 5px;
    left: 25px;
    padding-top: 4px;
  }
}
.el-tree
  > .el-tree-node
  > .el-tree-node__children
  .el-tree-node__content
  > .tree-container:before {
  content: "";
}
.el-tree
  > .el-tree-node
  > .el-tree-node__children
  .el-tree-node__content
  > .tree-container {
  padding-left: 10px !important;
}
.el-tree > .el-tree-node:nth-of-type(2) {
  .tree-container:before {
    content: url("../../../../static/image/icon1.png");
  }
}
.el-tree > .el-tree-node > .el-tree-node__content {
  .tree-container {
    padding-left: 66px;
  }
}

.el-tree > .el-tree-node > .el-tree-node__content {
  .tree-container:before {
    display: block !important;
  }
}
.el-tree > .el-tree-node:nth-of-type(3) {
  .tree-container:before {
    content: url("../../../../static/image/icon3.png");
  }
}
.el-tree > .el-tree-node:nth-of-type(4) {
  .tree-container:before {
    content: url("../../../../static/image/icon2.png");
  }
}
.selectMenu-list {
  .el-badge {
    padding-top: 16px;
  }
  .el-tree-node .el-tree-node__content {
    font-size: 18px;
    padding-left: 0 !important;
    .tree-left-img {
      display: none;
    }
    .tree-left-title {
      .tree-left-title-one {
        display: block;
        font-size: 15px !important;
        line-height: 48px;
        height: 48px;
        p {
          padding: 0 !important;
        }
      }
    }
    .tree-right-date {
      display: none;
    }
    .tree-right-num {
      display: block;
    }
  }
  .el-tree-node__children {
    .el-tree-node__content {
      .tree-left-img {
        display: inline-block;
      }
      .tree-left-title {
        p {
          display: block;
        }
      }
      .tree-right-date {
        display: block;
      }
      .tree-right-num {
        display: none;
      }
    }
  }
}
.selectMenu-list .el-tree-node__expand-icon.is-leaf {
  display: none;
}
.selectMenu-list .el-tree-node__content {
  height: auto;
}
.syl {
  text-align: center;
  margin-right: 10px;
}
.syl input {
  height: 30px;

  background: #dedede;
}
.el-tree-node > .el-tree-node__content {
  .tree-left-title-one {
    font-size: 18px !important;
  }
  .tree-right-num {
    font-size: 18px !important;
    line-height: 30px !important;
    color: #888584;
  }
  span {
    font-size: 18px;
  }
}
</style>
<style>
.inquiry .el-dialog__close {
  position: relative;
  z-index: 100;
}
</style>
