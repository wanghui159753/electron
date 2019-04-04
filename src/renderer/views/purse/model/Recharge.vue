<template>
    <bg class="bindingBg">
        <div class="content">
            <h3>
                充值
                <i class="el-icon-close" @click="$emit('input',false)"></i>
            </h3>
            <div class="form">
                <div class="num">
                    <span>充值金额</span>
                    <input placeholder="请输入充值金额" type="number" :maxlength="6" v-model="code"/>
                </div>
                <div class="payType">
                    <span>支付方式</span>
                    <label>
                        <input type="radio" v-model="payType" value="ALIPAY"/>
                        <span>支付宝</span>
                    </label>
                    <label>
                        <input type="radio" v-model="payType" value="WECHAT"/>
                        <span>微信</span>
                    </label>
                </div>
            </div>
            <div class="submit">
                <el-button type="primary" @click="sendReq">确定</el-button>
            </div>
        </div>
        <el-dialog
                width="350px"
                height="200px"
                :modal-append-to-body="false"
                v-if="codeShow"
                :visible.sync="codeShow"
                :center="true"
                @close="clear"
        >
            <template slot="title">扫码支付</template>
            <qrcode :pay_url="pay_url"></qrcode>
            <template slot="footer">打开{{payType=='WECHAT'?'微信':'支付宝'}}扫码支付</template>
        </el-dialog>
    </bg>
</template>
<script>
    import bg from '@/components/background.vue'
    import {recharge, rechargeL} from "@/api/myorder/index";
    import qrcode from "@/components/pay/payCode"

    export default {
        components: {bg, qrcode},
        data() {
            return {
                payType: "ALIPAY",
                codeShow: false,
                code: '',
                pay_url: '',
                timer: null
            }
        },
        methods: {
            clear(){
                clearInterval(this.timer)
            },
            polling() {
                rechargeL({tradeNo: this.tradeNo})
                    .then(res => {
                        if (res.data.status !== 'WAIT_PAY') {
                            clearInterval(this.timer)
                            this.$message.success('充值成功')
                            this.codeShow=false;
                            this.$emit('input',false)
                            this.$emit('init')
                        }
                    })
            },
            sendReq() {
                this.$store.commit('setLoading', true)
                recharge({
                    "amount": this.code * 100,
                    "clientType": "PC",
                    "payType": this.payType
                }).then(res => {
                    this.$store.commit('setLoading', false)
                    this.pay_url = res.data.qr_code || res.data.code_url;
                    this.tradeNo = res.data.tradeNo;
                    this.codeShow = true;
                    this.timer = setInterval(this.polling, 1000)
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .bindingBg {
        h3 {
            line-height: 60px;
            height: 60px;
            text-align: center;
            background: #e5e5e5;
            position: relative;
            i {
                position: absolute;
                right: 20px;
                font-size: 25px;
                top: 15px;
                color: #999;
                cursor: pointer;
            }
        }
        .content {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            background: #F7F7F7;
            width: 520px;
        }
        .submit {
            text-align: center;
            margin-top: 200px;
            .el-button {
                width: 260px;
                height: 44px;
                font-size: 16px;
            }
        }
        .form {
            .payType {
                label {
                    cursor: pointer;
                }
                input {
                    margin-top: 31px;
                    margin-right: 10px;
                }
            }
            > div {
                padding: 0 20px;
                height: 80px;
                margin-bottom: 10px;
                overflow: hidden;
                background: #fff;
                line-height: 80px;
                position: relative;
                span {
                    float: left;
                    font-size: 18px;
                    font-weight: bold;
                    width: 130px;
                }
                label {
                    display: inline-block;

                }
                input {
                    float: left;
                    width: 20px;
                    height: 20px;
                }
                input[type=number] {
                    border: 0;
                    outline: 0;
                    width: 250px;
                    height: 80px;
                }
            }
        }
    }
</style>