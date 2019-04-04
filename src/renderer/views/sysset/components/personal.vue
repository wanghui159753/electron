<template>
    <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
    >
        <el-form-item label="个人名称：" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="个人头像：" prop="avatar">
            <div label="个人头像">
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
        <el-form-item label="主营分类：" prop="scope">
            <el-input v-model="ruleForm.scope" placeholder="请输入主营分类" @focus="isShow=true"></el-input>
        </el-form-item>
        <el-form-item label="选择地址：" prop="address">
            <el-cascader
                    :options="options"
                    :show-all-levels="true"
                    placeholder="请选择地区"
                    filterable
                    v-model="ruleForm.address"
                    class="selertCity"
            ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" prop="addresses">
            <el-input v-model="ruleForm.addresses" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="手机：" prop="mobile">
            <el-input v-model="ruleForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="QQ：" prop="qqNum">
            <el-input v-model="ruleForm.qq" placeholder="请输入QQ号码"></el-input>
        </el-form-item>
        <el-form-item label="微信：" prop="wxNum">
            <el-input v-model="ruleForm.wechat" placeholder="请输入微信"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button size="medium" type="primary" @click="submitForm" :disabled="disabled">保存修改</el-button>
        </el-form-item>
        <el-dialog
                :title="'已发送验证码至'+ruleForm.mobile"
                :visible.sync="dialogVisible"
                width="30%"
                :modal="false"
        >
            <el-input placeholder="请输入短信验证码" :value="code">
                <i slot="suffix" @click="postCode">重新发送</i>
            </el-input>
            <el-button type="primary" @click="subMod">确定</el-button>
        </el-dialog>
        <car-list v-if="isShow" :scoped="selected" @getcar="getcar"></car-list>
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
</template>
<script>
    var req = require("@/utils/upPic");
    import {
        resetInfoDetil,
        getInfodetails,
        getarea
    } from "@/api/admission/admission.js";
    import {resetMod, sendCode} from "@/api/user/accountMobile.js";
    import VueCropper from "vue-cropper";
    import carList from "../../admission/step/car";
    import {getLocal, setLocal} from "@/utils/localstorage";
    import {getBannerlist, modifyBanner} from "@/api/merchant/banner.js";

    export default {
        components: {
            carList,
            VueCropper
        },
        name: "personal",
        data() {
            return {
                disabled: true,
                carlist: null,
                clip: {
                    img: "",
                    outputType: "png"
                },
                clipshow: false,
                isShow: false,
                defautMob: '',
                selected: [],
                code: "",
                iscar: "",
                cartype: "",
                scope: [],
                manageScopeList: "",
                options: [],
                dialogVisible: false,
                defautData: {},
                ruleForm: {
                    identity: "",
                    name: "",
                    scope: "",
                    mobile: "",
                    qq: "",
                    logo: '',
                    email: "",
                    wechat: "",
                    adderss: "",
                    activitie: "",
                    sellerIntroduce: "",
                    addresses: ""
                },
                rules: {
                    name: [{required: true, message: "请输入个人名称", trigger: "change"}],
                    scope: [
                        {required: true, message: "请输入经营范围", trigger: "change"}
                    ],
                    address: [{required: true, message: "请选择地区", trigger: "change"}],
                    addresses: [
                        {required: true, message: "请输入详细地址", trigger: "blur"}
                    ],
                    mobile: [
                        {min: 11, max: 11, message: "请输入正确的手机号码", trigger: "blur"}
                    ],
                    desc: [
                        {min: 3, max: 100, message: "长度不能超过100字", trigger: "blur"}
                    ],
                    descTwo: [
                        {min: 3, max: 100, message: "长度不能超过300字", trigger: "blur"}
                    ]
                }
            };
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
        mounted() {
            this.getform();
            getarea().then(res => {
                var arr = [];
                res.data.forEach((item, index) => {
                    var obj = {
                        value: item.id + "," + item.name,
                        label: item.name,
                        children: []
                    };
                    var arr1 = [];
                    item.children.forEach(item1 => {
                        let obj1 = {};
                        if (item1.children) {
                            obj1 = {
                                value: item1.id + "," + item1.name,
                                label: item1.name,
                                children: []
                            };
                            var arr2 = [];
                            item1.children.forEach(item2 => {
                                var obj2 = {
                                    value: item2.id + "," + item2.name,
                                    label: item2.name
                                };
                                arr2.push(obj2);
                            });
                            obj1.children = arr2;
                        } else {
                            obj1 = {
                                value: item1.id + "," + item1.name,
                                label: item1.name
                            };
                        }
                        arr1.push(obj1);
                    });
                    obj.children = arr1;
                    arr.push(obj);
                });
                this.options = arr;
            });
        },
        methods: {
            up() {
                //裁切图片上传
                this.clipshow = false;
                this.$refs.cropper.getCropBlob(data => {
                    req.up({files: [data]}, this, res => {
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
                };
            },
            getcar(obj) {
                this.isShow = obj.is;
                //经营范围列表
                let str = "";
                obj.s.forEach((item, index) => {
                    str += item.labelName + (index == obj.s.length - 1 ? "" : "/");
                });
                this.ruleForm.scope = str;
                this.selected = obj.original;
                this.scope = obj.s;
            },
            postCode() {
                sendCode({mobile: this.ruleForm.mobile});
            },
            subMod() {
                resetMod({code: this.code, mobile: this.ruleForm.mobile}).then(req => {
                    this.$message.success("手机号修改成功");
                    this.dialogVisible = false;
                });
            },
            submitForm() {
                this.ruleForm.address =
                    this.ruleForm.address.length != 0
                        ? this.ruleForm.address.map(v => {
                            return v.split(",");
                        })
                        : [];
                let obj = {
                    address:
                        this.ruleForm.address.length != 0
                            ? {
                                address: this.ruleForm.addresses,
                                cityId: Number(this.ruleForm.address[2][0]),
                                cityName: this.ruleForm.address[2][1],
                                provinceId: Number(this.ruleForm.address[0][0]),
                                provinceName: this.ruleForm.address[0][1],
                                regionId: Number(this.ruleForm.address[1][0]),
                                regionName: this.ruleForm.address[1][1]
                            }
                            : {},
                    logo: this.ruleForm.logo,
                    name: this.ruleForm.name ? this.ruleForm.name : "",
                    identityId: this.ruleForm.identityId,
                    partsList: [],
                    brandList: this.scope
                };
                resetInfoDetil(obj)
                    .then(req => {
                        if (req.code == 200) {
                            this.$message.success("基本信息修改成功");
                            this.getform();
                            this.$store.commit('SET_STORE', this.ruleForm)
                        }
                        if (this.defautMob != this.ruleForm.mobile) {
                            console.log(this.defautMob != this.ruleForm.mobile)
                            sendCode({mobile: this.ruleForm.mobile}).then(res => {
                                this.dialogVisible = true;
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    });
            },
            getform() {
                getInfodetails().then(res => {
                    let str = "";
                    this.carlist = res.data.brandList;
                    res.data.brandList.forEach(v => {
                        str += v.brandName;
                    });
                    let list = JSON.parse(getLocal("carlist"))
                    if (this.carlist) {
                        for (let i = 0; i < this.carlist.length; i++) {
                            for (const ind in list[i].children) {
                                if (list[i].children[ind].brandId == this.carlist[i].brandId) {
                                    list[i].children[ind].parent = list[i];
                                    this.selected.push(list[i].children[ind]);
                                }
                            }
                        }
                    }
                    let forms = {
                        identity:
                            res.data.identity.parentName + " " + res.data.identity.subName,
                        address: res.data.address
                            ? [
                                res.data.address.provinceId +
                                "," +
                                res.data.address.provinceName,
                                res.data.address.regionId + "," + res.data.address.regionName,
                                res.data.address.cityId + "," + res.data.address.cityName
                            ]
                            : [],
                        name: res.data.name,
                        addresses: res.data.address ? res.data.address.address : "",
                        scope: str,
                        identityId: res.data.identity.subId,
                        mobile: res.data.mobile,
                        qq: res.data.qq,
                        logo: res.data.logo || "https://cdn.xindongpeixun.com/oss/20181017/d871a7d7268644b8b7f47d3a4fb8ad32.png",
                        wechat: res.data.wechat
                    };
                    this.ruleForm = forms;
                    this.defautMob = res.data.mobile;
                    this.defautData = JSON.parse(JSON.stringify(forms));
                });
            }
        }
    };
</script>

<style lang="scss">
    .demo-ruleForm {
        height: calc(100vh - 30px);
        width: 500px;
        margin-top: 30px;
        .clips {
            position: fixed;
            top: 0;
            left: 180px;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.2);
            z-index: 500;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            div {
                width: 300px;
                // margin: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .el-button {
                    width: 100px;
                    height: 40px;
                    padding: 0;
                }
            }
            .vue-cropper {
                background: #fff;
                width: 300px;
                height: 300px;
            }
        }
        .el-button--medium {
            width: 130px;
        }
        .el-cascader {
            width: 100%;
        }
        .el-dialog {
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto;
            left: 0;
            right: 0;
            height: 170px;
            margin-top: auto !important;
            .el-dialog__header {
                text-align: center;
                span {
                    font-size: 16px;
                }
            }
            .el-dialog__body {
                padding: 0 20px;
                .el-input__suffix-inner > i {
                    background: #fdf5e7;
                    color: #fb780e;
                    float: left;
                    margin-top: 6px;
                    padding: 7px;
                    font-size: 12px;
                    cursor: pointer;
                }
                .el-button--primary {
                    width: 100%;
                    margin: 15px 0;
                }
            }
        }
        .uploadImage {
            width: 60px;
            height: 60px;
            margin-right: 10px;
            margin-top: 5px;
        }
        .upload-con {
            display: block;
            position: relative;
            float: left;
            .el-badge__content {
                opacity: 0.5;
                left: -13px;
                top: 54px;
                right: 70px;
                border-radius: 50%;
                padding: 0 3px;
                font-size: 9px;
                height: 12px;
                line-height: 12px;
            }
        }
    }

    .el-form-item__content .imgList {
        padding: 10px 10px 0px 10px;
        position: absolute;
        display: block;
        left: 0;
        top: 5px;
        border: 0;
        i {
            font-size: 40px;
            color: #aaa;
        }
        input[type="file"] {
            color: transparent;
            cursor: pointer;
        }
        .avatar-uploader {
            position: absolute;
            left: 0;
            top: 0;
            width: 50px;
            height: 50px;
            // z-index: -1;
            opacity: 0;
        }
    }
</style>
<style>
    .demo-ruleForm .el-form-item.is-required .el-form-item__label:before {
        content: none;
    }
</style>

