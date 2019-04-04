<template>
    <div class="cirDetail" v-if="idDetail">
        <hd class="head"></hd>
        <div class="scrollArea scrollbar">
            <div class="buying">
                <h3>车辆信息</h3>
                <div class="carInfo">
                    <div class="vin" v-if="idDetail.type=='PRECISE'">
                        <span class="titWord">车架号</span>
                        <div>
                            <p @click="idDetail.vin?frameShow=true:$message.error('车架号缺失')">
                                {{idDetail.vin||'车架号暂无'}}</p>
                            <p class="copy" @click="copy(idDetail.vin)">
                                <img src="@/../../static/image/copy.png" alt>复制
                            </p>
                        </div>
                    </div>
                    <div class="brand">
                        <span class="titWord">品牌</span>
                        <div>
                            <img :src="idDetail.logo" width="28" alt>
                            <span>{{idDetail.vehicleBrand}}<span v-if="idDetail.type=='PRECISE'">({{idDetail.vehicleSerie}})</span></span>
                        </div>
                    </div>
                    <div class="finish" v-if="idDetail.accid==$store.state.im.myInfo.account">
                        <div @click="finish(idDetail.status)" :class="{noDrop:idDetail.status}"><span
                                class="el-icon-check" v-if="idDetail.status"></span> <span v-else
                                                                                           class="el-icon-circle-close-outline"></span>采购完成
                        </div>
                    </div>
                </div>
                <div class="picList">
                    <h3>买家留言 <span>发布时间：{{idDetail.createTime|parseTime}}</span></h3>
                    <p>
                        <span>{{idDetail.remark?idDetail.remark:"暂无"}}</span>
                    </p>
                    <div class="quoteAudio" v-if="idDetail.audio" @click="play">
                        <audio :src="idDetail.audio" ref="quoteAudio" id="QuoteAudio" preload @ended="stop"></audio>
                        <img src="@/../../static/image/audio.png" alt v-show="!show">
                        <img src="@/../../static/image/audio.gif" alt v-show="show">
                        <span class="audioTime">{{audioTime}}s</span>
                        <span class="played">点击播放</span>
                    </div>
                    <div
                            @click="look(index,idDetail.imageList)"
                            class="img"
                            v-for="(x,index) in idDetail.imageList"
                            :key="index"
                            v-if="idDetail.imageList.length"
                    >
                        <img :src="x" alt>
                    </div>
                    <div class="img" v-if="!idDetail.imageList.length">
                        <img src="@/../../static/image/noPic.png" alt>
                    </div>
                </div>
                <div class="buyer">
                    <h3>采购商</h3>
                    <div class="info">
                        <img src="@/../../static/image/checking.png" width="40" height="40" alt>
                        <div>
                            <p>{{idDetail.identityParentName}}：{{idDetail.identitySubName}}</p>
                            <p class="area">
                                <img src="@/../../static/image/grayPosi.png" alt>
                                {{idDetail.province+' '+idDetail.city+' '+idDetail.region}}
                            </p>
                            <img v-if="idDetail.authList.includes('实地认证经销商')" src="@/../../static/image/shidi.png"
                                 width="102" height="22" alt="">
                            <img v-if="idDetail.authList.includes('实地认证汽修厂')" src="@/../../static/image/jxs.png"
                                 width="102" height="22" alt="">
                        </div>
                        <img src="@/../../static/image/successPay.png" alt="" class="completed" v-if="idDetail.status">
                    </div>
                    <p class="quoteNum"><span style="color:red">{{idDetail.quoteCount}}</span> 个经销商报价 </p>
                </div>
            </div>
            <div class="bill"
                 v-if="idDetail.type=='PRECISE'&&idDetail.accid!=$store.state.im.userUID&&!idDetail.status">
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
            <!--订单相关存-->
            <!--idDetail.isQuote&&idDetail.type=='FAST'-->
            <div v-if="idDetail.type=='FAST'&&idDetail.accid!=$store.state.im.userUID" class="fastQuote">
                <h3>报价</h3>
                <div style="position: relative">
                    <el-input type="textarea" v-model="idDetail.notes"
                              :maxlength='550'></el-input>
                    <span style="position: absolute; right: 0;font-size: 14px;padding: 0 10px;">{{550-idDetail.notes.length}}/550</span>
                </div>

                <div class="quotePic clearfix">
                    <span class="tit">照片 :</span>
                    <div class="upPic" ref="labels">
                        <label>
                            <input type="file" multiple @change="upPhoto">
                            <span>+</span>
                            <p>{{imgList.length}}/9张</p>
                        </label>
                    </div>
                    <div class="imgList" v-for="(item,x) in imgList" :key="x">
                        <img src="@/../../static/image/del.png" alt width="26" class="img" @click="delIndex(x)">
                        <img @click.stop="look (x,imgList)" :src="item" width="100" height="80" alt>
                    </div>
                </div>
                <!--//订单快速报价-->
                <!--<fast-list :detail="idDetail.currentUserQuote"></fast-list>-->
            </div>
            <!--v-if="idDetail.accid==$store.state.im.myInfo.account"-->
            <div v-if="idDetail.accid==$store.state.im.myInfo.account" class="fastQuote">
                <h3>报价卖家</h3>
                <el-collapse v-model="activeNames">
                    <el-collapse-item v-for="(item , ind) in idDetail.quoteList" :key="ind" :name='++ind'>
                        <template slot="title">
                            <div class="clearfix collapseItem">
                                <!-- <i class="el-icon-circle-plus-outline" style="float:left;display:inline-block"></i> -->
                                <img
                                        :src="(item.authList?item.authList.length:item.authList)?item.logo:require('../../../../static/image/noAuth.png')"
                                        style="width:30px;height:30px;margin:9px 0;float:left;margin-left:10px;border:1px solid #e6e6e6"
                                >
                                <span
                                        style="display:inline-block;float:left;padding-left:10px;"
                                >{{item.name}}({{item.province}}{{item.city}}{{item.region}})</span>
                                <div v-if="item.authList?item.authList.length:item.authList">
                                    <el-tooltip placement="top" v-for="x in item.authList" :key="x">
                                        <span slot="content">{{x}}</span>
                                        <img src="./../../../../static/image/cash.png" alt v-if="x=='营业执照认证'">
                                        <img src="./../../../../static/image/id.png" alt v-else-if="x=='身份证认证'">
                                        <img src="./../../../../static/image/cash2.png" alt v-else-if="x=='实地认证经销商'">
                                        <img src="./../../../../static/image/cash3.png" alt
                                             v-else-if="x.indexOf('元')>-1">
                                    </el-tooltip>
                                </div>
                                <span v-else class="noAudio">未认证</span>
                                <div class="connect" @click.stop.prevent="talkTo(item)">
                                    <img src="@/../../static/image/newMsg.png" width="22" alt="">联系卖家
                                </div>
                            </div>
                        </template>
                        <div v-if="idDetail.type == 'FAST'">
                            <p>{{item.remark}}</p>
                            <img :src="val" v-for="(val,ind) in item.quoteImageList" :key="ind"
                                 style="width:50px;height:50px;margin-left:10px;"
                                 @click.stop="look(ind,item.quoteImageList)">
                        </div>
                        <el-row
                                class="baby"
                                v-for="(i,index) in item.quotePartList"
                                :key="index"
                                :class="{oddBg:index%2==1}"
                                v-else
                        >
                            <el-col :span="3">{{index+1}}</el-col>
                            <el-col :span="5">{{i.subName}}</el-col>
                            <el-col :span="15" class="press">
                                <div class="myprice" v-if="i.partItemList">
                                    <div v-for="x in 4" :key="x" :class="{borde:1==x}">
                                        <p v-if="i.partItemList[x-1]">
                                            {{i.partItemList[x-1].classifyName}}
                                            {{i.partItemList[x-1].typeName}}
                                        </p>
                                        <p class="price" v-if="i.partItemList[x-1]">
                                            {{(i.partItemList[x-1].price/100).toFixed(2)}}</p>
                                    </div>
                                </div>
                                <div class="myprice quoteNow" @click="interest(index)" v-else>立即报价></div>
                            </el-col>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <!--<div v-if="idDetail.accid==$store.state.im.userUID" class="fastQuote">-->
            <!--<h3>报价卖家</h3>-->
            <!--<div v-for="(item,index) in idDetail.quoteList">-->
            <!--<quote-list :detail="item" @getSelect="updateArr(arguments[0],index)"></quote-list>-->
            <!--</div>-->
            <!--</div>-->
            <div class="send" v-if="idDetail.accid!=$store.state.im.userUID&&!idDetail.status">
                <el-button v-if="idDetail.type=='PRECISE'" type="primary" size="medium " @click="sendBuyer">
                    {{idDetail.isQuote?'修改报价':'确认报价'}}
                </el-button>
                <!--订单点击调用-->
                <el-button v-else type="primary" size="medium " @click="sendBuyer">{{idDetail.isQuote?'修改报价':'报价'}}
                </el-button>
            </div>
            <!--<div class="send" v-if="idDetail.accid==$store.state.im.userUID">-->
            <!--<p>已选{{num}}项，总计: <span style="color: #E60000">¥{{total}}</span><span-->
            <!--style="font-size: 12px">(不含运费)</span>-->
            <!--</p>-->
            <!--<el-button type="primary" size="medium" :disabled="!num" @click="orderDialog=true">去结算</el-button>-->
            <!--</div>-->
            <frames
                    @click.native="hid('frameShow',$event)"
                    v-model="frameShow"
                    v-if="frameShow"
                    :vin="idDetail.vin"
            ></frames>
            <offter
                    v-if="interestShow"
                    @hid="interestShow=false"
                    v-model="idDetail"
                    :index="currentNum"
            ></offter>
            <el-dialog
                    width="900px"
                    :visible.sync="fast"
                    :modal-append-to-body="false"
                    :append-to-body="false"
                    :center="true"
                    top="10vh"
                    custom-class="fastQ">
                <h5 slot="title" style="font-size: 18px">报价</h5>
                <fast-quote v-if="fast" :detail="idDetail"></fast-quote>
            </el-dialog>
        </div>
        <commit-order :del="idDetail" v-if="orderDialog" @showDetail="orderDialog=false"></commit-order>
        <transition name="el-zoom-in-bottom">
            <bg class="warning" v-if="dialog">
                <div class="dialog">
                    <i class="el-icon-close" @click="dialog = false;"></i>
                    <div class="header">
                        <i class="el-icon-warning"></i>温馨提示
                    </div>
                    <p>此商家未入驻“心动配讯”平台，若交易产生<br>纠纷，本平台概不负责。</p>
                    <footer>
                        <button @click="connect(1)">联系客服</button>
                        <button class="agree" @click="connect(0)">同意</button>
                    </footer>
                </div>
            </bg>
        </transition>
    </div>
</template>
<script>
    var up = require("@/utils/upPic");
    import commitOrder from "./model/commitOrder";
    import offter from "./model/offer";
    import hd from "../admission/bt/header";
    import frames from "./model/framNumberCopy";
    import fastQuote from './model/fastQuote';
    import fastList from './model/goodsList';
    import quoteList from './model/buyerCreatOrder';
    import {setLocal, getLocal} from "../../utils/localstorage";
    import bg from '../myOrder/model/bg'
    import {
        getDetail,
        getMyDetail,
        preciseCommit,
        getInfo,
        fastCommit,
        finish
    } from "@/api/quote/quote";
    import {lookPhoto} from "@/api/admission/admission";
    import preciseCommitObj from '@/utils/quote';

    const {ipcRenderer, clipboard} = require("electron");

    export default {
        components: {
            hd,
            frames,
            offter,
            fastQuote,
            fastList,
            quoteList,
            commitOrder,
            bg
        },
        created() {
            this.getDetailId();
        },
        mounted() {
            this.initAudioTime();
        },
        updated() {
            this.initAudioTime();
        },
        methods: {
            talkTo(item) {
                this.item = item;
                if(this.item.authList ? this.item.authList.length : this.item.authList){
                    this.sendCustom()
                }else
                this.dialog = true;
            },
            connect(val) {
                if (val) {
                    let supper = JSON.parse(getLocal('supper'));
                    this.$router.push('/message/index/' + 'p2p-' + supper[0])
                } else
                    this.sendCustom()
            },
            sendCustom() {
                setLocal('readyCustom', JSON.stringify({
                    scene: 'p2p',
                    to: this.item.accid,
                    type: "custom",
                    content: {
                        msgType: 5,
                        msgContent: {
                            purchaseId: this.idDetail.id,
                            buyerId: this.$store.state.im.userUID,
                            sellerId: this.item.accid,
                            brandName: this.idDetail.vehicleBrand + '(' + this.idDetail.vehicleSerie + ')',
                            brandLogo: this.idDetail.logo,
                            partName: this.idDetail.type == 'FAST' ? this.item.remark : this.idDetail.partList.map(item => item.subName).join(','),
                            allPrice: 0,
                            isFast: this.idDetail.type == 'FAST'
                        }
                    }
                }))
                setLocal('hasAuth', (this.item.authList ? this.item.authList.length : this.item.authList) ? 0 : 1)
                this.$router.push('/message/index/' + 'p2p-' + this.item.accid)
            },
            delIndex(i) {
                this.imgList.splice(i, 1);
            },
            upPhoto(e) {
                up.up(
                    e.target,
                    this,
                    str => {
                        if (this.imgList.length == 9) {
                            this.$message.warn("最多上传9张");
                            return;
                        }
                        this.imgList.push(str);
                    },
                    this.$refs.labels
                );
            },
            finish(flag) {
                if (flag) return false;
                finish({
                    id: this.idDetail.id
                }).then(res => {
                    this.$message.success("提交完成");
                    history.go(-1);
                });
            },
            updateArr(arg, index) {
                let arr = [];
                let total = 0;
                this.selectArr.length = this.idDetail.quoteList.length;
                this.selectArr[index] = arg;
                this.selectArr.forEach(item => {
                    arr = arr.concat(item.select)
                })
                arr.forEach(item => {
                    total += item.priceShow * item.num;
                })
                this.total = total.toFixed(2);
                this.num = arr.length;
            },
            copy(vin) {
                clipboard.writeText(vin);
                this.$message.success("复制成功");
            },
            stop() {
                this.show = false;
            },
            initAudioTime() {
                this.$nextTick(() => {
                    if (this.$refs.quoteAudio) {
                        this.$refs.quoteAudio.oncanplay = () => {
                            this.audioTime = Math.ceil(this.$refs.quoteAudio.duration) || 0;
                        };
                    }
                });
            },
            // newOrder() {
            //     ipcRenderer.send("orderWindowCreated", this.idDetail.userId);
            // },
            play() {
                if (this.$refs.quoteAudio.paused) {
                    this.show = true;
                    this.$refs.quoteAudio.play();
                } else {
                    this.show = false;
                    this.$refs.quoteAudio.pause();
                }
            },
            //联系卖家
            connectBuyer() {
                this.$router.push("/message/index/" + "p2p-" + this.idDetail.accid);
            },
            //点击消失
            hid(show, e) {
                if (e.target.className == "bgc") {
                    this[show] = false;
                }
            },
            delect(i) {
                this.idDetail.partList[i].quotePartItemList = null;
            },
            clearAll() {
                this.idDetail.partList.map(item => {
                    item.quotePartItemList = null;
                });
            },
            //我的报价单进入
            myquoted(quoteId) {
                this.$store.commit('setLoading', true)
                let FASTQUOTE = {};
                getMyDetail({
                    quoteId: quoteId
                }).then(res => {
                    if (res.data.type !== "FAST") {
                        res = this.requestData(res);
                    } else {
                        res.data.quoteList.forEach((item, index) => {
                            if (item.accid == this.$store.state.im.myInfo.account) {
                                res.data.notes = item.remark;
                                FASTQUOTE = item;
                            }
                        });
                    }
                    this.idDetail = res.data;
                    // res.data.isQuote && this.getNeedArray(res.data.currentUserQuote.quotePartList)
                    this.imgList = FASTQUOTE.quoteImageList ||
                        [];
                    this.idDetail.notes = this.idDetail.notes || FASTQUOTE.remark || '';
                    this.quoted =
                        FASTQUOTE.remark != undefined
                            ? JSON.parse(JSON.stringify(FASTQUOTE))
                            : JSON.parse(JSON.stringify(res.data));
                    this.$store.commit('setLoading', false)
                });
            },
            requestData(res) {
                res.data.partList.forEach(item => {
                    let quote = item.quotePartItemList;
                    quote
                        ? quote.forEach(item => {
                            item.priceS = (item.price / 100).toFixed(2);
                            item.parts = `${item.classify},${item.classifyName}`;
                            item.isHave = `${item.type},${item.typeName}`;
                        })
                        : null;
                });
                if (res.data.quoteList) {
                    for (let i = 0; i < res.data.quoteList.length; i++) {
                        if (res.data.quoteList[i].accid == this.$store.state.im.myInfo.account) {
                            res.data.notes = res.data.quoteList[i].remark;
                            break;
                        }
                    }
                }

                return res;
            },
            //从列表页进入quoteId我的报价单，id为我的采购单
            getDetailId() {
                this.$store.commit('setLoading', true)
                let {id, quoteId} = this.$route.query;
                if (quoteId) {
                    this.myquoted(quoteId);
                } else {
                    getDetail({
                        enquiryId: id
                    })
                        .then(res => {
                            res.data.notes = res.data.currentUserQuote ? res.data.currentUserQuote.remark : '';
                            this.idDetail = res.data;
                            res.data.isQuote && this.getNeedArray(res.data.currentUserQuote.quotePartList)
                            res.data.quoteList.forEach((i, index) => this.activeNames.push(index + 1))
                            if (res.data.isQuote && res.data.type == "FAST") {
                                // for (var i = 0; i < res.data.quoteList.length; i++) {
                                //     if ( res.data.quoteList[i].accid ==this.$store.state.im.myInfo.account) {
                                //         this.myquoted(res.data.quoteList[i].id);
                                //         return;
                                //     }
                                // }
                                return
                            }
                        })
                        .then(() => {
                            return getInfo({
                                enquiryId: id || quoteId
                            });
                        })
                        .then(res => {
                            res = this.requestData(res);
                            this.idDetail.partList = res.data.partList;
                            this.$store.commit('setLoading', false)
                        });
                }
            },
            look(i, arr) {
                ipcRenderer.send("picLooker", {pic: arr, index: i});
            },
            getNeedArray(arr) {
                //处理非订单
                !arr.length && (this.imgList = this.idDetail.currentUserQuote.quoteImageList)
                let list = [];
                arr.forEach(item => {
                    item.partItemList.forEach(val => {
                        list.push({
                            classify: val.classify,
                            isShow: false,
                            name: item.subName,
                            priceShow: (val.price / 100).toFixed(2),
                            reserveDays: val.reserveDays,
                            type: val.type,
                        })
                    })
                })
                this.idDetail.currentUserQuote.quotePartList = list;
            },
            isChange() {
                if (!this.idDetail.isQuote) return true;
                if (this.idDetail.type == "FAST") {
                    return (
                        this.quoted.remark != this.idDetail.notes ||
                        this.quoted.quoteImageList.join() != this.imgList.join()
                    );
                } else {
                    return (
                        JSON.stringify(this.idDetail.partList) !=
                        JSON.stringify(this.quoted.partList) ||
                        this.idDetail.notes != this.quoted.notes
                    );
                }
            },
            sendBuyer() {
                if (!this.isChange()) {
                    this.$message.error("请修改后提交");
                    return false;
                }
                if (this.idDetail.type == "PRECISE") {
                    let data = preciseCommitObj(this.idDetail);
                    if (data.partList.length) {
                        preciseCommit(data).then(res => {
                            this.$message.success("报价成功");
                            this.$router.push("/quotation/index");
                        });
                    } else {
                        this.$message.error("请报价后提交");
                        return;
                    }
                } else {
                    fastCommit({
                        enquiryId: this.idDetail.id,
                        remark: this.idDetail.notes,
                        imgList: this.imgList
                    }).then(res => {
                        if (res.code !== 200) return;
                        this.$message.success("报价成功");
                        this.$router.push("/quotation/index");
                    });
                }
            },
            interest(index) {
                this.currentNum = index;
                this.interestShow = true;
            }
        },
        data() {
            return {
                dialog: false,
                item: null,
                news: [1, 2, 3, 4],
                activeNames: [],
                idDetail: null,
                partsID: [],
                frameShow: false,
                interestShow: false,
                currentNum: null,
                imgList: [],
                audioTime: 0,
                show: false,
                quoted: {},
                fast: false,
                selectArr: [],
                total: 0.00,
                num: 0,
                orderDialog: false
            };
        }
    };
</script>
<style lang="scss" scoped>
    .warning {
        display: flex;
        align-items: center;
        justify-content: center;
        .dialog {
            position: relative;
            width: 482px;
            height: 241px;
            background: #fff;
            text-align: center;
            border-radius: 5px;
            >i{
                position: absolute;
                right: 5px;
                top: 5px;
                font-size: 18px;
            }
            .header {
                padding: 37px 0 24px;
                font-size: 20px;
                >i {
                    color: #FC684F;
                    margin-right: 10px;
                }
            }
            p {
                font-size: 18px;
                color: #565252;
                line-height: 25px;
            }
            footer {
                margin-top: 36px;
                font-size: 0;
                border-top: 1px solid #ccc;
                button {
                    border: 0;
                    outline: 0;
                    display: inline-block;
                    width: 241px;
                    height: 70px;
                    font-size: 16px;
                    background: white;
                    transition: all .3s;
                }
                button:hover {
                    filter: brightness(90%);
                }
                .agree {
                    color: #fff;
                    background: #FC684F;
                }
            }
        }
    }

    .noAudio {
        margin-left: 5px;
        padding: 5px;
        background: #ccc;
        color: #f00;
        border-radius: 3px;
    }

    .quotePic {
        margin-top: 25px;
        img {
            width: 100px;
            height: 80px;
            margin-right: 20px;
            border-radius: 5px;
            float: left;
        }
        .tit {
            float: left;
            margin-right: 15px;
            font-weight: 600;
        }
        .upPic {
            label {
                cursor: pointer;
                width: 100px;
                height: 8px;
            }
            margin-left: 0;
        }
    }

    .imgList {
        position: relative;
        float: left;
        margin-left: 20px;
        width: 100px;
        height: 80px;
        border-radius: 5px;
        margin-bottom: 20px;
        .img {
            position: absolute;
            right: -33px;
            top: -13px;
            width: 26px;
            height: 26px;
        }
        img {
            border-radius: 3px;
        }
    }

    .upPic {
        float: left;
        position: relative;
        width: 100px;
        height: 80px;
        border: 1px dashed #ccc;
        margin-right: 20px;
        label {
            width: 100px;
            height: 80px;
            text-align: center;
            input {
                display: none;
            }
            span {
                display: block;
                margin: 0 auto;
                margin-top: 25px;
                width: 30px;
                height: 30px;
                border: 1px dashed #ccc;
                line-height: 30px;
            }
        }
        p {
            position: absolute;
            width: 100%;
            text-align: center;
            bottom: 1px;
            left: 0;
            font-size: 12px;
        }
    }

    @import "../../styles/list";

    .cirDetail {
        height: 100%;
        background: #fff;
        color: #000;
        padding-bottom: 60px;
        position: relative;
        .head {
            margin-bottom: 0px;
        }
        .scrollArea {
            height: calc(100% - 58px);
        }
    }

    .buying > h3 {
        margin-left: 40px;
    }

    .buyer {
        padding-left: 40px;
        position: relative;
        padding-bottom: 20px;
        border-bottom: 1px solid #ccc;
        .quoteNum {
            position: absolute;
            right: 0;
            padding: 30px;
            top: 0;
        }
        .info {
            display: flex;
            font-size: 14px;
            line-height: 20px;
            align-items: center;
            img {
                margin-right: 10px;
                vertical-align: text-top;
            }
            .completed {
                position: absolute;
                right: 30%;
                top: 8px;
            }
            .area {
                font-size: 13px;
                color: #999;
                img {
                    margin-right: 0;
                }
            }
        }
    }

    .buying {
        font-size: 14px;
        position: relative;
        .finish {
            position: absolute;
            right: 40px;
            top: 30px;
            cursor: pointer;
            div {
                width: 110px;
                height: 36px;
                border-radius: 4px;
                background: #FFF8ED;
                font-size: 14px;
                line-height: 36px;
                text-align: center;
                color: #FF0000;
                span {
                    font-size: 18px;
                    vertical-align: text-bottom;
                    margin-right: 5px;
                }
            }
            .noDrop {
                cursor: not-allowed;
            }
        }
        .carInfo {
            @include fl;
            height: 50px;
            align-items: center;
            padding-left: 40px;
            border-bottom: 1px solid #cccccc;
            padding-bottom: 15px;
            .titWord {
                font-weight: 600;
                margin-right: 11px;
            }
            .vin {
                @include fl;
                height: 36px;
                margin-left: 10px;
                margin-right: 100px;
                align-items: center;
                div {
                    @include fl;
                    @include border;
                    cursor: pointer;
                    justify-content: space-between;
                    width: 280px;
                    padding-left: 11px;
                    color: #fc684f;
                    p {
                        text-decoration: underline;
                    }
                    .copy {
                        cursor: pointer;
                        text-align: center;
                        img {
                            vertical-align: middle;
                            margin-right: 5px;
                        }
                        width: 64px;
                        border-left: 1px solid #dedede;
                        text-decoration: none;
                        color: #000;
                    }
                }
            }
            .brand {
                @include fl;
                align-items: center;
                div {
                    @include fl;
                    align-items: center;
                    @include border;
                    padding: 0 10px;
                    img {
                        width: 28px;
                        height: 28px;
                        vertical-align: middle;
                        margin-right: 13px;
                    }
                }
            }
        }
        .picList {
            padding-left: 40px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 15px;
            p {
                font-size: 16px;
                color: #666;
                padding-left: 11px;
                margin-bottom: 20px;
            }
            width: 100%;
            .img {
                display: inline-block;
            }
            div {
                margin-left: 11px;
                width: 90px;
                height: 90px;
                margin-right: 20px;
                overflow: hidden;
                background: #dedede;
                border-radius: 3px;
                img {
                    width: 100%;
                }
            }
            .quoteAudio {
                position: relative;
                width: 180px;
                height: 40px;
                @include border;
                background: #fff;
                overflow: initial;
                margin-bottom: 20px;
                padding: 0 5px;
                .audioTime {
                    position: absolute;
                    right: 5px;
                }
                .played {
                    cursor: pointer;
                    position: absolute;
                    right: -70px;
                    color: #fc684f;
                }
                img {
                    width: 15px;
                    vertical-align: sub;
                }
            }
        }
    }

    .reset {
        text-decoration: underline;
    }

    .borde {
        border: 0 none !important;
    }

    @media screen and (min-width: 1400px) and (max-width: 1800px) {
        .one {
            margin-right: 80px !important;
        }
    }

    .ready {
        padding-left: 40px;
        .socaler {
            @include fl;
            flex-wrap: wrap;
        }
        .none {
            height: 100px;
            text-align: center;
            line-height: 100px;
            width: 100%;
        }
        .one {
            margin-right: 77px;
            margin-bottom: 40px;
            border: 1px solid #e6e6e6;
            @include fl;
            width: 260px;
            height: 120px;
            padding: 10px;
            padding-right: 0;
            .headPic {
                width: 100px;
                height: 100px;
                margin-right: 10px;
                border-radius: 5%;
            }
            .right {
                font-size: 12px;
                width: 50%;
                div {
                    height: 48px;
                    margin-top: 17px;
                }
                p {
                    img {
                        width: 12px;
                        height: 14px;
                    }
                }
                .name {
                    font-size: 14px;
                    line-height: 33px;
                    width: 70%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                img {
                    width: 22px;
                    height: 22px;
                    vertical-align: middle;
                }
            }
        }
    }

    .oddBg {
        background: #f5f5f5;
    }

    .baby {
        transition: all 0.5s;
        @include fl;
        height: 70px;
        line-height: 70px;
        border: 1px solid #cccccc;
        border-top: 0 none;
        text-align: center;
        span {
            margin-left: 5px;
            color: #000;
        }
        .press {
            @include fl;
            justify-content: center;
            align-items: center;
            padding: 0 20px;
            .myprice {
                font-size: 12px;
                @include fl;
                align-items: center;
                justify-content: center;
                width: 100%;
                border: 1px solid #cccccc;
                border-radius: 5px;
                color: #000;
                cursor: pointer;
            }
            .quoteNow {
                color: #fc684f;
            }
            .border {
                border: 0 none;
            }
            div {
                width: 25%;
                height: 50px;
                border-left: 1px solid #cccccc;
                p {
                    line-height: 25px;
                }
                .price {
                    color: #fc684f;
                }
            }
        }
        .reset {
            @include fl;
            align-items: center;
            justify-content: center;
        }
    }

    .connect {
        position: absolute;
        right: 100px;
        top: 2px;
        img {
            vertical-align: text-bottom;
            margin-right: 5px;
        }
    }

    .connect:hover {
        text-decoration: underline;
    }
</style>
<style lang='scss'>
    .fastQuote {
        padding-left: 40px;
        width: 95%;
        .el-textarea__inner {
            height: 120px;
            resize: none;
        }
    }

    .fastQuote {
        padding-left: 40px;
        width: 95%;
        .el-collapse-item__header {
            height: auto;
        }
        .baby {
            border: 0;
        }
        .el-textarea__inner {
            height: 120px;
            resize: none;
        }
        .collapseItem {
            position: relative;
        }
        .collapseItem .el-tooltip {
            width: 20px;
            padding: 9px 0;
            float: left;
            margin-left: 10px;
        }
        .el-collapse-item__content {
            border-top: 1px solid #e6e6e6;
            padding-bottom: 0;
        }
        .el-collapse {
            border: 0;
        }
        .el-collapse-item {
            border-style: solid;
            border-color: #e6e6e6;
            border-width: 1px 1px 0 1px;
            margin-bottom: 10px;
            width: 85%;
        }
    }

    .scrollArea {
        .el-dialog__wrapper {
            position: absolute;
        }
    }

    .fastQ {
        .el-dialog__body {
            padding: 0;
        }
    }
</style>
