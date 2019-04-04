<template>
    <bg @click.native="close">
        <div class="components">
            <header>立即付款 <span class="el-icon-close" @click="$emit('input')"></span></header>
            <div class="userInfo">
                <div class="img">
                    <img :src="commitObj.logo" width="90" alt="">
                </div>
                <div class="name">{{$store.state.im.currSessionInfo.alias||$store.state.im.currSessionInfo.nick}}</div>
            </div>
            <div class="payNum">
                <span>付款金额</span>
                <input type="number" maxlength="9" @input="getNumber" @keyup="reg" v-model="commitObj.priceShow"
                       placeholder="请输入金额">
            </div>
            <div class="remark">
                <p>备注：</p>
                <el-input type="textarea" v-model="commitObj.buyerRemark" maxlength="100"
                          placeholder="添加备注（100字符以内）"></el-input>
            </div>
            <div class="commit">
                <el-button type="primary" @click="commit">付款到平台</el-button>
                <p>提示：平台担保交易，系统将生成采购订单，在您确认收货后，平台才会把 款项付给卖家。</p>
            </div>
        </div>
    </bg>
</template>
<script>
    import bg from '@/views/myOrder/model/bg';
    import {getUserIdOrAccid, FloatMul} from '@/utils/index';
    import {direct} from '@/api/myorder/index';

    export default {
        components: {bg},
        data() {
            return {
                commitObj: {
                    sellerUserId: null,
                    buyerRemark: '',
                    price: '',
                    priceShow: '',
                    logo: ''
                }
            }
        },
        methods: {
            reg() {
                let reg = /^[0-9]+([.]{0,1}[0-9]{0,2})$/;
                if (!reg.test(this.commitObj.priceShow)) {
                    let newValue = this.commitObj.priceShow.slice(0, -1);
                    this.commitObj.priceShow = reg.test(newValue) || newValue == '' ? newValue : 1;
                }
            },
            getNumber(val) {
                if (this.commitObj.priceShow > 100000) {
                    this.commitObj.priceShow = 100000;
                }
                this.commitObj.price = FloatMul(this.commitObj.priceShow, 100)
            },
            close(e) {
                e.target.className == 'opcityBg' && this.$emit('input', false);
            },
            commit() {
                if (this.commitObj.priceShow < 1) {
                    this.$message.error('支付金额最小为1元')
                    return
                }
                direct(this.commitObj).then(res => {
                    this.$emit('detailInfo', res.data);
                })
            },
            getUserId() {
                this.commitObj.sellerUserId = getUserIdOrAccid(this.$store.state.im.currSessionId.substring(4))
            }
        },
        created() {
            this.getUserId();
            this.commitObj.logo = this.$store.state.im.currSessionInfo.avatar;
        }
    }
</script>
<style lang="scss" scoped>
    .components {
        font-size: 18px;
        font-weight: bold;
        width: 520px;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        background: #F7F7F7;
        header {
            height: 60px;
            display: block;
            text-align: center;
            background: #E5E5E5;
            color: #000;
            span {
                position: absolute;
                cursor: pointer;
                right: 20px;
                top: 22px;
                font-size: 18px;
            }
        }
        .userInfo {
            height: 194px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img {
                border-radius: 10px;
            }
            .name {
                margin-top: 15px;
            }
        }
        .payNum {
            height: 100px;
            background: #fff;
            display: flex;
            align-items: center;
            span {
                margin: 0 43px 0 19px;
            }
            input {
                height: 100%;
                width: 60%;
                border: 0;
                outline: 0;
            }
        }
        .remark {
            margin-top: 10px;
            margin-bottom: 59px;
            text-align: center;
            p {
                font-size: 16px;
                text-indent: 20px;
                line-height: 37px;
                text-align: left;
            }
            .el-textarea {
                width: 480px;
                height: 80px;
            }
        }
        .commit {
            padding: 0 27px;
            text-align: center;
            .el-button {
                width: 260px;
                height: 44px;
            }
            p {
                margin-top: 19px;
                font-size: 14px;
                color: #FC684F;
            }
        }
    }
</style>
<style lang="scss">
    .components {
        > .remark {
            .el-textarea__inner {
                height: 100%;
                resize: none;
            }
        }
    }
</style>