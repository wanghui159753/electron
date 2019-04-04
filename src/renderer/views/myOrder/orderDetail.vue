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
                      v-if="detailInfo.status!=='OK'&&detailInfo.status!=='REJECT'&&detailInfo.status!=='CANCEL'"
                      :autoseller="autoSellor"
                      :afterSale="true"
                      :refund="detailInfo.goodsStatus">
                </step>
                <status-time
                        @close="close"
                        :type="autoSellor"
                        :afterSale="true"
                        :status1="detailInfo.status"
                        :time="detailInfo.createTime"
                        :shipTime="detailInfo.shipTime">
                </status-time>
                <refund-result :del="detailInfo"></refund-result>
                <logistics
                        :address="address"
                        @close="showWl"
                        @choosAddress="addressChoose=true"
                        :type="autoSellor"
                        :del="detailInfo"
                        :afterSale="true"
                >
                </logistics>
                <order :detailInfo='detailInfo' @close="logisticsShow=true" :after-sale="true"
                       :autoSellor="autoSellor">
                    <div slot="top">
                        <div class="refundHistory" v-if="detailInfo.orderRefund" @click="show=!show;stepType=0">
                            <p><img src="@/../../static/image/refundHistory.png" width="20" alt="">退款记录</p>
                            <span class="el-icon-arrow-right"></span>
                        </div>
                    </div>
                </order>
            </div>
            <footer>
                <p v-if="this.detailInfo.status!='FINISH'||autoSellor">
                    合计：<span>￥{{detailInfo.amount|exNum}}</span>
                    <span>(不含运费)</span>
                </p>
                <div class="autoseller" v-if="autoSellor">
                    <el-button type="primary"
                               v-if="detailInfo.status=='PENDING'||(detailInfo.status=='WAIT_TAKE')"
                               @click="sellerRefund.rejectShow=true">
                        拒绝{{detailInfo.goodsStatus=='REFUND'?'退款':'退货退款'}}
                    </el-button>
                    <el-button type="danger" v-if="detailInfo.status=='PENDING'"
                               @click="agree">同意{{detailInfo.goodsStatus=='REFUND'?'退款':'退货退款'}}
                    </el-button>
                    <el-button type="danger" v-if="detailInfo.status=='WAIT_TAKE'"
                               @click="ReceiptAndRefund">
                        确认收货并退款
                    </el-button>
                    <p v-if="detailInfo.status=='WAIT_AGREES'">等待买家发货</p>
                </div>
                <div class="buyer" style="display: flex" v-else>
                    <el-button v-if="detailInfo.status=='PENDING'" type="success" plain
                               @click="cancleReturned">撤销申请
                    </el-button>
                    <el-button type="primary" plain v-if="detailInfo.status=='PENDING'"
                               @click="buyer.afterSaleShow=true">
                        修改申请
                    </el-button>
                    <el-button type="warning" plain :del="detailInfo"
                               v-if="detailInfo.status=='REJECT'&&!autoSellor"
                               @click="serviceInterventionShow=true">客服介入
                    </el-button>
                    <el-button v-if="detailInfo.status=='REJECT'&&!autoSellor"
                               type="primary" plain
                               @click="buyer.applyAfterSale=true;afterSaleAgain=true">再次申请
                    </el-button>
                    <el-button v-if="detailInfo.status=='WAIT_AGREES'" type="danger"
                               @click="logisticsShow=true">
                        确认退货物流
                    </el-button>
                </div>
            </footer>
        </div>
        <transition name="el-fade-in-linear">
            <second v-if="logisticsShow" :afterSale="true" v-model="logisticsShow" @ship="initDetail();refresh()"
                    @reload="reload" :address="address" :autoSellor="autoSellor" :detailInfo='detailInfo'
                    @close="close"></second>
        </transition>
        <transition name="el-fade-in-linear">
            <step-progress v-model="show" v-if="show" :type="stepType" :detail="detailInfo"></step-progress>
        </transition>
        <el-dialog
                width="560"
                height="300"
                center
                :modal-append-to-body="false"
                :visible.sync="sellerRefund.rejectShow"
                v-if="sellerRefund.rejectShow"
                :append-to-body="false">
            <h3 slot="title">拒绝原因</h3>
            <reject-dialog :reject="reject" v-if="sellerRefund.rejectShow"></reject-dialog>
            <div slot="footer">
                <el-button @click="sellerRefund.rejectShow=false">取消</el-button>
                <el-button type="primary" plain @click="refuse">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
                width="340px"
                height="183px"
                center
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
                <el-button type="primary" plain @click="chooseRefundType">确定</el-button>
            </div>
        </el-dialog>
        <buyer-refund
                :list="detailInfo"
                :reject="detailInfo.status=='REJECT'"
                :afterSale="true"
                v-if="buyer.afterSaleShow"
                @reLoad="reload"
                v-model="buyer.afterSaleShow"
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
        <!--<el-dialog-->
        <!--width="450px"-->
        <!--height="533px"-->
        <!--:center="true"-->
        <!--:modal-append-to-body="false"-->
        <!--:visible.sync="payCode"-->
        <!--:append-to-body="false"-->
        <!--top="10%"-->
        <!--@close="clear"-->
        <!--custom-class="payCode">-->
        <!--<template slot="title">扫码支付</template>-->
        <!--<payCode v-if="payCode" @start="training()" @stop="clear" :address="address" :del="detailInfo"></payCode>-->
        <!--</el-dialog>-->
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
        <!--<el-dialog-->
        <!--width="300px"-->
        <!--height="300px"-->
        <!--:modal-append-to-body="false"-->
        <!--:visible.sync="refundAll"-->
        <!--v-if="refundAll"-->
        <!--:center="true"-->
        <!--&gt;-->
        <!--<h2 slot="title" style="color: #f00">警告</h2>-->
        <!--<p style="font-size: 16px;text-align: center;line-height: 70px">确认后将全部退款给买家</p>-->
        <!--<div slot="footer">-->
        <!--<el-button type="success" @click="refundAll=false" style="margin-right: 35px">取消</el-button>-->
        <!--<el-button type="danger" @click="refundAllToBuyer">确定</el-button>-->
        <!--</div>-->
        <!--</el-dialog>-->
        <el-dialog
                width="300px"
                height="300px"
                :modal-append-to-body="false"
                :visible.sync="setPass"
                v-if="setPass"
                center
        >
            <h3 slot="title" style="color: #f00">注意</h3>
            <p style="font-size: 16px;text-align: center">你还没有设置支付密码,去设置</p>
            <div slot="footer">
                <el-button type="danger" @click="$router.push('/purse/index')">确定</el-button>
            </div>
        </el-dialog>
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
    import refundResult from './model/resultShow';
    import payCode from "@/components/pay/choosePay"
    import serviceIntervention from "./model/serviceIntervention"
    import {
        refundDetail,
        pay,
        training,
        returned,
        reject,
        refundAll,
        cancleReturned,
        updateReturned,
        sellerAgreeAll,
        orderCompleRefund,
        finishOrder,
        cancleOrder,
        undoneRefund
    } from "@/api/myorder/index";
    import pass from "@/components/pay/passWord";
    import second from "./model/secondLevel";
    import {findDetailByOrderId} from '@/api/myorder/index'
    import chooseAddress from "./../sysset/components/address"
    import {getDefault} from "@/api/merchant/address"

    export default {
        data() {
            return {
                afterSaleAgain: false,
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
                timer: null,
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
            refundResult,
            payCode,
            pass,
            serviceIntervention
        },
        props: {
            detailInfoId: {
                type: Number,
                default: ''
            }
        },
        methods: {
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
                if (this.sellerRefund.passwordType == 'pay') {
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
            ReceiptAndRefund() {
                this.$confirm('确认后，此订单付款金额将全部退还给买家，请谨慎选择。')
                    .then(_ => {
                        return orderCompleRefund({"orderRefundId": this.detailInfo.id})
                    })
                    .then(res => {
                        this.$message.success('已确认收货，退款完成');
                        this.initDetail();
                        this.refresh();
                    }).catch(_ => {
                })
            },
            refund() {
                let orderRefundId = this.detailInfo.id;
                let payPassword = this.sellerRefund.payPassword;

                function afterAsk() {
                    this.$message.success('已同意退款')
                    this.sellerRefund.payPassword = ''
                    this.sellerRefund.passwordShow = false;
                    this.initDetail()
                    this.refresh()
                }

                orderCompleRefund({orderRefundId})
                    .then(res => afterAsk.call(this))
            },
            agree() {
                if (this.detailInfo.goodsStatus == 'REFUND') {
                    if (this.detailInfo.status != 'FINISH') {
                        this.refund()
                    } else {
                        this.sellerRefund.passwordShow = true;
                        this.sellerRefund.passwordType = 'REFUND'
                    }
                } else if (this.detailInfo.goodsStatus == 'RETURN_REFUND') {
                    if (this.address) {
                        sellerAgreeAll(Object.assign({
                            "orderRefundId": this.detailInfo.id
                        }, this.address))
                            .then(res => {
                                this.initDetail()
                                this.$message.success('已同意退款退货')
                            })
                            .catch(_ => {
                            })
                    } else {
                        this.addressChoose = true;
                    }
                }
            },
            chooseRefundType() {
                this.buyer.applyAfterSale = false;
                this.buyer.afterSaleShow = true;
            },
            cancle() {
                cancleOrder({tradeNo: this.detailInfo.tradeNo}).then(res => {
                    this.refresh();
                    this.initDetail()
                })
            },
            cancleReturned() {
                cancleReturned({orderRefundId: this.detailInfo.refundGoodsList[0].orderRefundId}).then(res => {
                    this.$message.success('取消售后申请成功')
                    this.initDetail()
                    this.refresh()
                })
            },
            refuse() {
                reject(Object.assign({orderRefundId: this.detailInfo.id}, this.reject)).then(res => {
                    this.$message.success('提交成功')
                    this.initDetail();
                    this.refresh();
                    this.sellerRefund.rejectShow = false;
                })
            },
            clear() {
                clearInterval(this.timer)
            },
            training() {
                clearInterval(this.timer);
                this.timer = setInterval(() => {
                    training({tradeNo: this.detailInfo.tradeNo})
                        .then(res => {
                            if (res.data.payTime) {
                                this.payCode = false;
                                this.$message.success('订单支付成功')
                                clearInterval(this.timer)
                                this.initDetail();
                                this.refresh()
                            }
                        })
                }, 1000)
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
            reload() {
                if (!this.afterSaleAgain) {
                    this.logisticsShow = false;
                    this.initDetail()
                    this.refresh()
                } else {
                    this.logisticsShow = false;
                    this.refresh();
                    this.$emit('showDetail')
                }
            },
            refresh() {
                this.$emit('refresh')
            },
            init(val) {
                switch (val.status) {
                    case "WAIT_TAKE":
                        val.statusC = "卖家收货退款";
                        val.statusR = '等待卖家收货';
                        return
                    case "POST_SALES":
                        val.statusC = "售后/退款";
                        val.statusR = '退货退款申请';
                        return
                    case "PENDING":
                        val.statusC = '申请售后';
                        return
                    case "WAIT_AGREES":
                        val.statusC = "同意退货退款";
                        return
                    case "OK":
                        val.statusC = "退款成功";
                        return
                    case "REJECT":
                        val.statusC = "退款审核失败";
                        return
                }
            },
            close() {
                this.show = !this.show;
            },
            initDetail() {
                this.$store.commit('setLoading', true)
                refundDetail({orderRefundId: this.detailInfoId}).then(res => {
                    res.data.orderBuyerInfo = res.data.buyerInfo;
                    res.data.orderSellerInfo = res.data.sellerInfo;
                    res.data.order = res.data.orderMain;
                    this.autoSellor = res.data.orderBuyerInfo.userId != this.$store.state.user.storeInformation.userId;
                    this.saveAddress(res.data.refundShipAddress || {});
                    this.init(res.data)
                    this.detailInfo = res.data;
                    this.$store.commit('setLoading', false)
                })
                    .then(() => {
                        if (this.detailInfo.goodsStatus == 'RETURN_REFUND' && this.detailInfo.status == 'PENDING' && this.autoSellor) {
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
<style>
    .DetailShowArea .el-dialog__wrapper{
        left: 0px;
    }
</style>