<template>
    <div class="orders">
        <h2>
            <p @click="buySell=1;requst()" :class="{active:buySell==1}">我的卖
                <el-badge v-show="dote[1]" is-dot></el-badge>
            </p>
            <p @click="buySell=0;requst()" :class="{active:buySell==0}">我的买
                <el-badge v-show="dote[0]" is-dot></el-badge>
            </p>
        </h2>
        <div class="tab">
            <div class="left">
                <el-radio-group v-model="status" @change="change">
                    <el-radio-button label=''>全部
                    </el-radio-button>
                    <el-radio-button label="WAIT_PAY">待付款
                        <el-badge v-if="badge.WAIT_PAY" :value="badge.WAIT_PAY" class="mark"/>
                    </el-radio-button>
                    <el-radio-button label="WAIT_SHIP">待发货
                        <el-badge v-if="badge.WAIT_SHIP" :value="badge.WAIT_SHIP" class="mark"/>
                    </el-radio-button>
                    <el-radio-button label="WAIT_TAKE">待收货
                        <el-badge v-if="badge.WAIT_TAKE" :value="badge.WAIT_TAKE" class="mark"/>
                    </el-radio-button>
                    <el-radio-button label="FINISH">已完成
                    </el-radio-button>
                    <el-radio-button label="OVERDUE">已取消
                    </el-radio-button>
                    <el-radio-button label="POST_SALES ">退款 / 售后
                        <el-badge v-if="badge.REFUND" :value="badge.REFUND" class="mark"/>
                    </el-radio-button>
                </el-radio-group>
            </div>
            <div class="search">
                <input v-model="keyWord" @keyup.enter="requst()" placeholder="请输入订单号 / 卖家名称">
                <button class="el-icon-search" @click="requst()">搜索</button>
            </div>
        </div>
        <list @afterSale="refundStatus=arguments[0];requst()" :detailLists="detailList" :type="buySell"
              :refund="status.includes('POST_SALES')" @refresh="requst()"
              @showRefundDetail='showDetail(arguments[0],"refund")'
              @showDetail='showDetail(arguments[0],"normal")'></list>
        <pager @sizeChange="sizeChange" :total="pages"></pager>
        <order-detail v-if="refundOrder.show" :detailInfoId='refundOrder.detailInfo.id' @refresh="requst()"
                      :autoSellor="buySell==1"
                      @showDetail='showDetail(arguments[0],"refund")'></order-detail>
        <order-detail-normal v-if="show" :detailInfoId='detailInfo.tradeNo' @refresh="requst()" :autoSellor="buySell==1"
                             @showDetail='showDetail(arguments[0],"normal")'></order-detail-normal>
    </div>
</template>
<script>
    import {orderList, afterSale, orderTotal, burseMain} from "@/api/myorder/index.js";
    import orderDetail from "./orderDetail";
    import orderDetailNormal from "./orderDetailNormal";
    import list from "./model/list";
    import pager from "@/components/pager/pager";
    import {getLocal} from "../../utils/localstorage";

    export default {
        data() {
            return {
                status: "",
                detailList: null,
                keyWord: "",
                pages: 0,
                pageNo: 1,
                buySell: 1,
                show: false,
                detailInfo: null,
                badge: {},
                refundOrder: {
                    show: false,
                    detailInfo: null
                },
                dote: {
                    1: false,
                    0: false
                },
                refundStatus: 0
            };
        },
        components: {list, pager, orderDetail, orderDetailNormal},
        methods: {
            change(val) {
                this.keyWord = '';
                if (val == 'POST_SALES') {
                    this.refundStatus = 0;
                    this.requst()
                } else {
                    this.refundStatus = null;
                    this.requst()
                }
                this.pageNo = 1;
            },
            showDetail(val, str) {
                if (str == 'normal') {
                    this.show = !this.show;
                    this.detailInfo = val;
                } else {
                    this.refundOrder.show = !this.refundOrder.show;
                    this.refundOrder.detailInfo = val;
                }
            },
            sizeChange(i) {
                this.requst(i);
                this.pageNo = i;
            },
            afterReq(res) {
                this.detailList = res.data.records;
                this.pages = res.data.pages * 10;
                this.$store.commit('setLoading', false)
            },
            requst(pageNo) {
                this.$store.commit('setLoading', true)
                let obj = {}
                if (this.status) {
                    obj = {
                        pageNo: pageNo || this.pageNo,
                        pageSize: 10,
                        buySell: this.buySell,
                        status: this.status,
                        keyword: this.keyWord
                    };
                } else {
                    obj = {pageNo: pageNo, pageSize: 10, buySell: this.buySell, keyword: this.keyWord};
                }
                if (this.status == 'POST_SALES ') {
                    obj.status = this.refundStatus;
                    afterSale(obj)
                        .then(res => {
                            this.afterReq(res)
                        })
                        .then(res => orderTotal({userType: this.buySell ? 'SELLER' : 'BUYER'}))
                        .then(res => {
                            this.badge = res.data;
                            this.dote[this.buySell] = res.data.WAIT_PAY || res.data.WAIT_SHIP || res.data.WAIT_TAKE || res.data.REFUND
                        })
                        .then(res => orderTotal({userType: !this.buySell ? 'SELLER' : 'BUYER'}))
                        .then(res => {
                            this.dote[this.buySell == 1 ? 0 : 1] = res.data.WAIT_PAY || res.data.WAIT_SHIP || res.data.WAIT_TAKE || res.data.REFUND
                        })
                } else {
                    orderList(obj)
                        .then(res => this.afterReq(res))
                        .then(res => orderTotal({userType: this.buySell ? 'SELLER' : 'BUYER'}))
                        .then(res => {
                            this.badge = res.data;
                            this.dote[this.buySell] = res.data.WAIT_PAY || res.data.WAIT_SHIP || res.data.WAIT_TAKE || res.data.REFUND
                        })
                        .then(res => orderTotal({userType: !this.buySell ? 'SELLER' : 'BUYER'}))
                        .then(res => {
                            this.dote[this.buySell == 1 ? 0 : 1] = res.data.WAIT_PAY || res.data.WAIT_SHIP || res.data.WAIT_TAKE || res.data.REFUND
                        })
                }

            }
        },
        created() {
            this.buySell = JSON.parse(getLocal('myStore')).identityParentName == '配件商' ? 1 : 0;
            this.requst();
        }
    };
</script>
<style lang="scss" scoped>
    .tab {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 76px;
        background: #fff;
        padding: 0 15px;
        .search {
            display: flex;
        }
    }

    .orders {
        .el-col {
            font-size: 14px;
            padding: 0 5px;
            text-align: center;
            line-height: 48px;
        }
        h2 {
            height: 58px;
            font-size: 18px;
            line-height: 58px;
            text-align: center;
            color: #333;
            display: flex;
            justify-content: center;
            background: #EDEDED;
            cursor: pointer;
            p {
                width: 114px;
                border-bottom: 4px solid transparent;
                font-weight: 400;
                border-radius: 1px;
                position: relative;
                .el-badge {
                    right: 0;
                    top: -7px;
                }
            }
            .active {
                border-color: #FC684F;
                font-weight: bold;
            }
        }
        .search {
            width: 360px;
            border: 1px solid #ccc;
            border-radius: 5px;
            input {
                width: 300px;
                height: 40px;
                text-indent: 12px;
                border: 0;
                outline: 0;
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
            }
            .el-icon-search::before {
                margin-right: 8px;
            }
            button:hover {
                background: rgba(252, 104, 79, 0.8);
            }
            button {
                transition: all 0.3s;
                border: 0;
                outline: 0;
                width: 70px;
                background: #fc684f;
                color: #fff;
                font-size: 14px;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
            }
        }
    }
</style>
<style>
    .orders .tab .el-radio-button .el-radio-button__inner {
        padding: 8px 12px;
    }

    .orders .tab .el-badge__content {
        width: 20px;
        height: 20px;
        padding: 0;
    }

    .orders .tab .el-badge {
        position: absolute;
        top: 0;
        z-index: 5;
    }
</style>
