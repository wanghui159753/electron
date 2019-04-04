<template>
<bg class="flex">
    <div class="content">
        <div class="header">提示 <span class="el-icon-close" @click="$emit('input')"></span></div>
        <div class="success">
            <img src="@/../../static/image/successPayG.png" width="40" alt="">
            <p>付款成功!</p>
        </div>
        <div class="orderMsg">
            <p>订单编号：<span>{{detail.tradeNo}}</span></p>
            <p>付款金额：<span class="money">¥{{(detail.totalAmount/100).toFixed(2)}}</span></p>
            <p>付款时间：<span>{{detail.payTime|parseTime}}</span></p>
        </div>
        <div class="do">
            <el-button style="margin-right: 50px;" @click="look" v-if="payNow">查看订单</el-button>
            <el-button @click="$emit('input')">关闭</el-button>
        </div>
    </div>
</bg>
</template>
<script>
    import bg from '@/views/myOrder/model/bg';
    export default {
        props:['detail','payNow'],
        components:{bg},
        methods:{
            look(){
                window.VueEvent.$emit('look',this.detail.tradeNo);
                this.$emit('input');
            }
        }
    }
</script>
<style lang="scss" scoped>
    @mixin fontSize{
        font-size: 18px;
        font-weight:bold;
    }
.flex{
    display: flex;
    justify-content: center;
    align-items: center;
    .content{
        background: #fff;
        width: 500px;
        height: 470px;
        .header{
            text-align: center;
            line-height: 40px;
            @include fontSize;
            position: relative;
            background: #F5F5F5;
            span{
                position: absolute;
                top: 12px;
                right: 12px;
            }
        }
        .success{
            height: 120px;
            @include fontSize;
            background: #F2FDEE;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                margin-right: 12px;
            }
        }
        .orderMsg{
            margin-top: 10px;
            p{
                text-indent: 73px;
                line-height: 32px;
                span{
                    color: #666;
                }
            }
            .money{
                color: #FC684F;
            }
        }
        .do{
            margin-top: 50px;
            text-align: center;
            .el-button{
                width: 120px;
                height: 36px;
                padding: 0;
            }
        }
    }
}

</style>