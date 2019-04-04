<template>
    <div class="content">
        <div class="goodsList" v-if="!nothing">
            <div class="user">
                <img :src="detail.logo" alt="">
                <p>{{detail.name}}({{detail.province+detail.city}})</p>
                <div class="img">
                    <el-tooltip placement="top" v-for="x in detail.authList" :key="x">
                        <span slot="content">{{x}}</span>
                        <img src="./../../../../../static/image/cash.png" alt v-if="x=='营业执照认证'">
                        <img src="./../../../../../static/image/id.png" alt v-else-if="x=='身份证认证'">
                        <img src="./../../../../../static/image/cash2.png" alt v-else-if="x=='实地认证经销商'">
                        <img src="./../../../../../static/image/cash2.png" alt v-else-if="x=='实地认证汽修厂'">
                        <img src="./../../../../../static/image/cash3.png" alt v-else-if="x.indexOf('￥')>-1">
                    </el-tooltip>
                </div>
            </div>
            <el-row class="one header">
                <el-col :span="8">配件信息({{list.length}})</el-col>
                <el-col :span="4">单价</el-col>
                <el-col :span="4">品质</el-col>
                <el-col :span="4">货源</el-col>
                <el-col :span="4">预约发货</el-col>
            </el-row>
            <div class="body" v-for="item in list" :key="item.id">
                <div class="one" v-if="item.name">
                    <el-col :span="8">{{item.name}}</el-col>
                    <el-col :span="4">{{item.priceShow}}</el-col>
                    <el-col :span="4">{{item.classify|classify}}</el-col>
                    <el-col :span="4">{{item.type=='CASH'?'现货':'预约'}}</el-col>
                    <el-col :span="4">{{Number(item.reserveDays)?(item.reserveDays+'天'):'-'}}</el-col>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    import util from '@/utils/index'

    export default {
        filters: {
            classify(val) {
                return util.getClassify(val)
            }
        },
        props: ['detail'],
        data() {
            return {
                list: [],
                nothing: false
            }
        },
        created() {
            this.list = this.detail.quotePartList
        }
    }
</script>
<style lang="scss" scoped>
    .goodsList {
        border: 1px solid #E6E6E6;
        border-bottom: 0;
        width: 844px;
        margin-bottom: 30px;
        .user {
            display: flex;
            align-items: center;
            height: 40px;
            font-size: 14px;
            background: rgba(255, 248, 237, 1);
            img {
                margin: 0 10px 0 8px;
                width: 30px;
                height: 30px;
                border-radius: 2px;
            }
            .img {
                img {
                    width: 17px;
                    height: 20px;
                    margin: 0 0 0 13px;
                }
            }
        }
        .one {
            font-size: 14px;
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
                justify-content: space-between;
                div {
                    height: 40px;
                    line-height: 40px;
                    border-right: 1px solid #E6E6E6;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    img {
                        vertical-align: middle;
                        margin-right: 4px;
                    }
                }
            }
        }
        .header {
            border-top: 1px solid #E6E6E6;
            font-size: 12px;
            color: #666666;
            height: 31px;
            background: #EFEFEF;
            font-weight: bold;
        }
    }
</style>