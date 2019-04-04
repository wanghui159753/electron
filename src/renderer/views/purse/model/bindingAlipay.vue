<template>
    <bg class="bindingBg">
        <div class="content">
            <h3>
                绑定支付宝
                <i class="el-icon-close" @click="$emit('input',false)"></i>
            </h3>
            <div class="form">
                <div>
                    <span>支付宝账户</span>
                    <input v-model="form.drawAlipay" @blur="reg(0)" placeholder="请输入支付宝账号"></input>
                </div>
                <div>
                    <span>姓名</span>
                    <input v-model="form.drawAlipayRealName" @blur="reg(1)" placeholder="请输入支付宝对应姓名"></input>
                </div>
            </div>
            <div class="submit">
                <el-button @click="send" type="primary">确定</el-button>
            </div>
        </div>
        <pass v-if="passWord" :dialogVisible=passWord @withdraw='passWord=!passWord' @getPass='getPass'></pass>
    </bg>
</template>
<script>
    import pass from "@/components/pay/passWord"
    import bg from '@/components/background.vue'
    import {bindingAlipy} from "@/api/myorder/index";

    export default {
        components: {pass, bg},
        data() {
            return {
                form: {
                    drawAlipay: '',
                    drawAlipayRealName: '',
                    payPassword: ''
                },
                check: {
                    drawAlipay: true,
                    drawAlipayRealName: true
                },
                passWord: false
            }
        },
        methods: {
            getPass(val) {
                if (val.length == 6) {
                    this.form.payPassword = val;
                    this.passWord = false;
                    bindingAlipy(this.form)
                        .then(res => {
                            console.log(res)
                            this.$message.success('支付宝绑定成功')
                            this.$emit('input', false)
                            this.$emit('init')
                        })
                }

            },
            reg(i) {
                if (i) {
                    if (!(/^[\u4E00-\u9FA5]{2,4}$/.test(this.form.drawAlipayRealName))) {
                        this.check.drawAlipayRealName = false;
                        return
                    }
                    this.check.drawAlipayRealName = true;
                } else {
                    if (!/(^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$)|(^1[3|4|5|8]\d{9}$)/.test(this.form.drawAlipay)) {
                        this.check.drawAlipay = false
                        return
                    }
                    this.check.drawAlipay = true
                }
            },
            send() {
                if (this.form.drawAlipay && this.form.drawAlipayRealName && this.check.drawAlipay && this.check.drawAlipayRealName) {
                    this.passWord = true;
                } else {
                    !this.form.drawAlipay && this.$message.error('请输入支付宝账号')
                    !this.form.drawAlipayRealName && this.$message.error('请输入支付宝对应姓名')
                    !this.check.drawAlipay && this.$message.error('支付宝账号格式错误')
                    !this.check.drawAlipayRealName && this.$message.error('请输入正确的姓名')
                }
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
            > div {
                padding: 0 20px;
                height: 80px;
                margin-bottom: 10px;
                overflow: hidden;
                background: #fff;
                line-height: 80px;
                span {
                    float: left;
                    font-size: 18px;
                    font-weight: bold;
                    width: 130px;
                }
                input {
                    border: 0;
                    outline: 0;
                    float: left;
                    width: 250px;
                    height: 80px;
                }
            }
        }
    }
</style>