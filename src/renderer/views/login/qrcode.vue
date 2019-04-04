<template>
    <div v-loading="loading">
        <div id="qrcode"></div>
    </div>
</template>
<script>
    require("@/../../static/js/qrcode/qrcode.min.js");
    import QRCode from "qrcodejs2";
    import {getCodeLogin} from "@/api/user/login.js";

    export default {
        name: "QRcode",
        data() {
            return {
                url: "",
                sendData: "",
                code:null,
                loading:false
            };
        },
        methods: {
            qrcode() {
                if(this.code){
                    this.code.makeCode(this.url)
                }else{
                    this.code = new QRCode("qrcode", {
                        text: this.url,
                        title: '',
                        width: 150,
                        height: 150,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }
                document.querySelector('#qrcode').setAttribute('title','')
            },
            getcode() {
                this.loading=true;
                getCodeLogin()
                    .then(res => {
                        this.url = res.data.url;
                        this.qrcode();
                        let str = decodeURIComponent(this.url).split("?")[1];
                        let obj = JSON.parse(str);
                        this.sendData = obj.param.str;
                        this.$store.state.qrcode = this.sendData;
                        this.$emit("input", this.sendData);
                        this.loading=false;
                    })
            }
        },
        mounted() {
            this.getcode()
        }
    };
</script>
<style scopde>
    #qrcode {
        position: relative;
    }

    #qrcode img {
        display: block;
        margin: 0 auto;
        border: 1px solid #f4f4f4;
        position: absolute;
        margin-top: 20px;
        left: 0;
        right: 0;
        /* padding: 27px; */
    }
</style>
