<template>
    <div class="orderContent" v-loading="showLoading">
        <div class="contenerBox scrollbar">
            <h3>车辆信息</h3>
            <div class="carInfo">
                <!--<div class="left">-->
                <!--<span>车架号</span>-->
                <!--<el-input-->
                <!--type="text"-->
                <!--v-model="carBrand.vin"-->
                <!--placeholder="请输入17位车架号（选填）"-->
                <!--maxlength="17"-->
                <!--@keyup.native.enter="search"-->
                <!--&gt;</el-input>-->
                <!--</div>-->
                <div class="brand">
                    <span class="titWord">品牌</span>
                    <div v-if="carBrand.vehicleBrand" @click="brandShow=true" style="cursor: pointer">
                        <img :src="carBrand.logo" width="28" alt>
                        <span>
              {{carBrand.vehicleBrand}}
              <span
                      v-if="carBrand.vehicleSerie"
              >({{carBrand.vehicleSerie}})</span>
            </span>
                    </div>
                    <div v-else @click="brandShow=true" class="noInfo">选择车型</div>
                </div>
            </div>
            <div class="addParts">
                <div style="position: relative">
                    <h3>选择配件</h3>
                    <!--<p class="Preview" @click="previewOrder=true"><img src="@/../../static/image/Preview.png" width="14"-->
                    <!--alt=""> 预览订单</p>-->
                </div>
                <div class="table">
                    <el-row class="head">
                        <el-col :span="2"><img src="@/../../static/image/delete.png" width="14" alt=""> 清空</el-col>
                        <el-col :span="7">配件</el-col>
                        <el-col :span="3">品质</el-col>
                        <el-col :span="3">货源</el-col>
                        <el-col :span="4">单价(元)</el-col>
                        <el-col :span="3">发货数量</el-col>
                        <el-col :span="4">预约发货(天)</el-col>
                    </el-row>
                    <el-row class="baby" v-for="(item,index) in order" :key="index">
                        <el-col
                                :span="2"
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
                        <el-col :span="3" :class="{low:item.remark}" class="addBorder" v-if="type">
                            <el-select v-model="item.classify"
                                       @change="showRemark(arguments[0],item)">
                                <el-option
                                        v-for="item in type.classify"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                >
                                </el-option>
                            </el-select>
                            <div class="remarkShow" v-if="item.remark"><span
                                    :title="item.remark">{{item.remark}} </span><img @click="item.remarkShow=true"
                                                                                     width="12"
                                                                                     src="@/../../static/image/xiugai.png"
                                                                                     alt=""></div>
                            <div class="remarks" v-if="item.remarkShow">
                                <el-input maxlength="15" placeholder="请输入配件品牌" v-model="item.remark"></el-input>
                                <el-button type="primary" @click="$set(item,'remarkShow',false)">确认</el-button>
                            </div>
                        </el-col>
                        <el-col :span="3" class="addBorder" v-if="type">
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
                        <el-col :span="3" class="addBorder">
                            <el-input v-model="item.num" maxlength="2" @keyup.native="check(index,'num')"></el-input>
                        </el-col>
                        <el-col :span="4" class="addBorder">
                            <p v-if="item.type=='CASH'">--</p>
                            <el-input v-else :disabled="item.type=='CASH'" maxlength="3" v-model="item.scheduledDays"
                                      placeholder="" @keyup.native="check(index,'scheduledDays')"></el-input>
                        </el-col>
                    </el-row>
                    <el-row :span="24" class="baby addMore"> <div @click="addOrder">添加配件</div></el-row>
                </div>
            </div>
            <div class="remark">
                <h3>留言</h3>
                <el-input maxlength="100" placeholder="请输入留言，最大长度100字" type="textarea"
                          v-model="sellerRemark"></el-input>
            </div>
        </div>
        <div class="submit">
            <div class="press">
                总计:
                <span>￥{{priceTotal}}</span>
            </div>
            <el-button @click="commitOrder" v-if="!id">确认订单</el-button>
            <el-button @click="isModify" v-else>确认修改</el-button>
        </div>
        <brand v-if="brandShow" v-model="carBrand" @close="brandShow=false"></brand>
        <el-dialog :append-to-body="false" width="80%" :center="true" v-if="previewOrder" :visible.sync="previewOrder"
                   custom-class="previewOrder">
            <header slot="title">预览订单</header>
            <preview :car-brand="carBrand" :goods-list="order" :types="types" :sellerRemark="sellerRemark"></preview>
            <footer slot="footer">
                共{{order.length}}件，总计: ¥{{priceTotal}}
            </footer>
        </el-dialog>
        <el-dialog
                :append-to-body="false"
                width="340px"
                height="150px"
                :center="true"
                :close-on-press-escape="false"
                :show-close="false"
                :visible="makeSureAgain"
        >
            <p style="text-align: center">确定修改订单吗？</p>
            <div slot="footer">
                <el-button type="info" @click="makeSureAgain=false">取消</el-button>
                <el-button type="primary" @click="commitOrder();makeSureAgain=false">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
                :append-to-body="false"
                width="340px"
                height="150px"
                :center="true"
                :close-on-press-escape="false"
                :show-close="false"
                :visible="commitAgain"
        >
            <p style="text-align: center">请勿重复提交内容</p>
            <div slot="footer">
                <el-button type="primary" @click="commitAgain=false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {FloatMul} from '@/utils/index';
    import {getLocal, setLocal} from "@/utils/localstorage";
    import {accessory, vin, getPartType} from "@/api/quote/quote";
    import {quoteOrderDel} from "@/api/myorder/index.js";
    import {quoteOrder} from "@/api/myorder/index.js";
    import partList from "./partSearch";
    import brand from "@/views/shopping/model/pulb";
    import preview from "./previewOrder"

    const {ipcRenderer} = require("electron");
    export default {
        data() {
            return {
                previewOrder: false,
                redo: false,
                commitAgain:false,
                order: [{
                    "classify": "原厂件",
                    "name": "",
                    "num": 1,
                    "priceShow": '',
                    "type": "CASH",
                    isShow: false,
                    scheduledDays: '0',
                    remark: '',
                    remarkShow: false
                }],
                makeSureAgain: false,
                partsList: [],
                index: null,
                carBrand: {
                    logo: "",
                    vehicleBrand: "",
                    vehicleSerie: "",
                    // vin: ""
                },
                brandShow: false,
                showLoading: true,
                sellerRemark: "",
                buyerUserId: null,
                type: null,
                types: null,
                id: '',
                oldOrder: null,
                accid: null
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
        components: {partList, brand, preview},
        // watch: {
        //     'carBrand.vin': {
        //         handler(news, old) {
        //             if (!(/^[a-zA-Z\d]+$/.test(news))) {
        //                 this.$set(this.carBrand, 'vin', old)
        //             }
        //         },
        //         deep: true,
        //         immediate: true
        //     }
        // },
        mounted() {
            this.getPartType();
            ipcRenderer.on("newOrder", (a, data) => {
                if (data) {
                    this.getOrderDetial(data);
                }
            });
            ipcRenderer.on("userId", (a, data) => {
                data = JSON.parse(data);
                this.buyerUserId = data.userId;
                this.accid = data.accid;
            });
            ipcRenderer.send("giveMeId");
            //请求订单数据，请求完再关闭loading
        },
        methods: {
            isModify(){
                if (this.id) {
                    if (!this.Compared(this.assemble(), this.oldOrder)) {
                        this.commitAgain=true;
                        return;
                    }else
                        this.makeSureAgain=true;
                }else{
                    this.makeSureAgain=true;
                }
            },
            showRemark(a, item) {
                if (a == '品牌件') {
                    this.$set(item, 'remarkShow', true)
                } else
                    this.$set(item, 'remark', '')
            },
            getPartType() {
                getPartType().then(res => {
                    this.types = res.data;
                    let arr = [];
                    let type = [];
                    for (let x in res.data.classify) {
                        arr.push({
                            label: res.data.classify[x],
                            value: res.data.classify[x]
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
            check(index, val) {
                let input = this.order[index][val]
                if (!input) return
                let reg = /^[0-9]+([.]{0,1}[0-9]{0,2})$/;
                if (!reg.test(input)) {
                    let newValue = input.slice(0, -1)
                    this.$set(this.order[index], val, reg.test(newValue) ? newValue : 1)
                }
            },
            getOrderDetial(id) {
                //待确认
                quoteOrderDel({id: id}).then(res => {
                    this.carBrand.vehicleBrand = res.data.brandName;
                    this.buyerUserId = res.data.buyerUserId;
                    this.sellerRemark = res.data.sellerRemark;
                    // this.carBrand.vin = res.data.vin || '';
                    this.id = res.data.id;
                    this.carBrand.logo =
                        res.data.logo ||
                        "https://ss0.baidu.com/73x1bjeh1BF3odCf/it/u=945788614,517805603&fm=85&s=6ECA722359DAE1EB5E7C34CA0100A0B1";
                    this.order = res.data.quotedGoodsList.map(item => {
                        item.priceShow = item.price / 100
                        return item
                    });
                    res.data.quotedGoodsList = JSON.parse(JSON.stringify(this.order))
                    this.oldOrder = res.data;
                });
            },
            assemble() {
                if (
                    this.carBrand.logo &&
                    this.carBrand.vehicleBrand &&
                    this.order.length
                ) {
                    let flag = false;
                    this.order.map(item => {
                        delete item.isShow;
                        if (!item.name) {
                            flag = true;
                        }
                        item.price = FloatMul(item.priceShow, 100);
                    })
                    return flag ? false : {
                        brandName: `${this.carBrand.vehicleBrand}${this.carBrand.vehicleSerie ? '(' + this.carBrand.vehicleSerie + ')' : ''}`,
                        id: this.id || null,
                        logo: this.carBrand.logo,
                        buyerUserId: this.buyerUserId,
                        goodsList: this.order,
                        sellerRemark: this.sellerRemark || null,
                        // vin: this.carBrand.vin || null
                    };
                } else {
                    if (!this.carBrand.logo) {
                        this.$message.error("车型不能为空");
                    } else if (!this.order.length) {
                        this.$message.error("配件不能为空");
                    }
                    return false;
                }
            },
            Compared(obj1, obj2) {
                return obj1.brandName != obj2.brandName || obj1.remark != obj2.remark || JSON.stringify(obj1.goodsList) != JSON.stringify(obj2.quotedGoodsList)
            },
            commitOrder() {
                if (this.redo) {
                    return
                }
                let obj = this.assemble();
                if (obj) {
                    quoteOrder(this.assemble()).then(res => {
                        this.redo = true;
                        this.$message.success("订单已提交,3秒后自动关闭");
                        this.$store.dispatch("sendMsg", {
                            scene: 'p2p',
                            to: this.accid,
                            type: "custom",
                            content: {
                                msgType: 4,
                                msgContent: JSON.stringify({
                                    //测试清单
                                    orderId: res.data.id,
                                    buyerId: res.data.buyerUserId,
                                    brandLogo: res.data.logo,
                                    sellerId: res.data.sellerUserId,
                                    brandName: res.data.brandName,
                                    partName: res.data.quotedGoodsList.map(item => {
                                        return item.name
                                    }).join(','),
                                    isModify: Boolean(this.id),
                                    allPrice:parseInt(this.priceTotal*100)
                                })
                            },
                            done:()=>{
                                this.$store.dispatch("sendMsg", {
                                    scene: 'p2p',
                                    to: this.accid,
                                    type: "text",
                                    text: '已为您报价，请尽快去付款！'
                                })
                            }
                        });
                        ipcRenderer.send('orderFinish')
                    });
                }
            },
            //vin
            // search() {
            //     if (this.carBrand.vin.length == 17) {
            //         vin({
            //             vin: this.carBrand.vin
            //         }).then(res => {
            //             this.frameShow = true;
            //             this.vin = this.carBrand.vin;
            //             this.carBrand.vehicleBrand = res.data.baseInfo.brand;
            //             this.carBrand.vehicleSerie = res.data.baseInfo.series;
            //             this.carBrand.logo =
            //                 res.data.baseInfo.brandImgUrl ||
            //                 "http://cdn.xindongpeixun.com/oss/20181013/19574c5dd64045aea57cde7f139acf19.png";
            //         });
            //     } else {
            //         this.$message.warning("车架号错误，请检查");
            //     }
            // },
            delect(i) {
                this.order.splice(i, 1);
            },
            addOrder() {
                this.order.push({
                    "classify": "原厂件",
                    "name": "",
                    "num": 1,
                    "priceShow": '',
                    "type": "CASH",
                    isShow: false,
                    scheduledDays: '0',
                    remark: '',
                    remarkShow: false
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
                        this.$store.commit('setLoading', false)
                    });
                }
            },
            choose(val, item) {
                val.name = item[0].name;
            }
        },
        created() {
            this.$store.commit('setLoading', true)
            let {user} = this.$route.query;
            user = JSON.parse(user);
            if (user.orderId) {
                this.getOrderDetial(user.orderId);
                this.id = user.orderId
            } else {
                this.buyerUserId = user.userId;
            }
            this.accid = user.accid;
            this.getPartList();
        }
    };
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
        .bgc {
            left: 0;
        }
        .Preview {
            position: absolute;
            right: 0;
            top: -8px;
            border-radius: 4px;
            font-size: 12px;
            color: #4D4D4D;
            border: 1px solid #E6E6E6;
            padding: 9px 16px;
            cursor: pointer;
            img {
                margin-right: 10px;
                vertical-align: bottom;
            }
        }
        .contenerBox {
            padding: 10px 20px;
            height: calc(100% - 55px);
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
        .carInfo {
            @include fl;
            height: 50px;
            align-items: center;
            padding-left: 40px;
            border-bottom: 1px solid #cccccc;
            padding-bottom: 15px;
            .left {
                @include fl;
                justify-content: center;
                align-items: center;
                font-size: 0;
                margin-right: 70px;
                span {
                    width: 57px;
                    font-size: 14px;
                    margin-right: 9px;
                }
                .el-input {
                    height: 36px;
                }
            }
            .titWord {
                font-weight: 600;
                margin-right: 11px;
            }
            .brand {
                font-size: 14px;
                @include fl;
                align-items: center;
                div {
                    @include fl;
                    align-items: center;
                    @include border;
                    padding: 0 10px;
                    img {
                        width: 28px;
                        height: 28px;
                        vertical-align: middle;
                        margin-right: 13px;
                    }
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
            height: 54px;
            line-height: 54px;
            border: 1px solid #cccccc;
            border-top: 0 none;
            text-align: center;
            span {
                margin-left: 5px;
                color: #000;
            }
            .low {
                line-height: 36px;
            }
            .remarkShow {
                height: 18px;
                background: rgba(230, 230, 230, 1);
                overflow: hidden;
                display: flex;
                align-items: center;
                text-align: left;
                span {
                    display: inline-block;
                    width: calc(100% - 20px);
                    font-size: 12px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                img {
                    cursor: pointer;
                }
            }
            .remarks {
                @include fl;
                width: 335px;
                height: 48px;
                background: #fff;
                box-shadow: 0px 0px 8px 0px rgba(217, 217, 217, 1);
                justify-content: center;
                align-items: center;
                position: absolute;
                top: 54px;
                left: 0;
                z-index: 100;
                .el-input {
                    width: 258px;
                    line-height: 29px;
                    margin-right: 10px;
                }
                .el-button {
                    width: 47px;
                    height: 29px;
                    padding: 0;
                }
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
    .orderContent .previewOrder {
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

    .orderContent .remarks {
        .el-input__inner {
            width: 258px;
            height: 29px;
            line-height: 29px;
            border: 1px solid #ccc;
            text-align: left;
        }
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
        position: relative;
        .el-input.is-disabled .el-input__inner {
            background: transparent;
        }
        input {
            width: 100%;
            height: 69px;
            border: 0;
            text-align: center;
        }
    }
</style>
