<template>
    <div class="logistics">
        <!--<div class="company" v-if="isShow&&shipAddress&&!del.afterSale" @click="$emit('close')">-->
        <!--<b><img src="@/../../static/image/huoche.png" width="30" height="20" alt=""> <span-->
        <!--v-if="!shipAddress.logistics" style="color:#ccc">请选择物流</span> <span v-else>{{ shipAddress.logistics }}  {{ shipAddress.logisticsNo}}</span></b>-->
        <!--<span class="el-icon-arrow-right"></span>-->
        <!--</div>-->
        <!--<div class="company copy" v-if="isShow&&shipAddress&&del.afterSale" @click="$emit('close')">-->
        <!--<b><span>退货物流信息</span></b>-->
        <!--<span><span :style="{color:shipAddress.logistics?'#333':'#ccc'}">{{ shipAddress.logistics?shipAddress.logistics:'请填写' }}</span> <span class="el-icon-arrow-right"></span></span>-->
        <!--</div>-->
        <detail v-if='shipAddress' :ship-address="shipAddress" @click.native="choose"></detail>
        <detail v-else-if='shipAddress&&del.afterSale&&!this.type' :ship-address="shipAddress"
                @click.native="choose"></detail>
        <detail v-else-if='shipAddress&&!del.afterSale' :ship-address="shipAddress" @click.native="choose"></detail>
        <div class="buyerInfo no_have_address" v-if="chooseAddressShow" @click.native="choose">
            <img src="@/../../static/image/position.png" height="22" alt="">
            <span style="font-weight: bold">添加收货地址</span>
            <span class="el-icon-arrow-right"></span>
        </div>
    </div>
</template>
<script>
    import detail from './logisticsdel'

    export default {
        components: {
            detail
        },
        props: {
            address: {
                type: Object
            },
            type: {
                type: Boolean
            },
            del: {
                type: Object
            },
            afterSale: {
                type: Boolean
            }
        },
        methods: {
            choose() {
                if (this.del.status == 'WAIT_PAY' || this.getBoolean()) {
                    this.$emit('choosAddress')
                }
            },
            getBoolean() {
                if (this.afterSale && this.del.goodsStatus == 'RETURN_REFUND') {
                    return this.status == 'WAIT_AGREES';
                }
            }
        },
        computed: {
            shipAddress() {
                // if (this.del.orderRefund&&this.del.status=='FINISH') {
                //     return this.del.orderRefund.refundShipAddress;
                // } else {
                //     return this.del.shipAddress||this.address;
                // }
                return this.del.shipAddress || this.del.refundShipAddress || this.address;
            },
            chooseAddressShow() {
                if (this.type) {
                    return this.del.status == 'PENDING' && this.afterSale && !this.address && this.del.goodsStatus != 'REFUND'
                } else {
                    return this.del.status == 'WAIT_PAY' && !this.address
                }
            },
            isShow() {
                if (this.type && this.del.status != 'WAIT_PAY' && !this.del.afterSale && !this.del.orderRefund) {
                    return true;
                } else if (this.type && this.del.status != 'WAIT_PAY' && !this.del.afterSale && this.del.orderRefund) {
                    if (this.del.orderRefund.status == 'REJECT') {
                        return true
                    }
                } else if (!this.type && !this.del.afterSale && !this.del.orderRefund) {
                    return true;
                } else if (!this.type && this.del.afterSale) {
                    return this.del.orderRefund.refundShipAddress;
                } else {
                    return false;
                }
            }
        }
    };
</script>
<style lang='scss' scoped>
    .logistics {
        color: #333;
        border-bottom: 10px solid #f1f1f1;
        .rejectInfo {
            color: #f00;
            padding: 0 27px;
            font-weight: bold;
            p {
                padding: 22px 0;
                line-height: 1.5em;
            }
        }
        /*.company {*/
        /*padding: 0 20px;*/
        /*height: 60px;*/
        /*display: flex;*/
        /*justify-content: space-between;*/
        /*align-items: center;*/
        /*border-bottom: 1px solid #E6E6E6;*/
        /*span {*/
        /*cursor: pointer;*/
        /*}*/
        /*img {*/
        /*vertical-align: middle;*/
        /*}*/
        /*}*/
        /*.copy{*/
        /*color: #333;*/
        /*}*/
        .buyerInfo {
            padding: 0 20px;
            line-height: 47px;
            .address {
                line-height: 20px;
                padding-bottom: 10px;
                img {
                    margin-right: 10px;
                }
            }
            img {
                vertical-align: middle;
            }
            h5 {
                font-size: 16px;
                text-indent: 2em;
            }
            p {
                font-size: 14px;
            }
        }
        .no_have_address {
            position: relative;
            .el-icon-arrow-right {
                position: absolute;
                right: 10px;
                font-size: 20px;
                line-height: 47px;
            }
            img {
                vertical-align: sub;
            }
        }
    }
</style>
