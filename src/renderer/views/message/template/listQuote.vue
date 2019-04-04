<template>
    <div style="color: #000" v-if="idDetail">
        <div class="info">
            <h3>车辆信息</h3>
            <div class="carInfo">
                <div class="brand">
                    <span class="titWord">品牌</span>
                    <div>
                        <img :src="idDetail.logo" width="28" alt>
                        <span>{{idDetail.vehicleBrand}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="bill">
            <div class="titH3">
                <h3>待报价清单</h3>
                <el-button @click="clearAll">
                    <img src="@/../../static/image/clear.png" alt>
                    清空报价
                </el-button>
            </div>
            <div class="table">
                <el-row class="head">
                    <el-col :span="3">排序(共{{idDetail.partList.length}}件)</el-col>
                    <el-col :span="5">配件名称</el-col>
                    <el-col :span="12">报价</el-col>
                </el-row>
                <el-row
                        class="baby"
                        v-for="(item,index) in idDetail.partList"
                        :key="index"
                        :class="{oddBg:index%2==1}"
                >
                    <el-col :span="3">{{index+1}}</el-col>
                    <el-col :span="5">{{item.subName}}</el-col>
                    <el-col :span="12" class="press">
                        <div class="myprice" v-if="item.quotePartItemList">
                            <div v-for="x in 4" :key="x" :class="{borde:1==x}">
                                <p v-if="item.quotePartItemList[x-1]">
                                    {{item.quotePartItemList[x-1].parts?item.quotePartItemList[x-1].parts.split(',')[1]:item.quotePartItemList[x-1].classifyName}}
                                    {{item.quotePartItemList[x-1].isHave?item.quotePartItemList[x-1].isHave.split(',')[1]:item.quotePartItemList[x-1].typeName}}
                                </p>
                                <p
                                        class="price"
                                        v-if="idDetail.partList[index].quotePartItemList[x-1]"
                                >￥{{item.quotePartItemList[x-1].priceS}}</p>
                            </div>
                        </div>
                        <div class="myprice quoteNow" v-else @click="interest(index)">立即报价></div>
                    </el-col>
                    <el-col
                            :span="2"
                            class="reset"
                            v-if="item.quotePartItemList"
                            style="cursor: pointer"
                            @click.native="interest(index)"
                    >修改
                    </el-col>
                    <el-col
                            :span="2"
                            class="reset"
                            v-if="item.quotePartItemList"
                            style="cursor: pointer"
                            @click.native="delect(index)"
                    >删除
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="mark">
            <h3>备注</h3>
            <el-input type="textarea" v-model="idDetail.notes" placeholder="请输入备注内容(最多100字)" maxlength="100"></el-input>
        </div>
        <footer class="send">
            <el-button @click="commit">发送报价</el-button>
        </footer>
        <offer v-if="interestShow"
               @hid="interestShow=false"
               v-model="idDetail"
               :index="currentNum">
        </offer>
    </div>
</template>
<script>
    import offer from "../../quote/model/offer";
    import {inventory, preciseCommit} from '@/api/quote/quote';
    import preciseCommitObj from '@/utils/quote';

    export default {
        components: {offer},
        props:['msgContent'],
        data() {
            return {
                interestShow: false,
                currentNum: 0,
                idDetail: null
            }
        },
        methods: {
            commit() {
                let data = preciseCommitObj(this.idDetail);
                data.enquiryId = this.msgContent.orderId;
                preciseCommit(data).then(res => {
                    if (res.code !== 200) return;
                    this.$message.success("报价成功");
                    this.$emit('ok')
                    this.$store.dispatch("sendMsg", {
                        scene: 'p2p',
                        to: this.$store.state.im.currSessionId.substring(4),
                        type: "custom",
                        content: {
                            msgType: 6,
                            msgContent: JSON.stringify({
                                orderId:this.msgContent.orderId,
                                buyerId:this.msgContent.buyerId,
                                buyerName:this.msgContent.buyerName,
                                sellerId:this.msgContent.sellerId,
                                brandName:this.msgContent.brandName,
                                partName:this.msgContent.partName
                            })
                        }
                    });
                });
            },
            init() {
                inventory({enquiryId: this.msgContent.orderId}).then(res => {
                    res.data.partList.forEach(item => {
                        let quote = item.quotePartItemList;
                        quote && quote.forEach(item => {
                            item.priceS = (item.price / 100).toFixed(2);
                            item.parts = `${item.classify},${item.classifyName}`;
                            item.isHave = `${item.type},${item.typeName}`;
                        })
                    });
                    res.data.isQuote&&(res.data.notes=res.data.currentUserQuote.remark||'');
                    this.idDetail = res.data;
                })
            },
            interest(index) {
                this.currentNum = index;
                this.interestShow = true;
            },
            clearAll() {
                this.idDetail.partList.map(item => {
                    item.quotePartItemList = null;
                });
            },
        },
        created() {
            this.init();
            console.log(this.msgContent,'....')
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../../styles/list";

    .info {
        .titWord {
            margin-right: 10px;
        }
    }

    .bill {
        padding-left: 0;
        .table {
            padding: 0;
        }
    }

    .mark {
        padding-bottom: 88px;
        .el-textarea {
            height: 100px;
        }
    }

    .send {
        .el-button {
            background: #f00;
            color: #fff;
        }
        .el-button:hover {
            background: rgba(255, 0, 0, 0.6);
        }
    }
</style>
<style lang="scss">

    .mark .el-textarea .el-textarea__inner {
        height: 100px;
        resize: none;
    }
</style>