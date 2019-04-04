<template>
    <div>
        <p class="status">
            审核状态：<span>{{ status }}</span>
        </p>
        <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
        >
            <el-form-item label="店铺名称：" prop="name">
                <el-input v-model="ruleForm.name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="店铺头像：" prop="logo">
                <div label="店铺头像">
                    <div class="upload-con" id="upHead">
                        <img :src="ruleForm.logo" class="uploadImage" align="top">
                    </div>
                    <div class="imgList">
                        <i class="el-icon-plus avatar-uploader-icon" v-if="ruleForm.logo ==''"></i>
                        <input class="avatar-uploader" type="file" @change="readPic($event,0)" title="请选择图片">
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="我的身份：" prop="identity">
                <el-input v-model="ruleForm.identity" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="店铺地址：" prop="adderss">
                <el-input v-model="ruleForm.address" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="经营范围：" prop="scope">
                <el-input v-model="ruleForm.scope" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="手机：" prop="mobile">
                <el-input v-model="ruleForm.mobile" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item label="电话：" prop="phone">
                <el-input v-model="ruleForm.phone" placeholder="请输入电话号码"></el-input>
            </el-form-item>
            <el-form-item label="QQ：" prop="qqNum">
                <el-input v-model="ruleForm.qq" placeholder="请输入QQ号码"></el-input>
            </el-form-item>
            <el-form-item label="微信：" prop="wxNum">
                <el-input v-model="ruleForm.wechat" placeholder="请输入微信"></el-input>
            </el-form-item>
            <el-form-item label="优惠活动：" prop="activitie">
                <el-input
                        type="textarea"
                        v-model="ruleForm.activitie"
                        placeholder="你可以编辑优惠活动的具体时间的具体内容(最多100字)"
                        maxlength="100"
                ></el-input>
            </el-form-item>
            <el-form-item label="商户介绍：" prop="sellerIntroduce">
                <el-input type="textarea" maxlength="300" v-model="ruleForm.sellerIntroduce"
                          placeholder="请在这里输入商户介绍(最多300字)"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="medium" type="primary" @click="submitForm" :disabled="disabled">保存</el-button>
            </el-form-item>
            <el-dialog
                    :title="'已发送验证码至'+ruleForm.mobile"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :modal="false"
            >
                <el-input placeholder="请输入短信验证码" v-model="code">
                    <i slot="suffix" @click="postCode">重新发送</i>
                </el-input>
                <el-button type="primary" @click="subMod">确定</el-button>
            </el-dialog>
            <div class="clips" v-show="clipshow">
                <vueCropper
                        ref="cropper"
                        :img="clip.img"
                        :outputSize="1"
                        :outputType="clip.outputType"
                        :canScale="true"
                        :autoCrop="true"
                        :autoCropWidth="130"
                        :autoCropHeight="130"
                        :fixedBox="true"
                        :canMove="true"
                        :canMoveBox="false"
                ></vueCropper>
                <div>
                    <el-button type="primary" @click="clipshow=false">取消</el-button>
                    <el-button type="primary" @click="up">裁切</el-button>
                </div>
            </div>
        </el-form>
    </div>

</template>
<script>
    var req = require("@/utils/upPic");
    import {
        resetDetil,
        getdetails,
        getInfodetails,
        resetLogo,
        sendCode,
        resetMod
    } from "@/api/admission/admission.js";
    import {readFile} from "fs";
    import VueCropper from "vue-cropper";
    import {getBannerlist, modifyBanner} from "@/api/merchant/banner.js";

    export default {
        data() {
            return {
                status: '',
                disabled: true,
                clip: {
                    img: "",
                    outputType: "png"
                },
                defautData: {},
                clipshow: false,
                val: "",
                code: "",
                dialogVisible: false,
                ruleForm: {
                    logo: '',
                    name: "",
                    scope: "",
                    mobile: "",
                    phone: "",
                    qq: "",
                    email: "",
                    wechat: "",
                    activitie: "",
                    sellerIntroduce: ""
                },
                rules: {
                    mobile: [
                        {min: 11, max: 11, message: "请输入正确的手机号码", trigger: "blur"}
                    ],
                    activitie: [
                        {min: 3, max: 100, message: "长度不能超过100字", trigger: "blur"}
                    ],
                    sellerIntroduce: [
                        {min: 3, max: 100, message: "长度不能超过300字", trigger: "blur"}
                    ]
                }
            };
        },
        components: {VueCropper},
        mounted() {
            this.getform();
        },
        watch: {
            ruleForm: {
                handler(newName, oldName) {

                    if (JSON.stringify(newName) == JSON.stringify(this.defautData)) {
                        this.disabled = true
                    } else {
                        this.disabled = false
                    }
                },
                immediate: true,
                deep: true
            }
        },
        methods: {
            up() {
                //裁切图片上传
                this.clipshow = false;
                this.$refs.cropper.getCropBlob(data => {
                    req.up(
                        {files: [data]},
                        this,
                        res => {
                            this.ruleForm.logo = res;
                        },
                        document.getElementById("upHead")
                    );
                });
            },
            readPic(el, n) {
                // 图片裁切
                var obj = this.clip;
                var n = new FileReader();
                n.readAsDataURL(el.target.files[0]);
                n.onload = () => {
                    obj.img = n.result;
                    this.clip = obj;
                    this.clipshow = true;
                    el.target.value = '';
                };
            },
            postCode() {
                sendCode({mobile: this.ruleForm.mobile});
            },
            subMod() {
                resetMod({code: this.code, mobile: this.ruleForm.mobile}).then(req => {
                    this.$message.success("修改成功");
                });
            },
            submitForm() {
                this.ruleForm.email = "";
                resetLogo({logo: this.ruleForm.logo})
                resetDetil(this.ruleForm)
                    .then(req => {
                        if (req.code == 200) {
                            this.$message.success("信息修改成功");
                            this.$store.commit('SET_STORE', this.ruleForm)
                            console.log(this.$store.state,'===============')
                        }
                    })
                    .catch(error => {
                        sendCode({mobile: this.ruleForm.mobile}).then(res => {
                            this.dialogVisible = true;
                        });
                    });
            },
            getform() {
                getdetails().then(req => {
                    let scopes = "";
                    if (req.data.manageScopeList) {
                        req.data.manageScopeList.forEach(v => {
                            scopes += v.labelName + "、";
                        });
                    }
                    getInfodetails().then(res => {
                        ;
                        switch (req.data.status) {
                            case 'OK':
                                this.status = '审核成功'
                                break;
                            case 'WAIT' :
                                this.status = '待审核中'
                                break;
                            default:
                                this.status = '审核失败'
                                break;
                        }
                        let forms = {
                            identity:
                                res.data.identity.parentName + " " + res.data.identity.subName,
                            address:
                                req.data.address.provinceName +
                                " " +
                                req.data.address.cityName +
                                " " +
                                req.data.address.regionName +
                                " " +
                                req.data.address.address,
                            name: req.data.name,
                            scope: scopes,
                            mobile: req.data.mobile,
                            phone: req.data.phone,
                            qq: req.data.qq,
                            logo: req.data.logo || "https://cdn.xindongpeixun.com/oss/20181017/d871a7d7268644b8b7f47d3a4fb8ad32.png",
                            wechat: req.data.wechat,
                            activitie: req.data.activitie,
                            sellerIntroduce: req.data.sellerIntroduce
                        };
                        this.ruleForm = forms;
                        this.defautData = JSON.parse(JSON.stringify(forms));
                    });
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .status {
        color: #333;
        font-size: 15px;
        span {
            color: #FF6749;
            display: inline-block;
            padding-left: 20px;
        }
    }
</style>

