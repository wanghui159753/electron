<template>
    <bg>
        <div class="cirDetail" v-if="del">
            <div class="header">
                <div></div>
                <p class="plac">订单详情</p>
                <span class="el-icon-close" @click='$emit("input",false)'></span>
            </div>
            <div class="scroll scrollbar">
                <div class="address" @click="addressChooseShow=true">
                    <logistics v-if="defaultAddress" :ship-address="defaultAddress"></logistics>
                    <div v-else>选择收货地址</div>
                    <span class="el-icon-arrow-right"></span>
                </div>
                <div class="buyerInfo">
                    <div class="name">{{del.buyerUserName}}</div>
                    <div class="brand">
                        <div><img :src="del.logo" alt="" width="28"> <span>{{del.brandName}}</span></div>
                    </div>
                </div>
                <div v-if="del">
                    <selects :detail="del" @getSelect="updateArr"></selects>
                </div>
                <div class="marks">
                    <div class="buyer_mark">
                        <h5>买家留言</h5>
                        <el-input v-model="buyerRemark" placeholder="选填：如有售后质保在此说明"></el-input>
                    </div>
                    <div class="seller_mark">
                        <h5>卖家留言</h5>
                        <el-input :disabled="true" v-model="del.sellerRemark"></el-input>
                    </div>
                </div>
                <div class="company" @click="chooseLogistics=true">
                    <b><img src="@/../../static/image/huoche.png" width="30" height="20" alt=""><span>配送物流</span></b>
                    <p>{{name||'请选择'}}<span class="el-icon-arrow-right"></span></p>
                </div>
                <div class="total">共<span>{{sel.length||0}}</span>件，合计: <span>¥{{total}}</span><b>(不含运费)</b></div>
                <div class="pay">
                    <div class="red">
                        <p>红包</p>
                        <p>暂无可用红包<span class="el-icon-arrow-right"></span></p>
                    </div>
                    <div class="tip">
                        <h3>交易提醒</h3>
                        <p><span></span>心动配讯交易将为您担保交易金额的安全，7个工作日无退货退款或无确认收货，将视为自动收货。</p>
                        <p><span></span>请确保实际收货地址为清单中的地址，或者与卖家约定新的收货地址。</p>
                        <p><span></span>心动配讯交易将为您担保交易资金的安全，保证在线交易资金不受损失。</p>
                    </div>
                </div>
                <div class="compontents" v-show="addressChooseShow">
                    <transition name="el-zoom-in-top">
                        <choose-address :quoteUse="true" class="choose" :order="1" v-model="addressChooseShow"
                                        @address="defaultAddress=arguments[0];addressChooseShow=false"></choose-address>
                    </transition>
                </div>
            </div>
            <footer>
                <p>合计: <span>¥{{total}}</span></p>
                <el-button type="primary" @click="commit">去结算</el-button>
            </footer>
        </div>
        <el-dialog
                width="450px"
                height="533px"
                :center="true"
                :modal-append-to-body="false"
                :visible.sync="payCode"
                :append-to-body="false"
                top="8%"
                @close="close(1)"
                custom-class="payCode">
            <template slot="title">订单提交成功，请尽快支付</template>
            <pay v-if="payCode" @start="training()" @stop="close(0)" :address="address" :del="detailInfo"></pay>
        </el-dialog>
        <second class="inputBg" @ship="name=arguments[0]" v-if="chooseLogistics" v-model="chooseLogistics"
                :quoteUse="true"></second>
    </bg>
</template>
<script>
    import pay from "@/components/pay/choosePay";
    import bg from "../../myorder/model/bg";
    import selects from "../../quote/model/buyerCreatOrder";
    import {getDefault} from '@/api/merchant/address'
    import {quoteOrderDel, single,training} from '@/api/myorder/index'
    import logistics from '../../myOrder/model/logisticsdel';
    import chooseAddress from "../../sysset/components/address"
    import second from '../../myOrder/model/secondLevel';

    export default {
        props: ['id'],
        components: {bg, selects, logistics, chooseAddress, second, pay},
        data() {
            return {
                defaultAddress: null,
                addressChooseShow: false,
                del: null,
                name: '',
                defaultAddress: '',
                chooseLogistics: false,
                sel: [],
                buyerRemark: '',
                payCode: false,
                detailInfo: null,
                address:null,
                timer:null
            }
        },
        methods: {
            close(a){
                clearInterval(this.timer);
                if(a){
                    this.$emit('input',false);
                    this.$message.error('若支付成功，请前往订单查看');
                }
            },
            updateArr(val) {
                this.sel = val.select || [];
            },
            getDefaultAddress() {
                getDefault().then(res => {
                    this.defaultAddress = res.data;
                })
            },
            getCommitObj() {
                this.address = {
                    "address": this.defaultAddress.address,
                    "city": this.defaultAddress.regionName,
                    "logistics": this.name,
                    "mobile": this.defaultAddress.mobile,
                    "name": this.defaultAddress.name,
                    "province": this.defaultAddress.provinceName,
                    "region": this.defaultAddress.regionName
                }
                return {
                    address:this.address,
                    brandName: this.del.brandName,
                    buyerRemark: this.buyerRemark,
                    goodsList: this.sel,
                    logo: this.del.logo,
                    sellerRemark: this.del.sellerRemark,
                    sellerUserId: this.del.sellerUserId
                }
            },
            training() {
                clearInterval(this.timer);
                this.timer = setInterval(() => {
                    training({tradeNo:this.detailInfo.tradeNo})
                        .then(res => {
                            if (res.data.payTime) {
                                this.payCode = false;
                                this.$message.success('订单支付成功');
                                clearInterval(this.timer);
                                this.$emit('input',false);
                                this.sendMsg();
                            }
                        })
                }, 1000)
            },
            sendMsg(){
                this.$store.dispatch("sendMsg", {
                    scene: 'p2p',
                    to: this.$store.state.im.currSessionId.substring(4),
                    type: "custom",
                    content: {
                        msgType: 7,
                        msgContent: JSON.stringify({
                            orderId:this.detailInfo.id,
                            buyerId:this.detailInfo.buyerUserId,
                            buyerName:this.detailInfo.buyerUserName,
                            orderNum:this.detailInfo.tradeNo,
                            sellerId:this.detailInfo.sellerUserId,
                            brandName:this.detailInfo.brandName,
                            partName:this.detailInfo.goodsList.map(item=>item.name).join(','),
                            orderPrice:this.detailInfo.totalAmount
                        })
                    }
                });
                this.$store.dispatch("sendMsg", {
                    scene: 'p2p',
                    to: this.$store.state.im.currSessionId.substring(4),
                    type: "text",
                    text:'订单已支付，请尽快发货'
                })
            },
            getDetail() {
                quoteOrderDel({id: this.id}).then(res => {
                    this.del = res.data;
                })
            },
            commit() {
                if(!this.name){
                    this.$message.error('请填写物流')
                    return
                }else if(!this.defaultAddress){
                    this.$message.error('请填写收货地址')
                    return
                }
                single(this.getCommitObj()).then(res => {
                    this.detailInfo = res.data;
                    this.payCode=true;
                })
            }
        },
        computed: {
            total() {
                let num = 0;
                this.sel.length && this.sel.forEach(item => {
                    num += item.num * item.price;
                })
                return (num / 100).toFixed(2);
            }
        },
        created() {
            this.getDefaultAddress();
            this.getDetail();
        }
    }
</script>
<style scoped lang="scss">
    .payCode{left: 0}
    .total {
        height: 58px;
        padding: 0 20px;
        line-height: 58px;
        text-align: right;
        border-top: 1px solid #E6E6E6;
        span {
            font-size: 20px;
            color: #E60000;
        }
        b {
            font-weight: 400;
            font-size: 14px;
            color: #999999;
        }
    }

    .marks {
        padding: 0 20px;
        border-top: 1px solid #E6E6E6;
        padding-top: 10px;
        h5 {
            font-size: 16px;
            line-height: 24px;
        }
        .el-input {
            margin-bottom: 15px;
        }
    }

    .company {
        padding: 0 20px;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #E6E6E6;
        b {
            span {
                margin-left: 10px;
                font-size: 20px;
            }
        }
        p {
            cursor: pointer;
            span {
                font-size: 16px;
            }
        }
        span {
            cursor: pointer;
        }
        img {
            vertical-align: sub;
        }
    }

    .buyerInfo {
        .name {
            height: 60px;
            line-height: 60px;
            border-bottom: 1px solid #E6E6E6;
            font-weight: bold;
            font-size: 16px;
            text-indent: 20px;
        }
        .brand {
            > div {
                margin: 20px;
                height: 36px;
                border: 1px solid rgba(204, 204, 204, 1);
                border-radius: 6px;
                line-height: 36px;
                display: inline-block;
                padding: 0 10px;
                img {
                    vertical-align: middle;
                    margin-right: 10px;
                }
            }
        }
    }

    .compontents {
        position: fixed;
        top: 30px;
        bottom: 0;
        left: 180px;
        right: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 200;
        .choose {
            position: absolute !important;
            top: 0;
            bottom: 30px;
            width: 80%;
            height: auto;
            background: #fff;
            left: 10%;
        }
    }

    .cirDetail {
        height: 100%;
        width: 800px;
        margin: 0 auto;
        background: #fff;
        color: #000;
        padding-bottom: 60px;
        position: relative;
        .scroll {
            height: calc(100% - 43px);
        }
        .address {
            border-bottom: 10px solid #f1f1f1;
            padding: 5px 34px;
            line-height: 37px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span {
                font-size: 18px;
            }
        }
        .header {
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            align-items: center;
            border-top: 1px solid #e1e1e1;
            border-bottom: 1px solid #e1e1e1;
            color: #666;
            font-size: 14px;
            height: 46px;
            p {
                color: #000;
                font-size: 16px;
                width: 145px;
            }
            .el-icon-close {
                font-size: 22px;
            }
        }
        .scrollArea {
            height: calc(100% - 58px);
        }
    }

    .pay {
        border-top: 10px solid #f1f1f1;
        .red {
            height: 79px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            font-size: 20px;
            border-bottom: 1px solid #ccc;
            p:first-child {
                font-weight: bold;
            }
        }
        .red {
            p:nth-child(2) {
                color: #ccc;
                span {
                    color: #999999;
                }
            }
        }
        .tip {
            padding: 0 20px;
            h3 {
                font-size: 16px;
                line-height: 40px;
            }
            p {
                font-size: 14px;
                color: #333333;
                line-height: 25px;
                span {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    background: #F74C24;
                    border-radius: 50%;
                    margin-right: 5px;
                }
            }
        }
    }

    footer {
        position: absolute;
        width: 100%;
        height: 56px;
        background: rgba(242, 242, 242, 1);
        left: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0px 0px 8px 0px rgba(129, 129, 129, 0.7);
        p {
            margin-right: 20px;
            span {
                font-size: 20px;
                color: #E60000;
            }
        }
        .el-button {
            width: 120px;
            height: 36px;
            padding: 0;
            background: #E60000;
        }
    }
</style>
<style>
    .opcityBg .el-dialog__wrapper{
        left: 0;
    }
    .inputBg .el-input__inner {
        background: #fff;
    }

    .cirDetail .el-input__inner {
        background: #fff;
    }
</style>