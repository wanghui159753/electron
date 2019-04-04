<template>
    <div class="content">
        <div class="ok" v-if="del.status=='OK'">
            <div class="one">
                <span>退款总金额</span>
                <span style="color: #f00"><span>￥</span>{{(del.amount/100).toFixed(2)}}</span>
            </div>
            <div>
                <span>退回支付宝</span>
                <span><span>￥</span>{{(del.amount/100).toFixed(2)}}</span>
            </div>
        </div>
        <div class="reject" v-if="del.status=='REJECT'">
            <div class="reason one">
                原因：{{del.refundRejectInfo.reason}}
            </div>
            <div class="img" v-if="del.refundRejectInfo.imageList.length">
                <div v-for="(x,i) in del.refundRejectInfo.imageList" @click="picLooker(i)" :key="i">
                    <img :src="x" alt="">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {lookPhoto} from "@/api/admission/admission"

    export default {
        props: ['del'],
        methods: {
            picLooker(i) {
                lookPhoto(i, this.del.refundRejectInfo.imageList)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .one {
        border-bottom: 1px solid #dedede;
        margin-bottom: 10px;
    }

    .content {
        > div {
            border-bottom: 2px solid #F1F1F1;
        }
        .ok {
            div {
                padding: 0 20px;
                height: 60px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                span {
                    span {
                        font-size: 12px;
                    }
                }
            }
        }
        .reject {
            padding: 0 27px;
            padding-bottom: 10px;
            .reason {
                display: flex;
                min-height: 50px;
                color: #f00;
                border: 0;
                margin-bottom: 0;
                align-items: center;
            }
            .img {
                display: flex;
                padding: 10px 0 0 0;
                border-top: 1px solid #999;
                > div {
                    border: 3px;
                    width: 100px;
                    height: 80px;
                    overflow: hidden;
                    background: #999;
                    margin-right: 15px;
                }
            }
            img {
                width: 100px;
            }
        }
    }
</style>