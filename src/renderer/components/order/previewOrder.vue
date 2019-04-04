<template>
    <div class="content">
        <div class="userName">{{myInfo.autoSellerName}} <span>(报价清单共<span>{{goodsList.length}}</span>件)</span></div>
        <div class="orderContent">
            <div v-if="carBrand.vehicleBrand" class="brand">
                <img :src="carBrand.logo" width="28" alt>
                <span>{{carBrand.vehicleBrand}}<span v-if="carBrand.vehicleSerie">({{carBrand.vehicleSerie}})</span></span>
            </div>
            <span>车架号：<span>{{carBrand.vin||'暂无'}}</span></span>
        </div>
            <div class="partsList">
                <list :list="goodsList"></list>
        </div>
        <div class="remark">
            <h3>卖家留言</h3>
            <p>{{sellerRemark||'暂无留言'}}</p>
        </div>
    </div>
</template>
<script>
    import list from './goodsList'
    import {getLocal} from "@/utils/localstorage"
    export default {
        data(){
            return{
                myInfo:null
            }
        },
        components:{list},
        props: ['carBrand', 'goodsList','types','sellerRemark'],
        created() {
            this.myInfo=JSON.parse(getLocal('myStore'))
        }
    }
</script>
<style lang="scss" scoped>
    @mixin fl {
        display: flex;
    }

    @mixin border {
        border: 1px solid #dedede;
        border-radius: 5px;
        height: 36px;
        line-height: 36px;
    }
.content{
    color: #000;
    >div{
        padding: 0 20px;
    }
    .orderContent {
        margin: 18px 0;
        @include fl;
        .brand {
            @include fl;
            align-items: center;
            @include border;
            padding: 0 10px;
            margin-right: 20px;
            img {
                width: 28px;
                height: 28px;
                vertical-align: middle;
                margin-right: 13px;
            }
        }
        >span{
            line-height: 36px;
            color: #999;
            span{
                color: #666;
            }
        }
    }
    .partsList {
        padding-bottom: 15px;
        border-bottom: 1px solid #E6E6E6;
        width: 554px;
    }
    .userName{
        font-size: 18px;
        color: #666;
        line-height: 57px;
        text-align: center;
        border-bottom:10px solid #F1F1F1;
        span{
            font-size: 14px;
            span{
                color:#FC684F;
            }
        }
    }
    .remark{
        font-size: 16px;
        margin-top: 18px;
        p{
            text-indent: 10px;
            margin-top: 10px;
            line-height: 1.5em;
            min-height: 24px;
            background:rgba(240,240,240,1);
        }
    }
}

</style>