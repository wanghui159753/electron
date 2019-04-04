<template>
    <bg class="bindingBg">
        <div class="content">
            <h3>
                绑定支付密码
                <i class="el-icon-close" @click="$emit('close')"></i>
            </h3>
            <div class="form">
                <div>
                    <span>验证码</span>
                    <input placeholder="请输入验证码" type="number" :maxlength="6" v-model="code"/>
                    <el-button :loading="req" :disabled="isdisabled" @click.native="sendCode">{{showWord}}</el-button>
                </div>
                <div>
                    <span>密码</span>
                    <input type="password" placeholder="请输入密码" v-model="setPassword.p1" @blur="check" maxlength="6"/>
                </div>
                <div>
                    <span>再次输入密码</span>
                    <input type="password" v-model="setPassword.p2" @blur="check" placeholder="请输入再次输入密码"
                           maxlength="6"/>
                </div>
            </div>
            <div class="submit">
                <el-button type="primary" @click="sendReq">确定</el-button>
            </div>
        </div>
    </bg>
</template>
<script>
    import bg from '@/components/background.vue'
    import {bindingPasswordCode, bindingPassword} from "@/api/myorder/index";
    import {countdown} from '@/utils/countdown'
    import {setLocal} from "../../../utils/localstorage";

    export default {
        components: {bg},
        data() {
            return {
                code: '',
                showWord: '获取验证码',
                isdisabled: false,
                setPassword: {
                    p1: '',
                    p2: ''
                },
                req: false
            }
        },
        methods: {
            sendReq() {
                if (this.setPassword.p1 !== this.setPassword.p2) {
                    this.$message.error('两次密码不一致')
                    return
                } else if(!this.setPassword.p1||!this.setPassword.p2){
                    this.$message.error('密码不能为空')
                    return
                }else if(!this.code){
                    this.$message.error('验证码不能为空')
                    return
                }

                bindingPassword({
                    code: this.code,
                    payPassword: this.setPassword.p1
                }).then(res => {
                    this.$message.success('密码绑定成功')
                    setLocal('isSetPassword', true)
                    this.$emit('input', true)
                    this.$emit('close')
                })
            },
            check(e) {
                if (!e.target.value) return
                let flag = /\d/.test(e.target.value);
                if (!flag) {
                    this.$message.error('支付密码必须为数字')
                    e.target.value = '';
                }
            },
            sendCode() {
                this.req = true;
                bindingPasswordCode().then(res => {
                    this.$message.success('验证码已发送')
                    countdown(this, this.isdisable, 'showWord')
                    this.req = false;
                })
                    .catch(res => {
                        this.req = false;
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
                .el-button {
                    position: absolute;
                    right: 23px;
                    top: 20px;
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