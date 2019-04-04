<template>
    <div id="code">
        <p>点击刷新</p>
    </div>
</template>
<script>
    import QRCode from "qrcodejs2";

    export default {
        props: ['pay_url'],
        watch: {
            pay_url(val) {
                this.qrcode.clear();
                this.qrcode.makeCode(val);
                document.querySelector('#code').setAttribute('title', '');
            }
        },
        data() {
            return {
                qrcode: null
            }
        },
        methods: {
            init() {
                this.qrcode = new QRCode("code", {
                    text: this.pay_url,
                    title: '',
                    width: 160,
                    height: 160,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
                document.querySelector('#code').setAttribute('title', '')
            }
        },
        mounted() {
            this.init();
        }
    }
</script>
<style lang="scss" scoped>
    #code {
        width: 161px;
        height: 161px;
        margin: 0 auto;
        margin-top: 20px;
        position: relative;
        overflow: hidden;
        p {
            background: #fff;
            position: absolute;
            bottom: -30px;
            left: 0;
            right: 0;
            text-align: center;
            line-height: 30px;
            transition: all .2s;
        }

    }
    #code:hover p{
        bottom: 0;
    }
</style>