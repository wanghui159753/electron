<template>
    <div class="goodsLists">
        <header class="one header">
            <div style="text-align: center">配件信息({{list.length}})</div>
            <div>单价</div>
            <div>品质</div>
            <div>备注</div>
            <div>货源</div>
            <div>发货数量</div>
            <div>预约发货</div>
        </header>
        <div class="body" v-for="item in list" :key="item.id">
            <div class="one" v-if="item.name">
                <div><img src="@/../../static/image/2.png" alt="">{{item.name||'暂无'}}</div>
                <div style="color: red">￥{{item.priceShow!=undefined?item.priceShow:(item.price/100).toFixed(2)}}</div>
                <div>{{item.classifyName||item.classify}}</div>
                <div>{{item.remark}}</div>
                <div>{{item.type=='CASH'?'现货':'预约'}}</div>
                <div>
                    <p>{{item.num}}</p>
                    <p v-if="item.refundNum" class="refund">({{'已退货X'+item.refundNum}})</p>
                    <p v-if="item.waitRefundNum" class="refund">({{'退货中X'+item.waitRefundNum}})</p>
                </div>
                <div>{{Number(item.scheduledDays)?(item.scheduledDays+'天'):'-'}}</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['list','afterSale'],
        data() {
            return {}
        }
    }
</script>
<style lang="scss" scoped>
    .goodsLists {
        border: 1px solid #E6E6E6;
        border-bottom: 0;
        margin: 0 auto;
        width: 760px;
        .one {
            display: flex;
            text-align: center;
            padding: 0;
            height: 40px;
            align-items: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

        }
        .body {
            .one {
                border: 1px solid #E6E6E6;
                border-left: 0;
                border-right: 0;
                margin-right: -1px;
                margin-top: -1px;
                font-weight: bold;
                div {
                    display: flex;
                    height: 40px;
                    align-items: center;
                    justify-content: center;
                    border-right: 1px solid #E6E6E6;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    img {
                        vertical-align: middle;
                        margin-right: 4px;
                    }
                    .refund{
                        font-size: 12px;
                        color: #FF6749;
                    }
                }
            }
        }
        .header {
            font-size: 12px;
            color: #666666;
            height: 31px;
            background: #FFF8ED;
            font-weight: bold;
            justify-content: unset;
        }
    }
</style>
<style lang="scss">
    .goodsLists .one div:nth-child(1) {
        text-align: left;
        padding-left: 10px;
        width: 265px;
    }

    .goodsLists .one div:nth-child(2) {
        width: 89px;
    }

    .goodsLists .one div:nth-child(3) {
        width: 99px;
    }

    .goodsLists .one div:nth-child(4) {
        width: 148px;
    }

    .goodsLists .one div:nth-child(5) {
        width: 99px;
    }

    .goodsLists .one div:nth-child(6) {
        width: 100px;
    }
    .goodsLists .one div:nth-child(7) {
        width: 60px;
    }
</style>