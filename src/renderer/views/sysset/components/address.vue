<template>
    <div class="addresslist-con">
        <header v-if="order">选择收货地址 <span class="el-icon-close" @click="$emit('input',false)"></span></header>
        <el-button
                type="primary"
                plain
                @click="dialogFormVisible = !dialogFormVisible;  title='添加收货地址' ;forms ={} ;"
                :style="{marginLeft:order?'5%':0}"
        >新增收货地址
        </el-button>
        <span>您已创建{{ addressNum }}个收货地址</span>
        <el-dialog
                :title="title"
                :visible.sync="dialogFormVisible"
                :modal="false"
                :validate-on-rule-change="false"
                :close-on-click-modal='false'
        >
            <el-form :model="forms" ref="ruleForm" class="address-form" :rules="rules">
                <el-form-item prop="names">
                    <i>*</i>
                    <span>收货人</span>
                    <el-input v-model="forms.names" autocomplete="off" placeholder="请输入收货人姓名"></el-input>
                </el-form-item>
                <el-form-item prop="phoneNum">
                    <i>*</i>
                    <span>手机号码</span>
                    <el-input v-model="forms.phoneNum" autocomplete="off" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item prop="address">
                    <i>*</i>
                    <span>所在地区</span>
                    <el-cascader
                            :options="options"
                            :show-all-levels="true"
                            placeholder="请选择地区"
                            filterable
                            v-model="forms.address"
                            class="selertCity"
                    ></el-cascader>
                </el-form-item>
                <el-form-item prop="addresses">
                    <i>*</i>
                    <span>详细地址</span>
                    <el-input v-model="forms.addresses" autocomplete="off" placeholder="请输入详细地址"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveAddress">保存收货地址</el-button>
            </div>
        </el-dialog>
        <el-table :data="addresslistDetail" stripe :style="{width: order?'90%':'100%',margin:'20px auto'}" border :key="Math.random()">
            <el-table-column label="默认地址" width="80">
                <template slot-scope="scope">
                    <el-checkbox :checked="scope.row.def" @change="check(scope.row,scope.$index)"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column
                    v-for="(val,index ) in option"
                    :key="index"
                    :prop="val.prop"
                    :label="val.label"
                    :width="val.width"
                    :type="val.type"
            ></el-table-column>
            <el-table-column fixed="right" width="250">
                <template slot-scope="scope">
                    <el-button size="medium" icon="el-icon-edit-outline" @click="edtiorAddress(scope.row)"></el-button>
                    <el-button
                            size="medium"
                            icon="el-icon-delete"
                            @click="deleteAddress(scope.row,scope.$index)"
                    ></el-button>
                </template>
            </el-table-column>
        </el-table>
        <footer v-if="order">
            <el-button type="primary" @click="$emit('address',address)">保存修改</el-button>
        </footer>
    </div>
</template>
<script>
    // import areaJs from '../citylist.js';

    import {getPaper, sendCode, getarea} from "@/api/admission/admission.js";
    import {
        getAddresslist,
        addAddress,
        deleteAddress,
        getDefaultAddress,
        getAddress
    } from "@/api/merchant/address.js";
    import {getOne} from "@/api/basicData/basicData.js";

    export default {
        name: "addresses",
        data() {
            return {
                checked: false,
                title: "添加收货地址",
                option: [
                    {
                        prop: "name",
                        label: "收货人",
                        width: "100"
                    },
                    {
                        prop: "mobile",
                        label: "手机号码",
                        width: "150"
                    },
                    {
                        prop: "addressDetail",
                        label: "地址",
                        width: "900"
                    }
                ],
                rules: {
                    phoneNum: [
                        {required: true, message: "请输入手机号码", trigger: "blur"},
                        {min: 11, max: 11, message: "请输入正确的手机号码", trigger: "blur"}
                    ],
                    names: [
                        {required: true, message: "请输入收货人姓名", trigger: "blur"},
                        {
                            min: 1,
                            max: 20,
                            message: "收货人姓名不能超过二十位",
                            trigger: "blur"
                        }
                    ],
                    address: [
                        {required: true, message: "请输入收货地址", trigger: "blur"}
                    ],
                    addresses: [
                        {required: true, message: "请输入收货详细地址", trigger: "blur"}
                    ]
                },
                addressNum: 0,
                addresslistDetail: [],
                dialogFormVisible: false,
                //    options: areajson,
                forms: {
                    address: [],
                    phoneNum: "",
                    names: "",
                    addresses: ""
                },
                options: [],
                address: null
            };
        },
        mounted() {
            this.getlist();
            getarea().then(res => {
                this.options = getOne(res.data,3);
            });
        },
        props:['order'],
        computed: {},
        methods: {
            check(val, ind) {
                val.def = !val.def;
                this.address = val;
                addAddress(val).then(req => {
                    if (req.code == 200) {
                        this.forms = {};
                        this.getlist();
                    }
                });
                this.$message.success("设置默认地址成功");
            },
            deleteAddress(obj, index) {
                this
                    .$confirm("确定删除该地址？", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        showClose: false,
                        center: true
                    })
                    .then(() => {
                        this.addresslistDetail.splice(index, 1);
                        --this.addressNum;
                        deleteAddress({
                            id: obj.id
                        });
                        this.$message({
                            type: "success",
                            message: "清除成功!"
                        });
                    });
            },
            getlist() {
                getAddresslist().then(req => {
                    req.data.forEach(v => {
                        v.def ? this.address = v : null;
                        v.data = {
                            names: v.name,
                            phoneNum: v.mobile,
                            addresses: v.address,
                            address: [
                                v.provinceId + "," + v.provinceName,
                                v.regionId + "," + v.regionName,
                                v.cityId + "," + v.cityName
                            ]
                        };
                        v.def = v.def;
                        v.addressDetail =
                            v.provinceName + v.regionName + v.cityName + v.address;
                    });
                    this.addresslistDetail = req.data;
                    this.addressNum = this.addresslistDetail.length;
                });
            },
            edtiorAddress(obj) {
                this.title = "修改收货地址";
                this.dialogFormVisible = true;
                this.forms = obj.data;
                this.forms.id = obj.id;
            },
            saveAddress() {
                this.dialogFormVisible = false;

                this.forms.address = this.forms.address.map(v => {
                    return v.split(",");
                });
                let obj = {
                    address: this.forms.addresses,
                    cityId: Number(this.forms.address[2][0]),
                    cityName: this.forms.address[2][1],
                    def: false,
                    id: this.forms.id ? this.forms.id : null,
                    mobile: this.forms.phoneNum,
                    name: this.forms.names,
                    provinceId: Number(this.forms.address[0][0]),
                    provinceName: this.forms.address[0][1],
                    regionId: Number(this.forms.address[1][0]),
                    regionName: this.forms.address[1][1]
                };

                addAddress(obj).then(req => {
                    if (req.code == 200) {
                        this.forms = [];
                        this.$message.success("添加地址成功");
                        this.getlist();
                    }
                });
                this.title = "添加收货地址";
                this.$refs.ruleForm.resetFields();
            }
        }
    };
</script>
<style lang="scss" scoped>
    header{
        background:rgba(247,247,247,1);
        text-align: center;
        font-size: 18px;
        color:#000;
        text-align: center;
        height: 58px;
        display: block;
        font-weight: bold;
        position: relative;
        margin-bottom: 20px;
        span{
            position: absolute;
            right: 10px;
            line-height: 58px;
        }
    }
    footer {
        position: absolute;
        bottom: 0px;
        left: 0;
        width: 100%;
        text-align: center;
        height: 56px;
        background: rgba(242, 242, 242, 1);
        box-shadow: 0px 0px 8px 0px rgba(129, 129, 129, 0.7);
        .el-button {
            width: 110px;
            height: 36px;
            padding: 0;
            margin-top: 10px;
        }
    }

    .addresslist-con {
        width: 100%;
        height: 100%;
        margin-top: 30px;
        position: relative;
        > span {
            display: inline-block;
            font-size: 13px;
        }

        .address-form {
            i {
                color: red;
                display: inline-block;
                vertical-align: sub;
                width: 10px;
            }
        }
        .selertCity {
            width: 100%;
            display: block;
        }
    }
</style>
<style>
    .addresslist-con .el-dialog {
        font-weight: bold;
    }

    .addresslist-con .el-dialog__wrapper {
        left: 180px;
    }

    .el-input--suffix {
        width: 100% !important;
    }

    .addresslist-con .el-dialog__body .el-input {
        width: 100%;
    }

    .addresslist-con .el-form-item {
        margin: 0;
    }

    .addresslist-con .el-dialog__header {
        padding: 10px 20px;
        background-color: #eee;
    }

    .addresslist-con .el-dialog__body {
        padding: 10px 20px;
    }

    .addresslist-con .el-dialog__footer {
        position: relative;
        height: 80px;
    }

    .addresslist-con .el-dialog__footer button {
        color: black;
        position: absolute;
        left: 20px;
        background-color: #eee;
        border: 0;
    }

    .addresslist-con .el-form-item__content {
        margin-bottom: 10px;
    }

    .addresslist-con > .el-button--primary {
        background-color: #ff6749;
        color: white;
    }

    .addresslist-con .el-table {
        margin-top: 40px;
    }

    .addresslist-con .el-button--medium {
        border: 0;
        padding: 0px;
        font-size: 20px;
    }
</style>


