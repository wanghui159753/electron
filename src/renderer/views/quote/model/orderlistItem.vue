<template>
    <div class="orderInfo">
        <div class="buyer">
            <div class="left">
                <span>{{details.name}}</span>
            </div>
        </div>
        <div class="brand">
            <div class="brandLogo">
                <img :src="del.logo" width="28" alt>
                <p>
                    {{del.vehicleBrand}}
                </p>
            </div>
            <!--<div class="vin">-->
                <!--<span>车架号：</span> {{del.vin}}-->
            <!--</div>-->
        </div>
        <div class="partsList">
            <goods-list :list="details.select"></goods-list>
        </div>
        <div class="orderRemark">
            <p>买家留言</p>
            <el-input type="textarea" v-model="details.buyMark" maxlength="200"></el-input>
        </div>
        <div class="company" @click="chooseLogistics=true">
            <b><img src="@/../../static/image/huoche.png" width="30" height="20" alt=""><span>配送物流</span></b>
            <p>{{name||'请选择'}}<span class="el-icon-arrow-right"></span></p>
        </div>
        <div class="total"> 共 <span>{{details.select.length}}</span>件，合计: <span>{{details.select.total}}</span><span>(不含运费)</span> </div>
        <second @ship="name=arguments[0]" v-if="chooseLogistics" v-model="chooseLogistics" :quoteUse="true"></second>
    </div>
</template>
<script>
    import goodsList from "@/components/order/goodsList";
    import second from '../../myOrder/model/secondLevel';
    export default {
        props:['details','del'],
        components: {goodsList,second},
        data(){
            return{
                name:'',
                chooseLogistics:false
            }
        }
    };
</script>
<style lang="scss" scoped>
    .partsList {
        margin-bottom: 15px;
    }
    .company {
        padding: 0 20px;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #E6E6E6;
        border-top: 1px solid #E6E6E6;
        b{
            span{
                margin-left: 10px;
                font-size: 20px;
            }
        }
        p{
            span{
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
    .imgList {
        div {
            width: 100px;
            height: 80px;
            overflow: hidden;
            background: #999;
        }
    }

    .orderInfo {
        border-bottom: 10px solid #E6E6E6;
        font-size: 14px;
        .orderRemark,
        .buyer,
        .brand{
            padding: 0 20px;
        }
        .total{
            font-size: 16px;
            line-height: 58px;
            text-align: right;
            padding-right: 20px;
            span{
                font-size: 20px;
                color: #E60000;
            }
            span:nth-child(3){
                font-size: 14px;
                color:#999999;
            }

        }
        .orderRemark {
            padding-bottom: 10px;
            p {
                font-size: 16px;
                line-height: 30px;
                font-weight: bold;
            }
        }
        .buyer {
            height: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            border-bottom: 1px solid #e6e6e6;
            div {
                img {
                    vertical-align: text-bottom;
                    border-radius: 2px;
                }
            }
        }
        .brand {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 14px;
            height: 66px;
            .brandLogo {
                display: flex;
                align-items: center;
                padding: 0 10px;
                height: 36px;
                border: 1px solid rgba(204, 204, 204, 1);
                border-radius: 6px;
                margin-right: 180px;
                img {
                    margin-right: 5px;
                }
            }
            .vin {
                line-height: 20px;
                color: #666666;
                height: 20px;
                span {
                    color: #999;
                }
            }
        }
    }
</style>
