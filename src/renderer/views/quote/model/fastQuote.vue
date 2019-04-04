<template>
    <div class="orderContent" v-loading="showLoading">

        <div class="contenerBox scrollbar">
            <div class="addParts">
                <div style="position: relative">
                    <h3>选择配件</h3>
                </div>
                <div class="table">
                    <el-row class="head">
                        <el-col :span="3"><img src="@/../../static/image/delete.png" width="14" alt=""> 清空</el-col>
                        <el-col :span="7">配件</el-col>
                        <el-col :span="4">品质</el-col>
                        <el-col :span="4">货源</el-col>
                        <el-col :span="4">单价(元)</el-col>
                        <el-col :span="4">预约发货(天)</el-col>
                    </el-row>
                    <el-row class="baby" v-for="(item,index) in order" :key="index">
                        <el-col
                                :span="3"
                                class="reset el-icon-remove"
                                style="cursor: pointer"
                                @click.native="delect(index)"
                        >
                            <span>{{index+1}}.</span>
                        </el-col>
                        <el-col :span="7">
                            <el-input v-model="item.name" @focus="item.isShow=true" placeholder="请输入配件名称"
                                      @blur="item.isShow=false" maxlength="20"></el-input>
                            <part-list
                                    :inputValue="item.name"
                                    :partsList="partsList"
                                    @choose="choose(item,arguments)"
                                    v-show="item.isShow&&item.name"
                            ></part-list>
                        </el-col>
                        <el-col :span="4" class="addBorder" v-if="type">
                            <el-select
                                    v-model="item.classify"
                            >
                                <el-option
                                        v-for="item in type.classify"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4" class="addBorder" v-if="type">
                            <el-select v-model="item.type">
                                <el-option
                                        v-for="item in type.type"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4" class="addBorder">
                            <el-input v-model="item.priceShow" maxlength="6" placeholder="请输入价格"
                                      @keyup.native="check(index,'priceShow')"></el-input>
                        </el-col>
                        <el-col :span="4" class="addBorder">
                            <p v-if="item.type=='CASH'">--</p>
                            <el-input v-else :disabled="item.type=='CASH'" maxlength="3" v-model="item.reserveDays"
                                      placeholder="" @keyup.native="check(index,'reserveDays')"></el-input>
                        </el-col>
                    </el-row>
                    <el-row :span="24" class="baby addMore" @click.native="addOrder">添加配件</el-row>
                </div>
            </div>
            <div class="remark">
                <h3>留言</h3>
                <el-input type="textarea" v-model="sellerRemark"></el-input>
            </div>
        </div>
        <div class="submit">
            <el-button @click="commitOrder">确认报价</el-button>
        </div>
    </div>
</template>
<script>
    import {getLocal, setLocal} from "@/utils/localstorage";
    import {accessory, vin, getPartType, fastCommit} from "@/api/quote/quote";
    import {findDetailByOrderId} from "@/api/myorder/index.js";
    import {setOrder} from "@/api/myorder/index.js";
    import partList from "@/components/order/partSearch";
    import {FloatMul} from "../../../utils";

    export default {
        props: ['detail'],
        data() {
            return {
                previewOrder: false,
                redo: false,
                order: [{
                    "classify": "CLASSIFY_1",
                    "priceShow": 1,
                    "type": "CASH",
                    isShow: false,
                    reserveDays: '0'
                }],
                partsList: [],
                index: null,
                showLoading: true,
                sellerRemark: "",
                buyerUserId: null,
                type: null,
                types: null,
                oldOrder: null
            };
        },
        computed: {
            priceTotal() {
                let total = 0;
                if (this.order.length) {
                    this.order.forEach(item => {
                        total = (FloatMul(item.priceShow, 100) * item.num + FloatMul(total, 100)) / 100;
                    });
                }
                return total;
            }
        },
        components: {partList},
        watch: {
            'carBrand.vin': {
                handler(news, old) {
                    if (!(/^[a-zA-Z\d]+$/.test(news))) {
                        this.$set(this.carBrand, 'vin', old)
                    }
                },
                deep: true,
                immediate: true
            }
        },
        mounted() {
            getPartType().then(res => {
                this.types = res.data;
                let arr = [];
                let type = [];
                for (let x in res.data.classify) {
                    arr.push({
                        label: res.data.classify[x],
                        value: x
                    })
                }
                for (let x in res.data.type) {
                    type.push({
                        label: res.data.type[x],
                        value: x
                    })
                }
                this.type = {
                    classify: arr,
                    type
                };
                this.showLoading = false;
            });
        },
        methods: {
            check(index, val) {
                let input = this.order[index][val]
                if (!input) return
                let reg = /^[0-9]+([.]{0,1}[0-9]{0,2})$/;
                if (!reg.test(input)) {
                    let newValue = input.slice(0, -1)
                    this.$set(this.order[index], val, reg.test(newValue) ? newValue : 1)
                }
            },
            assemble() {
                if (this.order.length) {
                    let flag = false;
                    let arr = []
                    this.order.forEach(item => {
                        let obj = {
                            subName: item.name,
                            partItemList: [{
                                classify: item.classify,
                                price:FloatMul(item.priceShow,100),
                                type: item.type,
                                reserveDays: item.reserveDays
                            }]
                        }
                        if (item.name) {
                            arr.push(obj)
                        }
                    })
                    return {
                        enquiryId: this.detail.id,
                        partList: arr,
                        remark: this.sellerRemark
                    };
                }
            },
            Compared(obj1, obj2) {
                if(!obj2)return true;
                if(!obj2.quotePartList)return true;
                return this.sellerRemark!= obj2.remark || JSON.stringify(obj1[0]) != JSON.stringify(obj2.quotePartList[0])
            },
            commitOrder() {
                let obj = this.assemble();
                if (!this.Compared(this.order, this.oldOrder)) {
                    this.$message.error('当前订单无修改内容')
                    return;
                }
                fastCommit(obj).then(res => {
                    this.$message.success("报价成功");
                    this.$router.push("/quotation/index");
                })
                // if (this.redo) {
                //     return
                // }
                // let obj = this.assemble();
                //是否修改需要更换变量
                // if (this.tradeNo) {
                //     if (!this.Compared(obj, this.oldOrder)) {
                //         this.$message.error('当前订单无修改内容')
                //         return;
                //     }
                // }
            },
            delect(i) {
                this.order.splice(i, 1);
            },
            addOrder() {
                this.order.push({
                    "classify": "CLASSIFY_1",
                    isShow: false,
                    "name": "",
                    "priceShow": 1,
                    reserveDays: '0',
                    "type": "CASH"
                });
            },
            initPartsList(res) {
                res.data.forEach(item => {
                    item.children.forEach(val => {
                        this.partsList.push(val);
                    });
                });
            },
            getPartList() {
                if (getLocal("allParts")) {
                    this.initPartsList(JSON.parse(getLocal("allParts")));
                } else {
                    accessory().then(res => {
                        setLocal("allParts", JSON.stringify(res));
                        this.initPartsList(res);
                    });
                }
            },
            choose(val, item) {
                val.name = item[0].name;
            }
        },
        created() {
            this.getPartList();
            if (this.detail.isQuote) {
                this.sellerRemark = this.detail.currentUserQuote.remark;
                this.order = this.detail.currentUserQuote.quotePartList;
                this.oldOrder = JSON.parse(JSON.stringify(this.detail.currentUserQuote))
            }
        }
    }
</script>
<style lang="scss" scoped>
    @mixin fl {
        display: flex;
    }

    @mixin border {
        border: 1px solid #dedede;
        border-radius: 5px;
        height: 36px;
        line-height: 36px;
    }

    .orderContent {
        position: relative;
        background: #fff;
        height: calc(100% - 30px);
        color: #000;
        .bgc {
            left: 0;
        }
        .contenerBox {
            padding: 10px 20px;
            height: 80%;
            max-height: 500px;
        }
        h3 {
            font-size: 18px;
            border-left: 3px solid #f96f26;
            text-indent: 10px;
            margin: 20px 0;
        }
        .noInfo {
            color: #f96f26;
            text-decoration: underline;
            cursor: pointer;
        }
        .submit {
            height: 56px;
            box-shadow: 0px 0px 34px -9px #000;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .el-button {
                width: 120px;
                height: 40px;
                background: #e60000;
                color: #fff;
            }
            .press {
                font-size: 16px;
                span {
                    font-size: 20px;
                    color: #e60000;
                    margin-right: 20px;
                    vertical-align: middle;
                }
            }
        }
    }

    .table {
        padding-bottom: 50px;
        border-bottom: 1px solid #ccc;
        .head {
            @include fl;
            text-align: center;
            font-size: 14px;
            font-weight: 500;
            height: 40px;
            background: #fff8ed;
            color: #000;
            line-height: 40px;
            border: 1px solid #dedede;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            div {
                cursor: pointer;
            }
            img {
                vertical-align: middle;
                margin-right: 4px;
            }
        }
        .baby {
            transition: all 0.5s;
            @include fl;
            height: 70px;
            line-height: 70px;
            border: 1px solid #cccccc;
            border-top: 0 none;
            text-align: center;
            span {
                margin-left: 5px;
                color: #000;
            }
            .press {
                @include fl;
                justify-content: center;
                align-items: center;
                padding: 0 20px;
                .myprice {
                    font-size: 12px;
                    @include fl;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    border: 1px solid #cccccc;
                    border-radius: 5px;
                    color: #000;
                    cursor: pointer;
                }
                .quoteNow {
                    color: #fc684f;
                }
                .border {
                    border: 0 none;
                }
                div {
                    width: 25%;
                    height: 50px;
                    border-left: 1px solid #cccccc;
                    p {
                        line-height: 25px;
                    }
                    .price {
                        color: #fc684f;
                    }
                }
            }
            .reset {
                @include fl;
                align-items: center;
                justify-content: center;
                font-size: 21px;
                color: #ffa191;
            }
        }
        .addMore {
            height: 40px;
            justify-content: center;
            align-items: center;
            text-decoration: underline;
            color: #fc684f;
            background: #f7f7f7;
            cursor: pointer;
        }
    }
</style>
<style lang='scss'>
    .orderContent .el-dialog {
        .el-dialog__body {
            padding: 0 0 20px 0;
        }
        .el-dialog__footer {
            padding: 0;
            height: 56px;
            background: rgba(242, 242, 242, 1);
            box-shadow: 0px 0px 8px 0px rgba(129, 129, 129, 0.7);
            line-height: 55px;
        }
        .el-dialog__header {
            padding: 0;
            header {
                color: #000;
                font-weight: bold;
                justify-content: center;
                border-bottom: 1px solid #e6e6e6;
            }
        }
    }

    .orderContent .el-input__inner {
        height: 36px;
    }

    .baby .el-input {
        z-index: 5;
        padding-right: 10px;
    }

    .remark {
        .el-textarea {
            height: 100px;
            .el-textarea__inner {
                height: 100px;
                resize: none;
            }
        }
    }

    .addBorder {
        border-left: 1px solid #E0E0E0;
        .el-input.is-disabled .el-input__inner {
            background: transparent;
        }
        input:focus {
            border: none;
        }
        input {
            width: 100%;
            height: 69px;
            border: 0;
            text-align: center;
        }
    }
</style>
