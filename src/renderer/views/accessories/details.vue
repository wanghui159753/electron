<template>
    <div class="ManagementDetail">
        <header>
            <div class="left" @click="back">
                <span class="el-icon-arrow-left">返回</span>
            </div>
            <p>店铺详情</p>
            <div class="right"></div>
        </header>
        <div class="content scrollbar" v-if="info">
            <div class="ltd">
                <div class="top">
                    <div class="qrcode">
                        <div class="ie"></div>
                        <div id="qrcode2"></div>
                        <p>店铺二维码</p>
                    </div>
                    <div class="banner" @click="lookPhoto(0,info.bannerList.length?info.bannerList:null)">
                        <el-carousel indicator-position="outside" height="430px">
                            <el-carousel-item
                                    v-for="item in info.bannerList.length?info.bannerList:[{image:defaults}]"
                                    :key="item.image"
                            >
                                <img :src="item.image" alt="图片加载失败">
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                    <div class="right">
                        <h4>
                            {{info.name}}
                            <span v-if="info.excellent">vip</span>
                        </h4>
                        <div class="sort">
                            <el-rate v-model="score" disabled></el-rate>
                            <span class="some">{{score}}分</span>
                            <p>
                                <span style="border:0">浏览{{info.browse}}次</span>
                                <span>成交{{info.call}}次</span>
                            </p>
                            <div class="ebg">
                                <el-tooltip placement="top" v-for="x in info.authList" :key="x">
                                    <span slot="content">{{x}}</span>
                                    <img src="./../../../../static/image/cash.png" alt v-if="x=='营业执照认证'">
                                    <img src="./../../../../static/image/id.png" alt v-else-if="x=='身份证认证'">
                                    <img src="./../../../../static/image/cash2.png" alt v-else-if="x=='已实地认证'">
                                    <img
                                            src="./../../../../static/image/cash3.png"
                                            alt
                                            v-else-if="x.indexOf('保证金')>-1"
                                    >
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="Management">
                            <span>主营</span>
                            <p>{{info.manageScope}}</p>
                        </div>
                        <div class="connect">
                            <p>
                                <img src="@/../../static/image/model.png" width="16" alt>
                                <span>{{info.mobile}}</span>
                            </p>
                            <p>
                                <img src="@/../../static/image/phone.png" width="16" alt>
                                <span>{{info.phone||'暂无'}}</span>
                            </p>
                        </div>
                        <div
                                class="address"
                        >地址：{{`${info.address.provinceName} ${info.address.cityName} ${info.address.regionName}
                            ${info.address.address}`}}
                        </div>
                    </div>
                </div>
                <div class="introduction">
                    <span>商户介绍:</span>
                    <p>{{info.sellerIntroduce||'店家很懒，什么都没有'}}</p>
                </div>
                <div class="active">
                    <span>优惠活动：</span>
                    <p>{{info.activitie||'暂无活动'}}</p>
                </div>
                <div class="jubao">
                    <el-tooltip content="举报">
                        <img src="@/../../static/image/jubao.png" width="20" height="20" alt>
                    </el-tooltip>
                    <el-tooltip :content="info.collect?'取消收藏':'收藏'">
                        <img src="@/../../static/image/starGray.png" alt v-if="!info.collect" width="20" height="20"
                             @click="collect">
                        <img src="@/../../static/image/star.png" width="20" height="20" alt v-else @click="collect">
                    </el-tooltip>
                    <el-tooltip content="分享我的店铺">
                        <img src="@/../../static/image/share.png" height="20" alt="" @click="share">
                    </el-tooltip>
                    <p @click="$router.push('/message/index/p2p-'+info.accId)">
                        <img src="@/../../static/image/newMsg.png" width="24" height="22" alt> 发消息
                    </p>
                </div>
            </div>
            <div class="Authentication">
                <h5>认证信息</h5>
                <ul class="list">
                    <li v-for="item in info.autoSellerAuthList" :key="item.type">
                        <div class="img" @click="lookPhoto(0,item.type!='IDENTITY'?item.imageList:null)">
                            <img :src="item.imageList[0]" alt v-if="item.type!='IDENTITY'">
                            <img src="@/../../static/image/sfz@2x.png" alt v-else>
                        </div>
                        <p>{{authValue(item.type)}}</p>
                        <div class="el-icon-circle-check">已认证</div>
                    </li>
                </ul>
            </div>
            <div class="diaBox">
                <el-dialog v-if="shareShow" :visible.sync="shareShow" :modal-append-to-body="false">
                    <dialogs v-model="shareShow" :addType="'share'" :custom="custom"></dialogs>
                </el-dialog>
            </div>
            <!-- <common :id="info.autoSellerId"></common> -->
        </div>
    </div>
</template>
<script>
    require("@/../../static/js/qrcode/qrcode.min.js");
    import QRCode from "qrcodejs2";
    import common from "./compon/comment";
    import {lookPhoto} from "@/api/admission/admission.js";
    import {detail, collect, qrcode} from "@/api/accessories/index.js";
    import dialogs from "../message/template/chattingGroupAdd";

    const auth = [
        {key: "IDENTITY", value: "身份/营业执照", style: "primary"},
        {key: "FIELD", value: "实地认证", style: "success"},
        {key: "AGENCY", value: "代理认证", style: "warning"},
        {key: "BRAND", value: "商标认证", style: "danger"}
    ];
    const authValue = auth.reduce((acc, cur) => {
        acc[cur.key] = cur.value;
        return acc;
    }, {});
    export default {
        components: {common, dialogs},
        data() {
            return {
                score: 5,
                shareShow: false,
                info: null,
                defaults: require("../../../../static/image/defaultBanner.png"),
                custom: null
            };
        },
        methods: {
            share() {
                this.shareShow = true;
            },
            creatQrcode(url) {
                var qrcode = new QRCode("qrcode2", {
                    text: url,
                    width: 106,
                    height: 106,
                    colorDark: "#F63A24",
                    title: '',
                    alt: "",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
                qrcode2.setAttribute('title', '')
            },
            //查询二维码
            initQrcode() {
                qrcode({autoSellerId: this.info.autoSellerId}).then(res => {
                    this.creatQrcode(res.data.url);
                });
            },
            back() {
                history.go(-1);
            },
            authValue(level) {
                return authValue[level];
            },
            lookPhoto(i, arr) {
                if (!arr) return;
                lookPhoto(i, arr);
            },
            detail() {
                this.$store.commit('setLoading', true)
                detail({
                    autoSellerId: this.$route.params.id
                }).then(res => {
                    this.$store.commit('setLoading', false)
                    this.info = res.data;
                    this.custom = {
                        sellerId: res.data.autoSellerId,
                        name: res.data.name,
                        authList: res.data.authList,
                        businessScope: res.data.manageScope,
                        address: res.data.address.provinceName + res.data.address.cityName + res.data.address.regionName + res.data.address.address,
                        avatar: res.data.logo
                    }
                    this.score = this.info.score / 20;
                    this.initQrcode();
                });
            },
            collect() {
                collect({id: this.info.autoSellerId}).then(res => {
                    this.info.collect
                        ? this.$message.success("已取消收藏")
                        : this.$message.success("收藏成功");
                    this.info.collect = !this.info.collect;
                });
            }
        },
        mounted() {
            this.detail();
        }
    };
</script>
<style lang="scss" scoped>
    .collect {
        background: #f63a24;
    }

    .ManagementDetail {
        font-size: 14px;
        height: 100%;
        background: #f3f3f3;
        header {
            cursor: pointer;
            height: 58px;
            background: #fff;
            font-size: 18px;
            color: #000;
            font-weight: 600;
        }
        .content {
            width: 980px;
            margin: 0 auto;
            margin-top: 10px;
            background: #fff;
            height: calc(100% - 68px);
            overflow-x: hidden;
            .top {
                display: flex;
            }
            .ltd {
                position: relative;
                padding: 21px;
                .qrcode:hover {
                    width: 106px;
                    height: 152px;
                    .ie {
                        background: none;
                    }
                }
                .qrcode {
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    overflow: hidden;
                    right: 0;
                    top: 0;
                    margin: 10px;
                    .ie {
                        width: 60px;
                        height: 60px;
                        position: absolute;
                        left: 0;
                        top: 0;
                        background: linear-gradient(-135deg, transparent 50%, #fff 0) top right;
                        background-size: 100%;
                        background-repeat: no-repeat;
                    }
                    p {
                        color: #f63a24;
                        text-align: center;
                        line-height: 20px;
                    }
                }
                .banner {
                    img {
                        width: 420px;
                    }
                    width: 420px;
                    height: 168px;
                    margin: 0 20px 20px 0;
                }
                .right {
                    h4 {
                        font-size: 22px;
                        padding: 9px 0 20px 0;
                        span {
                            display: inline-block;
                            width: 44px;
                            height: 20px;
                            background: #fc0d1b;
                            color: #fef1a0;
                            text-align: center;
                            font-size: 16px;
                            border-radius: 4px;
                            vertical-align: middle;
                        }
                    }
                    .sort {
                        display: flex;
                        align-items: center;
                        font-size: 12px;
                        color: #999;
                        p {
                            span {
                                padding: 0 14px;
                                border-left: 1px solid #ccc;
                            }
                        }
                        .some {
                            font-size: 18px;
                            color: #fab12a;
                        }
                        .ebg {
                            img {
                                width: 17px;
                                height: 20px;
                                margin: 0 6px;
                            }
                        }
                    }
                    .Management {
                        font-size: 14px;
                        display: flex;
                        margin: 15px 0;
                        span {
                            text-align: center;
                            line-height: 18px;
                            display: inline-block;
                            width: 34px;
                            height: 18px;
                            color: #fff;
                            background: #56b9ff;
                            font-size: 12px;
                            border-radius: 2px;
                            margin-right: 10px;
                        }
                    }
                    .connect {
                        display: flex;
                        p {
                            margin-right: 31px;
                            img {
                                vertical-align: middle;
                                margin-right: 7px;
                            }
                        }
                    }
                    .address {
                        margin-top: 15px;
                    }
                }
                .jubao {
                    cursor: pointer;
                    display: flex;
                    margin-right: 11px;
                    flex-direction: row-reverse;
                    font-size: 16px;
                    color: #f63a23;
                    img {
                        margin-right: 20px;
                        vertical-align: middle;
                    }
                    p {
                        line-height: 22px;
                        margin-right: 38px;
                        img {
                            margin-right: 6px;
                            vertical-align: sub;
                        }
                    }
                }
                .introduction {
                    display: flex;
                    align-items: baseline;
                    color: #666;
                    span {
                        margin-right: 10px;
                    }
                    p {
                        width: 70%;
                        line-height: 20px;
                    }
                }
                .active {
                    margin-top: 14px;
                    display: flex;
                    align-items: baseline;
                    color: #666;
                    p {
                        height: 24px;
                        background: #fee9e2;
                        color: #fc684f;
                        padding: 0 10px;
                        line-height: 24px;
                        border-radius: 2px;
                    }
                }
            }
            .Authentication {
                border-top: 10px solid #f3f3f3;
                border-bottom: 10px solid #f3f3f3;
                height: 240px;
                padding-bottom: 21px;
                h5 {
                    padding: 21px;
                }
                ul {
                    margin-left: 40px;
                    display: flex;
                    li {
                        font-size: 14px;
                        margin: 0 20px;
                        text-align: center;
                        list-style: none;
                        margin-right: 40px;
                        p {
                            margin: 10px 0;
                        }
                        .el-icon-circle-check {
                            font-size: 12px;
                        }
                        .el-icon-circle-check:before {
                            font-size: 16px;
                            vertical-align: middle;
                            margin-right: 5px;
                        }
                    }
                }
                .img {
                    width: 110px;
                    height: 81px;
                    overflow: hidden;
                    border-radius: 10px;
                    img {
                        width: 100%;
                        height: auto;
                    }
                }
                .el-icon-circle-check {
                    color: #f63a24;
                }
            }
        }
    }

    h5 {
        font-size: 16px;
    }
</style>
<style lang='scss'>
    .ManagementDetail {
        .el-carousel__container {
            width: 420px !important;
            height: 168px !important;
        }
        .el-rate__item {
            vertical-align: -webkit-baseline-middle;
        }
        .el-rate__icon {
            font-size: 15px;
        }
        .diaBox {

            .el-dialog__body {
                padding: 0;
            }
            .el-checkbox__label {
                display: none;
            }
        }
    }
</style>
