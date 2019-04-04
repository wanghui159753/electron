<template>
    <transition name="el-zoom-in-center">
        <bg v-if="ownList" @click.native="reSet">
            <div class="refundContent">
                <h4 class="header">
                    售后申请
                    <span class="el-icon-close" @click="$emit('input',false)"></span>
                </h4>
                <div class="content scrollbar">
                    <h5>全部商品</h5>
                    <div class="goodsListRefund">
                        <header class="one header">
                            <div>配件信息({{ownList.goodsList.length}})</div>
                            <div>单价</div>
                            <div>品质</div>
                            <div>货源</div>
                            <div>发货数量</div>
                            <div>预约发货</div>
                            <div>申请数量</div>
                            <div>选择</div>
                        </header>
                        <div class="body" v-for="(item,index) in ownList.goodsList" :key="item.id">
                            <div class="one">
                                <div><img src="@/../../static/image/2.png" alt="">{{item.name}}</div>
                                <div>{{(item.price/100||item.priceShow/100).toFixed(2)}}</div>
                                <div>{{item.classify}}</div>
                                <div>{{item.type=='CASH'?'现货':'预约'}}</div>
                                <div>{{item.num||item.refundNum}}</div>
                                <div>—</div>
                                <div><input type="text" @keyup="isMax(index)" v-model="item.returned"></div>
                                <div>
                                    <el-checkbox :label="index"
                                                 @click.native="item.returned >item.num-item.refundNum?$message.error('超出售后申请数量'):null"
                                                 :disabled="item.returned >item.num-item.refundNum"
                                                 v-model="selArr"></el-checkbox>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="refundReasons">
                        <div>
                            <h5>退款原因</h5>
                            <el-radio-group v-model="form.reason">
                                <el-radio :label="'质量问题'">质量问题</el-radio>
                                <el-radio :label="'少件/漏发'">少件/漏发</el-radio>
                                <el-radio :label="'收到货物与商品描述不符'">收到货物与商品描述不符</el-radio>
                                <el-radio :label="'大小/型号等不合适'">大小/型号等不合适</el-radio>
                                <el-radio :label="'其他'">其他</el-radio>
                            </el-radio-group>
                        </div>
                        <div>
                            <el-input type="textarea" v-model="form.explain" placeholder="请输入退款说明"></el-input>
                        </div>
                        <div class="paper" v-if="ownList.status!='WAIT_SHIP'">
                            <span>上传凭证</span>
                            <div class="upImg">
                                <label>
                                    <i class="el-icon-plus avatar-uploader-icon"></i>
                                    <input class="avatar-uploader" type="file" @change="upPic" title="请选择图片"
                                           accept="image/jpeg,image/jpg,image/png">
                                    <span>{{imgList.length}}/3</span>
                                </label>
                            </div>
                            <div class="imglist">
                                <div v-for="(x,index) in imgList" :key="x">
                                    <img src="@/../../static/image/del.png" width="18" class="del" alt=""
                                         @click="imgList.splice(index,1)">
                                    <img :src="x" alt="" width="80" @click="picLooker(index)">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer>
                    <div class="left">
                        退款金额: <span>￥{{total}}</span>
                    </div>
                    <el-button type="danger" @click="commit">{{afterSaleId?'修改':'提交'}}</el-button>
                </footer>
            </div>
        </bg>
    </transition>
</template>
<script>
    import bg from "./bg";
    import {lookPhoto} from '@/api/admission/admission';
    import {returned, resetRefund} from '@/api/myorder/index'

    const upPic = require("@/utils/upPic");
    export default {
        components: {bg},
        data() {
            return {
                selArr: [],
                imgList: [],
                form: {
                    explain: '',
                    reason: ''
                },
                afterSaleId: null,
                before: null,
                ownList: null
            }
        },
        props: ['list', 'returnedType', 'type', 'afterSale', 'reject'],
        computed: {
            total() {
                let num = 0;
                this.selArr.forEach(item => {
                    item = this.ownList.goodsList[item];
                    num += (item.returned | 0) * item.price;
                })
                return num / 100
            }
        },
        methods: {
            reSet(e) {
                if (e.target.className == 'opcityBg') {
                    this.$emit('input', false)
                }
            },
            afterRequest(str) {
                this.$message.success(str);
                this.$emit('reLoad')
                this.$emit('input', false);
            },
            commit() {
                if (!this.selArr.length || !this.form.reason) {
                    this.form.reason ? null : this.$message.error('售后原因不能为空')
                    this.selArr.length ? null : this.$message.error('售后配件不能为空')
                    return
                }
                if (this.afterSale && !this.reject) {
                    let req = this.getRequstObj();
                    if (this.Compared(req, this.before)) {
                        this.$message.error('当前没有修改内容')
                        return
                    }
                    this.$store.commit('setLoading', true)
                    resetRefund(Object.assign({orderRefundId: this.afterSaleId}, req))
                        .then(res => this.afterRequest('售后修改已提交'))
                } else
                    this.retrunedGoods();
            },
            Compared(val, val2) {
                for (let x in val) {
                    if (typeof (val[x]) == Object) {
                        return JSON.stringify(val[x]) == JSON.stringify(val2[x])
                    } else {
                        return val[x] == val2[x]
                    }
                }
            },
            getRequstObj() {
                return {
                    "explain": this.form.explain || null,
                    "goodsStatus": this.returnedType != '退货退款' ? 'REFUND' : 'RETURN_REFUND',
                    "imgList": this.imgList,
                    "reason": this.form.reason,
                    "requestGoodsList": this.selArr.map(item => {
                        item = this.ownList.goodsList[item];
                        return {
                            goodsId: item.id,
                            refundNum: item.returned
                        }
                    }),
                    "tradeNo": this.ownList.tradeNo
                }
            },
            retrunedGoods() {
                this.$store.commit('setLoading', true)
                returned(this.getRequstObj()).then(res => {
                    this.afterRequest('售后申请已提交')
                    if (this.list.status == 'WAIT_SHIP') {
                        this.$emit('sendMsg')
                    }
                    this.$store.commit('setLoading', false)
                })
            },
            isMax(i) {
                let item = this.ownList.goodsList[i]
                if (item.returned > item.num - item.refundNum) {
                    item.returned = item.num - item.refundNum;
                    this.ownList.goodsList.splice(i, 1, item)
                }
            },
            upPic(el) {
                if (this.imgList.length >= 3) {
                    this.$message.warning('最多上传三张图片')
                    return
                }
                upPic.up({files: el.target.files}, this, res => this.imgList.push(res), el.target.parentNode.parentNode)
            },
            picLooker(i) {
                lookPhoto(i, this.imgList)
            }
        },
        created() {
            let obj;
            if (this.afterSale) {
                obj = JSON.parse(JSON.stringify(this.list));
                obj.goodsList = obj.orderMain.goodsList;
                obj.status = obj.orderMain.status;
            } else
                obj = this.list;
            this.ownList = obj;
            if (this.afterSale && this.list.status == "REJECT") {
                let arr = [];
                this.afterSaleId = this.ownList.id;
                this.ownList.refundGoodsList.forEach(item => {
                    this.ownList.goodsList.forEach((val, index) => {
                        val.returned = item.refundNum
                        if (val.id == item.orderGoodsId) {
                            arr.push({
                                orderId: val.id,
                                refundNum: item.refundNum
                            })
                            this.selArr.push(index)
                        }
                    })
                })
                this.form.explain = this.ownList.explain;
                this.imgList = this.ownList.imageList || [];
                this.form.reason = this.ownList.reason;
                this.before = {
                    explain: this.ownList.explain || null,
                    "goodsStatus": this.ownList.goodsStatus,
                    "imgList": this.ownList.imageList || [],
                    "reason": this.ownList.reason || null,
                    "requestGoodsList": arr,
                    "tradeNo": this.ownList.tradeNo
                }
            } else {
                this.ownList.goodsList.forEach(item => {
                    this.$set(item, 'returned', 1)
                })
            }

        }
    }
</script>
<style lang="scss" scoped>
    .refundContent {
        height: 100%;
        width: 818px;
        margin: 0 auto;
    }

    .content {
        height: calc(100% - 114px);
        width: 818px;
        padding: 0 15px 20px 15px;
        margin: 0 auto;
        background: #fff;
    }

    footer {
        height: 56px;
        background: rgba(242, 242, 242, 1);
        box-shadow: 0px 0px 8px 0px rgba(129, 129, 129, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        span {
            color: #E60000;
        }
        .el-button {
            width: 120px;
            height: 36px;
            background-color: #E60000;
            border-color: #E60000;
            padding: 0;
            margin-left: 16px;
        }
        .el-button:hover {
            background-color: #f56c6c;
        }
    }

    .header {
        width: 818px;
        height: 58px;
        background: #F7F7F7;
        position: relative;
        font-size: 18px;
        font-weight: bold;
        line-height: 58px;
        text-align: center;
        border-bottom: 1px solid #E6E6E6;
        span {
            position: absolute;
            top: 20px;
            right: 20px;
        }
    }

    h5 {
        font-size: 18px;
        text-indent: 10px;
        border-left: 3px solid #FC684F;
        margin: 21px 0;
    }

    .refundReasons {
        .paper {
            display: flex;
            align-items: center;
            margin-top: 21px;
            span {
                font-size: 16px;
                font-weight: bold;
                margin-right: 20px;
            }
            label {
                span {
                    font-size: 12px;
                }
            }
        }
        .el-textarea {
            width: 760px;
            height: 100px;
        }
        .el-radio-group {
            color: #000;
            font-weight: bold;
            .el-radio__inner {
                width: 18px;
                height: 18px;
            }
        }
    }

    .imglist {
        margin-left: 20px;
        display: flex;
        .del {
            position: absolute;
            right: 0;
            top: 0;
        }
        div {
            position: relative;
            background: #eee;
            width: 80px;
            height: 80px;
            overflow: hidden;
            margin-right: 20px;
        }
    }

    .upImg {
        width: 80px;
        height: 80px;
        color: #CCCCCC;
        border: 1px solid #ccc;
        text-align: center;
        position: relative;
        border-radius: 4px;
        .el-icon-plus {
            font-size: 45px;
            display: block;
            margin-top: 15px;
        }
        label {
            width: 80px;
            height: 80px;
        }
        input {
            display: none;
        }
        span {
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            font-size: 12px;
            font-weight: 100 !important;
        }
    }

    .goodsListRefund {
        border: 1px solid #E6E6E6;
        border-bottom: 0;
        overflow: hidden;
        .one {
            width: 786px;
            display: flex;
            text-align: center;
            padding: 0;
            height: 40px;
            align-items: center;
            justify-content: space-between;
        }
        .body {
            .one {
                border: 1px solid #E6E6E6;
                border-left: 0;
                border-right: 0;
                margin-right: -1px;
                margin-top: -1px;
                input {
                    width: 46px;
                    height: 28px;
                    text-align: center;
                    border: 1px solid #ccc;
                    border-radius: 2px;
                    outline: 0;
                }
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
            font-size: 12px;
            color: #666666;
            height: 31px;
            background: #FFF8ED;
            font-weight: bold;
        }
    }
</style>
<style lang="scss">
    .goodsListRefund .one div:nth-child(1) {
        width: 185px;
    }

    .goodsListRefund .one div:nth-child(2) {
        width: 110px;
    }

    .goodsListRefund .one div:nth-child(3) {
        width: 90px;
    }

    .goodsListRefund .one div:nth-child(4) {
        width: 80px;
    }

    .goodsListRefund .one div:nth-child(5) {
        width: 80px;
    }

    .goodsListRefund .one div:nth-child(6) {
        width: 80px;
    }

    .goodsListRefund .one div:nth-child(7) {
        width: 90px;
    }

    .goodsListRefund .one div:nth-child(8) {
        width: 70px;
        border: 0 !important;
    }

    .refundReasons {
        .el-radio-group {
            margin-left: 10px;
            margin-bottom: 21px;
        }
        .el-radio + .el-radio {
            margin-left: 50px;
        }
        .el-radio__inner {
            width: 18px;
            height: 18px;
        }
        .el-textarea__inner {
            height: 100px;
            resize: none;
        }
    }

    .goodsListRefund {
        .el-checkbox__label {
            display: none;
        }
    }
</style>