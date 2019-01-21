<template>
  <div>
  <el-dialog  @open="getCarList" :visible.sync="applyInquiry.show" 
    class="inquiry" 
    :modal="false"
    width="240px" height="474px"  center>
    <div slot="title" class="title-user-img">
      <img v-if="markerData.avatar" :src="markerData.avatar" alt="图片加载失败">
      <img v-else src="@/../../static/image/DefaultUserIcon.png" alt="">
      <span>{{markerData.nick}}</span> 
    </div>
    <div class="center-user">
      <p v-if="applyInquiry.data.isFriend">备注名：
        <el-button type="text" v-if="!markShow" @click="markShow=true">{{mark}}</el-button>
        <el-input size="mini" v-if="markShow" @blur="setAlias(markerData)" v-model="markNameCard" @focus="getfocus"></el-input>
      </p>
      <p>身份：{{markerData.identityName}}</p>
      <p>所在地：{{markerData.province +"-"+ markerData.city}}</p> 
      <P>进驻时间：{{markerData.createTime |moment("YYYY-MM-DD")}}</P>
      <p>服务电话：{{markerData.tel}}</p>
    </div>
    <div class="bottom-user">
      <el-button type="primary" size="mini" v-if="!markerData.isFriend">加好友</el-button>
      <el-button type="primary" size="mini" v-else>进入店铺</el-button>
      <el-button type="primary" size="mini" v-model="isBlack" @click="joinBlack(markerData)">加入黑名单</el-button>
    </div>
  </el-dialog>
  </div>

</template>

<script>
export default {
  props: {
    applyInquiry: {
      type: Object,
      default: {
        show: false,
        data: {}
      }
    }
  },
  data() {
    return {
      mark: "点击添加备注",
      markShow: false,
      markerData: {},
      showMsg: "",
      markNameCard: "点击添加备注",
      isBlack: true
    };
  },
  methods: {
    getCarList() {
      this.applyInquiry.show = true;
      var account = this.applyInquiry.data.account;
      if (account !== undefined || account !== null) {
        if (this.$store.state.im.userInfos[account] !== undefined) {
          this.markerData.isFriend = this.$store.state.im.userInfos[
            account
          ].isFriend;
          if (this.$store.state.im.userInfos[account].isFriend === true) {
            this.markNameCard = this.$store.state.im.userInfos[account].alias;
            this.mark = this.$store.state.im.userInfos[account].alias;
            this.showMsg = "进入店铺";
          } else {
            this.showMsg = "加好友";
          }
        }
      }
      this.markerData.tel = this.applyInquiry.data.tel;
      this.markerData.account = this.applyInquiry.data.account;
      this.markerData.avatar = this.applyInquiry.data.avatar;
      this.markerData.createTime = this.applyInquiry.data.createTime;
      this.markerData.gender = this.applyInquiry.data.gender;
      this.markerData.nick = this.applyInquiry.data.nick;
      this.markerData.sign = this.applyInquiry.data.sign;
      this.markerData.updateTime = this.applyInquiry.data.updateTime;
      if (this.applyInquiry.data.custom !== undefined) {
        this.markerData.custom = JSON.parse(this.applyInquiry.data.custom);
        this.markerData.identityName = this.markerData.custom.identityName;
        this.markerData.province = this.markerData.custom.province;
        this.markerData.city = this.markerData.custom.city;
      }
    },
    setAlias(info) {
      this.markShow = false;
      if (this.markNameCard.length > 15) {
        this.$message.warning("备注长度不能超过15个字符");
        return;
      }
      this.$store.dispatch("updateFriend", {
        account: info.account,
        alias: this.markNameCard.replace(/\s+/g, "")
      });
    },
    getfocus() {
      this.markNameCard = "";
    },
    joinBlack(blackData) {
      if (blackData.account == undefined) {
        this.$message.error("当前未获取到联系人信息，请关闭窗口重试。");
        return false;
      }
      const userUID = this.$store.state.im.userUID;
      if (userUID == blackData.account) {
        this.$message.error("不能添加自己到黑名单");
        return false;
      }
      return;
      this.$store.dispatch("updateBlack", {
        account: blackData.account,
        isBlack: this.isBlack
      });
      this.$message.success("加入黑名单成功");
    }
  },
  beforeDestroy() {
    this.markerData = {};
  },
  mounted() {
    // console.log("userInfos", this.$store.state.im.userInfos);
  },
  created(){
    console.log(this.applyInquiry,"1111")
  }
};
</script>
<style lang='scss' scoped>
.inquiry {
  background: transparent !important;
  .title-user-img {
    img {
      width: 45px;
      height: 45px;
      vertical-align: middle;
    }
    span {
      display: inline-block;
      line-height: 45px;
    }
  }
  .center-user {
    padding: 0px 5px;
    p {
      padding: 5px 0px;
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
  }
}
</style>
<style>
.inquiry .el-dialog__body {
  padding-top: 0px;
}
</style>
