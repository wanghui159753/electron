<template>
  <div>
        <div id="qrcode"></div>
  </div>
</template>
<script>
require("@/../../static/js/qrcode/qrcode.min.js");
import QRCode from "qrcodejs2";
import { getCodeLogin } from "@/api/user/login.js";
export default {
  name: "QRcode",
  data() {
    return {
      url: "",
      sendData: ""
    };
  },
  methods: {
    qrcode() {
      var qrcode = new QRCode("qrcode", {
        text: this.url,
        width: 120,
        height: 120,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    },
    getcode() {
      getCodeLogin()
        .then(res => {
          this.url = res.data.url;
          this.qrcode();
          let str = decodeURIComponent(this.url).split("?")[1];
          let obj = JSON.parse(str);
          this.sendData = obj.param.str;
          this.$store.state.qrcode = this.sendData;
          this.$emit("input", this.sendData);
        })
        .catch(() => {
          this.getcode()
        });
    }
  },
  created() {
this.getcode()
  }
};
</script>
<style scopde>
#qrcode img {
  display: block;
  margin: 0 auto;
  border: 1px solid #f4f4f4;
  padding: 27px;
}
</style>
