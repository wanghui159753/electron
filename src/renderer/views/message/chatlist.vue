<template>
    <div class="chatlist scrollbar clearfix" id="msgbox">
        <div class="warn" v-if="hasAuth"><span>此商家未入驻“心动配讯”平台，<br>若交易产生纠纷， 本平台概不负责!</span></div>
        <div ref="msglist">
            <div
                    class="moreMsg"
                    v-if="!canLoadMore&&$store.state.im.currSessionInfo"
                    @click="getHistoryMsgs"
            >查看更多消息
            </div>
            <div class="moreMsg noMoreMsg" v-else>没有更多消息了</div>
            <el-checkbox-group v-model="checkList" @change="updateSelectContent">
                <label
                        v-for="(msg,ind ) in msglist"
                        :key="msg.idClient"
                        @contextmenu="contextmenu($event,msg)"
                        v-contextmenu:contextmenu
                >
                    <chat-item
                            :curAudioInfo="curAudioInfo"
                            :isbg="isbg"
                            :type="type"
                            :msgShow="msgShow"
                            :rawMsg="msg"
                            :userInfos="userInfos"
                            :myInfo="myInfo"
                            :isRead='msglist[ind] && msglist[ind].isRead'
                            :isHistory="isHistory"
                            @msg-loaded="msgLoaded"
                            @pushURL="getURL"
                            @contextmenu.native="cancalBable(msg,$event)"
                            @vin="vinShow"
                            @showOrder="showOrder"
                            @newAudio="play"
                            @quote="quoteShow"
                            @realOrder="realOrder"
                    ></chat-item>
                </label>
            </el-checkbox-group>
        </div>
        <v-contextmenu ref="contextmenu">
            <v-contextmenu-item @click="copy" v-if="!aitHeader">复制</v-contextmenu-item>
            <v-contextmenu-item @click="selectorMore" v-if="!aitHeader">多选</v-contextmenu-item>
            <v-contextmenu-item @click="retransmissionMsg" v-if="!aitHeader">转发</v-contextmenu-item>
            <v-contextmenu-item @click="deleteMsg" v-if="!aitHeader">删除</v-contextmenu-item>
            <v-contextmenu-item @click="ait" v-if="aitHeader">@他</v-contextmenu-item>
            <v-contextmenu-item
                    @click="revocateMsg"
                    v-if="new Date().getTime()-msg.time<120000&&msg.flow=='out'&&!aitHeader"
            >撤回
            </v-contextmenu-item>
        </v-contextmenu>
        <videoPlear v-show="blean" v-model="blean" :url="url"></videoPlear>
        <vin v-if="vin.show" :vin="vin.id"></vin>
        <order v-if="order.orderShow" :detailInfoId='order.num' :autoSellor="!order.isBuyer"
               @showDetail="order.orderShow=false"></order>
        <el-dialog
                width="80%"
                top="15vh"
                :center="true"
                custom-class="inventoryQuote"
                v-if="inventoryQuote"
                :visible.sync="inventoryQuote">
            <h3 slot="title">报价</h3>
            <inventory-quote :msgContent="quote" @ok="inventoryQuote=false"></inventory-quote>
        </el-dialog>
        <commitOrder v-if="selectOrder.show" :id="selectOrder.id" v-model="selectOrder.show"></commitOrder>
    </div>
</template>
<script>
    import {getBase64} from "@/api/im/baseMethod";
    import Bus from "@/utils/bus.js";
    import {mapGetters} from "vuex";
    import ChatEditor from "@/components/Chat/ChatEditor.vue";
    import util from "@/utils";
    import ChatItem from "@/components/Chat/ChatItem";
    import videoPlear from "@/components/Chat/videoPlear";
    import {getLocal,setLocal} from "../../utils/localstorage";
    import order from "../myOrder/orderDetailNormal"
    import vin from "@/views/quote/model/framNumberCopy";
    import inventoryQuote from './template/listQuote'
    import im from "../../store/modules/im";
    import commitOrder from './template/order_buyer_create_order'

    const {clipboard, nativeImage, ipcRenderer} = require("electron");
    export default {
        components: {
            ChatEditor,
            ChatItem,
            videoPlear,
            vin,
            order,
            inventoryQuote,
            commitOrder
        },
        data() {
            return {
                inventoryQuote: false,
                checkList: [],
                blean: false,
                url: "",
                isEmojiShown: false,
                num: 1,
                msgBoxHeight: 0,
                msg: {},
                textMsg: "",
                lookHistory: false,
                vin: {
                    id: "",
                    show: false
                },
                aitHeader: false,
                msglistMore: [],
                curAudio: new Audio(),
                curAudioInfo: null,
                order: {
                    orderShow: false,
                    isBuyer: null,
                    num: ''
                },
                quote: null,
                hasAuth:false,
                selectOrder: {
                    show: false,
                    id: null
                }
            };
        },
        props: {
            type: String,
            msglist: {
                type: Array,
                default: []
            },
            myInfo: {
                type: Object,
                default: {}
            },
            isHistory: {
                type: Boolean,
                default: false
            },
            msgSectionShow: {
                type: Boolean,
                default: false
            },
            userInfos: {
                type: Object,
                default: {}
            },
            msgdialogVisible: {
                type: Boolean,
                default: true
            }
        },
        watch: {
            msgSectionShow() {
                if (this.msgSectionShow) {
                    this.msgShow = true;
                } else {
                    this.msgShow = false;
                }
            },
            lastMsg(val) {
                if (val.flow == 'out') {
                    this.lookHistory = false;
                }
            },
            currSessionId() {this.hasAuth=false;
                setLocal('hasAuth',0)
                this.num = 1;
                this.lookHistory = false;
            },
            isbg(val) {
                val ? null : (this.checkList = []);
            }
        },
        methods: {
            quoteShow(val) {
                this.quote = val;
                this.inventoryQuote = true;
            },
            realOrder(msg) {
                let myshop = JSON.parse(getLocal('myStore'))
                if (msg.buyerId == myshop.userId || msg.sellerId == myshop.userId) {
                    this.order = {
                        orderShow: true,
                        isBuyer: msg.buyerId == myshop.userId,
                        num: msg.orderNum
                    }
                } else {
                    this.$message.error('不能查看他人订单')
                }
            },
            showOrder(msg) {
                let myshop = JSON.parse(getLocal('myStore'))
                if (msg.buyerId == myshop.userId) {
                    this.selectOrder = {
                        show: true,
                        id: msg.orderId
                    }
                } else if (msg.sellerId == myshop.userId) {
                    ipcRenderer.send('orderWindowCreated', JSON.stringify({
                        userId: myshop.userId,
                        accid: this.$store.state.im.currSessionId.substring(4),
                        orderId: msg.orderId
                    }))
                } else {
                    this.$message.error('不能查看他人订单')
                }
            },
            play(obj) {
                this.curAudioInfo = obj
                if (obj.do == 'play') {
                    this.curAudio.volume = 0.3;
                    this.curAudio.src = obj.src;
                    this.curAudio.play();
                    this.curAudio.onended = () => {
                        this.curAudioInfo.do = 'end';
                    }
                } else {
                    this.curAudio.pause();
                    this.curAudioInfo.do = 'pause'
                }
            },
            ait() {
                Bus.$emit("aitOne", this.msg);
            },
            vinShow(vin) {
                this.vin.show = true;
                this.vin.id = vin.vin;
            },
            cancalBable(msg, e) {
                if (
                    msg.type == "tip" ||
                    msg.type == "timeTag" ||
                    msg.type == "notification"
                ) {
                    e.stopPropagation();
                }
            },
            contextmenu(event, msg) {
                if (event.target.className == "icon u-circle") {
                    this.aitHeader = true;
                } else {
                    this.aitHeader = false;
                }
                this.msg = msg;
                // 处理文本消息
                if (msg.type == "text") {
                    let a = window.getSelection();
                    this.textMsg =
                        msg.text.substring(a.anchorOffset, a.extentOffset) || msg.text;
                } else if (msg.type == "image" && msg.file.url) {
                    this.msgTypeState = "image";
                    this.imgUrl = msg.file.url;
                }
            },
            revocateMsg() {
                // 在会话聊天页
                console.error("点击撤回");
                if (this.$store.state.im.currSessionId) {
                    if (this.msg) {
                        if (this.msg.type === "robot") {
                            return;
                        }
                        // 自己发的消息
                        if (this.msg.flow === "out") {
                            this.$store.dispatch("revocateMsg", {
                                idClient: this.msg
                            });
                        }
                    }
                }
            },
            deleteMsg() {
                Bus.$emit("deleteMsg", this.msg.idClient);
            },
            retransmissionMsg() {
                if (this.retransmission !== null) {
                    Bus.$emit("openSendContactBox", this.msg);
                }
            },
            selectorMore() {
                // 开启多选禁用图片放大功能
                this.$store.commit("updateSelectBox", {
                    isShow: true
                });
                this.$nextTick(() => {
                    let dom = this.$refs.contextmenu;
                    dom.style = {
                        display: "none",
                        tip: 0,
                        left: 0
                    };
                    dom = null;
                });
            },
            copy() {
                if (this.$store.state.im.currSessionId) {
                    if (this.textMsg) {
                        clipboard.writeText(this.textMsg);
                        this.textMsg = "";
                    }
                    if (this.imgUrl) {
                        getBase64(this.imgUrl, dataURL => {
                            clipboard.writeImage(nativeImage.createFromDataURL(dataURL));
                            this.imgUrl = "";
                        });
                    }
                }
            },
            getURL(obj) {
                this.url = obj.url;
                this.blean = obj.blean;
            },
            selectEmoji(code) {
                this.value += code;
            },
            resize() {
            },
            getStyle(dom, style) {
                return parseInt(getComputedStyle(dom, null)[style]);
            },
            getHistoryMsgs() {
                this.lookHistory = true;
                this.msgBoxHeight = this.getStyle(this.$refs.msglist, "height");
                this.num++;
                this.$store.dispatch("getLocalMsgs", {
                    sessionId: this.$store.state.im.currSessionId,
                    end: this.num * 20
                });
            },
            msgLoaded() {
                this.scroll();
            },
            updateSelectContent() {
                this.$emit("selMsg", this.checkList);
            },
            scroll() {
                this.$nextTick(() => {
                    if (this.lookHistory) {
                        if (this.msgBoxHeight) {
                            document.getElementById("msgbox").scrollTop =
                                this.getStyle(this.$refs.msglist, "height") - this.msgBoxHeight;
                        }
                        this.msgBoxHeight = 0;
                    } else {
                        let msgbox = document.getElementById("msgbox");
                        msgbox.scrollTop = msgbox.scrollHeight;
                        msgbox = null;
                    }
                });
            },
            returnFalse(el) {
                this.isEmojiShown = false;
                if (el.target.className == "bgc") {
                    this.vin.show = false;
                }
            }
        },
        computed: {
            ...mapGetters(["msgs"]),
            ...mapGetters(["im"]),
            canLoadMore() {
                return this.$store.state.im.noMoreHistoryMsgs;
            },
            lastMsg() {
                return this.$store.state.im.currSessionLastMsg;
            },
            scene() {
                return util.parseSession(this.sessionId).scene;
            },
            msgShow() {
                return this.$store.state.im.isShowSelectBox;
            },
            currSessionId() {
                return this.$store.state.im.currSessionId;
            },
            isbg() {
                let flag = this.msgdialogVisible;
                return flag;
            },
        },
        beforeUpdate() {
            window.document.body.removeEventListener("click", this.returnFalse);
        },
        updated() {
            window.document.body.addEventListener("click", this.returnFalse);
        },
        mounted() {
            this.hasAuth=getLocal('hasAuth')==1;
            window.VueEvent.$on('look', (tradNo) => {
                this.order = {
                    orderShow: true,
                    isBuyer: true,
                    num: tradNo
                }
            })
            this.msglistMore = this.msglist;
            ipcRenderer.send("openPicWindow");
            var msgdata = null;
            Bus.$on("sendmsgdata", result => {
                if (result !== null || result !== undefined) {
                    msgdata = result;
                }
            });
            Bus.$on("deleteMsg", content => {
                this.msglist.forEach((el, index) => {
                    if (el.idClient == content) {
                        this.$store.dispatch("deleteMsg", {msg: el});
                        this.$emit("removeMsg", index);
                    }
                });
            });
        },
        beforeDestroy() {
            window.document.body.removeEventListener("click", this.returnFalse);
            Bus.$off("sendmsgdata");
            Bus.$off("deleteMsg");
        }
    };
</script>
<style scoped lang="scss">
    .warn{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 0;
        text-align: center;
        padding-top:40px;
        span{
            padding: 5px 0;
            display: inline-block;
            text-align: center;
            width: 368px;
            background: #ccc;
            font-size: 18px;
            color: white;
            border-radius: 5px;
            line-height: 25px;
        }
    }
    @mixin zIndex{
        position: relative;
        z-index: 5;
    }
    .chatlist {
        height: 100%;
        background-color: #f3f3f3;
    }

    .moreMsg {
        text-align: center;
        color: #00f;
        padding: 15px;
        cursor: pointer;
        font-size: 12px;
        @include zIndex;
    }

    .noMoreMsg {
        color: #ccc;
        @include zIndex;
    }


    #msgbox {
        background: #f3f3f3;
        transition: all 0.3s;
    }
</style>
<style lang="scss">
    .vue-splitter-container {
        .el-dialog__wrapper {
            left: 180px;
        }
        .el-dialog__body {
            padding: 0 25px;
        }
    }
</style>