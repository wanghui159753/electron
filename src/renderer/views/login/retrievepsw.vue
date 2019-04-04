<template>
    <div class="retrievepsw container">
        <div class="logo">
            <div class="brand0">
                <el-button type="text" @click="$router.go(-1)">
                    <span class="el-icon-arrow-left">返回</span>
                </el-button>
            </div>
            <div class="brand2">
                <img src="@/../../static/image/brand2.png" width="224" height="52" alt="">
            </div>
        </div>
        <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="" prop="mobile">
                <div class="icon">
                    <img src="@/../../static/image/mobile.png" alt="">
                </div>
                <el-input v-model="form.mobile" placeholder="输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="" prop="code">
                <div class="icon">
                    <img src="@/../../static/image/code.png" alt="">
                </div>
                <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
                <div class="sendcode">
                    <el-button @click="sendIdentifying" type="primary" v-bind:disabled="isdisabled">{{sendText}}</el-button>
                </div>
            </el-form-item>
            <el-form-item label="" prop="password">
                <div class="icon">
                    <img src="@/../../static/image/psw.png" alt="">
                </div>
                <el-input :type="pwdType" v-model="form.password" placeholder="请输入6-12位数字加字母的新密码"></el-input>
                <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye"/></span>
            </el-form-item>
            <el-form-item>
                <div id="register">
                    <el-button class="register" @click="confirmsubmit">确定</el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {countdown} from "@/utils/countdown"; //验证码倒计时
    const request = require("@/api/user/accountMobile");

    export default {
        name: "generallogin",
        data() {
            return {
                form: {
                    mobile: "",
                    code: "",
                    password: ""
                },
                checked: "",
                sendText: "发送验证码",
                isdisabled: false,
                dialogVisible: false,
                pwdType: "password",
                loading: false,
                rules: {
                    mobile: [
                        {required: true, message: "请输入用户名", trigger: "blur"},
                        {
                            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
                            message: "请输入正确的手机号"
                        }
                    ],
                    password: [
                        {required: true, message: "请输入密码", trigger: "blur"},
                        {
                            pattern: /^[0-9a-zA-Z]{6,16}$/,
                            message: "请输入6-16位的数字和字母的密码"
                        }
                    ],
                    code: [
                        {required: true, message: "请输入验证码", trigger: "blur"},
                        {
                            pattern: /^\d{6}/,
                            message: "请输入6位数字的验证码"
                        }
                    ]
                }
            };
        },
        created(){
            this.$store.commit('setLoading',true)},
        mounted(){
            this.$store.commit('setLoading',false)},
        methods: {
            // 发送验证码方法
            sendIdentifying() {
                const that = this;
                if (this.form.mobile !== "") {
                    const params = {
                        mobile: this.form.mobile
                    };
                    request.retrieveSendCode(params).then(res => {
                        if (res.code == 200) {
                            this.$message.success("发送成功，请注意查收");
                            countdown(that, this.isdisabled, this.sendText);
                        }
                    });
                } else {
                    this.$message.warning("请输入相关信息后进行提交");
                    return;
                }
            },
            showPwd() {
                if (this.pwdType === "password") {
                    this.pwdType = "";
                } else {
                    this.pwdType = "password";
                }
            },
            confirmsubmit() {
                if (this.form.mobile == "" || this.form.code == "" || this.form.password == "") {
                    this.$message.warning("请输入相关信息后进行提交");
                    return;
                }
                this.loading = true;
                const data = {
                    mobile: this.form.mobile,
                    code: this.form.code,
                    newPassword: this.form.password
                };
                request
                    .subNewPsw(data)
                    .then(res => {
                        if (res.code == 200) {
                            this.loading = false;
                            this.$message.success("修改成功，页面即将进行跳转,请进行登录。");
                            this.$router.push("/login/generallogin");
                        }
                    })
                    .catch(err => {
                        this.loading = false;
                        console.log(err);
                    });
            }
        }
    };
</script>

<style scoped lang="scss">
    .container {
        width: 520px;
        height: 600px;
        margin: 70px auto;
        background-color: #fff;
        border-radius: 18px;
        box-shadow: 0px 9px 10px #d9d9d9;
        position: relative;
        .logo {
            width: 224px;
            margin: 0 auto !important;
            display: flex;
            justify-content: space-between;
            .brand0 {
                position: absolute;
                top: 27px;
                left: 27px;
                font-size: 14px;
                span {
                    display: block;
                    float: left;
                    height: 25px;
                    line-height: 24px;
                }
            }
            .brand2 {
                margin: 60px 0;
                position: relative;
            }
        }
    }

    .el-form {
        width: 80%;
        margin: 0 auto;
        .el-form-item {
            margin-bottom: 0;
            position: relative;
        }
        .icon {
            position: absolute;
            top: 13px;
            z-index: 9999;
            left: 8px;
        }
        .show-pwd {
            cursor: pointer;
            position: absolute;
            right: 10px;
            top: 10px;
        }
        .el-form-item {
            margin-bottom: 20px;
        }
    }

    .container:before {
        position: absolute;
        z-index: -1;
        left: 20px;
        bottom: 10px;
        width: 80%;
        height: 20px;
        content: "";
        transform: skew(-18deg) rotate(-3deg);
        -webkit-transform: skew(-18deg) rotate(-3deg);
        -moz-transform: skew(-18deg) rotate(-3deg);
        box-shadow: 0 20px 10px #d9d9d9;
    }

    .container:after {
        position: absolute;
        z-index: -2;
        right: 20px;
        bottom: 10px;
        width: 80%;
        height: 20px;
        content: "";
        transform: skew(18deg) rotate(3deg);
        -webkit-transform: skew(18deg) rotate(3deg);
        -moz-transform: skew(18deg) rotate(3deg);
        box-shadow: 0 20px 10px #d9d9d9;
    }

    #register .el-button {
        width: 100%;
        background: #FC684F;
        color: #fff;
        padding: 0;
        width: 440px;
        height: 56px;
        font-size: 18px;
    }
    #register{
        margin:60px 0
    }
    .sendcode .el-button {
        border: none;
        color: #fff;
        position: absolute;
        top: 10px;
        right: 10px;
        height: 36px;
    }
</style>
<style>
    .brand0 .el-icon-arrow-left::before{
        font-size: 20px;
        vertical-align: bottom;
    }
    .retrievepsw .el-input {
        height: 56px;
        font-size: 16px;
    }

    .retrievepsw .el-input .el-input__inner {
        padding-left: 30px !important;
        padding-right: 30px !important;
        height: 56px;
    }

    .retrievepsw .el-input.is-active .el-input__inner,
    .el-input__inner:focus {
        border: 1px solid #fa5110;
    }

    .agree {
        display: inline-block;
        color: #666;
        cursor: pointer;
    }

    .retrievepsw .el-checkbox__inner {
        border: 1px solid #fa5110;
    }

    .retrievepsw .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #fa5110;
        border-color: #fa5110;
    }

    .retrievepsw .el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #fa5110 !important;
    }

    .el-checkbox__input.is-checked .el-checkbox__label {
        color: #666;
    }

    .retrievepsw .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #fa5110;
    }
</style>