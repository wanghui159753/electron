<template>
    <div class="goodsList" :style="{width:$route.path.includes('message')?'96%':'916px'}">
        <div class="user" v-if="detail.quotePartList">
            <div class="left">
                <img :src="detail.logo" alt="">
                <p>{{detail.name}}({{detail.province+detail.city}})</p>
                <div class="img" v-if="detail.authList">
                    <el-tooltip placement="top" v-for="x in detail.authList" :key="x">
                        <span slot="content">{{x}}</span>
                        <img src="./../../../../../static/image/cash.png" alt v-if="x=='营业执照认证'">
                        <img src="./../../../../../static/image/id.png" alt v-else-if="x=='身份证认证'">
                        <img src="./../../../../../static/image/cash2.png" alt v-else-if="x=='实地认证经销商'">
                        <img src="./../../../../../static/image/cash2.png" alt v-else-if="x=='实地认证汽修厂'">
                        <img src="./../../../../../static/image/cash3.png" alt v-else-if="x.indexOf('￥')>-1">
                    </el-tooltip>
                </div>
                <div v-else class="noAuthList">未认证</div>
                <div class="connect">
                    <img src="@/../../static/image/newMsg.png" alt="">
                    <span>联系商家</span>
                </div>
            </div>
            <div class="smTotal">
                <p>已选{{select.length}}项</p>
                <div>小计¥{{ total}}</div>
            </div>
        </div>
        <el-row class="one header" :class="{messageBg:$route.path.includes('message')}">
            <el-col :span="8">配件信息({{list.length}})</el-col>
            <el-col :span="3">单价</el-col>
            <el-col :span="4">品质</el-col>
            <el-col :span="2">货源</el-col>
            <el-col :span="3">预约发货</el-col>
            <el-col :span="2">数量</el-col>
            <el-col :span="2">选择</el-col>
        </el-row>
        <div class="body" v-for="item in list" :key="item.id">
            <div class="one" v-if="item.name">
                <el-col :span="8" class="div">{{item.name}}</el-col>
                <el-col :span="3" class="div">{{item.priceShow}}</el-col>
                <el-col :span="4" class="brand_remark">
                    <div>{{item.classify}} <span v-if="item.classify">{{item.remark}}</span></div>
                </el-col>
                <el-col :span="2" class="div">{{item.type=='CASH'?'现货':'预约'}} <span style="display: none">{{total}}</span></el-col>
                <el-col :span="3" class="div">{{Number(item.reserveDays)?(item.reserveDays+'天'):'-'}}</el-col>
                <el-col :span="2" class="insert div">
                    <el-input maxlength="2" v-model="item.num"
                              @keyup.native="$set(item,'num',item.num.replace(/[^\d]/g,''))"></el-input>
                </el-col>
                <el-col :span="2" class="div">
                    <el-checkbox :label="item" v-model="select" @change="change"></el-checkbox>
                </el-col>
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
                select: []
            }
        },
        methods: {
            getNeedArray() {
                let arr = []
                this.detail.quotePartList && this.detail.quotePartList.forEach(item => {
                    item.partItemList.forEach(val => {
                        arr.push({
                            classify: val.classifyName,
                            type: val.type,
                            priceShow: (val.price / 100).toFixed(2),
                            name: item.subName,
                            reserveDays: val.reserveDays,
                            num: 1
                        })
                    })
                })
                this.detail.quotedGoodsList && this.detail.quotedGoodsList.forEach(item => {
                    arr.push(Object.assign({priceShow: (item.price / 100).toFixed(2)}, item))
                })
                this.list = arr;
            },
            change() {

            }
        },
        computed: {
            total() {
                let total = 0;
                this.select.forEach(item => {
                    total += item.priceShow * item.num;
                })
                total = total.toFixed(2);
                this.select.total = total;
                this.$emit('getSelect', Object.assign(this.detail, {select: this.select}))
                return total;
            }
        },
        created() {
            this.getNeedArray();
        }
    }
</script>
<style lang="scss" scoped>
    @mixin fl {
        display: flex;
        align-items: center;
    }

    .goodsList {
        border: 1px solid #E6E6E6;
        border-bottom: 0;
        width: 916px;
        margin: 0 auto;
        margin-bottom: 15px;
        .noAuthList {
            width: 68px;
            height: 24px;
            background: #ccc;
            color: #FF0000;
            font-size: 14px;
            text-align: center;
            line-height: 24px;
            border-radius: 4px;
            margin-left: 15px;
        }
        .user {
            @include fl;
            justify-content: space-between;
            height: 40px;
            font-size: 14px;
            background: rgba(255, 248, 237, 1);
            .left {
                @include fl;
                .connect {
                    @include fl;
                    line-height: 18px;
                    img {
                        width: 18px;
                        height: 18px;
                        margin: 0 5px 0 15px;
                    }
                    color: #FC684F;
                }
            }
            .smTotal {
                @include fl;
                div {
                    width: 110px;
                    height: 42px;
                    background: #EF0C19;
                    color: white;
                    text-align: center;
                    line-height: 42px;
                }
                p {
                    margin-right: 10px;
                }
            }
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
        }
        .body {
            .insert {
                .el-input {
                    width: 40px;
                    height: 28px;
                }
            }
            .brand_remark {
                height: 40px;
                border-right: 1px solid #E6E6E6;
                @include fl;
                justify-content: center;
                div{
                    line-height: 20px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    span {
                        color: #FC684F;
                        font-size: 12px;
                    }
                }

            }
            .one {
                border: 1px solid #E6E6E6;
                border-left: 0;
                border-right: 0;
                margin-right: -1px;
                margin-top: -1px;
                justify-content: space-between;
                > .div {
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
            border-bottom: 1px solid #E6E6E6;
            font-size: 12px;
            color: #666666;
            height: 31px;
            background: #E6E6E6;
            font-weight: bold;
        }
        .messageBg {
            background: #FFF8ED;
        }
    }
</style>
<style>
    .insert .el-input__inner {
        height: 28px;
        padding: 0;
        text-align: center;
        background: #fff;
    }

    .body .one .el-checkbox__label {
        display: none;
    }
</style>