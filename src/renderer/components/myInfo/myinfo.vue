<template>
    <div class="box-card" @mouseleave="$emit('input',false)">
        <div class="box-card_header">
            <div class="card_header_text">
                <p>{{myInfo.name}}
                    <el-tooltip placement="top" v-for="x in myInfo.authList" :key="x">
                        <span slot="content">{{x}}</span>
                        <img src="./../../../../static/image/cash.png" alt v-if="x=='营业执照认证'">
                        <img src="./../../../../static/image/id.png" alt v-else-if="x=='身份证认证'">
                        <img src="./../../../../static/image/cash2.png" alt v-else-if="x=='实地认证经销商'">
                        <img src="./../../../../static/image/cash2.png" alt v-else-if="x=='实地认证汽修厂'">
                        <img src="./../../../../static/image/cash3.png" alt v-else-if="x.indexOf('￥')>-1">
                    </el-tooltip>
                </p>
                <img :src="myInfo.logo" width="60">
            </div>
        </div>
        <div class="box-card_body">
            <span>登陆账号</span>
            <strong>{{myInfo.mobile}}</strong>
        </div>
        <div class="box-card_body" v-if="myInfo.identityParentName=='配件商'">
            <span>主营品牌</span>
            <strong>{{myInfo.manageScope}}</strong>
        </div>
        <div class="box-card_body" v-if="myInfo.identityParentName=='配件商'">
            <span>服务信誉</span>
            <strong>100%好评</strong>
        </div>
        <div class="box-card_body">
            <span>采购信誉</span>
            <strong>0次退货</strong>
        </div>
        <div class="share">
            <el-button type="primary" @click="$router.push('/sysset/index?activeName=third');$emit('input',false)" v-if="myInfo.merchantFieldPass">店铺设置</el-button>
            <p v-else></p>
            <img src="@/../../static/image/share.png" alt="" @click="$emit('share')">
        </div>
    </div>
</template>
<script>

    export default {
        name: "myinfo",
        props: ['myInfo', 'value']
    };
</script>
<style lang="scss" scoped>
    .box-card {
        padding: 20px;
        position: absolute;
        right: -400px;
        width: 400px;
        z-index: 1000;
        top: 30px;
        background: #f3f3f3;
        border: 1px solid #c3c3c3;
        box-shadow: 0px 0px 10px 0px #666666;
        border-radius: 6px;
        font-size: 14px;
        .card_header_text {
            p{
                img{
                    position: initial;
                    width: 17px;
                    height: 20px;
                    margin-left: 10px;
                    vertical-align: sub;
                }
            }
            img {
                position: absolute;
                top: 20px;
                right: 20px;
                border-radius: 4px;
            }
        }
        .box-card_header {
            width: 100%;
            font-weight: bold;
            p {
                font-size: 18px;
            }
        }
        .box-card_body {
            line-height: 34px;
            display: flex;
            span {
                color: #999999;
                display: block;
                height: 20px;
                margin-right: 19px;
            }
            strong{
                width: calc(100% - 79px) ;
            }
        }
        .share {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            img {
                width: 28px;
                height: 24px;
            }
        }
        .el-button {
            width: 80px;
            height: 36px;
            padding: 0;
        }
    }
</style>

