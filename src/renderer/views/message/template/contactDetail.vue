<template>
    <el-dialog :title="contactshowBox.data&&contactshowBox.data.lastMsg&&contactshowBox.data.lastMsg.fromNick?contactshowBox.data.lastMsg.fromNick:''" :visible.sync="contactshowBox.show" class="payment dialog" center>
        <div class="avatar">
            <div class="imgbox">
                <img src="@/../../static/image/logo.png" alt="">
            </div>
            <div class="contact-title">
                <h4>{{contactshowBox.data&&contactshowBox.data.lastMsg&&contactshowBox.data.lastMsg.fromNick?contactshowBox.data.lastMsg.fromNick:''}}</h4>
                <p>心动客服官方</p>
            </div>
        </div>
        <div class="desc">
            <h3>信息介绍</h3>
            <p>心动汽配官方平台，联系电话：110</p>
        </div>
    </el-dialog>
</template>

<script>
export default {
  name: "contactDetail",
  data() {
    return {
      contactData: {}
    };
  },
  props: {
    contactshowBox: {
      type: Object,
      default: {
        show: false,
        data: {}
      }
    },
    // contactBoxData: {
    //   type: Object,
    //   default: {}
    // }
  },
  // watch: {
  //   contactBoxData(newValue, oldValue) {
  //     this.contactData = newValue;
  //   }
  // }
};
</script>
<style lang="scss" scoped>
.message {
  .payment {
    .outer-container,
    .content {
      height: calc(100vh - 115px);
    }
    .avatar {
      width: 94%;
      margin: 0 auto;
      display: flex;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 10px;
      .imgbox {
        width: 80px;
        height: 80px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .contact-title {
        padding: 20px;
        h4 {
          font-size: 18px;
        }
        p {
          background-color: #1973bf;
          color: #fff;
          padding: 2px;
        }
      }
    }
    .desc {
      padding: 10px;
      p {
        padding-top: 20px;
      }
    }
  }
}
</style>
