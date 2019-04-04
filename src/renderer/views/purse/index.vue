<template>
    <div class="purse">
        <div class="purse_head">
            <el-radio-group v-model="isCollapse">
                <el-radio-button :label="false">财务状况</el-radio-button>
                <el-radio-button :label="true">交易记录</el-radio-button>
            </el-radio-group>
        </div>
        <div class="purse_main" v-if="!isCollapse">
            <div class="purse_left">
                <p>数据统计</p>
                <div class="purse_money">
                    <div class="income">
                        <p>累计收入</p>
                        <p>
                            <span>￥ {{burseBillTradeInfo.plusAmount|exNum}}</span>
                        </p>
                        <p>交易
                            <strong>{{burseBillTradeInfo.plusNum}} 笔</strong>
                        </p>
                    </div>
                    <div class="outlay">
                        <p>累计支出</p>
                        <p>
                            <span>￥ {{burseBillTradeInfo.subAmount|exNum}}</span>
                        </p>
                        <p>交易
                            <strong>{{burseBillTradeInfo.subNum}} 笔</strong>
                        </p>
                    </div>
                </div>
            </div>
            <div class="purse_left purse_right">
                <p>账号概况</p>
                <div class="purse_money">
                    <div class="income">
                        <p>账户余额</p>
                        <p>
                            <span style="color:#00C738">￥ {{balanceTradeInfo.balanceAmount|exNum}}</span>
                        </p>
                        <p>
                            <el-tooltip
                                    popper-class="purse_tool"
                                    effect="dark"
                                    content="是指在您的销售订单中,所有处在等待用户确定收货状态下的订单总额"
                                    placement="bottom-start"
                            >
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                            待到账
                            <strong :title="balanceTradeInfo.waitBillAmount|exNum">{{balanceTradeInfo.waitBillAmount|exNum}} 元</strong>
                        </p>
                        <p>
                            <el-tooltip
                                    popper-class="purse_tool"
                                    effect="dark"
                                    content="待到账、交易中、余额的总和"
                                    placement="bottom-start"
                            >
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                            总&nbsp&nbsp&nbsp额
                            <strong :title="(balanceTradeInfo.drawAmount+balanceTradeInfo.waitBillAmount+balanceTradeInfo.balanceAmount)|exNum">{{(balanceTradeInfo.drawAmount+balanceTradeInfo.waitBillAmount+balanceTradeInfo.balanceAmount)|exNum}}
                                元</strong>
                        </p>
                        <p>
                            <el-tooltip
                                    popper-class="purse_tool"
                                    effect="dark"
                                    content="所有处于等待用户确认收货状态下的订单总额"
                                    placement="bottom-start"
                            >
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                            交易中
                            <strong :title="balanceTradeInfo.drawAmount|exNum">{{balanceTradeInfo.drawAmount|exNum}}
                                元</strong>
                        </p>
                    </div>
                    <div class="outlay">
                        <el-button type="success" @click="cz=true">充值</el-button>
                        <el-button class="tixian" @click="close">提现</el-button>
                        <span class="history" @click="dialogTableVisible=true">提现记录</span>
                    </div>
                </div>
            </div>
            <zhi-fu @reSetAlipay="bindingShow=true" @close="close" v-if="show" :drawAlipay='drawAlipay'
                    @init="init"
                    :balanceAmount='balanceTradeInfo.balanceAmount'></zhi-fu>
            <binding @init="initInfo" v-if="bindingShow" v-model="bindingShow"></binding>
        </div>

        <list v-if="isCollapse" :plus='burseBillTradeInfo.plusAmount' :sub='burseBillTradeInfo.subAmount'></list>
        <draw v-if="dialogTableVisible"
              :dialogTableVisible='dialogTableVisible'
              @closeTable='closeTable'></draw>
        <bindingPassword v-if="setPassword" v-model="this.data.bindPayPassword" @close="setPassword=false"></bindingPassword>
        <Recharge @init="init" v-if="cz" v-model="cz"></Recharge>
    </div>
</template>
<script>
    import zhiFu from "./model/zhifu";
    import list from "./model/list";
    import binding from "./model/bindingAlipay"
    import bindingPassword from './model/bindingPayPassword'
    import {burseMain} from "@/api/myorder/index.js";
    import Recharge from "./model/Recharge"
    import draw from "./model/draw";

    export default {
        data() {
            return {
                cz:false,
                setPassword:false,
                isCollapse: false,
                show: false,
                burseBillTradeInfo: {},
                balanceTradeInfo: {},
                drawAlipay: null,
                bindingShow: false,
                dialogTableVisible: false,
                data:null
            };
        },
        components: {zhiFu, list, binding, draw,bindingPassword,Recharge},
        methods: {
            closeTable() {
                this.dialogTableVisible = false;
            },
            initInfo(val) {
                this.init()
            },
            close() {
                if(!this.data.bindPayPassword){
                    this.setPassword=true;
                    return
                }
                if (this.drawAlipay) {
                    this.show = !this.show;
                } else {
                    this.bindingShow = true;
                }
            },
            init() {
                this.$store.commit("setLoading", true);
                burseMain().then(res => {
                    this.setPassword=!res.data.bindPayPassword;
                    this.$store.commit("setLoading", false);
                    this.burseBillTradeInfo = res.data.burseBillTradeInfo
                    this.balanceTradeInfo = res.data.balanceTradeInfo
                    this.drawAlipay = res.data.drawAlipay
                    this.data=res.data;
                })
            }
        },
        mounted() {
            this.init()
        }
    };
</script>
<style lang="scss" scoped>
    .purse {
        user-select: none;
        background: #f2f2f2;
        height: 100%;
        .purse_head {
            background: #ededed;
            height: 58px;
            line-height: 58px;
            text-align: center;
            font-weight: 900;
        }
        .purse_main {
            display: flex;
            justify-content: space-between;
        }
        .purse_left {
            margin: 30px 5%;
            background: white;
            width: 40%;
            height: 248px;
            > p {
                height: 60px;
                padding: 15px;
                text-align: left;
                font-weight: 900;
            }
            .purse_money {
                display: flex;
                justify-content: space-between;
                padding-top: 20px;
                div {
                    width: 50%;
                }
                div:nth-of-type(1) {
                    border-right: 2px solid #e6e6e6;
                }
                p {
                    color: #666;
                    text-align: center;
                    font-size: 15px;
                }
                strong {
                    color: black;
                    padding-left: 20px;
                }
                span {
                    color: black;
                    font-weight: 900;
                    font-size: 16px;
                    display: inline-block;
                    line-height: 66px;
                    height: 66px;
                }
            }
        }
        .purse_right {
            .purse_money p:last-of-type,
            .purse_money p:nth-last-child(3),.purse_money p:nth-last-child(2) {
                text-align: left;
                padding: 0 20%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                height: 18px;
                strong {
                    padding-left: 10px;
                }
                i {
                    color: #ccc;
                }
            }
            .outlay {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .history {
                    height: 30px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    text-decoration: underline;
                    color:#CCCCCC;
                    line-height: 30px;
                }
                .el-button+.el-button{
                    margin: 12px 0 0 0 ;
                }
                .tixian{

                    background: #ff9e3f;
                    color: white;
                }
                .el-button {
                    padding: 0;
                    margin-top: 15px;
                    width: 110px;
                    height: 38px;
                }
            }
        }
    }
</style>
<style>
    .purse_tool {
        background: #fff5c4 !important;
        color: #666 !important;
        width: 200px;
        line-height: 16px;
    }

    .purse_tool .popper__arrow {
        border-top-color: #fff5c4 !important;
        border-bottom-color: #fff5c4 !important;
    }

    .purse_tool .popper__arrow:after {
        border-bottom-color: #fff5c4 !important;
        border-top-color: #fff5c4 !important;
    }
</style>
