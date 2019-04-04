<template>
    <div class="orderInfo">
        <div class="Rejected" v-if="afterSale">
            <!--<div class="company" v-if="detailInfo.shipAddress">-->
            <!--<b><img src="@/../../static/image/huoche.png" width="30" height="20" alt=""><span>配送物流</span></b>-->
            <!--<p><span>{{ detailInfo.shipAddress.logistics }}  {{ detailInfo.shipAddress.logisticsNo}}</span><span-->
            <!--class="el-icon-arrow-right"></span></p>-->
            <!--</div>-->
            <h2 style="margin: 20px 0">退款信息</h2>
            <goods-list v-if="detailInfo.type=='GENERAL_ORDER'"
                        :list="detailInfo.refundGoodsList" :afterSale="afterSale"></goods-list>
            <div class="payNowOrder" v-else>
                <img :src="autoSellor?detailInfo.orderBuyerInfo.logo:detailInfo.orderSellerInfo.logo" width="80" alt="">
                <div>
                    <p>支付方式：{{detailInfo.orderMain.payType|getPay}}支付</p>
                    <p>交易金额： <span>¥{{(detailInfo.orderMain.totalAmount/100).toFixed(2)}}</span></p>
                </div>
            </div>
            <p>
                <span>售后类型：</span> {{detailInfo.goodsStatus=='REFUND'?'仅退款':'退货退款'}}
            </p>
            <p>
                <span>退款原因：</span> {{detailInfo.reason}}
            </p>
            <div>
                <span>退款说明：</span>
                <p>{{detailInfo.explain}}</p>
            </div>
            <p>
                <span>退款金额：</span>
                <i>￥{{detailInfo.amount|exNum}}</i>
            </p>
            <div>
                <span>凭证照片：</span>
                <div class="imgList">
                    <div v-for="(x,i) in detailInfo.imageList||[]" :key="i">
                        <img :src="x" width="100" @click="picLooker(i)">
                    </div>
                </div>
            </div>
            <p>
                <span>申请件数：</span> {{computedTotal(detailInfo.refundGoodsList)}}
            </p>
            <p>
                <span>申请时间：</span> {{detailInfo.createTime||0|parseTime}}
            </p>
            <p>
                <span>退款编号：</span>{{detailInfo.tradeNo}}
            </p>
        </div>
        <div v-if="afterSale">
            <div class="ship" v-if="detailInfo.refundShipAddress" @click="$emit('close')">
                <p>退货物流信息：</p>
                <div>
                    <p v-if="detailInfo.refundShipAddress.logistics">{{detailInfo.refundShipAddress.logistics }}
                        {{detailInfo.refundShipAddress.logisticsNo}}</p>
                    <p v-else>请选择</p>
                    <span class="el-icon-arrow-right"></span>
                </div>
            </div>
        </div>
        <slot name="top"></slot>
        <!--<h3 v-if="afterSale">全部商品</h3>-->
        <div class="buyer">
            <div class="left" v-if="autoSellor">
                <span>{{detailInfo.orderBuyerInfo.name}}</span>
            </div>
            <div class="left" v-else>
                <span>{{detailInfo.orderSellerInfo.name}}</span>
            </div>
            <div class="connectMe"
                 v-if="!$route.fullPath.includes('message')"
                 @click="detailInfo.type=='GENERAL_ORDER'?sendCustom7():sendCustom8()"
                 style="cursor: pointer;">
                <img src="@/../../static/image/newMsg.png" width="18" style="transform: rotateY(180deg)" alt>
                <span>{{autoSellor?'联系买家':'联系卖家'}}</span>
            </div>
        </div>
        <div v-if="detailInfo.order.type=='GENERAL_ORDER'&&!afterSale">
            <div class="brand">
                <div class="brandLogo">
                    <img :src="detailInfo.order.logo" width="28" alt>
                    <p>
                        {{detailInfo.order.brandName}}
                    </p>
                </div>
                <div class="vin">
                    <span>车架号：</span> {{detailInfo.order.vin}}
                </div>
            </div>
            <div class="partsList">
                <goods-list :list="detailInfo.order.goodsList"></goods-list>
            </div>
            <div class="orderRemark" v-if="!autoSellor">
                <p>卖家留言</p>
                <el-input type="textarea" v-model="detailInfo.orderSellerInfo.remark" :disabled="true"></el-input>
            </div>
            <div class="orderRemark" v-else>
                <p>买家留言</p>
                <el-input type="textarea" v-model="detailInfo.orderBuyerInfo.remark" :disabled="true"></el-input>
            </div>
        </div>
        <div v-if="detailInfo.order.type=='DIRECT_PAY_ORDER'&&!afterSale">
            <!--<div class="company" v-if="detailInfo.order.shipAddress">-->
                <!--<b><img src="@/../../static/image/huoche.png" width="30" height="20" alt=""><span>配送物流</span></b>-->
                <!--<p><span>{{ detailInfo.order.shipAddress.logistics }}  {{ detailInfo.order.shipAddress.logisticsNo}}</span><span-->
                        <!--class="el-icon-arrow-right"></span></p>-->
            <!--</div>-->
            <div class="payNowOrder">
                <img :src="autoSellor?detailInfo.orderBuyerInfo.logo:detailInfo.orderSellerInfo.logo" width="80" alt="">
                <div>
                    <p>支付方式：{{detailInfo.order.payType|getPay}}支付</p>
                    <p>交易金额 <span>¥{{(detailInfo.order.totalAmount/100).toFixed(2)}}</span></p>
                    <p v-if="!afterSale" style="color: #FF0000">
                        {{detailInfo.goodsList[0].refundNum==1?'(售后完成)':detailInfo.afterSale?'(售后中)':''}}</p>
                </div>
            </div>
            <div class="orderRemark" v-if="">
                <p>买家留言</p>
                <el-input type="textarea" v-model="detailInfo.orderBuyerInfo.remark" :disabled="true"></el-input>
            </div>
        </div>
        <div class="company" v-if="detailInfo.shipAddress&&!afterSale" @click="$emit('close')">
            <b><img src="@/../../static/image/huoche.png" width="30" height="20" alt=""><span>配送物流</span></b>
            <p><span>{{ detailInfo.shipAddress.logistics }}  {{ detailInfo.shipAddress.logisticsNo}}</span><span
                    class="el-icon-arrow-right"></span></p>
        </div>
        <div class="total" v-if="!afterSale">
            <p>红包优惠: <span style="font-weight: bold">- ¥0.00</span></p>
            <p>共<span>{{detailInfo.order.goodsList.length}}</span>件，合计:
                <span>￥{{(detailInfo.order.totalAmount/100).toFixed(2)}}</span><span>(不含运费)</span></p>
        </div>
        <div class="orderNum" v-if="!afterSale">
            <div class="OrderNumber">
                <p>订单编号：{{detailInfo.order.tradeNo}}</p>
                <span @click="copy(detailInfo.order.tradeNo)">复制</span>
            </div>
            <div style="height: auto;">
                <div v-if="detailInfo.order.createTime">创建时间：{{detailInfo.order.createTime|parseTime}}</div>
                <div v-if="detailInfo.order.payTime">付款时间：{{detailInfo.order.payTime|parseTime}}</div>
                <div v-if="detailInfo.order.shipTime">发货时间：{{detailInfo.order.shipTime|parseTime}}</div>
                <div v-if="detailInfo.order.payType">支付方式：{{detailInfo.order.payType |getPay }}</div>
            </div>
        </div>


        <!--<div v-if="detailInfo.status != 'WAIT_PAY' && detailInfo.status != 'POST_SALES'">-->
        <!--<div style="height: 10px;background: #eee;"></div>-->
        <!--<div class="orderRemark">-->
        <!--<p>买家留言</p>-->
        <!--<el-input v-model="detailInfo.orderBuyerInfo.remark" :disabled="true"></el-input>-->
        <!--</div>-->
        <!--</div>-->

    </div>
</template>
<script>
    import goodsList from "@/components/order/goodsList";
    import logistics from './logisticsdel'

    const {clipboard} = require("electron");
    import {lookPhoto} from "@/api/admission/admission"

    export default {
        filters: {
            getPay(val) {
                let obj = {
                    ALIPAY: '支付宝',
                    WECHAT: '微信',
                    BALANCE: '余额'
                }
                return obj[val];
            },
            getNormal(str) {
                return this.afterSale ? this.detailInfo.orderMain[str] : this.detailInfo[str];
            }
        },
        components: {goodsList, logistics},
        data() {
            return {}
        },
        props: {
            detailInfo: {
                type: Object,
                default: {}
            },
            autoSellor: {
                type: Boolean
            },
            afterSale: {
                type: Boolean
            }
        },
        methods: {
            sendCustom7() {
                let account = this.autoSellor ? this.detailInfo.orderBuyerInfo.accid : this.detailInfo.orderSellerInfo.accid;
                this.detailInfo.payTime && this.$store.dispatch("sendMsg", {
                    scene: 'p2p',
                    to: account,
                    type: "custom",
                    content: {
                        msgType: 7,
                        msgContent: JSON.stringify({
                            orderId: this.detailInfo.id,
                            buyerId: this.detailInfo.orderBuyerInfo.userId,
                            buyerName: this.detailInfo.orderBuyerInfo.name,
                            sellerId: this.detailInfo.orderSellerInfo.userId,
                            orderNum: this.detailInfo.tradeNo,
                            brandName: this.detailInfo.order.brandName,
                            partName: this.detailInfo.order.goodsList.map(item => item.name).join(','),
                            orderPrice: this.detailInfo.order.totalAmount
                        })
                    }
                });
                this.$router.push('/message/index/' + 'p2p-' + account)
            },
            sendCustom8() {
                let account = this.autoSellor ? this.detailInfo.orderBuyerInfo.accid : this.detailInfo.orderSellerInfo.accid;
                this.detailInfo.payTime && this.$store.dispatch("sendMsg", {
                    scene: 'p2p',
                    to: account,
                    type: "custom",
                    content: {
                        msgType: 8,
                        msgContent: JSON.stringify({
                            orderId: this.detailInfo.id,
                            buyerId: this.detailInfo.orderBuyerInfo.userId,
                            buyerName: this.detailInfo.orderBuyerInfo.name,
                            orderNum: this.detailInfo.tradeNo,
                            sellerId: this.detailInfo.orderSellerInfo.userId,
                            sellerName: this.detailInfo.orderSellerInfo.name,
                            orderTime: this.detailInfo.order.payTime,
                            orderPrice: this.detailInfo.order.totalAmount,
                            orderFrom: 'order'
                        })
                    }
                });
                this.$router.push('/message/index/' + 'p2p-' + account)
            },
            picLooker(i) {
                lookPhoto(i, this.detailInfo.imageList)
            },
            copy(val) {
                clipboard.writeText(val);
                this.$message.success('复制成功')
            },
            computedTotal(val) {
                let num = 0;
                val.forEach(item => {
                    num += item.refundNum
                })
                return num
            }
        }
    };
</script>
<style lang="scss" scoped>
    .partsList {
        margin-bottom: 15px;
    }

    .company {
        padding: 0 20px;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #E6E6E6;
        span {
            cursor: pointer;
        }
        img {
            vertical-align: middle;
        }
    }

    .copy {
        color: #333;
    }

    .orderInfo .payNowOrder {
        display: flex;
        align-items: center;
        font-weight: bold;
        font-size: 16px;
        height: 130px;
        div {
            height: 80px;
            p {
                line-height: 20px;
                margin: 8px 0;
                span {
                    color: #FF0000;
                    float: none;
                }
            }
        }
        img {
            margin: 0 20px;
            border-radius: 6px;
        }
    }

    .company {
        padding: 0 20px;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #E6E6E6;
        border-top: 1px solid #E6E6E6;
        b {
            span {
                margin-left: 10px;
                font-size: 20px;
            }
        }
        p {
            span {
                font-size: 16px;
            }
        }
        span {
            cursor: pointer;
        }
        img {
            vertical-align: middle;
        }
    }

    .total {
        font-size: 16px;
        text-align: right;
        line-height: 35px;
        padding-right: 10px;
        border-bottom: 5px solid #f1f1f1;
        border-top: 1px solid #f1f1f1;
        p:nth-child(2) {
            margin-top: -10px;
            span {
                font-size: 20px;
                color: red;
                font-weight: bold;
            }
            span:nth-last-child(1) {
                font-size: 14px;
                color: #ccc;
            }
        }
    }

    .imgList {
        div {
            width: 100px;
            height: 80px;
            overflow: hidden;
            background: #999;
        }
    }

    .orderInfo {
        font-size: 14px;
        .orderRemark,
        .buyer,
        .brand,
        .orderNum,
        .Rejected {
            padding: 0 20px;
        }
        .orderRemark {
            padding-bottom: 10px;
            p {
                font-size: 16px;
                line-height: 30px;
                font-weight: bold;
            }
        }
        .ship {
            height: 65px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid #e6e6e6;
            border-bottom: 1px solid #e6e6e6;
            padding: 0 20px 0 27px;
            font-size: 16px;
            > div {
                display: flex;
            }
            span {
                font-size: 20px;
            }

        }
        .Rejected {
            font-size: 14px;
            color: #000;
            line-height: 30px;
            .payNowOrder {
                img {
                    margin: 0 20px 0 0;
                }

            }
            > div {
                overflow: hidden;
                span {
                    float: left;
                }
                > p {
                    width: calc(100% - 75px);
                    float: left;
                }
            }
            span {
                color: #666;
            }
            i {
                font-style: normal;
                color: #fc684f;
            }
            img {
                border-radius: 4px;
                margin-right: 10px;
            }
        }
        h3 {
            height: 38px;
            background: #4293CC;
            color: #fff;
            text-align: center;
            line-height: 38px;
            font-size: 18px;
        }
        .buyer {
            height: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            border-bottom: 1px solid #e6e6e6;
            div {
                img {
                    vertical-align: text-bottom;
                    border-radius: 2px;
                }
            }
        }
        .brand {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 14px;
            height: 66px;
            .brandLogo {
                display: flex;
                align-items: center;
                padding: 0 10px;
                height: 36px;
                border: 1px solid rgba(204, 204, 204, 1);
                border-radius: 6px;
                margin-right: 180px;
                img {
                    margin-right: 5px;
                }
            }
            .vin {
                line-height: 20px;
                color: #666666;
                height: 20px;
                span {
                    color: #999;
                }
            }
        }
        .orderNum {
            font-size: 14px;
            color: #666;
            .OrderNumber {
                display: flex;
                align-items: center;
                span {
                    width: 44px;
                    height: 22px;
                    font-size: 12px;
                    text-align: center;
                    line-height: 20px;
                    border: 1px solid rgba(252, 164, 79, 1);
                    border-radius: 4px;
                    cursor: pointer;
                    margin-left: 20px;
                }
                span:hover {
                    background-color: #ffeee1;
                    color: #fc684f;
                }
            }
            div {
                height: 30px;
                line-height: 30px;
            }
        }
    }
</style>
