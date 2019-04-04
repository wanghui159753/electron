<template>
    <div class="notice-con" @scroll="scroll">
        <div class="title">
            <div>
                <p @click="refresh('QUOTE_MSG')">报价通知 <el-badge is-dot v-if="brage['报价通知']"></el-badge></p>
                <p @click="refresh('SYS_MSG')">系统通知 <el-badge is-dot v-if="brage['系统通知']"></el-badge></p>
                <p @click="refresh('TRADE_INFO')">交易信息 <el-badge is-dot v-if="brage['交易信息']"></el-badge></p>
                <div class="cir"
                     :style="{right:classify=='QUOTE_MSG'?'416px':classify=='SYS_MSG'?'225px':'36px'}"></div>
            </div>
        </div>
        <span @click="allUnread">一键阅读</span>
        <div class="scrollBody scrollbar" @scroll="scroll" v-if="syslist.length">
            <div class="notice-body" v-for=" (item,index) in syslist" :key="index">
                <el-badge value="new" :class="item.time?'item':''" :hidden="!item.unread"></el-badge>
                <div
                        class="notice-news"
                        v-if="item.classify == 'SYS_NEWS'"
                        @click="clickItem(item,0,item.unread)"
                >
                    <p class="notice-news-time" v-if="item.time">{{item.time}}</p>
                    <div style="border:1px solid #e6e6e6;box-shadow: 0px 0px 8px #e6e6e6;border-radius: 5px;">
                        <div class="notice-news-img">
                            <img v-if="item.msgBody" :src="item.msgBody.banner">
                            <img v-else :src="item.content.banner">
                        </div>
                        <div class="notice-news-text">
                            <p class="news-title" v-if="item.msgBody">{{ item.msgBody.title }}</p>
                            <p class="news-title" v-else>{{ item.content.title }}</p>
                            <p class="news-content" v-if="item.msgBody">{{item.msgBody.content}}</p>
                            <p class="news-content" v-else>{{item.content.content}}</p>
                        </div>
                    </div>
                </div>
                <div class="notice-item" v-else-if="item.classify.includes('QU')">
                    <p v-if="item.time">{{item.time}}</p>
                    <div class="notice-content clearfix" @click="clickItem(item,0,item.unread)">
                        <img
                                :src="item.classify == 'QUOTE'? (item.msgBody.addOrUpdate ? require('../../../../static/image/quoted.png'): require('../../../../static/image/exit.png')  ): require('../../../../static/image/examine.png')"
                        >
                        <p>{{ item.msgBody.title }}</p>
                        <div class="notice-img">
                            <img :src="item.msgBody.logo">
                        </div>
                        <div class="notice-text">
                            <!-- <p>{{item.quote}} {{item.classify=='QUOTE'?"为您报价了":"发布了询价"}}</p>
                            <p @click="$router.push('')">
                              <span v-for="(v,i) in item.partList" :key="i" v-if="item.quotetype !=='FAST'">{{v}}</span>
                            </p>
                            <p>
                              <a @click="$router.push('')" style="color:#FC684F">去查看>></a>
                            </p>-->
                            <p>{{item.msgBody.content}}</p>
                        </div>
                    </div>
                </div>
                <div class="notice-item" v-else-if="item.classify.indexOf('AUTH')!==-1">
                    <p v-if="item.time">{{item.time}}</p>
                    <div class="notice-content">
                        <p>{{ item.msgBody.title }}</p>
                        <div class="notice-img">
                            <img
                                    :src="(item.classify.indexOf('AUTH_SUCCESS')!==-1) ? require('../../../../static/image/pass.png') : require('../../../../static/image/unpass.png')"
                            >
                        </div>
                        <div class="notice-text">
                            <p @click="clickItem(item,1,item.unread)">{{item.msgBody.content}}</p>
                            <p>
                                <a
                                        @click="clickItem(item,2,item.unread)"
                                        style="color:#FC684F"
                                >{{(item.classify.indexOf('AUTH_SUCCESS')!==-1)?'去报价':'修改入驻'}} >></a>
                            </p>
                        </div>
                    </div>
                </div>
                <div v-else-if="item.classify.includes('ORDER')">
                    <p class="notice-news-time" v-if="item.createTime">{{item.createTime|parseTime}}</p>
                    <div class="order" @click="showOrder(item)">
                        <header>{{item.msgBody.title}}</header>
                        <div>
                            <div class="left"><img :src="getImg(item.msgBody.msgType,item.msgBody.logo)" width="77"
                                                   alt=""></div>
                            <div class="right">
                                <div class="content"><span v-if="item.msgBody.brand">（{{item.msgBody.brand}})</span>{{item.msgBody.goodsInfo}}
                                </div>
                                <div class="price">
                                    <p>{{item.msgBody.name}}（{{item.msgBody.address}}）</p>
                                    <p>总价：<span>¥{{(item.msgBody.amount/100).toFixed(2)}}</span></p>
                                </div>
                                <footer><p>单 号：{{item.msgBody.tradeNo||item.msgBody.refundId}}</p>
                                    <p style="color: #F9CD8B">
                                        {{item.msgBody.msgType=='BUYER_REFUND_REJECT'?'申请客服介入...':'更多...'}}</p></footer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="nothing" v-else>
            <img src="@/../../static/image/vinDefault.png" alt="">
        </div>
        <order-refund v-if="refund.show" @showDetail="refund.show=false" :detailInfoId='refund.id'
                      :autoSellor="refund.autoseller"></order-refund>
        <order-normal v-if="normal.show" @showDetail="normal.show=false" :detailInfoId='normal.tradeNo'
                      :autoSellor="normal.autoseller"></order-normal>
    </div>
</template>

<script>
    import orderNormal from './../myOrder/orderDetailNormal';
    import orderRefund from './../myOrder/orderDetail';
    import {loadSysPage, setSysUnread, setSysAllUnread} from "@/api/im/user.js";
    import {getMyEnquiryDetail, getMyDetail} from "@/api/quote/quote.js";
    import {parseTime} from "@/utils/index";

    export default {
        name: "notice",
        components: {orderRefund, orderNormal},
        data() {
            return {
                refund: {
                    show: false,
                    id: null,
                    autoseller: null
                },
                normal: {
                    show: false,
                    tradeNo: null,
                    autoseller: null
                },
                syslist: [],
                num: 1,
                classify: 'QUOTE_MSG',
                total: 0,
                brage:{},
                img: {
                    BUYER_REFUND_OK: require('../../../../static/image/refund.png'),
                    BUYER_REFUND_REJECT: require('../../../../static/image/reject.png'),
                    SELLER_SERVICE_INVO: require('../../../../static/image/custom.png'),
                }
            };
        },
        methods: {
            refresh(val){
                this.classify=val;
            },
            showOrder(item) {
                if (item.msgBody.tradeNo) {
                    this.normal = {
                        show: true,
                        tradeNo: item.msgBody.tradeNo
                    }
                } else {
                    this.refund = {
                        show: true,
                        id: item.msgBody.refundId
                    }
                }
                this.makeRead(item)
            },
            getImg(type, logo) {
                if (type == 'BUYER_REFUND_OK' || type == 'BUYER_REFUND_REJECT' || type == 'SELLER_SERVICE_INVO') {
                    return this.img[type]
                } else
                    return logo
            },
            allUnread() {
                setSysAllUnread().then(res => {
                    this.$store.state.im.customSysMsgUnread = 0;
                    this.$store.state.im.customSysMsgs = [];
                    this.$store.dispatch("resetSysMsgs", {type: 1});
                    let arr = [...this.syslist];
                    arr.forEach(v => {
                        this.$set(v, 'unread', false);
                    });
                    this.syslist = arr;
                });
            },
            clickItem(item, num, boo) {
                if (item.classify == "QUOTE") {
                    this.$message.error("请在手机APP查看");
                } else if (item.classify == "ENQUIRY") {
                    this.$router.push({
                        path: "/quote/details",
                        query: {
                            id: item.msgBody.enquiryId
                        }
                    });
                } else if (item.classify.indexOf("SELLER_AUTH") !== -1) {
                    if (num == 1) {
                        this.$router.push("/quote/index");
                    } else {
                        this.$router.push("/admission/index");
                    }
                } else if (item.classify == "SYS_NEWS") {
                    let id = item.msgBody.newsId;
                    this.$router.push("/news/" + id);
                }
                if (boo) {
                    this.makeRead(item)
                }
            },
            makeRead(item) {
                setSysUnread({id: item.id}).then(res => {
                    item.unread = false;
                    --this.$store.state.im.customSysMsgUnread
                });
            },
            scroll() {
                if (this.total.current * 10 > this.total.total) return;
                let scrolltop = document.querySelector(".scrollBody");
                if (scrolltop.clientHeight + scrolltop.scrollTop == scrolltop.scrollHeight) {
                    this.getSysList(++this.num);
                }
            },
            getSysList(size) {
                this.$store.commit('setLoading', true);
                loadSysPage({pageNo: size, pageSize: 10, classifySimplofication: this.classify})
                    .then(req => {
                        this.brage=req.data.havaUnRead;
                        this.total = req.data.page;
                        if (req.data.page.records.length) {
                            req.data.page.records.forEach(v => {
                                v.msgBody = JSON.parse(v.msgBody);
                                v.time = parseTime(v.createTime);
                                v.unread = !v.read;
                            });
                        }
                        this.syslist = [...this.syslist, ...req.data.page.records];
                        this.$store.commit('setLoading', false);
                    })
            }
        },
        watch: {
            classify() {
                this.getSysList();
                this.syslist = [];
                this.num = 1;
            },
            customSysMsgs(newval, oldval) {
                let newVal = JSON.stringify(Object.assign({}, newval));
                let oldVal = JSON.stringify(Object.assign({}, oldval));
                if (newVal != oldVal) {
                    if (newval[newval.length - 1] && newval[newval.length - 1].content && typeof newval[newval.length - 1].content == "string") {
                        newval[newval.length - 1].content = JSON.parse(newval[newval.length - 1].content);
                    }
                    if (newval[newval.length - 1]) {
                        let obj = {
                            msgBody: newval[newval.length - 1].content,
                            time: parseTime(newval[newval.length - 1].time),
                            createTime: parseTime(newval[newval.length - 1].createTime),
                            read: false,
                            unread: true,
                            classify: newval[newval.length - 1].content.classify,
                            id: newval[newval.length - 1].content.enquiryId
                        };
                        let obj1={
                            TRADE_INFO:'ORDER',
                            SYS_MSG:'SYS',
                            QUOTE_MSG:'QU'
                        }
                        console.log(newval[newval.length - 1].content.classify.includes(obj1[this.classify]))
                        newval[newval.length - 1].content.classify.includes(obj1[this.classify]) && this.syslist.unshift(obj);
                    }
                }
            }
        },
        computed: {
            customSysMsgs() {
                return this.$store.state.im.customSysMsgs;
            }
        },
        mounted() {
            this.getSysList();
            if (document.querySelector(".scrollbar")) {
                document.querySelector(
                    ".scrollbar"
                ).scrollTop = this.$route.meta.scollTopPosition;
            }
        }
    };
</script>
<style lang="scss" scoped>
    .nothing {
        height: calc(100% - 58px);
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .order {
        width: 460px;
        height: 192px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 8px 0px rgba(204, 204, 204, 0.7);
        border-radius: 6px;
        header {
            font-size: 20px;
            color: #000;
        }
        > div {
            padding: 0px 20px;
            display: flex;
            .left {
                margin-right: 33px;
            }
            .right {
                width: 289px;
                font-size: 14px;
                .content {
                    font-size: 20px;
                    color: #333;
                }
                .price {
                    line-height: 20px;
                    margin: 20px 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    span {
                        font-size: 20px;
                        color: #F81E1E;
                    }
                }
                footer {
                    color: #808080;
                    display: flex;
                    justify-content: space-between;
                }
            }
        }
    }

    .notice-con {
        width: 100%;
        overflow: auto;
        position: relative;
        height: calc(100vh - 30px);
        > span {
            position: absolute;
            right: 20px;
            top: 19px;
            cursor: pointer;
            display: inline-block;
            font-size: 12px;
            line-height: 12px;
            border: 1px solid #ccc;
            background: #fff;
            padding: 4px 8px;
            border-radius: 4px;
        }
        > span:hover {
            color: #FC684F;
        }
        .scrollBody {
            height: calc(100% - 58px);
            padding-bottom: 50px;
        }
        .title {
            background: #eee;
            width: 100%;
            height: 58px;
            text-align: center;
            line-height: 58px;
            font-size: 18px;
            font-weight: bold;
            > div {
                position: relative;
                width: 460px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                p {
                    position: relative;
                    cursor: pointer;
                }
                >div {
                    position: absolute;
                    bottom: 0;
                    border-style: solid;
                    border-width: 10px;
                    border-color: transparent transparent #fff transparent;
                    transition: all .3s;
                }
            }
        }
        .notice-body {
            width: 460px;
            margin: 0px auto;
            box-sizing: content-box;
            .notice-item {
                > p {
                    height: 50px;
                    line-height: 50px;
                    width: 100%;
                    text-align: center;
                    font-size: 14px;
                    color: #aaa;
                }
            }
        }
    }

    .notice-content {
        background-color: white;
        height: 175px;
        width: 100%;
        border-radius: 5px;
        position: relative;
        border: 1px solid #e6e6e6;
        box-shadow: 0px 0px 8px #e6e6e6;
        > img {
            position: absolute;
            right: 0;
            top: -8px;
            cursor: pointer;
        }
        > p {
            font-weight: bold;
            height: 50px;
            line-height: 50px;
            font-size: 14px;
            padding-left: 20px;
        }
        .notice-img {
            width: 29%;
            height: 125px;
            float: left;
            img {
                width: 81px;
                margin: 14%;
                border: 1px solid #ebeef5;
            }
        }
        .notice-text {
            float: left;
            width: 66%;
            height: 75px;
            line-height: 25px;
            padding: 20px 0;
            p {
                font-size: 16px;
                color: #888;
                padding: 4px 0;
                cursor: pointer;
                > span {
                    margin-right: 6px;
                }
            }
        }
    }

    .notice-news-time {
        height: 50px;
        line-height: 50px;
        width: 100%;
        text-align: center;
        font-size: 14px;
        color: #aaa;
    }

    .notice-news {
        cursor: pointer;
        width: 100%;
        border-radius: 5px;
        .notice-news-img {
            border-radius: 5px;
            width: 100%;
            height: 177px;
            overflow: hidden;
            background: white;
            border-bottom: 1px solid #eee;
            img {
                width: 100%;
            }
        }
        .notice-news-text {
            padding: 10px;
            height: auto;
            .news-title {
                height: 25px;
                line-height: 25px;
                font-weight: bold;
                font-size: 14px;
            }
            .news-content {
                width: 405px;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                font-size: 13px;
                line-height: 20px;
                color: #555;
            }
        }
    }
</style>
<style>
    .notice-body .el-badge__content {
        position: absolute;
        left: 435px;
        z-index: 2;
    }
    .notice-con .title .el-badge{
        margin-top: -15px;
    }
    .item .el-badge__content {
        top: 45px;
    }
</style>

