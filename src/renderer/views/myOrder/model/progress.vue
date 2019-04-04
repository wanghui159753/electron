<template>
    <bg @click.native="disappear">
        <div class="stepsShow">
            <div class="orderTit">
                <p>{{type?'订单记录':'售后记录'}}</p>
            </div>
            <div class="orderNum">
                订单号：{{detail.tradeNo}}
            </div>
            <div class="step" v-if="type">
                <div class="one">
                    <span></span>
                    <div>
                        <p class="time">{{initTime(detail.createTime)}}</p>
                        <p>生成订单</p>
                    </div>
                    <div class="line"></div>
                </div>
                <div class="one" v-if="detail.payTime">
                    <span></span>
                    <div>
                        <p class="time">{{initTime(detail.payTime)}}</p>
                        <p>买家付款</p>
                    </div>
                    <div class="line"></div>
                </div>
                <div class="one" v-if="detail.shipTime">
                    <span></span>
                    <div>
                        <p class="time">{{initTime(detail.shipTime)}}</p>
                        <p>卖家发货</p>
                    </div>
                    <div class="line"></div>
                </div>
                <div class="one" v-if="detail.finishTime">
                    <span></span>
                    <div>
                        <p class="time">{{initTime(detail.finishTime)}}</p>
                        <p>买家确认收货，交易完成</p>
                    </div>
                    <div class="line"></div>
                </div>
            </div>
            <!--//售后记录使用-->
            <div class="step scrollbar" v-else>
                <div class="one two" v-for="item in data" :key="item.id">
                    <span></span>
                    <div>
                        <p class="time">{{initTime(item.createTime)}}</p>
                        <p v-for="val in item.refundGoodsList" class="goods">
                            <img src="@/../../static/image/gift.png" alt="">
                            {{val.name}} {{val.classify}}
                            {{val.type=='CASH'?'现货':'预定'}} <span>￥{{(val.price/100).toFixed(2)}}</span>
                            x{{val.refundNum}}</p>
                        <p class="result" v-if="item.status=='OK'">
                            卖家同意{{getWord(item.goodsStatus)}}，{{getWord(item.goodsStatus)}}成功</p>
                        <p class="result" v-else-if="item.status=='CANCEL'">买家取消售后申请</p>
                        <p class="result" v-else-if="item.status=='REJECT'">
                            卖家拒绝{{getWord(item.goodsStatus)}}，{{getWord(item.goodsStatus)}}失败</p>
                        <p class="result" v-else>正在售后中</p>
                    </div>
                    <div class="line"></div>
                </div>
            </div>
        </div>
    </bg>
</template>
<script>
    import {parseTime, getClassify} from "@/utils/index.js";
    import {refundHistory} from "@/api/myorder/index"
    import bg from "./bg"

    export default {
        data() {
            return {
                data: {},
                word: ''
            }
        },
        created() {
            this.getData()
        },
        components: {bg},
        props: ['detail', 'type'],
        methods: {
            getWord(val) {
                return val == 'REFUND' ? '退款' : '退货退款';
            },
            getData() {
                refundHistory({tradeNo: this.detail.tradeNo})
                    .then(res => {
                        this.data = res.data;
                    })
            },
            disappear(e) {
                if (e.target.className == 'opcityBg') {
                    this.$emit('input', false)
                }
            },
            initTime(time) {
                return parseTime(time)
            }
        }
    };
</script>
<style lang="scss" scoped>
    .stepsShow {
        width: 520px;
        height: 100%;
        background: #fff;
        position: absolute;
        right: 0;
        top: 0;
        .orderTit {
            background: rgba(247, 247, 247, 1);
            align-items: center;
            color: #000;
            font-weight: bold;
            p {
                text-align: center;
                height: 47px;
                line-height: 47px;
                width: 90%;
            }
        }
        .orderNum {
            border-bottom: 20px solid #E5E5E5;
            line-height: 46px;
            text-indent: 20px;
        }
        .step {
            position: relative;
            padding-top: 20px;
            height: calc(100% - 113px);
        }
        .two {
            height: auto !important;
            padding-bottom: 10px;
            .time {
                line-height: normal;
            }
            .goods {
                font-size: 14px;
                font-weight: bold;
                span {
                    color: #FF6749;
                    border: 0;
                }
            }
            .result {
                font-weight: bold;
            }
            p {
                line-height: 32px;
            }
        }
        .one {
            padding-left: 20px;
            display: flex;
            height: 80px;
            font-size: 16px;
            position: relative;
            z-index: 1;
            .time {
                color: #999999;
                margin-bottom: 15px;
            }
            span {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 1px solid #CCCCCC;
                margin-right: 20px;
                background: #fff;
            }
            .line {
                position: absolute;
                width: 2px;
                top: 20px;
                bottom: 0px;
                background: #E6E6E6;
                left: 29px;
            }
        }
    }
</style>
<style>
    .stepsShow .one:last-child .line {
        display: none;
    }
</style>
