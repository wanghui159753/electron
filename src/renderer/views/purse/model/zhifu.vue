<template>
    <bg class="zhifu_bg" @click="getFoucs">
        <div class="zhifu_con">
            <h3>
                提现
                <i class="el-icon-close" @click="$emit('close')"></i>
            </h3>
            <div class="zhifu_head" @click="$emit('reSetAlipay')">
                <img src="../../../../../static/image/zhifu.png">
                <div class="zhifu_account">
                    <p class="account_num">支付宝账号 {{drawAlipay}}</p>
                    <p>
                        <span>2小时到账单笔限额5万元</span>
                    </p>
                </div>
                <span class="el-icon-arrow-right"></span>
            </div>
            <div class="zhifu_body">
                <p>提现金额</p>
                <p>
                    <el-input placeholder="请输入金额" :clearable="true" v-model="amount" :autofocus='true' type="number">
                        <span slot="prefix">￥</span>
                    </el-input>
                </p>
            </div>
            <div class="zhifu_footer zhifu_body">
                <p>可提现金额</p>
                <p>
                    <span class="withdraw">￥{{balanceAmount|exNum}}</span>
                    <el-button @click.stop="withdraw($event,balanceAmount)">全部提现</el-button>
                </p>
            </div>
            <div class="zhifu_btn">
                <el-button type="primary" @click="withdraw">立即提现</el-button>
            </div>
        </div>
        <pass v-if="dialogVisible" :dialogVisible=dialogVisible @withdraw='colsePass' @getPass='getPass'
              ref='pass'></pass>
    </bg>
</template>
<script>
    import pass from "@/components/pay/passWord";
    import {applyBurse} from "@/api/myorder/index.js";
    import bg from '@/components/background.vue'

    export default {
        components: {pass, bg},
        props: ['drawAlipay', 'balanceAmount'],
        data() {
            return {
                dialogVisible: false,
                payPassword: '',
                amount: '',
                allDraw: false
            };
        },
        methods: {
            colsePass() {
                this.dialogVisible = !this.dialogVisible;
            },
            getFoucs() {
                this.$refs.pass && this.$refs.pass.initFoucs(this.payPassword.length == 0 ? 0 : this.payPassword.length - 1)
            },
            commitBurse() {
                this.$store.commit('setLoading', true)
                applyBurse({
                    amount: this.allDraw ? this.balanceAmount : this.amount * 100,
                    payPassword: this.payPassword
                }).then(res => {
                    this.$store.commit('setLoading', false)
                    this.$message.success('申请已提交')
                    this.dialogVisible = false;
                    this.$emit('close');
                    this.$emit('init')
                })
            },
            getPass(pass) {
                this.payPassword = pass;
                if (pass.length == 6) {
                    this.dialogVisible = false;
                    this.commitBurse()
                }
            },
            withdraw(event, balanceAmount) {
                this.allDraw = balanceAmount != undefined ? true : false;
                if (!(this.allDraw ? this.balanceAmount : this.amount)) {
                    this.$message.warning('请输入大于零的金额')
                } else {
                    this.dialogVisible = !this.dialogVisible;
                    return false;
                }
            },
        },
        mounted() {
        }
    };
</script>
<style lang="scss">
    .zhifu_bg {
        input[type=number]::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }
        .zhifu_con {
            width: 520px;
            background: #f7f7f7;
            height: 100%;
            position: absolute;
            right: 0;
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
            .zhifu_head {
                cursor: pointer;
                overflow: hidden;
                padding: 15px;
                position: relative;
                background: white;
                margin-bottom: 10px;
                > span {
                    position: absolute;
                    right: 18px;
                    top: 40%;
                    font-size: 18px;
                }
                img {
                    width: 80px;
                    height: 80px;
                    border-radius: 10px;
                }
                .zhifu_account {
                    display: inline-block;
                    position: absolute;
                    padding: 15px 20px;
                    top: 15px;
                    bottom: 0;
                    margin: auto;
                    .account_num {
                        line-height: 30px;
                    }
                    span {
                        color: #666;
                        font-size: 12px;
                    }
                }
            }
            .zhifu_body {
                background: white;
                padding: 20px 15px;
                p:nth-of-type(1) {
                    padding-right: 25px;
                    line-height: 38px;
                    width: 90px;
                    flex: none;
                }
                p:nth-of-type(2) {
                    flex: 1;
                }
                p {
                    display: inline-block;
                    font-weight: 900;
                    .el-input__inner {
                        border: 0;
                    }
                    .el-input__prefix {
                        line-height: 40px;
                        font-size: 20px;
                        color: black;
                    }
                }
            }
            .zhifu_footer {
                padding: 5px 0 5px 15px;
                border-top: 1px solid #e6e6e6;
                display: flex;
                flex: 1;
                p {
                    color: #999;
                    font-size: 13px;
                    .withdraw {
                        display: inline-block;
                        width: 310px;
                        line-height: 38px;
                        padding-left: 15px;
                        border-right: 1px solid #e6e6e6;
                    }
                }
                .el-button {
                    border: 0;
                    color: #fc684f;
                }
            }
            .zhifu_btn {
                width: 100%;
                height: 500px;
                position: relative;
                button {
                    position: absolute;
                    left: 0;
                    top: 25%;
                    right: 0;
                    margin: auto;
                    width: 260px;
                    height: 40px;
                }
            }
        }
    }
</style>