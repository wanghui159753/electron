<template>
    <div class="one_goods">
        <div class="left">
            <img :src="logo" width="80" alt="">
        </div>
        <div class="right">
            <div class="top"><p>
                {{name}}</p>
                <p v-if="val.vin">车架号：<span>{{val.vin}}</span></p></div>
            <div class="middle"><span style="color: #2197D8">{{item.name}}</span><span>{{item.classify}}</span><span>{{item.type=='CASH'?'现货':'预定'}}</span><span>{{item.remark}}</span>
            </div>
            <div class="foot">
                <span>单价：¥{{(item.price/100).toFixed(2)}}</span><span>数量：{{item.num||item.refundNum}}</span></div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                logo: '',
                name: ''
            }
        },
        created() {
            if (this.goodsType == 'DIRECT_PAY_ORDER') {
                this.logo = this.type ? this.val.orderBuyerInfo.logo : this.val.orderSellerInfo.logo;
                this.name = this.val.brandName ? this.val.brandName : '立即付款';
            } else {
                this.logo = this.val.logo || this.val.orderMain.logo
                this.name = this.val.brandName ? this.val.brandName : this.val.orderMain.brandName;
            }
        },
        props: ['item', 'val', 'type', 'goodsType']
    }
</script>
<style lang="scss" scoped>
    $fles: flex;
    @mixin fl {
        display: flex;
    }

    .one_goods {
        text-align: left;
        height: 102px;
        @include fl;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #DBF3FE;
        .left {
            margin: 0 10px 0 20px;
        }
        .top {
            @include fl;
            p {
                margin-right: 15px;
                span {
                    color: #FC684F;
                }
            }
        }
        .middle {
            color: #999;
            margin: 15px 0 9px 0;
            span {
                margin-right: 10px;
            }
        }
        .foot {
            span {
                margin-right: 25px;
            }
        }
    }
</style>