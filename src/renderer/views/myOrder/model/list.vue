<template>
    <div class="content_box">
        <div class="choose" v-if="refund">
            <p :class="{active:active==1}" @click="active=1;$emit('afterSale',0)">全部售后</p>
            <p :class="{active:active==2}" @click="active=2;$emit('afterSale',1)">售后中</p>
            <p :class="{active:active==3}" @click="active=3;$emit('afterSale',2)">售后完成</p>
        </div>
        <div class="tit">
            <el-col :span="14">配件商品</el-col>
            <el-col :span="3">合计付款</el-col>
            <el-col :span="4">交易状态</el-col>
            <el-col :span="3">操作</el-col>
        </div>
        <div class="scrollbar orderList" :style="{height:refund?'calc(100vh - 300px)':'calc(100vh - 270px)'}" v-if='detailLists'>
            <div class="list">
                <div v-for="(val,key) in detailLists" :type="type" :key="Math.random()" :class="val.status+val.id">
                    <buy-item :val="val" :type="type" :refund="refund" v-bind="$attrs" v-on="$listeners" @refresh="$emit('refresh')"></buy-item>
                </div>
            </div>
            <nothing v-if='!detailLists.length'></nothing>
        </div>
    </div>

</template>
<script>
    import buyItem from "./buyItem";
    import nothing from "../../quote/model/nothing";

    export default {
        name: "quoteItem",
        data(){
            return{
                active:1
            }
        },
        components: {
            nothing,
            buyItem
        },
        methods: {},
        props: {
            detailLists: {
                type: Array,
                default: []
            },
            type: {
                type: Number,
                default: 1
            },
            refund:{
                type:Boolean
            }
        },
        mounted() {
            if (document.querySelector(".scrollbar")) {
                document.querySelector(".scrollbar").scrollTop = this.$route.meta.scollTopPosition;
            }
        }
    };
</script>
<style lang="scss" scoped>
    .content_box{
        margin: 0 10px;
    }
    .choose{
        display: flex;
        p{
            margin-right: 39px;
            font-size: 14px;
            color: #FC684F;
            padding-bottom: 10px;
            cursor: pointer;
            width: 70px;
            border-bottom: 3px solid transparent;
            transition: all .3s;
            text-align: center;
        }
        .active{
            border-bottom: 3px solid #FC684F;
        }
    }
    .tit {
        display: flex;
        align-items: center;
        text-align: center;
        width: 100%;
        height: 48px;
        background: linear-gradient(#e7e7e7, #f9f9f9);
        border: 1px solid rgba(230, 230, 230, 1);
    }
    .orderList {
        height: calc(100vh - 300px);
        overflow: auto;
    }
</style>
