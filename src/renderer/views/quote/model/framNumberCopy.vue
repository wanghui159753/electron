<template>
    <bg v-if="tableData">
        <div class="VinBox">
            <header>
                <p></p>
                <div>心动配讯车架号查询</div>
                <p class="el-icon-close" @click="$emit('input',false)"></p>
            </header>
            <div class="frame scrollbar">
                <div class="top">
                    <p>{{tableData. baseInfo.vin}}</p>
                    <div class="copy">
                        <img src="@/../../static/image/copy.png" alt="">
                        <p @click="copy(tableData. baseInfo.vin)">复制</p>
                    </div>
                </div>
                <div class="bottom">
                    <img :src="tableData.baseInfo.brandImgUrl" alt="图片加载失败">
                    <h3>{{tableData.baseInfo.manufacturers}}</h3>
                    <p>{{tableData.baseInfo.brand}} {{tableData.baseInfo.series}} {{tableData.baseInfo.salesName}}</p>
                    <p class="explain">(信息仅供参考)</p>
                </div>
                <div class="gothere">
                <div class="left">
                <span>更多服务</span>
                <el-button size='mini' @click="$router.push({name:'searchList',query:{keyWord:tableData. baseInfo.brand}});$emit('input',false)"><img src="@/../../static/image/shopcar.png" alt=""> 汽配经销商</el-button>
                </div>
                <p></p>
                <div class="right">
                <!--<el-button  size='mini'><img src="@/../../static/image/msg.png" alt=""> 意见反馈</el-button>-->
                </div>
                </div>
                <div class="table">
                    <div class="row" v-for="(item) in tableData.detailInfo" :key="item.key">
                        <div class="left linebg">{{item.key}}</div>
                        <div class="right">{{item.value?item.value:"空"}}</div>
                    </div>
                </div>
            </div>
        </div>
    </bg>
</template>
<script>
    const {clipboard} = require("electron");
    import bg from "@/components/background.vue";
    import {vin} from "@/api/quote/quote";

    export default {
        components: {bg},
        props: ["vin", 'value'],
        data() {
            return {
                tableData: null
            };
        },
        methods: {
            copy(val) {
                clipboard.writeText(val);
                this.$message.success("复制成功");
            }
        },
        created() {
            vin({
                vin: this.vin
            })
                .then(res => {
                    this.tableData = res.data;
                })
                .catch(e => {
                    this.$emit("input", false);
                });
        }
    };
</script>
<style lang="scss" scoped>
    header {
        height: 60px;
        line-height: 60px;
        background: #e5e5e5;
        font-size: 18px;
        margin: 0;
        color: #000;
        p::before {
            height: 60px;
            line-height: 60px;
        }
    }

    .VinBox {
        overflow: auto;
        height: 100%;
    }

    .gothere {
        display: flex;
        justify-content: space-between;
        height: 58px;
        line-height: 58px;
        background: #fff;
        font-size: 14px;
        padding: 0 20px;
        img {
            vertical-align: bottom;
        }
    }

    .frame,
    .bottom {
        background: #fff;
    }

    .frame {
        height: calc(100% - 60px);
        text-align: center;
        .top {
            text-align: center;
            position: relative;
            font-size: 16px;
            padding-top: 20px;
            .copy {
                height: 18px;
                img {
                    vertical-align: middle;
                }
                p {
                    cursor: pointer;
                    display: inline-block;
                    line-height: 18px;
                    position: relative;
                    top: 2px;
                }
            }
            div {
                position: absolute;
                bottom: 3px;
                right: 100px;
                font-size: 12px;
            }
        }
        .bottom {
            img {
                width: 100px;
                height: 100px;
                margin: 25px auto;
            }
            h3 {
                font-size: 20px;
                color: #fc684f;
                line-height: 50px;
            }
            p {
                font-size: 16px;
                color: #333;
            }
            .explain {
                font-size: 14px;
                color: #999;
                line-height: 48px;
            }
        }
    }

    .row {
        display: flex;
        width: 480px;
        margin: 0 auto;
        font-size: 14px;
        color: #000;
        border-top: 1px solid #ccc;
        .right {
            border-left: 0;
            color: #fc684f;
        }
        div {
            width: 50%;
            height: 40px;
            line-height: 40px;
            border: 1px solid #ccc;
            border-top: 0;
        }
    }

    .table {
        padding-bottom: 30px;
        .row {
            height: 40px;
            display: flex;
            width: 480px;
            margin: 0 auto;
            font-size: 14px;
            color: #000;
            border-top: 1px solid #ccc;
            .right {
                border-left: 0;
                color: #fc684f;
            }
            div {
                width: 50%;
                height: 40px;
                line-height: 40px;
                border: 1px solid #ccc;
                border-top: 0;
            }
        }
        .left {
            color: #666;
        }
        .right {
            width: 340px;
            height: 40px;
        }
    }

    .linebg {
        background: #f0f0f0;
    }
</style>
