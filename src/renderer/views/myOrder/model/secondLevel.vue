<template>
    <bg @click.native="disappear">
        <div class="secondShowArea scrollbar">
            <header>
                <span @click="$emit('input',false)"> 关闭</span>
                <p>{{title}}</p>
            </header>
            <div class="orderNumber" v-if="!quoteUse">订单号：{{detailInfo.tradeNo}}</div>
            <div class="rejected" v-if="(!afterSale&&detailInfo.status!='WAIT_SHIP'&&detailInfo.shipAddress)&&!quoteUse">
                <p>物流公司：<span>{{detailInfo.shipAddress.logistics}}</span></p>
                <p>物流单号：<span> {{detailInfo.shipAddress.logisticsNo}}</span></p>
                <p>物流电话：<span>{{detailInfo.shipAddress.logisticsMobile}}</span></p>
                <p class="recipient">收货人：<span>{{detailInfo.shipAddress.name}} {{detailInfo.shipAddress.mobile}}</span>
                </p>
                <p>收货地址：<span style="width:80%;display: inline-block;vertical-align: top;">{{detailInfo.shipAddress.province}} {{detailInfo.shipAddress.city}} {{detailInfo.shipAddress.region}} {{detailInfo.shipAddress.address}}</span>
                </p>
            </div>
            <div class="whriteExp" v-if="(address&&detailInfo.status=='WAIT_PAY')||quoteUse">
                <div style="position: relative">
                    <p>物流公司</p>
                    <el-input style="z-index: 5" placeholder="请输入物流名称"
                              @focus="logisticsList.showList=logisticsList.list" v-model="Logistics.name"></el-input>
                    <el-collapse-transition>
                        <choose @chooseLogisticsqq="logisticsSet" v-if="logisticsList.showList.length"
                                :list="logisticsList.showList"></choose>
                    </el-collapse-transition>
                </div>
                <div class="save">
                    <el-button type="success" @click="$emit('ship',Logistics.name);$emit('input',false);">确定</el-button>
                </div>
            </div>
            <div class="whriteExp" v-else-if="choose">
                <div class="radioChange">
                    <el-radio v-model="radio" label="1">物流快递</el-radio>
                    <el-radio v-model="radio" label="2">当面交易</el-radio>
                </div>
                <template v-if="radio == '1'">
                    <div style="position: relative">
                        <p>物流公司</p>
                        <el-input placeholder="请输入物流名称" @focus="logisticsList.showList=logisticsList.list"
                                  v-model="Logistics.name"></el-input>
                        <el-collapse-transition>
                            <choose @chooseLogisticsqq="logisticsSet" v-if="logisticsList.showList.length"
                                    :list="logisticsList.showList"></choose>
                        </el-collapse-transition>
                    </div>
                    <div>
                        <p>物流单号</p>
                        <el-input placeholder="请输入物流订单号" v-model="Logistics.logisticsNo"
                                  @blur.native="check(1)"></el-input>
                    </div>
                    <div>
                        <p>物流电话</p>
                        <el-input placeholder="请输入物流电话" v-model="Logistics.logisticsMobile"
                                  @blur.native="check(0)"></el-input>
                    </div>
                </template>
                <div class="save">
                    <el-button type="success" @click="submitLogistics">确定</el-button>
                </div>
            </div>
            <div class="rejected" v-if="afterSale&&detailInfo.refundShipAddress.logistics">
                <p>物流公司：<span>{{detailInfo.refundShipAddress.logistics}}</span></p>
                <p>物流单号：<span> {{detailInfo.refundShipAddress.logisticsNo}}</span></p>
                <p>物流电话：<span>{{detailInfo.refundShipAddress.logisticsMobile}}</span></p>
                <p class="recipient">收货人：<span>{{detailInfo.refundShipAddress.name}} {{detailInfo.refundShipAddress.mobile}}</span>
                </p>
                <p>收货地址：<span style="width:80%;display: inline-block;vertical-align: top;">{{detailInfo.refundShipAddress.province}} {{detailInfo.refundShipAddress.city}} {{detailInfo.refundShipAddress.region}} {{detailInfo.refundShipAddress.address}}</span>
                </p>
            </div>
        </div>
    </bg>
</template>
<script>
    import bg from "./bg.vue";
    import stepProgress from "./progress";
    import choose from './logisticsRecommend'
    import {setLogistics, shipmentsRefund, loisticList} from "@/api/myorder/index.js";

    export default {
        props: {
            afterSale:{
                type:Boolean,
                default:false
            },
            detailInfo: {
                type: Object,
                default(){
                    return{}
                }
            },
            autoSellor: {
                type: Boolean,
                default: false
            },
            address: {
                type: Object,
                default: null
            },
            quoteUse: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                title: "",
                Logistics: {
                    name: "",
                    logisticsNo: "",
                    logisticsMobile: ""
                },
                radio: '1',
                logisticsList: {
                    list: [],
                    showList: [],
                    show: false
                }
            };
        },
        created(){
            if(this.afterSale){
                this.Logistics.name=this.detailInfo.refundShipAddress?this.detailInfo.refundShipAddress.logistics:'';
            }else
                this.Logistics.name=this.detailInfo.shipAddress?this.detailInfo.shipAddress.logistics:'';
        },
        computed: {
            choose() {
                let del = this.detailInfo;
                if (this.autoSellor) {
                    if (this.afterSale) {
                        return del.status == 'WAIT_AGREES' && !this.autoSellor;
                    } else {
                        return del.status == 'WAIT_SHIP'
                    }
                } else {
                    if (this.afterSale) {
                        return del.status == 'WAIT_AGREES';
                    }
                }
            }
        },
        methods: {
            logisticsSet(item) {
                this.Logistics.name = item.name;
                this.Logistics.logisticsMobile = item.obile;
                this.logisticsList.list = [];
            },
            initList() {
                loisticList().then(res => {
                    this.logisticsList.list = res.data.defList;
                })
            },
            check(i) {
                if (i) {
                    let reg = /^\w$/;
                    if (!reg.test(this.Logistics.logisticsNo)) {
                        this.$message.warning('物流单号不能包含特殊字符')
                    }
                } else {
                    let reg1 = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
                    if (!reg.test(this.Logistics.logisticsMobile)) {
                        this.$message.warning('物流单号不能包含特殊字符')
                    }
                }
            },
            disappear(e) {
                if (e.target.className == 'opcityBg') {
                    this.$emit('input', false)
                }
            },
            submitLogistics() {
                let obj = this.radio == '1' ? {
                    logistics: this.Logistics.name,
                    logisticsMobile: this.Logistics.logisticsMobile,
                    logisticsNo: this.Logistics.logisticsNo,
                    tradeNo: this.detailInfo.tradeNo
                } : {};
                if (this.afterSale) {
                    shipmentsRefund(Object.assign({orderRefundId: this.detailInfo.id}, obj)).then(res => {
                        this.$message.success('物流选择完成')
                        this.$emit('reload')
                    })
                } else {
                    setLogistics(obj).then(res => {
                        this.$message.success('物流选择完成')
                        this.$emit('reload')
                    });
                }
            }
        },
        watch: {
            'Logistics.name'(val) {
                this.logisticsList.showList = this.logisticsList.list.filter(item => item.name.includes(val))
            }
        },
        mounted() {
            this.initList();
            this.title = (() => {
                if (this.detailInfo.afterSale || this.detailInfo.orderRefund) {
                    if (this.detailInfo.status == 'FINISH') {
                        return "售后物流";
                    }
                }
                switch (this.detailInfo.status) {
                    case "WAIT_PAY":
                        return "物流选择"
                    case "WAIT_SHIP":
                        return "物流选择";
                    case "WAIT_TAKE":
                        return "物流信息";
                    case "FINISH":
                        return "物流信息";
                    case "OVERDUE":
                        return "已过期";
                    // case "WAIT_EVALUATE":
                    //   return "待评论";
                    case "POST_SALES":
                        return "退款物流";
                }
            })();
        },
        components: {bg, stepProgress, choose}
    };
</script>
<style lang="scss" scoped>
    .secondShowArea {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 520px;
        background: #fff;
        font-size: 16px;
        z-index: 10;
        .whriteExp {
            .save {
                justify-content: center;
                .el-button {
                    width: 200px;
                    background: #FC684F;
                    border: 0;
                }
            }
            div {
                display: flex;
                align-items: center;
                height: 70px;
                padding: 0 20px;
            }
            p {
                font-size: 18px;
                color: #666;
            }
        }
        .orderNumber,
        .logistics,
        .rejected,
        .whriteExp {
            padding: 0 20px;
            .el-input {
                .el-input__inner {
                    color: #000;
                }
            }
        }
        header {
            height: 47px;
            background: rgba(247, 247, 247, 1);
            align-items: center;
            color: #000;
            font-weight: bold;
            span {
                color: #FC684F;
                font-size: 18px;
                width: 10%;
            }
            p {
                text-align: center;
                width: 90%;
            }
        }
        .orderNumber {
            height: 66px;
            font-weight: bold;
            line-height: 46px;
            color: #333;
            border-bottom: 20px solid #e5e5e5;
        }
        .logistics {
            padding: 10px 20px;
            border-bottom: 10px solid #f2f2f2;
            line-height: 37px;
            h5 {
                font-size: 18px;
            }
            p {
                color: #999;
            }
        }
        .recipient {
            text-indent: 16px;
        }
        .rejected {
            color: #666666;
            line-height: 37px;
            /*border-bottom: 10px solid #f2f2f2;*/
            span {
                color: #000;
            }
        }
    }
</style>
<style lang='scss'>
    .whriteExp {
        .radioChange {
            .el-radio__inner {
                width: 20px;
                height: 20px;
            }
            .el-radio__inner::after {
                width: 6px;
                height: 6px;
            }
            span {
                font-size: 20px;
                font-weight: bold;
                color: black;
            }
        }
        .el-input {
            font-size: 16px;
            width: 283px;
            height: 44px;
            .el-input__inner {
                height: 44px;
                color: #000;
            }
        }
    }
</style>
