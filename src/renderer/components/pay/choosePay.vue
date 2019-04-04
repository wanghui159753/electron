<template>
    <div class="pay">
        <p>订单编号：{{del.tradeNo}}</p>
        <p>应付金额：<span>￥{{del.totalAmount|exNum}}</span></p>
        <div class="payChoose">
            <el-radio-group v-model="payType" @change="chagePay">
                <el-radio label="ALIPAY">
                    <img src="@/../../static/image/zhifu.png" width="30" alt="">
                    <span class="payName">支付宝支付</span>
                </el-radio>
                <el-radio v-model="payType" label="WECHAT">
                    <img src="@/../../static/image/WeChat1.png" width="30" alt="">
                    <span class="payName">微信支付</span>
                </el-radio>
                <el-radio v-model="payType" label="BALANCE" :disabled="disabled">
                    <img src="@/../../static/image/Balance.png" width="30" alt="">
                    <span class="payName">余额支付 <p class="balance">￥{{balance}} <span
                            v-show="disabled">余额不足</span></p></span>
                </el-radio>
            </el-radio-group>
        </div>
        <div class="payCode" @click="pay()">
            <div v-loading="req1">
                <paycode :pay_url="payType=='WECHAT'?pay_url.WECHAT:pay_url.ALIPAY"></paycode>
            </div>
            <p>打开{{payType=='ALIPAY'?'支付宝':'微信'}}扫码支付</p>
            <p v-if="num" class="timer">距离二维码过期还剩<span>{{num}}</span>秒</p>
            <p class="timer" v-else>二维码已过期，点击二维码刷新</p>
        </div>
        <password v-if="passWord" :dialogVisible=passWord @withdraw='passWord=!passWord' @getPass='getPass'></password>
    </div>
</template>
<script>
    import paycode from './payCode.vue'
    import {pay, payMore, balance} from "@/api/myorder/index";
    import {getLocal} from "@/utils/localstorage";
    import password from './passWord';

    export default {
        //more用于多订单提示
        props: ['del', 'address', 'more'],
        data() {
            return {
                payType: 'ALIPAY',
                pay_url: {
                    ALIPAY: '',
                    WECHAT: ''
                },
                req1: false,
                num: 60,
                timer: null,
                balance: 0.00,
                disabled: true,
                passWord: false,
                password: ''
            }
        },
        beforeDestroy() {
            clearInterval(this.timer);
        },
        methods: {
            chagePay(val) {
                this.num=60;
                clearInterval(this.timer);
                if (val == 'WECHAT' && !this.pay_url.WECHAT) {
                    this.pay()
                } else if (val == 'ALIPAY' && !this.pay_url.ALIPAY) {
                    this.pay()
                } else if (val == 'BALANCE') {
                    this.passWord = true;
                    this.req1 = true;
                } else {
                    this.req1=false;
                    this.timer = setInterval(this.countDown, 1000);
                }
            },
            countDown() {
                --this.num;
                if (this.num == 0) {
                    this.req1 = true;
                    clearInterval(this.timer);
                    this.$emit('stop');
                    this.pay_url = {
                        ALIPAY: '',
                        WECHAT: ''
                    }
                }
            },
            getBalance() {
                let setPassWord = getLocal('isSetPassword')
                balance().then(res => {
                    this.balance = (res.data.balanceAmount / 100).toFixed(2);
                    this.disabled = this.del.totalAmount > res.data.balanceAmount || !setPassWord;
                })
            },
            getPass(val) {
                if (val.length == 6) {
                    this.password = val;
                    this.passWord = false;
                    this.pay();
                }
            },
            pay() {
                this.req1 = true;
                let obj = {
                    "tradeNo": this.del.tradeNo,
                    clientType: 'PC',
                    payType: this.payType
                }
                obj = this.payType == 'BALANCE' ? Object.assign(obj, {payPassword: this.password}) : obj;
                let payMoney = this.more ? payMore : pay;
                payMoney(Object.assign(obj, {address: this.address})).then(res => {
                    clearInterval(this.timer);
                    this.timer = setInterval(this.countDown, 1000);
                    this.num = 60;
                    this.$emit('start')
                    if (res.data.code_url) {
                        this.pay_url.WECHAT = res.data.code_url;
                    } else {
                        this.pay_url.ALIPAY = res.data.qr_code;
                    }
                    this.req1 = false;
                }).catch(res => {
                    if (this.password) {
                        this.passWord = true;
                        this.$message.error(res.msg)
                    }
                })
            }
        },
        components: {
            paycode,
            password
        },
        created() {
            this.pay();
            this.getBalance();
        }
    }
</script>
<style lang="scss" scoped>
    .balance {
        color: #999999;
        margin-left: 21px;
        span {
            color: #FF0000;
        }
    }

    .pay {
        border: 0;
        font-size: 16px;
        > p {
            padding: 0 20px;
            line-height: 47px;
            span {
                font-size: 30px;
                color: #FC684F;
            }
        }
        .payChoose {
            padding: 0 46px 10px 46px;
            position: relative;
            border-bottom: 1px solid #E6E6E6;
            border-top: 1px solid #E6E6E6;
            .payName {
                line-height: 32px;
                display: flex;
            }
            .el-radio-group {
                display: block;
            }
            .el-radio {
                position: relative;
            }
        }
        .payCode {
            > p {
                text-align: center;
                font-size: 18px;
                color: #000;
                padding: 20px;
                font-weight: bold;
            }
            .timer {
                padding: 0;
                font-size: 14px;
                padding-bottom: 19px;
                span {
                    color: #FC684F;
                }
            }
        }
    }
</style>
<style lang="scss">
    .payChoose {
        .el-radio {
            height: 50px;
            display: block;
            .el-radio__input {
                position: absolute;
                right: 0;
                top: 20px;
                .el-radio__inner {
                    width: 18px;
                    height: 18px;
                }
            }
        }
        .el-radio + .el-radio {
            margin: 0;
        }
        .el-radio__label {
            font-size: 16px;
            display: flex;
            align-items: center;
            padding-top: 14px;
            img {
                margin-right: 5px;
            }
        }

    }
</style>