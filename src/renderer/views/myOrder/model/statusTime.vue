<template>
    <div class="blueBg" :style="{backgroundColor:type?'#4293cc':'#FA8729'}">
        <h5>{{status}}</h5>
        <p class="timeGo" v-if="status == '等待买家付款'">剩{{timeLow}}自动关闭</p>
        <p class="timeGo" v-if="status == '等待买家收货'">还剩{{timeLow}}自动确定收货</p>
        <p class="timeGo" v-if="status == '订单已过期'">买家没有在规定时间内付款</p>
        <p class="timeGo" v-if="status == '等待卖家发货'">买家已付款，请尽快发货，还剩{{ timeLow }}小时自动关闭</p>
        <p class="timeGo" v-if="status1 == 'PENDING'">卖家3天未受理判定为平台处理订单</p>
        <p class="timeGo" v-if="status1 == 'WAIT_AGREES'&&!this.type">商家已同意退货退款，请尽快发送退货物流</p>
        <p class="timeGo" v-if="status1 == 'WAIT_AGREES'&&this.type">已同意退货退款，等待买家发货</p>
        <p class="timeGo" v-if="status1 == 'WAIT_TAKE'&&status=='等待卖家收货'">卖家7天未受理判定为平台处理订单</p>
        <p class="timeGo" v-if="status1 == 'REJECT'">卖家拒绝退款</p>
    </div>
</template>
<script>
    import {parseTime, Surplus} from "@/utils/index.js";
    import {finishOrder} from "@/api/myorder/index.js";
    import {afterSale} from "../../../api/myorder";

    export default {
        props: ["status1", "time", "shipTime", 'type','afterSale'],
        data() {
            return {
                timeUp: 24 * 60 * 60 * 1000,
                timeUpFinish: 24 * 60 * 60 * 1000 * 7,
                nowTime: 0
            }
        },
        methods: {
            getStatus(status) {
                switch (status) {
                    case "WAIT_PAY":
                        return this.type?"等待买家付款":'待付款';
                    case "WAIT_SHIP":
                        return this.type?"待发货":'等待卖家发货';
                    case "WAIT_TAKE":
                        if(this.afterSale){
                            return this.type?'买家已退货，等待收货':'等待买家收货'
                        }else
                        return this.type?"已发货":"待收货";
                    case "FINISH":
                        return "交易完成";
                    case "OVERDUE":
                        return "订单已过期";
                    case "WAIT_EVALUATE":
                        return "待评论";
                    case "POST_SALES":
                        return "退货退款申请";
                    case "PENDING":
                        return this.type?"待处理":'等待卖家处理';
                    case "WAIT_AGREES":
                        return this.type?'等待买家发货':"请尽早退货";
                    case "REJECT":
                        return "退款审核失败";
                    case "OK":
                        return "退款成功";
                    case "CANCEL":
                        return  this.type?"买家取消售后":'取消售后';

                }
            },
            getDifValue(nowtimestamp, beforetimestamp, num) {
                var difValue = nowtimestamp - beforetimestamp;
                var day = Math.floor(difValue / 1000 / 60 / 60 / 24);//天
                difValue = difValue % (1000 * 60 * 60 * 24);
                var hour = Math.floor(difValue / 1000 / 60 / 60);//小时
                difValue = difValue % (1000 * 60 * 60);
                var min = Math.floor(difValue / 1000 / 60);//分钟
                difValue = difValue % (1000 * 60);
                var second = Math.floor(difValue / 1000);
                if (num == 1) {
                    return hour + "小时" + min + "分钟" + second + "秒"
                } else if (num == 2) {
                    return day + '天' + hour + "小时"
                } else if (num == 3) {
                    return hour + '小时'
                }
            }
        },
        computed: {
            timeLow: {
                get() {
                    this.nowTime = new Date().getTime();
                    switch (this.status) {
                        case "等待买家付款":
                            return this.getDifValue(this.timeUp + this.time, this.nowTime, 1);
                        case "等待买家收货":
                            return this.getDifValue(this.timeUpFinish + this.shipTime, this.nowTime, 2);
                        case "等待卖家发货":
                            return this.getDifValue(this.timeUp + this.time, this.nowTime, 3);
                    }
                },
                set() {

                }
            },
            status() {
                return this.getStatus(this.status1)
            }
        },
        mounted() {
            let time = setInterval(() => {
                --this.timeUp
                clearInterval(time);
            }, 1000)
        }
    };
</script>
<style lang="scss" scoped>
    .blueBg {
        width: 100%;
        height: 88px;
        background: #4293cc;
        padding: 20px 62px;
        color: #fff;
        font-size: 14px;
        h5 {
            font-size: 18px;
            margin-bottom: 15px;
        }
    }
</style>
