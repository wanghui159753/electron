<template>
    <div class="accountlogin container">
        <div class="logo">
            <img src="@/../../static/image/brand2.png" width="224" height="52" alt>
        </div>
        <div class="togoLogin" @click="tabLogin">
            <div v-if="!togoLogin">
                <span>密码登陆</span>
                <img src="@/../../static/image/Computer.png" alt="">
            </div>
            <div v-else>
                <span>扫码登陆</span>
                <img src="@/../../static/image/qrcode.png" alt="">
            </div>
        </div>
        <transition name="el-fade-in">
            <div class="loginContent" v-show="togoLogin">
                <div class="tabs">
                    <p :class="{active:activeName=='first'}" @click="activeName='first'">账号密码登录</p>
                    <p :class="{active:activeName=='second'}" @click="activeName='second'">手机动态码登陆</p>
                </div>
                <el-form ref="form1" :model="form1" :rules="rules" v-show="activeName=='first'">
                    <el-form-item label="" prop="mobile">
                        <div class="icon">
                            <img src="@/../../static/image/user.png" alt>
                        </div>
                        <el-input v-model="form1.mobile" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="password">
                        <div class="icon">
                            <img src="@/../../static/image/psw.png" alt>
                        </div>
                        <el-input
                                :type="pwdType"
                                v-model="form1.password"
                                placeholder="请输入密码"
                                @keyup.enter.native="submitEntry('form1')"
                        ></el-input>
                        <span class="show-pwd" @click="showPwd">
                            <svg-icon icon-class="eye"/>
                          </span>
                    </el-form-item>
                    <el-form-item>
                        <div class="forgot">
                            <div>
                                <el-checkbox v-model="checked"></el-checkbox>
                                <div class="agree" @click="isRemempsw">下次自动登陆</div>
                            </div>
                            <div>
                                <router-link class="forgotpsw" to="/login/register">
                                    注册账号
                                </router-link>
                                <router-link class="forgotpsw" to="/login/retrievepsw">
                                    忘记密码
                                </router-link>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <div class="usernamelogin">
                            <el-button class="register" @click="submitEntry('form1')">登录</el-button>
                        </div>
                        <div class="xieyi">
                            登录即同意 <span>《心动配讯用户协议》</span>
                        </div>
                    </el-form-item>
                </el-form>

                <el-form ref="form2" :model="form2" :rules="rules2" v-show="activeName=='second'">
                    <el-form-item label="" prop="mobile">
                        <div class="icon">
                            <img src="@/../../static/image/mobile.png" alt>
                        </div>
                        <el-input v-model="form2.mobile" placeholder="输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="code">
                        <div class="icon">
                            <img src="@/../../static/image/code.png" alt>
                        </div>
                        <el-input v-model="form2.code" placeholder="请输入验证码"></el-input>
                        <div class="sendcode">
                            <el-button v-bind:disabled="isdisabled" type="primary" @click="sendCode">{{sendText}}
                            </el-button>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <div class="forgot">
                            <div></div>
                            <div>
                                <router-link class="forgotpsw" to="/login/register">
                                    注册账号
                                </router-link>
                                <router-link class="forgotpsw" to="/login/retrievepsw">
                                    忘记密码
                                </router-link>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <div class="usernamelogin">
                            <el-button class="register" @click="entry('form2')">登录</el-button>
                        </div>
                        <div class="xieyi">
                            登录即同意 <span>《心动配讯用户协议》</span>
                        </div>
                    </el-form-item>
                </el-form>

            </div>
        </transition>
        <transition name="el-fade-in">
            <div class="codeLogin" v-show="!togoLogin">
                <p class="tips">1秒即登录，方便又安全</p>
                <div class="marked">
                    <div class="qrcode" v-loading="loading">
                        <qrcode @input="strs" v-show="isReLoad" ref="mychild"></qrcode>
                        <img
                                src="@/../../static/image/markread.jpg"
                                v-show="!isReLoad"
                                class="sussesPic"
                        >
                    </div>
                    <img class="saoyisao" src="@/../../static/image/saoyisao.png" alt="">
                </div>
                <p @click="refresh" class="el-icon-refresh refresh">刷新二维码</p>
                <div class="footTip">
                    <span>心动配讯扫码登录，同步账户信息</span>
                    <span class="downLoad">下载心动配讯APP</span>
                </div>
                <div class="service">浙江心动网络科技 技术支持</div>
            </div>
        </transition>
    </div>
</template>
<script>
    const ipcRenderer = require("electron").ipcRenderer;
    const session = require("electron").remote.session;
    import {countdown} from "@/utils/countdown";
    import {RefreshToken} from "@/api/user/login";
    import {setLocal, getLocal, removeLocal} from "@/utils/localstorage.js";
    import {login, registerMobile, sendCode, polling} from "@/api/user/login";

    const request = require("@/api/user/accountMobile");
    import {imlogin} from "@/api/im/login.js";
    import qrcode from "./qrcode.vue";
    import {error} from "util";
    import {setTimeout} from "timers";

    export default {
        name: "accountlogin",
        data() {
            return {
                loading:false,
                num: 0,
                timer: null,
                togoLogin: false,
                form1: {
                    mobile: "",
                    password: ""
                },
                form2: {
                    mobile: "",
                    code: ""
                },
                isload: false,
                checked: true,
                activeName: "first",
                pwdType: "password",
                sendText: "发送验证码",
                isdisabled: false,
                isloading: false,
                entryState: 0,
                dialogFormVisible: false,
                //是否显示刷新验证码
                isReLoad: true,
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
                    ]
                },
                rules2: {
                    mobile: [
                        {required: true, message: "请输入用户名", trigger: "blur"},
                        {
                            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
                            message: "请输入正确的手机号"
                        }
                    ],
                    code: [
                        {required: true, message: "请输入验证码", trigger: "blur"},
                        {
                            pattern: /^\d{6}/,
                            message: "请输入6位数字的验证码"
                        }
                    ]
                },
                timeNum:0
            };
        },
        components: {
            qrcode: qrcode
        },
        beforeDestroy() {
            clearInterval(window.initTimer)
        },
        methods: {
            tabLogin(){
                this.timeNum=0;
                this.togoLogin=!this.togoLogin;
                console.log(this.togoLogin,'===')
                if(this.togoLogin){
                    clearInterval(window.initTimer)
                }else{
                    this.refresh()
                }
            },
            refresh() {
                this.loading=false;
                this.$refs.mychild.getcode();
                this.isReLoad = true;
                this.num = 0;
                this.timeNum=0;
            },
            polling(){
                clearInterval(window.initTimer)
                window.initTimer = setInterval(()=>{
                    this.isload?clearInterval(window.initTimer):this.sokit()
                }, 1000)
            },
            strs(i) {
                this.timer=i;
                this.polling()
            },
            sokit() {
                if(this.timeNum==300){
                    clearInterval(window.initTimer)
                    this.loading=true;
                    return
                }
                polling(this.timer).then(res => {
                    this.timeNum++;
                    if (res.data.status == "SCANNED") {
                        this.num++;
                        if (this.num == 1) {
                            this.$message.success("扫描成功，请在手机上确认");
                            this.isReLoad = false;
                            removeLocal("loginToken");
                            removeLocal("imuid");
                            removeLocal("imtoken");
                        }
                    }
                    if (res.data.token) {
                        setLocal("loginToken", res.data.token)
                        ;this.$store.state.user.token = res.data.token;
                        this.getIm();
                        this.isload = true;
                        this.$router.push("/message/index/:sessionId");
                    }
                }).catch(()=>{
                    clearInterval(window.initTimer)
                    this.loading=true;
                })
            },
            handleClick(tab, event) {
            },
            onDecode(content) {
                this.paused = true;
            },
            showPwd() {
                if (this.pwdType === "password") {
                    this.pwdType = "";
                } else {
                    this.pwdType = "password";
                }
            },
            // 普通的账号密码登录
            submitEntry(form1) {
                this.$refs[form1].validate(valid => {
                    if (valid) {
                        // this.$refs[form1].resetFields();
                        if (this.checked == true) {
                            this.entryState = 2;
                            console.log("当前是记住密码状态的登录");
                            this.sendRequest();
                        } else if (this.checked == "" || this.checked == undefined) {
                            this.entryState = 1;
                            console.log("说明当前是未记住密码状态的登录");
                            this.sendRequest();
                        } else {
                            console.log("12345678");
                        }
                    } else {
                        return;
                    }
                });
            },
            setCookies(token) {
                session.defaultSession.cookies.set(
                    {
                        url: "https://xdpx.zjxdpx.com",
                        name: "token",
                        expirationDate: new Date().getTime() + 60 * 60 * 24 * 7*1000,
                        value: token
                    },
                    function (params) {
                        if (params) {
                            setTimeout(() => {
                                this.setCookies(token);
                            }, 200);
                        } else {
                            session.defaultSession.flushStorageData();
                        }
                    }.bind(this)
                );
            },
            getCookies() {
                session.defaultSession.cookies.get(
                    {name: "token"},
                    function (err, cookies) {
                        for (let i = 0; i < cookies.length; i++) {
                            if (cookies[i].value) {
                                if(cookies[i].expirationDate<new Date().getTime()){
                                    return;
                                }
                                this.$store.commit("SET_TOKEN", cookies[i].value);
                                RefreshToken().then(res => {
                                    clearInterval(window.initTimer)
                                    this.$store.commit("SET_TOKEN", res.data.jwtToken.token);
                                    setLocal('loginToken', res.data.jwtToken.token)
                                    this.setCookies(res.data.jwtToken.token);
                                    if (this.isUpdata) return
                                    this.getIm();
                                    this.$router.push("/message/index/Sessind");
                                });
                                break;
                            }
                        }
                    }.bind(this)
                );
            },
            sendRequest() {
                let data = {
                    mobile: this.form1.mobile,
                    password: this.form1.password
                };
                this.loading = true;
                this.$store
                    .dispatch("Login", data)
                    .then(res => {
                        console.log(res);
                        if (res.code == 200) {
                            if (res.code == 200 && this.entryState == 1) {
                                if (res.data.jwtToken) {
                                    setLocal("loginToken", JSON.stringify(res.data.jwtToken));
                                }
                                // 请求im服务器
                                this.getIm();
                                console.log("页面即将跳转");
                                this.isload = true;
                                this.$router.push("/message/index/:sessionId");
                            } else if (res.code == 200 && this.entryState == 2) {
                                this.setCookies(res.data.jwtToken.token);
                                setLocal("loginToken", JSON.stringify(res.data.jwtToken));
                                this.getIm();
                                this.isload = true;
                                this.$router.push({path: "/message/index/:sessionId"});
                            } else {
                                console.log(
                                    "当前是没有点击记住密码，点击了登录并且出错才会打印的。"
                                );
                            }
                        } else {
                            this.$message.success("" + res.data.msg + "");
                        }
                    })
                    .catch(error => {
                        console.log("账号密码登录出错:" + error);
                        this.loading = false;
                    });
            },
            getIm() {
                this.$store
                    .dispatch("ImLogin")
                    .then(res => {
                        if (res.code == 200) {
                            setLocal("imuid", res.data.accid);
                            setLocal("imtoken", res.data.token);
                            this.$store.dispatch("connect");
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            sendCode() {
                const that = this;
                const params = {
                    mobile: this.form2.mobile
                };
                request
                    .loginSendCode(params)
                    .then(res => {
                        console.log(res);
                        if (res.code == 200) {
                            this.$message.success("发送成功,请注意查收。");
                            countdown(that, this.isdisabled, 'sendText');
                        }
                    })
                    .catch(error => {
                        console.log("验证码发送失败");
                        console.log(error);
                    });
            },
            entry(form2) {
                this.$refs[form2].validate(valid => {
                    if (valid) {
                        const data = {
                            mobile: this.form2.mobile,
                            code: this.form2.code
                        };
                        this.$store.dispatch("MobileLogin", data).then(res => {
                            console.log(res);
                            if (res.code == 200) {
                                if (res.data.jwtToken) {
                                    setLocal("loginToken", JSON.stringify(res.data.jwtToken));
                                }
                                this.getIm();
                                this.isload = true;
                                this.$router.push("/message/index/:sessionId");
                            }
                        });
                    }
                });
            },
            isRemempsw() {
                this.checked = !this.checked;
            },
            isTokenExpire() {
                if (
                    getLocal("loginToken") !== undefined ||
                    getLocal("loginToken") == ""
                ) {
                    const tokenData = JSON.parse(getLocal("loginToken"));
                    const hisTokenTime = new Date(tokenData.expirationTime).getTime();
                    const curTokenTime = new Date().getTime();
                    if (curTokenTime > hisTokenTime) {
                        this.$store
                            .dispatch("refreshToken")
                            .then(res => {
                                console.log(res);
                                if (res.code == 200) {
                                    setLocal("loginToken", JSON.stringify(res.data.jwtToken));
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                } else {
                    return false;
                }
            }
        },
        props: ['isUpdata'],
        created() {
            getLocal("imtoken") ? removeLocal("imtoken") : null;
            getLocal("imuid") ? removeLocal("imuid") : null;
            getLocal("loginToken") ? removeLocal("loginToken") : null;
            this.getCookies();
        }
    };
</script>
<style scoped lang="scss">
    $layout: flex;
    $mode: space-between;
    $bglin: linear-gradient(0deg, #fb780e 0%, #f93812 100%);
    * {
        -moz-user-select: -moz-none;
        -moz-user-select: none;
        -o-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .container {
        width: 520px;
        height: 600px;
        margin: 70px auto;
        background-color: #fff;
        border-radius: 18px;
        box-shadow: 0px 9px 10px #d9d9d9;
        position: relative;
        overflow: hidden;
        .loginContent {
            width: 100%;
        }
        .togoLogin {
            position: absolute;
            right: 15px;
            top: 15px;
            cursor: pointer;
            div:hover {
                img {
                    filter: grayscale(20%);
                }
            }
            span {
                position: relative;
                top: -46px;
                width: 77px;
                height: 22px;
                line-height: 22px;
                color: #FFC674;
                font-size: 14px;
                border: 1px solid #FFC674;
                padding: 4px 9px;
            }
            img {
                margin-left: 10px;
            }
        }
        .xieyi {
            color: #999;
            text-align: center;
            span {
                color: #FC684F
            }
        }
        .tabs {
            cursor: pointer;
            margin: 0 auto;
            margin-top: 22px;
            font-size: 18px;
            text-align: center;
            width: 440px;
            display: $layout;
            justify-content: $mode;
            p {
                width: 220px;
                border-bottom: 1px solid transparent;
                line-height: 58px;
            }
            .active {
                color: #FC684F;
                border-color: #FC684F;
            }
        }
        .logo {
            width: 224px;
            margin: 0 auto;
            padding-top: 64px;
            display: $layout;
            justify-content: $mode;
        }
        .refresh {
            line-height: 86px;
            font-size: 12px;
            cursor: pointer;
        }
        .qrcode {
            width: 190px;
            height: 190px;
            margin: 0 auto;
            position: relative;
            border: 1px solid #E6E6E6;
        }
        .codeLogin {
            margin: 0 auto;
            text-align: center;
            .marked {
                width: 190px;
                display: flex;
                margin: 0 auto;
                transition: all .3s;
                .saoyisao {
                    display: none;
                    height: 192px;
                    margin-right: 21px;
                }
            }
            .marked:hover {
                width: 100%;
                .saoyisao {
                    display: block;
                }
            }
            .tips {
                line-height: 78px;
                text-align: center;
                color: #666666;
                font-size: 18px;
            }
        }
        .footTip {
            font-size: 14px;
            color: #666;
            span {
                padding: 0 5px;
            }
            .downLoad {
                border-left: 1px solid #999;
                color: #FC5638;
            }
        }
        .service {
            font-size: 12px;
            color: #666;
            position: absolute;
            bottom: 20px;
            left: 0;
            width: 100%;
        }
    }

    .el-form {
        width: 440px;
        margin: 0 auto;
        .el-form-item {
            margin: 30px 0;
            position: relative;
        }
        .icon {
            position: absolute;
            top: 13px;
            z-index: 9999;
            left: 8px;
        }
        .el-input .el-input__inner {
            padding-left: 30px !important;
        }
        .forgot {
            display: $layout;
            justify-content: $mode;
            .forgotpsw {
                color: #000;
                cursor: pointer;
                p {
                    font-size: 14px;
                }
            }
        }
        .qrcode-container {
            width: 120px;
            height: 120px;
            display: inline-block;
            background-color: #f5f5f5;
            display: none;
        }
        .show-pwd {
            cursor: pointer;
            position: absolute;
            right: 10px;
            top: 10px;
        }
        .el-form-item {
            padding-bottom: 10px;
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

    .codeLogin .refresh:before {
        color: #FC5638;
        font-size: 18px;
        vertical-align: middle;
        margin-right: 5px;
    }

    .usernamelogin .el-button {
        width: 100%;
        background: #FC684F;
        color: #fff;
        padding: 0;
        width: 440px;
        height: 56px;
        font-size: 18px;
    }

    .messageLogin .el-button {
        width: 100%;
        background: $bglin;
        color: #fff;
        margin: 30px 0;
    }

    .usernameregister .el-button {
        width: 100%;
        background: $bglin;
        color: #fff;
    }

    .sendcode .el-button {
        border: none;
        color: #fff;
        position: absolute;
        top: 10px;
        right: 10px;
        height: 36px;
    }

    .sussesPic {
        display: block;
        margin: 0 auto;
        width: 188px;
        height: 188px;
    }
</style>
<style>
    .el-tabs__nav {
        width: 100% !important;
    }

    .accountlogin .el-input {
        width: 440px;
        height: 56px;
        font-size: 16px;
    }

    .accountlogin .el-input .el-input__inner {
        padding-left: 30px !important;
        height: 56px;
    }

    .accountlogin .el-input.is-active .el-input__inner,
    .el-input__inner:focus {
        border: 1px solid #fa5110;
    }

    .agree {
        display: inline-block;
        color: #999;
        cursor: pointer;
    }

    .accountlogin .el-checkbox__inner {
        border: 1px solid #fa5110;
    }

    .accountlogin .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #fa5110;
        border-color: #fa5110;
    }

    .accountlogin .el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #fa5110 !important;
    }

    .el-checkbox__input.is-checked .el-checkbox__label {
        color: #666;
    }

    .accountlogin .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #fa5110;
    }

    .accountlogin .el-tabs__header {
        padding: 0 100px;
    }
</style>