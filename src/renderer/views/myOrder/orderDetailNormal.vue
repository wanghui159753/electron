<template>
    <bg>
        <div class="DetailShowArea" v-if="detailInfo">
            <div class="header">
                <div class="Record" @click="show=!show;stepType=1">
                    <img src="@/../../static/image/Record.png" width="14" alt>
                    <span>订单记录</span>
                </div>
                <p class="plac">订单详情</p>
                <span class="el-icon-close" @click='$emit("showDetail")'></span>
            </div>
            <div class="scrollArea scrollbar">
                <step :status='detailInfo.statusC'
                      v-if="detailInfo.status !== 'FINISH'&&detailInfo.status !== 'OVERDUE'"
                      :autoseller="autoSellor"
                      :status2="detailInfo.status"
                      :afterSale="detailInfo.afterSale">
                </step>
                <status-time
                        :type="autoSellor"
                        :status1="detailInfo.status"
                        :time="detailInfo.createTime"
                        :shipTime="detailInfo.shipTime">
                </status-time>
                <logistics
                        :address="address"
                        @close="showWl"
                        @choosAddress="addressChoose=true"
                        :type="autoSellor"
                        :del="detailInfo"
                >
                </logistics>
                <order :detailInfo='detailInfo' @close="logisticsShow=true" :autoSellor="autoSellor"></order>
                <div slot="top">
                    <div class="refundHistory" v-if="detailInfo.orderRefund" @click="show=!show;stepType=0">
                        <p><img src="@/../../static/image/refundHistory.png" width="20" alt="">退款记录</p>
                        <span class="el-icon-arrow-right"></span>
                    </div>
                </div>
            </div>
            <footer>
                <p v-if="this.detailInfo.status!='FINISH'||autoSellor">
                    合计：<span>￥{{detailInfo.totalAmount|exNum}}</span>
                    <span>(不含运费)</span>
                </p>
                <div class="autoseller" v-if="autoSellor">
                    <el-button v-if="detailInfo.status=='OVERDUE'" @click="delOrder">删除订单</el-button>
                    <el-button v-if="detailInfo.status=='WAIT_PAY'" @click="cancle" type="primary" plain>取消订单
                    </el-button>
                    <el-button type="danger" @click="logisticsShow=!logisticsShow"
                               v-if="detailInfo.status == 'WAIT_SHIP'">确认发货
                    </el-button>
                    <el-button type="danger" v-if="detailInfo.status == 'WAIT_SHIP'" @click.native="refundAll=true">
                        全部退款
                    </el-button>

                </div>
                <div class="buyer" style="display: flex" v-else>
                    <el-button v-if="detailInfo.status=='OVERDUE'" @click="delOrder">删除订单</el-button>
                    <el-button v-if="detailInfo.status=='WAIT_PAY'" @click="cancle" type="primary" plain>取消订单
                    </el-button>
                    <el-button v-if="detailInfo.status=='WAIT_PAY'" type="danger" @click="pay">付款</el-button>
                    <el-button v-if="detailInfo.status=='WAIT_SHIP'&&!detailInfo.afterSale" type="danger"
                               @click="goToTalk">提醒卖家发货
                    </el-button>
                    <el-button v-if="detailInfo.status=='WAIT_TAKE'" type="danger"
                               @click="finish">确认收货
                    </el-button>
                    <el-button
                            v-if="detailInfo.status!='WAIT_PAY'&&detailInfo.status!='FINISH'&&detailInfo.status!='WAIT_TAKE'&&detailInfo.status!='OVERDUE'&&!detailInfo.afterSale"
                            type="primary" plain @click="buyer.applyAfterSale=true">申请退款
                    </el-button>
                    <el-button v-if="detailInfo.status=='FINISH'||detailInfo.status=='WAIT_TAKE'"
                               type="primary" plain
                               @click="after">申请售后
                    </el-button>
                    <!--<el-button type="warning" plain :del="detailInfo" v-if="detailInfo.status=='FINISH'"-->
                    <!--@click="serviceInterventionShow=true">客服介入-->
                    <!--</el-button>-->
                </div>
            </footer>
        </div>
        <transition name="el-fade-in-linear">
            <second v-if="logisticsShow" v-model="logisticsShow" :afterSale="false"
                    @ship="address.logistics=arguments[0];pay()"
                    @reload="reload" :address="address" :autoSellor="autoSellor" :detailInfo='detailInfo'
                    @close="close"></second>
        </transition>
        <transition name="el-fade-in-linear">
            <step-progress v-model="show" v-if="show" :type="stepType" :detail="detailInfo"></step-progress>
        </transition>
        <el-dialog
                width="340px"
                height="183px"
                :center="true"
                :modal-append-to-body="false"
                :visible.sync="buyer.applyAfterSale"
                v-if="buyer.applyAfterSale" :append-to-body="false" top="15%" custom-class="afterSaleName">
            <h3 slot="title">请选择售后类型</h3>
            <el-radio-group v-model="buyer.returnedType" style="margin: 40px 0">
                <el-radio :label="'退货退款'">退货退款</el-radio>
                <el-radio :label="'仅退款'">仅退款</el-radio>
            </el-radio-group>
            <div slot="footer">
                <el-button @click="buyer.applyAfterSale=false">取消</el-button>
                <el-button type="primary" style="margin-left: 50px" plain @click="chooseRefundType">确定</el-button>
            </div>
        </el-dialog>
        <buyer-refund
                :list="detailInfo"
                v-if="buyer.afterSaleShow"
                @reLoad="reload"
                @sendMsg="senCustom8"
                v-model="buyer.afterSaleShow"
                :type="detailInfo.type=='GENERAL_ORDER'"
                :returnedType="buyer.returnedType">
        </buyer-refund>
        <pass
                v-if="sellerRefund.passwordShow"
                :dialogVisible=sellerRefund.passwordShow
                @withdraw='sellerRefund.passwordShow=false'
                @getPass='passWord'>
        </pass>
        <transition name="el-zoom-in-top">
            <choose-address v-show="addressChoose" v-model="addressChoose" :order="1" class="address"
                            @address="saveAddress"></choose-address>
        </transition>
        <el-dialog
                width="450px"
                height="533px"
                :center="true"
                :modal-append-to-body="false"
                :visible.sync="payCode"
                :append-to-body="false"
                top="10%"
                @close="clear"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :before-close="handleClose"
                custom-class="payCode">
            <template slot="title">扫码支付</template>
            <payCode v-if="payCode" @start="training" @stop="clear" :address="address" :del="detailInfo"></payCode>
        </el-dialog>
        <el-dialog
                width="450px"
                height="444px"
                :modal-append-to-body="false"
                :visible.sync="serviceInterventionShow"
                v-if="serviceInterventionShow"
                :append-to-body="false"
                top="10%"
                center
                custom-class="intervention">
            <h3 slot="title">申请客服介入</h3>
            <service-intervention v-model="serviceInterventionShow" :del="detailInfo"
                                  :type="autoSellor"></service-intervention>
        </el-dialog>
        <el-dialog
                width="300px"
                height="300px"
                :modal-append-to-body="false"
                :visible.sync="refundAll"
                v-if="refundAll"
                :center="true"
        >
            <h2 slot="title" style="color: #f00">警告</h2>
            <p style="font-size: 16px;text-align: center;line-height: 70px">确认后将全部退款给买家</p>
            <div slot="footer">
                <el-button type="success" @click="refundAll=false" style="margin-right: 35px">取消</el-button>
                <el-button type="danger" @click="refundAllToBuyer">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
                width="300px"
                height="300px"
                :modal-append-to-body="false"
                :visible.sync="setPass"
                v-if="setPass"
                :center="true"
        >
            <h3 slot="title" style="color: #f00">注意</h3>
            <p style="font-size: 16px;text-align: center">你还没有设置支付密码,去设置</p>
            <div slot="footer">
                <el-button type="danger" @click="$router.push('/purse/index')">确定</el-button>
            </div>
        </el-dialog>
        <pay-now  v-if="payFinish" v-model="payFinish" :detail="detailInfo"></pay-now>
    </bg>
</template>
<script>
    import {getLocal} from "../../utils/localstorage";
    import rejectDialog from "./model/reject"
    import stepProgress from "./model/progress";
    import bg from "./model/bg";
    import buyerRefund from "./model/buyerRefund";
    import step from "./model/stepLine";
    import statusTime from "./model/statusTime";
    import order from "./model/orderNum";
    import logistics from "./model/logistics";
    import payCode from "@/components/pay/choosePay"
    import serviceIntervention from "./model/serviceIntervention"
    import {
        pay,
        training,
        returned,
        reject,
        refundAll,
        cancleReturned,
        updateReturned,
        sellerAgreeAll,
        finishOrder,
        cancleOrder,
        completeRefund,
        undoneRefund,
        delOrder
    } from "@/api/myorder/index";
    import pass from "@/components/pay/passWord";
    import second from "./model/secondLevel";
    import {findDetailByOrderId} from '@/api/myorder/index'
    import chooseAddress from "./../sysset/components/address"
    import {getDefault} from "@/api/merchant/address"
    import payNow from '@/components/chat/paySunncess';
    export default {
        data() {
            return {
                payFinish:false,
                setPass: false,
                refundAll: false,
                serviceInterventionShow: false,
                show: false,
                detailInfo: null,
                logisticsShow: false,
                buyer: {
                    //买家退款使用
                    returnedType: '退货退款',
                    //买家退款使用
                    applyAfterSale: false,
                    //买家退款使用
                    afterSaleShow: false,
                },
                timers: null,
                sellerRefund: {
                    passwordShow: false,
                    //支付密码
                    payPassword: '',
                    passwordType: '',
                    agree: undefined,
                    rejectShow: false
                },
                reject: {
                    reason: '',
                    imageList: []
                },
                //售后记录使用
                stepType: 1,
                address: null,
                addressChoose: false,
                //支付相关
                payCode: false,
                binding: null,
                autoSellor: false
            }
        },
        components: {
            payNow,
            bg,
            step,
            statusTime,
            order,
            logistics,
            second,
            stepProgress,
            chooseAddress,
            buyerRefund,
            rejectDialog,
            payCode,
            pass,
            serviceIntervention
        },
        props: {
            detailInfoId: {
                type: String,
                default: ''
            },
            // autoSellor: {
            //     type: Boolean,
            //     default: false
            // }
        },
        methods: {
            handleClose(done) {
                this.$confirm('确定关闭付款页面吗?')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
            after() {
                if (this.detailInfo.afterSale) {
                    this.$message.error('订单正在售后中，不可重复申请')
                    return;
                } else if (this.detailInfo.settle) {
                    this.$message.error('此订单已结算不能发起售后，如有疑问可联系平台客服咨询')
                    return;
                }
                this.buyer.applyAfterSale = true
            },
            delOrder() {
                delOrder({tradeNo: this.detailInfo.tradeNo}).then(res => {
                    this.$emit('refresh');
                    this.$message.success('删除成功');
                    this.$emit("showDetail");
                })
            },
            senCustom8(val) {
                this.sendCustomMsg(8, JSON.stringify({
                    orderId: this.detailInfo.id,
                    buyerId: this.detailInfo.orderBuyerInfo.userId,
                    buyerName: this.detailInfo.orderBuyerInfo.name,
                    orderNum: this.detailInfo.tradeNo,
                    sellerId: this.detailInfo.orderSellerInfo.userId,
                    sellerName: this.detailInfo.orderSellerInfo.name,
                    orderTime: this.detailInfo.payTime,
                    orderPrice: this.detailInfo.totalAmount,
                    orderFrom: val ? 'order' : 'refund'
                }), val ? () => {
                    this.$store.dispatch("sendMsg", {
                        scene: 'p2p',
                        to: this.autoSellor ? this.detailInfo.orderBuyerInfo.accid : this.detailInfo.orderSellerInfo.accid,
                        type: "text",
                        text: '订单已支付，请尽快发货'
                    })
                } : null)
                // val&&this.$store.dispatch("sendMsg", {
                //     scene: 'p2p',
                //     to: this.autoSellor ? this.detailInfo.orderBuyerInfo.accid : this.detailInfo.orderSellerInfo.accid,
                //     type: "text",
                //     text: '订单已支付，请尽快发货'
                // })
            },
            refundAllToBuyer(e) {
                this.$store.commit('setLoading', true)
                refundAll({tradeNo: this.detailInfo.tradeNo})
                    .then(_ => {
                        this.senCustom8();
                        this.$message.success('已退款给买家')
                        this.initDetail();
                        this.$emit('refresh');
                        this.refundAll = false;
                    })
            },
            goToTalk() {
                this.$store.dispatch('sendMsg', {
                    scene: 'p2p',
                    to: this.detailInfo.orderSellerInfo.accid,
                    type: "text",
                    text: '订单已付款，请尽快发货。\n订单号：' + this.detailInfo.tradeNo
                })
                this.$message.success('已提醒卖家尽快发货');
            },
            showWl() {
                if (this.detailInfo.status == 'WAIT_SHIP' && !this.autoSellor) {
                    this.logisticsShow = false
                } else {
                    this.logisticsShow = true
                }
            },
            passWord(val) {
                this.sellerRefund.payPassword = val
                val.length == 6 && this.getPassWord();
            },
            getPassWord() {
                if (!this.binding) {
                    this.goSetPassWord = true;
                    return;
                }
                this.sellerRefund.passwordShow = false;
                if (this.sellerRefund.passwordType == 'afterSale') {
                    this.ReceiptAndRefund()
                } else if (this.sellerRefund.passwordType == 'pay') {
                    this.pay()
                } else {
                    this.refund();
                }
            },
            saveAddress(val) {
                if (!val.mobile) return
                this.address = {
                    address: val.address,
                    city: val.city || val.cityName,
                    mobile: val.mobile,
                    name: val.name,
                    province: val.province || val.provinceName,
                    region: val.region || val.regionName
                }
                this.addressChoose = false;
            },
            chooseRefundType() {
                this.buyer.applyAfterSale = false;
                this.buyer.afterSaleShow = true;
            },
            cancle() {
                cancleOrder({tradeNo: this.detailInfo.tradeNo}).then(res => {
                    this.initDetail();
                    this.refresh()
                })
            },
            cancleReturned() {
                cancleReturned({orderRefundId: this.detailInfo.orderRefund.refundGoodsList[0].orderRefundId}).then(res => {
                    this.$message.success('取消售后申请成功');
                    this.initDetail();
                    this.refresh()
                })
            },
            clear() {
                clearTimeout(this.timers);
            },
            training() {
                clearTimeout(this.timers);
                this.timers = setTimeout(() => {
                    training({tradeNo: this.detailInfo.tradeNo})
                        .then(res => {
                            if (res.data.payTime) {
                                clearTimeout(this.timers)
                                this.timers = null;
                                res.data.type != 'DIRECT_PAY_ORDER' ? this.sendMsg() : this.senCustom8(1);
                                this.initDetail();
                                this.$emit('refresh')
                                this.payCode = false;
                                this.payFinish=true;
                            } else
                                this.training();
                        })
                }, 1500)
            },
            sendCustomMsg(msgType, msgContent, done) {
                this.$store.dispatch("sendMsg", {
                    scene: 'p2p',
                    to: this.autoSellor ? this.detailInfo.orderBuyerInfo.accid : this.detailInfo.orderSellerInfo.accid,
                    type: "custom",
                    content: {
                        msgType,
                        msgContent
                    },
                    done
                });
            },
            sendMsg() {
                this.sendCustomMsg(7, JSON.stringify({
                    orderId: this.detailInfo.id,
                    buyerId: this.detailInfo.buyerUserId,
                    buyerName: this.detailInfo.buyerUserName,
                    orderNum: this.detailInfo.tradeNo,
                    sellerId: this.detailInfo.sellerUserId,
                    brandName: this.detailInfo.brandName,
                    partName: this.detailInfo.goodsList.map(item => item.name).join(','),
                    orderPrice: this.detailInfo.totalAmount
                }), () => {
                    this.$store.dispatch("sendMsg", {
                        scene: 'p2p',
                        to: this.autoSellor ? this.detailInfo.orderBuyerInfo.accid : this.detailInfo.orderSellerInfo.accid,
                        type: "text",
                        text: '订单已支付，请尽快发货'
                    })
                })
            },
            pay() {
                if (this.address) {
                    if (this.address.logistics) {
                        this.payCode = true;
                    } else
                        this.logisticsShow = true;
                } else
                    this.addressChoose = true;
            },
            finish() {
                if (this.detailInfo.afterSale) {
                    this.$message.error('订单正在售后中，不可操作')
                    return
                }
                finishOrder({tradeNo: this.detailInfo.tradeNo}).then(res => {
                    this.initDetail()
                    this.refresh()
                })
            },
            reload() {
                this.logisticsShow = false;
                this.initDetail()
                this.refresh()
            },
            refresh() {
                this.$emit('refresh')
            },
            init(val) {
                switch (val.status) {
                    case "WAIT_PAY":
                        val.statusC = "待付款"
                        val.statusR = '等待买家付款';
                        return
                    case "WAIT_SHIP":
                        val.statusC = "待发货";
                        val.statusR = '等待卖家发货';
                        return
                    case "WAIT_TAKE":
                        val.statusC = "待收货";
                        val.statusR = '等待买家收货';
                        return
                    case "FINISH":
                        val.statusC = "交易完成";
                        val.statusR = '交易完成';
                        return
                    case "OVERDUE":
                        val.statusC = "已过期";
                        val.statusR = '订单已过期';
                        return
                    case "WAIT_EVALUATE":
                        val.statusC = "待评论";
                        val.statusR = '等待买家评论';
                        return
                }
            },
            close() {
                this.show = !this.show;
            },
            initDetail() {
                this.$store.commit('setLoading', true)
                findDetailByOrderId({tradeNo: this.detailInfoId}).then(res => {
                    res.data.order = res.data;
                    this.autoSellor = res.data.orderBuyerInfo.userId != this.$store.state.user.storeInformation.userId;
                    this.init(res.data)
                    this.detailInfo = res.data;
                    this.$store.commit('setLoading', false)
                })
                    .then(() => {
                        if (this.detailInfo.status == 'WAIT_PAY' && !this.autoSellor) {
                            return getDefault()
                        }
                    }).then(res => {
                    if (res) {
                        this.saveAddress(res.data);
                    }
                })
            }
        },
        created() {
            this.binding = getLocal('isSetPassword') == 'true';
        },
        beforeDestroy() {
            clearTimeout(this.timers)
        },
        mounted() {
            this.initDetail()
        }
    }
    ;
</script>
<style lang="scss" scoped>
    .header {
        display: flex;
        justify-content: space-between;
        height: 46px;
        align-items: center;
        padding: 0 5px;
        border-bottom: 1px solid #f1f1f1;
        img {
            vertical-align: middle;
        }
    }

    .address {
        position: absolute !important;
        top: 0;
        bottom: 0;
        height: auto !important;
        /*left: 0px;*/
        /*margin: 0;*/
        width: 80% !important;
        left: 10%;
        min-width: 600px;
        max-height: 700px;
        background: #fff;
        z-index: 200;
    }

    .DetailShowArea {
        width: 800px;
        height: 100%;
        background: #fff;
        margin: 0 auto;
        border: 1px solid #e6e6e6;
        cursor: pointer;
        .refundHistory {
            height: 60px;
            border-top: 1px solid #E6E6E6;
            border-bottom: 1px solid #E6E6E6;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            p {
                font-size: 16px;
                font-weight: bold;
                img {
                    vertical-align: sub;
                    margin-right: 5px;
                }
            }
            span {
                font-size: 20px;
            }
        }
        .scrollArea {
            height: calc(100% - 102px);
        }
        footer {
            height: 56px;
            background: rgba(242, 242, 242, 1);
            box-shadow: 0px 0px 8px 0px rgba(129, 129, 129, 0.7);
            font-size: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
                font-size: 20px;
                color: #e60000;
            }
            p {
                margin-right: 20px;
                span:nth-child(2) {
                    color: #ccc;
                    font-size: 14px;
                }
            }
            .el-button {
                width: 120px;
                height: 36px;
                padding: 0;
            }
        }
    }
</style>
<!--<style lang="scss">-->
<!--.payCode {-->
<!--.el-dialog__body {-->
<!--padding: 0;-->
<!--}-->
<!--.el-dialog__header {-->
<!--padding: 20px;-->
<!--background: #F5F5F5;-->
<!--font-size: 18px;-->
<!--font-weight: bold;-->
<!--}-->
<!--}-->

<!--.intervention {-->
<!--.el-dialog__body {-->
<!--padding: 10px 25px;-->
<!--}-->
<!--}-->

<!--.afterSaleName {-->
<!--.el-dialog__body {-->
<!--text-align: center;-->
<!--}-->
<!--.el-radio__label {-->
<!--font-size: 16px;-->
<!--}-->
<!--.el-radio__inner {-->
<!--width: 18px;-->
<!--height: 18px;-->
<!--}-->
<!--.el-button {-->
<!--margin: 10px;-->
<!--}-->
<!--}-->
<!--</style>-->