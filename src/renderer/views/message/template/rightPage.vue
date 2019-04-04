<template>
  <div class="rightBg" @click="hidden">
    <div class="right scrollbar" v-if="this.sessionId.indexOf('team')>-1">
      <el-input placeholder="搜索群成员" v-model="serchGroupNumber">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <div class="groupOneShow" :class="{togoHeight:togo}">
        <div class="add" v-if="isowner">
          <img
            @click="teamAdd('team')"
            src="https://cdn.xindongpeixun.com/oss/20181018/55e4f17e3fff4c0fa0c56d627881c72a.png"
            width="43"
            alt
          >
        </div>
        <div class="del" v-if="isowner">
          <img
            @click="delTeamNumber"
            src="https://cdn.xindongpeixun.com/oss/20181018/e37c828f26c34304b39a35f9e03b470f.png"
            width="43"
            alt
          >
        </div>
        <div class="one" @click="showInfoBox(groupOne[0])" v-else>
          <img
            :src="groupOne[0].avatar||'https://cdn.xindongpeixun.com/oss/20181017/d871a7d7268644b8b7f47d3a4fb8ad32.png'"
            width="43"
            alt
          >
          <p>{{groupOne[0].nickInTeam||groupOne[0].nick||groupOne[0].id}}</p>
        </div>
        <div
          class="one"
          v-for="(item,x) in groupOne"
          :key="x"
          @click="showInfoBox(item)"
          v-if="isowner"
        >
          <img
            :src="item.avatar||'https://cdn.xindongpeixun.com/oss/20181017/d871a7d7268644b8b7f47d3a4fb8ad32.png'"
            width="43"
            alt
          >
          <p>{{item.nickInTeam||item.nick||item.id}}</p>
        </div>
      </div>
      <div class="more" @click="togo=!togo" v-if="(groupOne||[]).length>20">查看更多群成员
        <i :class="togo?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
      </div>
      <div class="set">
        <div class="groupName">
          <h6>群聊名称</h6>
          <p v-show="!groupName.show" @click="focuseInput(1)">
            <span>{{groupName.name||'暂无'}}</span>
            <img v-if="isowner" src="@/../../static/image/canWhite.png" align="top">
          </p>
          <el-input
            ref="input1"
            maxlength="20"
            v-model="groupName.name"
            v-show="groupName.show"
            @blur="send(groupName,1)"
          ></el-input>
        </div>
        <div class="groupNotice">
          <h6>群公告</h6>
          <p @click="Notice.show= !Notice.show">
            <span>{{Notice.name||'点击设置群公告'}}</span>
            <img v-if="isowner" src="@/../../static/image/canWhite.png" align="top">
          </p>
        </div>
        <div class="groupNickname">
          <h6>我在本群的昵称</h6>
          <p v-show="!myName.show" @click="focuseInput(3)">
            <span>{{myName.name||'暂无'}}</span>
            <img src="@/../../static/image/canWhite.png" align="top">
          </p>
          <el-input ref="input3" v-show="myName.show" v-model="myName.name" @blur="send(myName,3)"></el-input>
        </div>
        <div class="Disturb">
          <h6>消息免打扰</h6>
          <el-switch
            v-model="value2"
            active-color="#FC684F"
            @change="send(value2,4)"
            inactive-color="#ccc"
          ></el-switch>
        </div>
        <div class="zhuanrang" v-if="isowner">
          <h6 @click="attornTeam">群主管理权转让
            <i class="el-icon-arrow-right"></i>
          </h6>
        </div>
      </div>
      <div class="esc" @click="goOut">退出群聊</div>
    </div>
    <div v-if="sessionId.indexOf('p2p')>-1&&userInfo" class="right scrollbar">
      <div class="groupOneShow">
         <div class="add"><img @click="teamAdd('new')" src="https://cdn.xindongpeixun.com/oss/20181018/55e4f17e3fff4c0fa0c56d627881c72a.png" width="43" alt=""></div>
        <div class="one" @click="showInfoBox($store.state.im.currSessionInfo)">
          <img
            :src="userInfo.avatar||'https://cdn.xindongpeixun.com/oss/20181017/d871a7d7268644b8b7f47d3a4fb8ad32.png'"
            width="43"
            alt
          >
          <p>{{userInfo.nick||userInfo.id}}</p>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="Notice.show"
      v-if="Notice.show"
      width="340px"
      height="460px"
      custom-class="notice"
      @close="cancle"
      :rows="6"
    >
      <header>群公告</header>
      <footer>
        <div class="showArea">
          <p v-show="!Notice.input" @click="focuseInput(2)">{{Notice.name||'点击设置群公告'}}</p>
          <el-input
            ref="input2"
            maxlength="114"
            height="300px"
            type="textarea"
            v-show="Notice.input"
            v-model="Notice.name"
          ></el-input>
        </div>
        <div v-if="isowner" class="chane">
          <el-button @click="cancle">取消</el-button>
          <el-button @click.native="send(Notice,2)" :disabled="!Notice.show" type="primary">确定</el-button>
        </div>
        <div v-else>
          <span></span>
          只有群主才能更改
          <span></span>
        </div>
      </footer>
    </el-dialog>
  </div>
</template>
<script>
import Bus from "@/utils/bus.js";
import { AddChatroomAuthority } from "@/api/im/user";

export default {
  props: ["sessionId"],
  data() {
    return {
      value2: false,
      groupOne: [],
      groupName: { name: "", show: false },
      Notice: { name: "", show: false, input: false },
      myName: { name: "", show: false },
      teamNme: "",
      defaultName: "",
      serchGroupNumber: "",
      userInfo: null,
      togo: true
    };
  },
  watch: {
    value2(newd, oldn) {
      console.error(newd, oldn, "jiushizi ");
    },
    teamNme(val) {
      this.myName.name = val;
    },
    serchGroupNumber(val) {
      this.groupOne === val
        ? this.currentTeamNumber.filter(item =>
            item.nickInTeam
              ? item.nickInTeam.indexOf(val) > -1
              : item.nick.indexOf(val) > -1
          )
        : this.currentTeamNumber;
    },
    currentTeamNumber(val) {
      this.groupOne = val;
    }
  },
  computed: {
    currentTeam() {
      return this.$store.state.im.currChatroomInfo;
    },
    currentTeamNumber() {
      let arrOne = this.$store.state.im.currChatroomMembers;
      this.$store.state.im.teamMembers.forEach((v, i) => {
              arrOne[v.account]&&(v.joinTime = arrOne[v.account].joinTime);
      });
      let arrTwo = this.$store.state.im.teamMembers;
      arrTwo = arrTwo.sort(function(a, b) {
        return a.joinTime - b.joinTime;
      });
      for (let i = 0; i < arrTwo.length; i++) {
        if (this.$store.state.im.currChatroomInfo.owner == arrTwo[i].account) {
          let item = arrTwo[i];
          arrTwo.splice(i, 1);
          arrTwo.unshift(item);
        }
      }
      return arrTwo;
    },
    myId() {
      return this.$store.state.im.myInfo.account;
    },
    isowner() {
      if (this.$store.state.im.currChatroomMembers) {
        return (
          this.$store.state.im.currChatroomMembers[this.myId].type == "owner"
        );
      } else {
        return false;
      }
    }
  },
  methods: {
    focuseInput(n) {
      let str = "input";
      if (n == 3) {
        this.myName.show = !this.myName.show;
      } else if (n == 2) {
        this.Notice.input = this.isowner
          ? !this.Notice.input
          : this.Notice.input;
      } else {
        this.groupName.show = this.isowner
          ? !this.groupName.show
          : this.groupName.show;
      }

      str += n;

      this.$nextTick(() => {
        this.$refs[str].$el
          .querySelector(n == 2 ? "textarea" : "input")
          .focus();
      });
    },
    cancle() {
      this.Notice.show = false;
      this.Notice.input = false;
      this.Notice.name = this.currentTeam.announcement;
    },
    showInfoBox(val) {
      Bus.$emit("openimage", val);
    },
    //转让群主
    attornTeam() {
      this.$emit("addShow", {
        form: "attorn"
      });
    },
    //退出群聊
    goOut() {
      if (!this.isowner) {
        this.$store.dispatch("leaveTeam", {id:this.sessionId.substring(5)});
        this.$emit("input",false);
        this.$emit("changeIndex");
      }else if(this.currentTeamNumber.length==1&&this.isowner){
          this.$store.dispatch("dismissTeam", {id:this.sessionId.substring(5),done:function(obj) {
                  this.$emit("input", false);
                  this.$emit("changeIndex", obj);
              }.bind(this)})
      } else {
        this.$message.error("转让群之后才能退出噢");
      }
    },
    // 删除成员
    delTeamNumber() {
      this.$emit("addShow", {
        form: "delect"
      });
    },
    // 拉人进群
    teamAdd(val) {
      // AddChatroomAuthority().then(res => {
        // if (res.data.isCreateGroup == true) {
          this.$emit("addShow", {
            form: val
          });
        // }else{
        //     this.$message.error('你没有建群拉人权限')
        // }
         val == "new" ? this.$emit("input", false) : null;
      // })
    },
    getObj(n) {
      let obj = { id: this.currentTeam.teamId };
      console.error(obj, "---");
      switch (n) {
        case 1:
          obj.name = this.groupName.name;
          obj.isChange = !(this.groupName.name == this.currentTeam.name);
          break;
        case 2:
          obj.announcement = this.Notice.name;
          obj.isChange = !(this.Notice.name == this.currentTeam.announcement);
          break;
        case 3:
          obj.name = this.myName.name;
          obj.isChange = !(this.myName.name == this.teamNme);
          break;
        case 4:
          obj.mute = this.value2;
          obj.isChange = true;
          break;
        default:
          break;
      }
      return obj;
    },
    send(val, n) {
      let obj = this.getObj(n);
      val.show !== undefined ? (val.show = false) : null;
      if (!obj.isChange) {
        return false;
      }
      if (n == 2) {
        val.input = false;
      }
      if (n == 3) {
        console.log(obj.name);
        if (obj.name.trim() == "") {
          this.myName.name = this.defaultName;
          this.$message.error("备注名不能为空");
          return false;
        } else {
          this.$store.dispatch("setNick", obj);
        }
      } else if (n == 4) {
        this.$store.dispatch("setNick", obj);
      } else {
        if (!this.isowner) {
          this.$message.warning("你没有更改权限");
          return false;
        }
        this.$store.dispatch("upinfo", obj);
        this.$emit("changeIndex");
      }
    },
    hidden(e) {
      if (e.target.className == "rightBg") {
        this.$emit("input", false);
      }
    },
    initTeam() {
      this.groupOne = this.currentTeamNumber;
      this.groupName.name = this.currentTeam.name;
      this.Notice.name = this.currentTeam.announcement;
      this.teamNme = this.$store.state.im.currChatroomMembers[
        this.$store.state.im.myInfo.account
      ].nickInTeam;
      this.defaultName = this.teamNme;
      this.value2 =
        this.$store.state.im.muteList[this.currentTeam.teamId] == 1
          ? true
          : false;
    }
  },
  created() {
    // this.value2 = this.$store.state.im.currChatroomInfo.mute
    this.sessionId.indexOf("team") > -1 && this.initTeam();
    if (this.sessionId.indexOf("p2p") > -1) {
      this.userInfo = this.$store.state.im.userInfos[this.sessionId.substring(4)];
    }
  }
};
</script>
<style lang="scss" scoped>
.rightBg {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 500;
  font-size: 14px;
  .right {
    position: absolute;
    right: 0;
    top: 0;
    width: 280px;
    height: 100%;
    background: #fff;
    padding: 20px 20px 0 20px;
    overflow-y: auto;
    p {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .el-input {
    width: 244px;
    height: 30px;
    background: #f2f2f2;
    margin: 15px 0;
    .el-input__inner {
      height: 30px;
    }
  }
  .more {
    text-align: center;
    line-height: 45px;
    color: #999999;
    border-bottom: 1px solid #e6e6e6;
  }
  .groupOneShow {
    font-size: 12px;
    color: #333;
    padding: 10px 0;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    transition: all 1s;
    div {
      width: 43px;
      height: 55px;
      margin: 7px;
      p {
        margin-top: 2px;
      }
    }
    img {
      width: 43px;
      height: 43px;
    }
  }
  .togoHeight {
    max-height: 290px;
  }
  .set {
    div {
      h6 {
        color: #666;
        line-height: 28px;
        font-size: 14px;
        width: 100%;
      }
      p {
        line-height: normal;
        span {
          font-size: 16px;
          color: #999;
          display: block;
          max-width: 90%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          float: left;
        }
        img {
          display: none;
          vertical-align: super;
          height: 16px;
          float: left;
          margin-left: 5px;
        }
      }
    }
  }
  .esc {
    margin-top: 20px;
    background: #fff;
    text-align: center;
    color: #fc684f;
    line-height: 40px;
    border-top: 1px solid #e6e6e6;
  }
  .zhuanrang {
    height: 16px;
    color: #fff;
    margin: 10px 0 25px 6px;
    h6 {
      i {
        border-radius: 50%;
        background: #fc684f;
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 16px;
        color: #fff;
      }
    }
  }
  .chane {
    padding: 10px 0;
    width: 90%;
    margin: 0 auto;
    border-top: 1px solid #e0e0e0;
    padding-top: 10px;
    .el-button {
      width: 80px;
      height: 28px;
      padding: 0;
    }
  }
  footer {
    .showArea {
      word-break: break-all;
      height: 300px;
      .el-textarea {
        height: 300px;
      }
    }
    div {
      color: #b3b3b3;
    }
    span {
      display: inline-block;
      height: 1px;
      width: 26%;
      background: #e6e6e6;
      margin-bottom: 5px;
    }
  }
}

.set p:hover img {
  display: inline !important;
}
</style>
<style lang="scss">
.showArea .el-textarea__inner {
  height: 270px;
}

.notice {
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    text-align: center;
    padding: 0;
    header {
      padding: 0;
      margin: 0 20px;
      justify-content: center;
      border-bottom: 1px solid #ccc;
    }
    p {
      padding: 20px;
      text-align: left;
      text-indent: 15px;
    }
    .el-textarea {
      padding: 20px;
      textarea {
        resize: none;
      }
    }
    div {
      padding-bottom: 20px;
    }
  }
}

.set {
  div {
    .el-input {
      height: 30px !important;
      margin: 0 !important;
      .el-input__inner {
        height: 30px;
        background: #fff;
      }
    }
  }
}

.rightBg .right .el-input {
  height: 30px;
  .el-input__icon {
    line-height: 30px;
  }
  .el-input__inner {
    height: 30px;
  }
}
</style>
