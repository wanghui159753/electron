<template>
  <div class="page selectMenu-list">
      <div class="msg-list" >
          <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-input
                    placeholder="请输入搜索条件"
                    class="syl"
                    v-model="filterText">
                  </el-input>
                <el-tree 
                  :data="data"
                  class="selectMenu"
                  node-key="id"
                  :filter-node-method="filterNode"
                  ref="tree2"
                  :expand-on-click-node="true"
                  @node-click="nodeClick"
                  default-expand-all
                  :highlight-current="true"
                >
                  <div class="tree-container" slot-scope="{ node, data }">
                    <div class="tree-left">
                      <div class="tree-left-img">
                        <img :src="data.avatar" alt="图片加载失败">
                      </div>
                      <div class="tree-left-title">
                        <p class="tree-left-title-one">{{data.alias}}</p>
                        <p class="tree-left-title-two">{{data.alias}}</p>
                        <p>{{data.sign?data.sign:"好友很懒，还没有添加签名"}}</p>
                      </div>
                    </div>
                    <div class="tree-right">
                      <p class="tree-right-num">{{data.friendsNum}}</p>
                    </div>
                  </div>
                </el-tree>
          </el-tabs>
      </div>
      <div class="wicket" v-if="currentCheckUserInfo.nick">
          <div class="friendsDetail">
                <div class="introduce">
                   <div class="introduction-title">
                     <p>{{currentCheckUserInfo.nick}}</p>
                      <span class="earnest">{{currentCheckUserInfo.custom.identityName.indexOf("心动认证")==0?"官方认证":"未认证"}}</span>
                   </div>
                   <div class="currentUserInfoAvatar" v-show="currentCheckUserInfo.avatar==''?'':currentCheckUserInfo.avatar">
                     <img :src="currentCheckUserInfo.avatar" alt="个人图像">
                   </div>
                </div>
                <div id="userInfoBox">
                  <p v-if="currentCheckUserInfo.sign">介绍：{{currentCheckUserInfo.sign}}</p>
                  <p v-else>介绍：好友很懒还未添加签名</p>
                  <!--currentCheckUserInfo.custom.identityName province -->
                  <p v-if="currentCheckUserInfo.custom">地区：{{currentCheckUserInfo.custom.province}}-{{currentCheckUserInfo.custom.city}}</p>
                  <p v-else>地区：暂无地区信息</p>
                  <p v-if="currentCheckUserInfo.custom">身份：{{currentCheckUserInfo.custom.identityName}}</p>
                  <p v-else>身份：普通汽配经销商</p>
                </div>
                 <div class="send-msg">
                    <el-button type="success" class="chatInfo" @click="sendMessage(currentCheckUserInfo.account,currentCheckUserInfo)">发消息</el-button>
                    <el-button type="success" class="chatInfo" @click="enter">进入店铺</el-button>
                    <el-button type="success" class="chatInfo" @click="remarks">添加备注</el-button>
                 </div>
          </div>
      </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { onUpdateSession } from "@/store/modules/im/mutations/index.js";
export default {
  name: "im",
  data() {
    return {
      timer: null,
      num: 0,
      data: [
        {
          id: 1,
          alias: "官方客服",
          friendsNum: "",
          children: [
            {
              id: 5,
              alias: "客服007",
              isFriend: true,
              avatar: "@/../../static/image/avatar.png",
              birth: "",
              gender: "",
              sign: "",
              tel: "15858199806",
              updateTime: new Date().getTime(),
              valid: ""
            }
          ]
        },
        {
          id: 2,
          alias: "通讯录好友",
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
      currentNickname: "",
      currentCheckUserInfo: {}
    };
  },
  methods: {
    enter() {
      console.log(this.data[1]);
      this.$router.push(
        "/accessories/details/" + this.currentCheckUserInfo.custom.autoSellerId
      );
    },
    remarks() {
      this.$prompt("请输入备注", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /.{1,15}/,
        inputErrorMessage: "最少1个字符,最多15个字符",
        inputPlaceholder: this.currentCheckUserInfo.name
      }).then(res => {
        this.$store.dispatch("updateFriend", {
          account: this.currentCheckUserInfo.account,
          alias: res.value.replace(/\s+/g, "")
        });
        this.currentCheckUserInfo.alias = res.value;
        this.data[1].children.map((item, index) => {
          return item.account == this.currentCheckUserInfo
            ? this.currentCheckUserInfo
            : item;
        });
      });
      console.log(this.currentCheckUserInfo.custom);
    },
    handleClick() {},
    filterNode(value, data) {
      if (!value) return true;
      if (data.alias) {
        // nick过滤
        return data.alias.indexOf(value) !== -1;
      }
    },
    nodeClick(node, data) {
      // friendslist
      // console.log("friendslist", this.friendslist);
      // 当前点击的好友所有信息
      const userInfo = data.data;
      if (userInfo.account) {
        this.$store.dispatch("searchUsers", {
          accounts: userInfo.account,
          done: userAddressinfo => {
            if (userAddressinfo[0]) {
              if (data.level !== 1) {
                this.currentCheckUserInfo = userInfo;
                this.currentCheckUserInfo.custom = JSON.parse(
                  userAddressinfo[0].custom
                );
              } else {
                return;
              }
            }
          }
        });
      }
    },
    sendMessage(userID, session) {
      if (
        this.currentCheckUserInfo.nick == "" ||
        this.currentCheckUserInfo.nick == undefined ||
        this.currentCheckUserInfo.nick == null
      ) {
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
    isThereValue() {
      if (this.currentNickname == "" || this.currentNickname == undefined) {
        this.currentNickname = "心动客服官方";
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
      // console.log(this.userInfos);
      // const listlength = that.data.length - 1;
      // var arry = [];
      // for (const key in that.userInfos) {
      //   arry.push({
      //     account: that.userInfos[key].account,
      //     avatar: that.userInfos[key].avatar
      //       ? that.userInfos[key].avatar
      //       : "http://yx-web.nos.netease.com/webdoc/h5/im/default-icon.png",
      //     nick: that.userInfos[key].nick,
      //     birth: that.userInfos[key].birth,
      //     email: that.userInfos[key].email,
      //     gender: that.userInfos[key].gender,
      //     isFriend: that.userInfos[key].isFriend,
      //     nick: that.userInfos[key].nick,
      //     sign: that.userInfos[key].sign,
      //     tel: that.userInfos[key].tel,
      //     updateTime: that.userInfos[key].updateTime,
      //     valid: that.userInfos[key].valid
      //   });
      // }
      // that.friendsNum = arry.length;
      // that.data[1].children = arry;
      // console.log(this.data);
      // console.log(arry, "arry");
      // that.data[1].children = that.friendslist.concat(arry);
    },
    conformity() {
      var arry = [];
      var that = this;
      console.log(that.im.userInfos);
      let friendNum = Object.keys(that.im.userInfos).length;
      for (const key in that.im.userInfos) {
        arry.push({
          account: that.im.userInfos[key].account,
          alias: that.im.userInfos[key].alias,
          avatar: that.im.userInfos[key].avatar
            ? that.im.userInfos[key].avatar
            : "http://yx-web.nos.netease.com/webdoc/h5/im/default-icon.png",
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
      // that.friendsNum = arry.length;
      this.data[1].children = arry.filter(item => item.isFriend);
      this.data[0].friendsNum = this.data[0].children.length;
      this.data[1].friendsNum = arry.length;
    }
  },
  computed: {
    ...mapGetters(["im"]),
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
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  created() {
    // console.log(this.userInfos,this.im)
    // this.timer = setInterval(() => {
    //   this.addCustomFriends();
    //   if (JSON.stringify(this.userInfos) != {}) {
    //     window.clearInterval(this.timer);
    //     this.conformity();
    //   }
    // }, 400);
    console.log(this.im);
    this.addCustomFriends();
    this.conformity();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$BorderE0: 1px solid #e0e0e0;
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
  height: 100vh;
  width: 100%;
  justify-content: space-between;
  .tree-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    .tree-right {
      p {
        font-size: 12px;
        color: #524f4e;
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
        width: 48px;
        height: 48px;
        img {
          width: 100%;
          height: 100%;
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
          padding: 5px 0;
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
    width: 282px;
    background: #fff;
  }
  .wicket {
    width: 80%;
    height: 100%;
    .friendsDetail {
      width: 372px;
      height: 300px;
      position: relative;
      left: 25%;
      top: 25%;
      p {
        padding-bottom: 13px;
      }
      .introduce {
        display: flex;
        justify-content: space-between;
        padding-bottom: 13px;
        border-bottom: 1px solid #e8e8e8;
        .introduction-title {
          position: relative;
          .earnest {
            background-color: #ff6749;
            color: #fff;
            padding: 2px;
            font-size: 14px;
            border-radius: 4px;
            width: 36px;
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
.el-tree-node__content {
  border-bottom: 1px solid #e0e0e0;
}
.selectMenu-list {
  .el-tree-node .el-tree-node__content {
    font-size: 18px;
    padding-left: 0 !important;
    .tree-left-img {
      display: none;
    }
    .tree-left-title {
      p {
        display: none;
        font-size: 18px;
      }
      .tree-left-title-one {
        display: block;
        font-size: 15px !important;
      }
      .tree-left-title-two {
        display: none;
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
}
.syl input {
  width: 260px;
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
