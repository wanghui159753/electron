<template>
    <bg>
        <div class="cirDetail">
            <div class="header">
                <div></div>
                <p class="plac">订单详情</p>
                <span class="el-icon-close" @click='$emit("showDetail")'></span>
            </div>
            <div class="scroll scrollbar">
                <div class="address" @click="addressChooseShow=true">
                    <logistics v-if="defaultAddress" :ship-address="defaultAddress"></logistics>
                    <div v-else>选择收货地址</div>
                    <span class="el-icon-arrow-right"></span>
                </div>
                <div v-for="(item,index) in quoteList" :key="index">
                    <orderItem :details="item" :del="del"></orderItem>
                </div>
                <div class="pay">
                    <div class="payType">
                        <p>支付方式</p>
                        <p>在线支付</p>
                    </div>
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
                <div class="compontents"  v-show="addressChooseShow">
                    <transition name="el-zoom-in-top">
                        <choose-address class="choose" :order="1" v-model="addressChooseShow" @address="defaultAddress=arguments[0];addressChooseShow=false"></choose-address>
                    </transition>
                </div>
            </div>
            <footer>
                <p>合计: <span>¥{{total.toFixed(2)}}</span></p>
                <el-button type="primary" @click="commit">提交订单</el-button>
            </footer>
        </div>
    </bg>
</template>
<script>
    import bg from "../../myorder/model/bg";
    import orderItem from "./orderlistItem";
    import {getDefault} from '@/api/merchant/address'
    import logistics from '../../myOrder/model/logisticsdel';
    import chooseAddress from "../../sysset/components/address"
    export default {
        props: ['del'],
        components: {bg, orderItem, logistics,chooseAddress},
        data() {
            return {
                quoteList: [],
                total: 0,
                defaultAddress: null,
                addressChooseShow:false
            }
        },
        methods: {
            getDefaultAddress() {
                getDefault().then(res => {
                    this.defaultAddress = res.data;
                })
            },
            commit(){

            }
        },
        created() {
            this.quoteList = this.del.quoteList.filter(item => {
                this.total += Number(item.select.total);
                item.buyMark = '';
                return item.select.length;
            })
            this.getDefaultAddress();
        }
    }
</script>
<style scoped lang="scss">
    .compontents{
        position: fixed;
        top: 30px;
        bottom: 0;
        left: 180px;
        right: 0;
        background: rgba(0,0,0,0.3);
        z-index: 200;
        .choose{
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
            border-bottom: 10px solid #ccc;
            padding: 5px 34px;
            line-height: 37px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span{
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
        .payType, .red {
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
        .payType {
            padding-right: 40px;
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