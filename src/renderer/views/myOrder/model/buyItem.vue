<template>
    <div class="item" :style="{borderColor:color}">
        <div class="header" :style="{backgroundColor:color}">
            <p>下单时间：{{vals.createTime|parseTime}}</p>
            <p>订单号：{{vals.tradeNo}}</p>
            <p v-if="!type">商家：{{vals.orderSellerInfo.name}}</p>
            <p v-else>买家：{{vals.orderBuyerInfo.name}}</p>
        </div>
        <div class="orderInfo" :style="{height:(vals.goodsList||vals.refundGoodsList).length*102+'px'}">
            <el-col :span="14" class="goods_list" :style="{borderColor:color}">
                <one-goods
                        :style="{borderBottom:index==(vals.goodsList||vals.refundGoodsList).length-1?'0':'1px solid #DBF3FE',borderColor: color}"
                        v-for="(item,index) in (vals.goodsList||vals.refundGoodsList)"
                        :val="val"
                        :item="item"
                        :type="type"
                        :goodsType="val.type||val.orderMain.type"
                        :key="index"></one-goods>
            </el-col>
            <el-col :span="3" class="goods_price" :style="{borderColor:color}">
                ￥{{(val.totalAmount||val.amount)|exNum}}
            </el-col>
            <el-col :span="4" class="goods_status" :style="{borderColor:color}">
                <div>
                    <p :style="{color:val.color||'userSet'}">{{val.statusC}}<span v-if="val.afterSale">（售后中）</span></p>
                    <p @click="refund?$emit('showRefundDetail',val,false):$emit('showDetail',val,false)"
                       style="cursor: pointer;padding: 5px;border:1px solid #FF6749;border-radius: 3px">查看详情</p>
                </div>
            </el-col>
            <el-col :span="3" class="goods_do" :style="{borderColor:color}">
                <template v-if="refund">
                    <!--/卖家售后操作/-->
                    <div v-if="type">
                        <el-button v-if="vals.status=='WAIT_TAKE'" @click="orderCompleRefund">确认收货</el-button>
                        <el-button v-if="vals.status=='PENDING'&&vals.goodsStatus=='REFUND'" @click="agreeRefund">同意退款
                        </el-button>
                        <p v-if="vals.status=='PENDING'&&vals.goodsStatus=='REFUND'"
                           @click="refund?$emit('showRefundDetail',val,false):$emit('showDetail',val,false)">拒绝退款</p>
                        <el-button v-if="vals.status=='PENDING'&&vals.goodsStatus=='RETURN_REFUND'"
                                   @click="refund?$emit('showRefundDetail',val,false):$emit('showDetail',val,false)">
                            同意退货退款
                        </el-button>
                        <p v-if="vals.status=='PENDING'&&vals.goodsStatus=='RETURN_REFUND'"
                           @click="refund?$emit('showRefundDetail',val,false):$emit('showDetail',val,false)">拒绝退货退款</p>
                    </div>
                    <!--/买家售后操作/-->
                    <div v-else>
                        <el-button v-if="vals.status=='WAIT_AGREES'"
                                   @click="refund?$emit('showRefundDetail',val,false):$emit('showDetail',val,false)">
                            去发货
                        </el-button>
                        <el-button v-if="vals.status=='PENDING'"
                                   @click="refund?$emit('showRefundDetail',val,false):$emit('showDetail',val,false)">
                            修改售后
                        </el-button>
                        <p v-if="vals.status=='PENDING'" @click="cancleReturned">取消售后</p>
                        <p v-if="vals.status=='REJECT'"
                           @click="refund?$emit('showRefundDetail',val,false):$emit('showDetail',val,false)">客服介入</p>
                    </div>
                </template>
                <template v-else>
                    <!--/卖家正常操作/-->
                    <div v-if="type">
                        <p v-if="vals.status=='OVERDUE'" @click="delOrder">删除订单</p>
                        <el-button v-if="vals.status=='WAIT_SHIP'"
                                   @click="refund?$emit('showRefundDetail',val,false):$emit('showDetail',val,false)">
                            去发货
                        </el-button>
                        <p v-if="vals.status=='WAIT_SHIP'" @click="refundAll">全部退款</p>
                        <p v-if="vals.status=='WAIT_PAY'" @click="cancleOrder">取消订单</p>
                    </div>
                    <!--/买家正常操作/-->
                    <div v-else>
                        <el-button v-if="vals.status=='WAIT_SHIP'" @click="goToTalk">发货提醒</el-button>
                        <p v-if="vals.status=='OVERDUE'" @click="delOrder">删除订单</p>
                        <el-button v-if="vals.status=='WAIT_PAY'"
                                   @click="refund?$emit('showRefundDetail',val,false):$emit('showDetail',val,false)">付款
                        </el-button>
                        <el-button v-if="vals.status=='WAIT_TAKE'" @click="finish">确认收货</el-button>
                        <p v-if="vals.status=='FINISH'||vals.status=='WAIT_TAKE'"
                           @click="toAfterSale">申请售后</p>
                        <p v-if="vals.status=='WAIT_PAY'" @click="cancleOrder">取消订单</p>
                        <p v-if="vals.status=='WAIT_SHIP'"
                           @click="refund?$emit('showRefundDetail',val,false):$emit('showDetail',val,false)">申请退款</p>
                    </div>
                </template>
            </el-col>
        </div>
    </div>
</template>
<script>
    import {parseTime} from "@/utils/index.js";
    import {lookPhoto} from "@/api/admission/admission";
    import {getLocal} from "@/utils/localstorage";
    import oneGoods from './oneGoods';

    const {ipcRenderer} = require("electron");
    import {
        pay,
        returned,
        cancleReturned,
        updateReturned,
        finishOrder,
        delOrder,
        refundAll,
        cancleOrder, orderCompleRefund
    } from "@/api/myorder/index"

    export default {
        components: {oneGoods},
        props: {
            val: {
                type: Object,
                default: {}
            },
            type: {
                type: Number
            },
            refund: {
                type: Boolean
            }
        },
        data() {
            return {
                isFinish: 0,
                show: false,
                num: 3,
                status: "",
                vals: null
            };
        },
        activated() {
            this.statusChange()
        },
        updated() {
            this.statusChange()
        },
        created() {
            let obj = this.val;
            this.vals = obj;
            this.vals.orderBuyerInfo = this.vals.buyerInfo || this.vals.orderBuyerInfo;
            this.vals.orderSellerInfo = this.vals.sellerInfo || this.vals.orderSellerInfo;
        },
        mounted() {
            this.statusChange()
        },
        methods: {
            toAfterSale() {
                if (this.refund) {
                    this.$message.error('订单正在售后中，请到售后列表查看');
                    return;
                } else if (this.val.settle) {
                    this.$message.error('此订单已结算不能发起售后，如有疑问可联系平台客服咨询');
                    return;
                }
                this.refund ? this.$emit('showRefundDetail', this.val, false) : this.$emit('showDetail', this.val, false)
            },
            orderCompleRefund() {
                this.$confirm('确认后，此订单付款金额将全部退还给买家，请谨慎选择。')
                    .then(_ => {
                        this.request(orderCompleRefund, '已确认收货，退款完成', this.val.id)
                    }).catch(_ => {
                })
            },
            cancleReturned() {
                this.request(cancleReturned, '取消售后成功', this.val.id)
            },
            agreeRefund() {
                this.$confirm('确认后，此订单付款金额将全部退还给买家，请谨慎选择。')
                    .then(_ => {
                        this.request(orderCompleRefund, '退款成功', this.val.id)
                    }).catch(_ => {
                })
            },
            goToTalk() {
                this.$store.dispatch('sendMsg', {
                    scene: 'p2p',
                    to: this.vals.orderSellerInfo.accid,
                    type: "text",
                    text: '订单已付款，请尽快发货。\n订单号：' + this.vals.tradeNo
                })
                this.$message.success('已提醒卖家尽快发货');
            },
            cancleOrder() {
                this.request(cancleOrder, '订单已取消')
            },
            refundAll() {
                this.request(refundAll, '已全部退款给买家')
                this.sendCustom8()
            },
            delOrder() {
                this.request(delOrder, '删除成功')
            },
            pay() {
                pay().then(res => location.reload())
            },
            finish() {
                if (this.refund) {
                    this.$message.error('订单正在售后中，请前往售后单查看')
                }
                this.request(finishOrder, '确认收货成功，订单已完成')
            },
            revert(item) {
                ipcRenderer.send("orderWindowCreated", item.tradeNo);
            },
            request(url, msg, id) {
                this.$store.commit('setLoading', true)
                url(id ? {orderRefundId: id} : {tradeNo: this.val.tradeNo}).then(res => {
                    this.$message.success(msg);
                    this.$emit('refresh')
                })
            },
            detailWatch() {
                this.$emit('showDetail', this.val, false)
            },
            yesNO() {
                return isFinite == 1;
            },
            look() {
                this.item.imageList.length ? lookPhoto(0, this.item.imageList) : null;
            },
            sendCustom8() {
                let account = this.type ? this.vals.orderBuyerInfo.accid : this.vals.orderSellerInfo.accid;
                this.$store.dispatch("sendMsg", {
                    scene: 'p2p',
                    to: account,
                    type: "custom",
                    content: {
                        msgType: 8,
                        msgContent: JSON.stringify({
                            orderId: this.vals.id,
                            buyerId: this.vals.orderBuyerInfo.userId,
                            buyerName: this.vals.orderBuyerInfo.name,
                            orderNum: this.vals.tradeNo,
                            sellerId: this.vals.orderSellerInfo.userId,
                            sellerName: this.vals.orderSellerInfo.name,
                            orderTime: this.vals.payTime,
                            orderPrice: this.vals.totalAmount,
                            orderFrom: 'refund'
                        })
                    }
                });
            },
            statusChange() {
                switch (this.val.status) {
                    case "WAIT_PAY":
                        this.$set(this.val, 'color', '#FF0000');
                        this.$set(this.val, 'statusC', '待付款');
                        return "待付款";
                    case "WAIT_SHIP":
                        this.$set(this.val, 'color', '#FF0000');
                        this.$set(this.val, 'statusC', '待发货');
                        return "待发货";
                    case "WAIT_TAKE":
                        this.$set(this.val, 'color', '#FF0000');
                        this.$set(this.val, 'statusC', this.refund ? '待收货(售后中)' : '待收货');
                        return "待收货";
                    case "FINISH":
                        this.$set(this.val, 'color', 'gray');
                        this.$set(this.val, 'statusC', '已完成');
                        return "已完成";
                    case "OVERDUE":
                        this.$set(this.val, 'color', 'gray');
                        this.$set(this.val, 'statusC', '已过期');
                        return "已过期";
                    case "PENDING":
                        this.$set(this.val, 'color', '#FF0000');
                        this.$set(this.val, 'statusC', '售后中');
                        return "待评论";
                    case "WAIT_AGREES":
                        this.$set(this.val, 'color', '#FF0000');
                        this.$set(this.val, 'statusC', '待发货（售后中）');
                        return "待发货（售后中）";
                    case "REJECT":
                        this.$set(this.val, 'color', '#FF0000');
                        this.$set(this.val, 'statusC', '拒绝售后');
                        return "拒绝售后";
                    case "OK":
                        this.$set(this.val, 'color', 'gray');
                        this.$set(this.val, 'statusC', '售后完成');
                        return "售后完成";
                    case "CANCEL":
                        this.$set(this.val, 'color', 'gray');
                        this.$set(this.val, 'statusC', '取消售后');
                        return "取消售后";
                }
            }
        },
        computed: {
            goodsList() {
                return (this.vals.goodsList || this.vals.refundGoodsList).map(v => {
                    return v.name;
                });
            },
            time() {
                let createTimeC = parseTime(this.val.createTime);
                return createTimeC;
            },
            color() {
                return this.vals.status == "FINISH" || this.vals.status == "OK" ? '#F1F1F1' : 'DBF3FE'
            }
        }
    };
</script>
<style lang="scss" scoped>
    @mixin flex {
        display: flex;
        align-items: center;
    }

    $size: 12px;
    $lineheingt: 102px;
    .item {
        border: 1px solid #DBF3FE;
        font-size: $size;
        margin: 0 0px 10px 0px;
        .header {
            padding-left: 10px;
            height: 44px;
            background: #DBF3FE;
            @include flex;
            p {
                margin-right: 30px;
            }
        }

        .orderInfo {
            text-align: center;
            overflow: hidden;
            > div {
                border-right: 1px solid #DBF3FE;
                height: 100%;
            }
            .border {
                border-color: #eee;
            }
            .goods_price {
                line-height: $lineheingt;
                color: #FF2500;
                font-size: 14px;
            }
            .goods_status, .goods_do {
                div {
                    height: 102px;
                    @include flex;
                    justify-content: center;
                    flex-direction: column;
                    text-align: center;
                }
            }
            .goods_status {
                p {
                    margin: 10px;
                }
            }
            .goods_do {
                p {
                    cursor: pointer;
                    margin-top: 10px;
                }
                .el-button {
                    width: 78px;
                    height: 30px;
                    padding: 0;
                    font-size: 12px;
                }
            }
        }
    }
</style>