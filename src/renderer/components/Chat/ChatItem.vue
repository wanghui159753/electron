<template>
    <div
            class="u-msg clearfix clearfloat"
            id="u-msg"
            @dragstart.prevent="backfalse"
            :class="{
      'item-me': msg.flow==='out',
      'item-you': msg.flow==='in',
      'item-time': msg.type==='timeTag',
      'team-tip':msg.type==='notification',
      'item-tip': msg.type==='tip',
      'session-chat': type==='session',
      'bg':bg,
      leftLeave:$store.state.im.isShowSelectBox 
    }"
    >
        <el-checkbox
                v-if="(msg.flow==='in'|| msg.flow==='out') && msgShow&&!['tip','notification','order','quote','inventory','realOrder','pay'].includes(msg.type)"
                :label="msg"
                @change.native="bg = !bg"
        >&nbsp;
        </el-checkbox>
        <div>
            <a class="msg-head" v-if="msg.type!=='notification'&&msg.type!=='tip'">
                <img
                        class="icon u-circle"
                        v-if="msg.avatar"
                        :src="msg.avatar||'https://cdn.xindongpeixun.com/oss/20181017/d871a7d7268644b8b7f47d3a4fb8ad32.png'"
                        width="44"
                        @click.stop.prevent="openUserDetail(msg)"
                >
                <div class="triangleBox" :class="{isTeam:msg.scene==='team'}">
          <span
                  class="triangle"
                  :style="{'borderTopColor':['personal','business','vin','order','quote','inventory','realOrder','pay'].includes(msg.type)?'#fff':msg.type=='pay'&&msg.content.msgContent.orderFrom=='pay'?'#F89C49':msg.flow=='out'?'#FF6749':'#fff'}"
          ></span>
                </div>
            </a>
            <p class="msg-user" v-else-if="msg.type!=='notification'">
                <em>{{msg.showTime}}</em>
                {{msg.from}}
            </p>
        </div>
        <div v-if="msg.type==='timeTag'" class="timeTag">
            <p>{{msg.showText}}</p>
        </div>
        <div v-else-if="msg.type==='notification' && msg.scene==='team'" class="notification">
            <p>{{msg.showText}}</p>
        </div>
        <div v-else-if="msg.type==='tip'" class="tip">{{msg.showText}}</div>
        <div
                class="clearfix"
                v-else-if="msg.flow==='in' || msg.flow==='out'"
                :idClient="msg.idClient"
                :time="msg.time"
                :flow="msg.flow"
                :type="msg.type"
        >
            <div class="isRead" v-if="msg.flow==='out'&&msg.scene=='p2p'">
                <span v-if="isRead" :key="Math.random()">已读</span>
                <span v-else>未读</span>
            </div>
            <p class="nickInTeam"
               v-if="msg.scene=='team'"
            >{{msg.nickInTeam||$store.state.im.currChatroomMembers[msg.account]||msg.fromNick}}</p>
            <div v-if="msg.type==='text'" class="msg-text" v-html="msg.showText"></div>
            <div v-else-if="msg.type==='custom-type1'" class="msg-text" ref="mediaMsg"></div>
            <div v-else-if="msg.type==='custom-type3'" class="msg-text" ref="mediaMsg"></div>
            <div
                    v-else-if="msg.type==='personal'"
                    class="msg-text personal"
                    ref="mediaMsg"
                    @click="openUserDetail( conversionJSON(msg).content.msgContent)"
            ></div>
            <div
                    v-else-if="msg.type==='vin'"
                    class="msg-text business vin"
                    ref="mediaMsg"
                    @click="$emit('vin',dayin(msg.content)) "
            ></div>
            <div
                    v-else-if="msg.type==='pay'"
                    class="msg-text"
                    :class='{pay:conversionJSON(msg).content.msgContent.orderFrom=="pay"||conversionJSON(msg).content.msgContent.orderFrom=="refund",realOrder:conversionJSON(msg).content.msgContent.orderFrom=="order"}'
                    ref="mediaMsg"
                    @click="conversionJSON(msg).content.msgContent.orderFrom=='order'&&orderClick('realOrder')"
            ></div>
            <div
                    v-else-if="msg.type==='realOrder'"
                    class="msg-text realOrder"
                    ref="mediaMsg"
                    @click="orderClick('realOrder')"
            ></div>
            <div
                    v-else-if="msg.type==='business'"
                    class="msg-text business"
                    ref="mediaMsg"
                    @click="$router.push({name:'details',params:{id:conversionJSON(msg).content.msgContent.sellerId}})"
            ></div>
            <div
                    v-else-if="msg.type==='order'"
                    class="msg-text order"
                    ref="mediaMsg"
                    @click="orderClick('showOrder')"
            ></div>
            <div
                    v-else-if="msg.type==='quote'"
                    class="msg-text quote"
                    ref="mediaMsg"
                    @click="$router.push({path:'/quote/details',query:{id:conversionJSON(msg).content.msgContent.purchaseId}})"
            ></div>
            <div
                    v-else-if="msg.type==='inventory'"
                    class="msg-text inventory"
                    ref="mediaMsg"
                    @click="quote"
            ></div>
            <div
                    v-else-if="msg.type==='image'"
                    class="msg-pics"
                    ref="mediaMsg"
                    v-loading="loading"
                    @click.stop="showFullImg(msg.originLink,$event)"
            ></div>
            <div v-else-if="msg.type==='video'" class="msg-video" ref="mediaMsg" @click="getUrl">
                <img src="@/../../static/image/vplay.png">
            </div>
            <div
                    v-else-if="msg.type==='audio'"
                    class="msg-text audioBox flexbetween"
                    @click="playAudio(msg.audioSrc)"
                    :style="audioWidth"
            >
                <div class="audioImage" :class="{transform180:msg.flow=='out'}">
                    <img src="@/../../static/image/audio.png" v-if="currImage" alt>
                    <img src="@/../../static/image/audio.gif" v-else alt>
                </div>
                <div>{{msg.showText}}</div>
            </div>
            <div v-else-if="msg.type==='file'" class="msg-text msg-file">
                <a :href="msg.fileLink" target="_blank">
                    <i class="el-icon-document"></i>
                    {{msg.showText}}
                </a>
            </div>
            <div
                    v-else-if="msg.type==='robot'"
                    class="msg-text"
                    :class="{'msg-robot': msg.robotFlow!=='out' && !isRobot}"
            >
                <div v-if="msg.robotFlow==='out'">{{msg.showText}}</div>
                <div v-else-if="msg.subType==='bot'">
                    <!-- 多次下发的机器人消息 -->
                    <div v-for="(tmsgs,index) in msg.message" :key="index">
                        <!-- 多个机器人模板 -->
                        <div v-for="(tmsg,index) in tmsgs" :key="index">
                            <div v-if="tmsg.type==='text'">
                                <p>{{tmsg.text}}</p>
                            </div>
                            <div v-else-if="tmsg.type==='image'">
                                <p>
                                    <img :src="tmsg.url" @click="copyImage(this)">
                                </p>
                            </div>
                            <div v-else-if="tmsg.type==='url'">
                                <a :class="tmsg.style" :href="tmsg.target" target="_blank">
                                    <div v-if="tmsg.image">
                                        <p v-for="(tmsg2,index) in tmsg.image" :key="index">
                                            <img :src="tmsg2.url">
                                        </p>
                                    </div>
                                    <div v-if="tmsg.text">
                                        <p v-for="(tmsg2,index) in tmsg.text" :key="index">{{tmsg2.text}}</p>
                                    </div>
                                </a>
                            </div>
                            <div v-else-if="tmsg.type==='block'">
                                <a
                                        :class="tmsg.style"
                                        :params="tmsg.params"
                                        :target="tmsg.target"
                                        @click="sendRobotBlockMsg(tmsg, msg)"
                                >
                                    <div v-if="tmsg.image">
                                        <p v-for="(tmsg2,index) in tmsg.image" :key="index">
                                            <img :src="tmsg2.url">
                                        </p>
                                    </div>
                                    <div v-if="tmsg.text">
                                        <p v-for="(tmsg2,index) in tmsg.text" :key="index">{{tmsg2.text}}</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="msg.subType==='faq'">
                    <!--p>{{msg.message.question}}</p-->
                    <p>{{msg.message.answer}}</p>
                </div>
                <span v-if="msg.robotFlow!=='out' && !isRobot" class="msg-link">
          <a class="link-right" @click="continueRobotMsg(msg.content.robotAccid)">继续对话</a>
        </span>
            </div>
            <span v-else-if="msg.type==='notification'" class="msg-text notify">{{msg.showText}}</span>
            <span v-else class="msg-text" v-html="msg.showText"></span>
            <span v-if="msg.status==='fail'" class="msg-failed">
        <i class="el-icon-warning"></i>
      </span>
            <!-- :href='`#/msgReceiptDetail/${msg.to}-${msg.idServer}`' -->
            <a
                    v-if="teamMsgUnRead >=0"
                    class="msg-unread"
            >{{teamMsgUnRead>0 ? `${teamMsgUnRead}人未读`: '全部已读'}}</a>
        </div>
    </div>
</template>

<script type="text/javascript">
    const {clipboard, ipcRenderer} = require("electron");
    import util from "@/utils";
    import customMsg from '@/utils/customMsg'
    import config from "@/configs";
    import emojiObj from "@/configs/emoji";
    import Bus from "@/utils/bus.js";

    export default {
        props: {
            type: String, // 类型，chatroom, session
            rawMsg: {
                type: Object,
                default: {}
            },
            isRead: {
                type: Boolean,
                default: true
            },
            curAudioInfo: {
                type: Object
            },
            userInfos: {
                type: Object
            },
            myInfo: {
                type: Object,
                default: {}
            },
            isRobot: {
                type: Boolean,
                default: false
            },

            msgShow: {
                type: Boolean,
                default: false
            },
            isHistory: {
                type: Boolean,
                default: false
            },
            isbg: {}
        },
        data() {
            return {
                loading: true,
                flag: true,
                bg: false,
                checked: false,
                isFullImgShow: false,
                currentAudio: 0,
                currImage: true,
                textMsg: "",
                dataID: null,
                contextMenuVisible: false,
                msgIdClient: null,
                msgType: null,
                msgTypeState: null,
                imgUrl: null,
                isShowMsg: false,
                retransmission: null,
                audioWidth: {
                    width: 0
                }
            };
        },
        computed: {
            returnTime() {
                if (this.$store.state.im.currSessionInfo.msgReceiptTime) {
                    return this.$store.state.im.currSessionInfo.msgReceiptTime < this.msg.time
                } else {
                    return false
                }
            },
            robotInfos() {
                return this.$store.state.robotInfos;
            },
            teamMsgUnRead() {
                var obj =
                    !this.isHistory &&
                    this.msg.needMsgReceipt &&
                    this.msg.flow === "out" &&
                    this.$store.state.teamMsgReads.find(
                        item => item.idServer === this.msg.idServer
                    );
                return obj ? parseInt(obj.unread) : -1;
            },
            msg() {
                let item = Object.assign({}, this.rawMsg);
                // 标记用户，区分聊天室、普通消息
                if (this.type === "session") {
                    if (item.flow === "in") {
                        if (item.type === "robot" && item.content && item.content.msgOut) {
                            // 机器人下行消息
                            let robotAccid = item.content.robotAccid;
                            item.avatar = this.robotInfos[robotAccid].avatar;
                            item.isRobot = true;
                        } else if (item.from !== this.$store.state.userUID) {
                            item.avatar =
                                (this.userInfos[item.from] && this.userInfos[item.from].avatar) ||
                                config.defaultUserIcon;
                            //todo  如果是未加好友的人发了消息，是否能看到名片
                        } else {
                            item.avatar = this.myInfo.avatar;
                        }
                    } else if (item.flow === "out") {
                        item.avatar = this.myInfo.avatar;
                    }
                } else {
                    // 标记时间，聊天室中
                    item.showTime = util.formatDate(item.time);
                }
                if (item.type === "timeTag") {
                    // 标记发送的时间
                    item.showText = item.text;
                } else if (item.type === "text") {
                    // 文本消息
                    if (this.$store.state.im.userInfos[item.from]) {
                        item.nickInTeam = this.$store.state.im.userInfos[
                            item.from
                            ].nickInTeam;
                    }
                    item.showText = util.escape(item.text);
                    if (/\[[^\]]+\]/.test(item.showText)) {
                        let emojiItems = item.showText.match(/\[[^\]]+\]/g);
                        emojiItems.forEach(text => {
                            let emojiCnt = emojiObj.emojiList.emoji;
                            if (emojiCnt[text]) {
                                item.showText = item.showText.replace(
                                    text,
                                    `<img class="emoji-small" width=23 style="vertical-align: middle;" src="${
                                        emojiCnt[text].img
                                        }">`
                                );
                            }
                        });
                    }
                } else if (item.type === "custom") {
                    let content = JSON.parse(item.content);
                    // type 1 为猜拳消息
                    if (content.type === 1) {
                        let data = content.data;
                    } else if (content.type === 3) {
                        let data = content.data;
                        let emojiCnt = "";
                        if (emojiObj.pinupList[data.catalog]) {
                            emojiCnt = emojiObj.pinupList[data.catalog][data.chartlet];
                            // item.showText = `<img class="emoji-big" src="${emojiCnt.img}">`
                            item.type = "custom-type3";
                            item.imgUrl = `${emojiCnt.img}`;
                        }
                    } else if (content.msgType == 1) {
                        item.type = "personal";
                    } else if (content.msgType == 2) {
                        item.type = "business";
                    } else if (content.msgType == 3) {
                        item.type = "vin";
                    }
                    if (content.msgType == 4) {
                        item.type = "order";
                    } else if (content.msgType == 5) {
                        item.type = "quote";
                    } else if (content.msgType == 6) {
                        item.type = "inventory";
                    } else if (content.msgType == 7) {
                        item.type = "realOrder";
                    } else if (content.msgType == 8) {
                        item.type = "pay";
                    } else {
                        item.showText = util.parseCustomMsg(item);
                        if (item.showText !== "[自定义消息]") {
                            item.showText += ",请到手机或电脑客户端查看";
                        }
                    }
                } else if (item.type === "image") {
                    // 原始图片全屏显示
                    item.originLink = item.file.url;
                } else if (item.type === "video") {
                    // ...
                } else if (item.type === "audio") {
                    item.audioSrc = item.file.mp3Url;
                    item.showText = Math.round(item.file.dur / 1000) + '"';
                    this.audioWidth.width = (20 * item.file.dur) / 1000 + "px";
                } else if (item.type === "file") {
                    item.fileLink = item.file.url;
                    item.showText = item.file.name;
                } else if (item.type === "notification") {
                    if (item.scene === "team") {
                        // item.avatar
                        item.showText = util.generateTeamSysmMsg(item);
                    } else {
                        //对于系统通知，更新下用户信息的状态
                        item.showText = util.generateChatroomSysMsg(item);
                    }
                } else if (item.type === "tip") {
                    //对于系统通知，更新下用户信息的状态
                    item.showText = item.tip;
                } else if (item.type === "robot") {
                    let content = item.content || {};
                    let message = content.message || [];
                    if (!content.msgOut) {
                        // 机器人上行消息
                        item.robotFlow = "out";
                        item.showText = item.text;
                    } else if (content.flag === "bot") {
                        item.subType = "bot";
                        message = message.map(item => {
                            if (item.type === "template") {
                                // 在vuex(store/actions/msgs.js)中已调用sdk方法做了转换
                                return item.content.json;
                            } else if (item.type === "text" || item.type === "answer") {
                                // 保持跟template结构一致
                                return [
                                    {
                                        type: "text",
                                        text: item.content
                                    }
                                ];
                            } else if (item.type === "image") {
                                // 保持跟template结构一致
                                return [
                                    {
                                        type: "image",
                                        url: item.content
                                    }
                                ];
                            }
                        });
                        item.message = message;
                    } else if (item.content.flag === "faq") {
                        item.subType = "faq";
                        item.query = message.query;
                        let match = message.match.sort((a, b) => {
                            // 返回最匹配的答案
                            return b.score - a.score;
                        });
                        item.message = match[0];
                    }
                } else {
                    item.showText = `[${util.mapMsgType(item)}],请到手机或电脑客户端查看`;
                }
                item.avatar =
                    item.avatar === ""
                        ? "https://cdn.xindongpeixun.com/oss/20181017/d871a7d7268644b8b7f47d3a4fb8ad32.png"
                        : item.avatar;
                return item;
            }
        },
        mounted() {
            let item = this.msg;
            // 有时序问题的操作
            this.$nextTick(() => {
                let media = null;
                if (item.type === "image") {
                    // 图片消息缩略图
                    media = new Image();
                    media.src = item.file.url;
                    media.style.height = 100 + "px";
                    media.style.verticalAlign = "bottom";
                    media.style.borderRadius = "4px";
                    media.style.border = "1px solid #ccc";
                } else if (item.type === "custom-type1") {
                    // 猜拳消息
                    media = new Image();
                    media.className = "emoji-middle";
                    media.src = item.imgUrl;
                } else if (item.type === "custom-type3") {
                    // 贴图表情
                    media = new Image();
                    media.className = "emoji-big";
                    media.src = item.imgUrl;
                } else if (item.type === "video") {
                    if (/(mov|mp4|ogg|webm|video)/i.test(item.file.ext)) {
                        media = document.createElement("img");
                        media.src = item.file.url.split("?")[0] + "?vframe";
                        media.style.width = "100%";
                        media.style.height = "auto";
                        media.style.verticalAlign = "middle";
                        media.autoStart = false;
                        media.preload = "metadata";
                        media.style.borderRadius = "4px";
                        media.style.border = "1px solid #ccc";
                        // media.controls = "controls";
                    } else {
                        let aLink = document.createElement("a");
                        aLink.href = item.file.url;
                        aLink.target = "_blank";
                        aLink.innerHTML = `<i class="el-icon-document"></i>${item.file.name}`;
                        this.$refs.mediaMsg.appendChild(aLink);
                    }
                } else if (["personal","business","pay","vin","order", "quote","inventory","realOrder"].includes(item.type)) {
                    //自定义名片消息
                    item = this.conversionJSON(item);
                    this.$nextTick(() => {
                        if (this.$refs.mediaMsg) {
                            this.$refs.mediaMsg.innerHTML = this.professionalBrand(item.content);
                        }
                    });
                }
                if (media) {
                    if (this.$refs.mediaMsg) {
                        this.$refs.mediaMsg.appendChild(media);
                    }
                    media.addEventListener('load', this.load);
                    media.addEventListener('error', this.error);
                } else {
                    this.$emit("msg-loaded");
                }
            }); // end this.nextTick
        },
        methods: {
            load(e) {
                this.loading = false;
                this.$emit("msg-loaded");
                e.target.removeEventListener('load', this.load);
            },
            error(e) {
                this.$emit("msg-loaded");
                e.target.removeEventListener('load', this.error);
            },
            quote() {
                let id = this.$store.state.user.userInfos.userId;
                if (typeof this.msg.content == 'string')
                    this.msg.content = JSON.parse(this.msg.content);
                if (typeof this.msg.content.msgContent == "string")
                    this.msg.content.msgContent = JSON.parse(this.msg.content.msgContent);
                if (id == this.msg.content.msgContent.sellerId) {
                    this.$emit('quote', this.msg.content.msgContent)
                } else if (id == this.msg.content.msgContent.buyerId) {
                    //暂不处理
                } else
                    this.$message.error('当前报价单不是你的')
            },
            orderClick(val) {
                //判断是否是能查看
                this.conversionJSON(this.msg)
                this.$emit(val, this.msg.content.msgContent)
            },
            dayin(vin) {
                if (typeof vin == "string") {
                    var content = JSON.parse(vin);
                    return JSON.parse(content.msgContent);
                } else {
                    return vin.msgContent;
                }
            },
            backfalse() {
                return false;
            },
            //创建个人名片
            professionalBrand(item) {
                return customMsg(item, this.$store.state, this.msg.flow);
            },
            getUrl(el) {
                var str = el.currentTarget.children[1].src;
                var arr = str.split("?vframe")[0];
                this.$emit("pushURL", {url: arr, blean: true});
            },
            sendRobotBlockMsg(msg, originMsg) {
                if (this.isHistory) {
                    // 在历史消息中，不进行机器人交互
                    return;
                }
                let body = "[复杂按钮模板触发消息]";
                if (msg.text && msg.text.length === 1) {
                    body = msg.text[0].text;
                }
                let robotAccid = originMsg.content.robotAccid;
                if (!this.isRobot) {
                    body = `@${this.robotInfos[robotAccid].nick} ${body}`;
                }
                if (this.type === "session") {
                    this.$store.dispatch("sendRobotMsg", {
                        type: "link",
                        scene: originMsg.scene,
                        to: originMsg.to,
                        robotAccid,
                        // 机器人后台消息
                        params: msg.params,
                        target: msg.target,
                        // 显示的文本消息
                        body
                    });
                } else if (this.type === "chatroom") {
                    this.$store.dispatch("sendChatroomRobotMsg", {
                        type: "link",
                        robotAccid,
                        // 机器人后台消息
                        params: msg.params,
                        target: msg.target,
                        // 显示的文本消息
                        body
                    });
                }
            },
            continueRobotMsg(robotAccid) {
                this.$store.dispatch("continueRobotMsg", robotAccid);
            },
            showFullImg(src, el) {
                let arr = [];
                this.$store.state.im.currSessionMsgs.forEach(item => {
                    if (item.type == "image") {
                        arr.push(item.file.url);
                    }
                });
                ipcRenderer.send("picLooker", {pic: arr, index: arr.indexOf(src)});
            },
            playAudio(src) {
                if (!this.currentAudio) {
                    this.$emit('newAudio', {
                        id: this.msg.idClient,
                        src: src,
                        do: 'play'
                    })
                    this.currentAudio = 1;
                    this.currImage = false;
                } else {
                    this.currentAudio = '';
                    this.$emit('newAudio', {
                        id: this.msg.idClient,
                        src: src,
                        do: 'pause'
                    })
                    this.currImage = true;
                }
            },
            paste() {
                if (this.msgTypeState == "text") {
                    clipboard.readText(this.textMsg);
                } else if (this.msgTypeState == "image" && this.imgUrl !== "") {
                    console.log("img");
                } else {
                    console.log("paste");
                }
            },
            conversionJSON(msg) {
                if (typeof msg.content == "string") {
                    msg.content = JSON.parse(msg.content);
                    if (typeof msg.content.msgContent == "string") {
                        msg.content.msgContent = JSON.parse(msg.content.msgContent);
                    }
                }
                return msg;
            },
            openUserDetail(msg) {
                Bus.$emit("openimage", msg);
            },
            copyImage() {
                div.contentEditable = "true";
                var controlRange;
                if (document.body.createControlRange) {
                    controlRange = document.body.createControlRange();
                    controlRange.addElement(div);
                    controlRange.execCommand("Copy");
                }
                div.contentEditable = "false";
            }
        },
        watch: {
            isbg(val) {
                val == true ? null : (this.bg = false);
            },
            curAudioInfo(val) {
                if (val.src != this.msg.audioSrc) {
                    this.currImage = true;
                    this.currentAudio = '';
                } else if (val.do != 'play') {
                    this.currImage = true;
                }
            },
            'curAudioInfo.do'(val) {
                if (val == 'end') {
                    this.currImage = true;
                    this.currentAudio = '';
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    @mixin tip {
        display: inline-block;
        background-color: #dadada;
        padding: 3px;
        border-radius: 4px;
        color: #fff;
    }

    .clearfix {
        position: relative;
    }

    .msg-text .emoji-small {
        width: 23px;
        vertical-align: middle;
    }

    .leftLeave {
        padding-left: 40px !important;
    }

    .isRead {
        position: absolute;
        left: -30px;
        bottom: 0;
        width: 27px;
        height: 12px;
        color: #ccc;
        font-size: 12px;
    }

    .u-msg {
        padding: 10px 10px 10px 20px;
        position: relative;
        overflow: hidden;
        .el-checkbox {
            position: absolute;
            width: 100%;
            height: 100%;
        }

        .timeTag,
        .notification {
            font-size: 12px;
            margin: 10px 0;
            float: inherit;
            text-align: center;
            max-width: 100%;
            p {
                @include tip;
            }
        }
        .notification {
            p {
                max-width: 80%;
                color: #999999;
                background: transparent;
            }
        }
        .audioBox {
            max-width: 200px !important;
            min-width: 60px;
            div {
                line-height: 24px;
            }
            .audioImage {
                width: 24px;
                height: 24px;
                border: none;
                img {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
            }
        }
    }

    label {
        .item-tip {
            text-align: center;
            div {
                float: initial;
            }
            .tip {
                @include tip;
                max-width: 100%;
                font-size: 12px;
            }
        }
    }

    .msg-video {
        width: 220px;
        position: relative;
        overflow: hidden;
        img {
            border: 0 !important;
            display: inline-block;
            z-index: 5;
            position: absolute;
            top: 50%;
            margin-top: -22px;
            left: 50%;
            margin-left: -22px;
            border: 0;
        }
    }

    .msg-file {
        width: 295px;
        height: 66px;
    }

    @mixin radiaus {
        border-radius: 4px;
        cursor: pointer;
    }

    .item-me > div {
        float: right;
        text-align: right;
        max-width: 80%;
        img {
            width: 44px;
            height: 44px;
            border: 1px solid #e5e5e5;
            @include radiaus;
        }
        .msg-head {
            float: right;
            position: relative;
            .isTeam {
                top: 35px !important;
            }
            .triangleBox {
                width: 0;
                height: 0;
                border-width: 6px 6px 0;
                border-style: solid;
                border-color: #e1e1e1 transparent transparent;
                position: absolute;
                left: -15px;
                top: 10px;
                transform: rotate(-90deg);
                z-index: 5;
                span.triangle {
                    display: block;
                    width: 0;
                    height: 0;
                    border-width: 7px 6px 0;
                    border-style: solid;
                    border-color: #ff6749 transparent transparent;
                    /*黄 透明 透明 */
                    position: absolute;
                    top: -8px;
                    left: -6px;
                }
            }
        }
        .nickInTeam {
            text-align: right;
            padding-right: 12px;
        }
        .msg-text {
            max-width: 100%;
            display: inline-block;
            font-size: 14px;
            border: 1px solid #e1e1e1;
            padding: 9px 4px;
            margin-right: 12px;
            word-wrap: break-word;
            background-color: #ff6749;
            text-align: left;
            color: #fff;
            @include radiaus;
            text-indent: 0.1em;
            letter-spacing: 0.07em;
        }
        .msg-pics,
        .msg-video {
            margin-right: 13px;
        }
    }

    .nickInTeam {
        font-size: 14px;
        color: #999;
        line-height: 18px;
        margin-bottom: 4px;
    }

    .item-you > div {
        float: left;
        margin-top: 10px;
        max-width: 80%;
        img {
            width: 44px;
            height: 44px;
            border: 1px solid #e5e5e5;
            @include radiaus;
        }
        .msg-head {
            float: left;
            position: relative;
            .isTeam {
                top: 35px !important;
            }
            .triangleBox {
                width: 0;
                height: 0;
                border-width: 6px 6px 0;
                border-style: solid;
                border-color: #e1e1e1 transparent transparent;
                position: absolute;
                right: -15px;
                top: 10px;
                transform: rotate(90deg);
                span.triangle {
                    display: block;
                    width: 0;
                    height: 0;
                    border-width: 7px 6px 0;
                    border-style: solid;
                    border-color: white transparent transparent;
                    position: absolute;
                    top: -8px;
                    left: -6px;
                }
            }
        }
        .nickInTeam {
            text-indent: 12px;
        }
        .msg-text {
            display: inline-block;
            font-size: 14px;
            background: #fff;
            border: 1px solid #e1e1e1;
            @include radiaus;
            padding: 9px 8px;
            margin-left: 12px;
            word-wrap: break-word;
            line-height: 20px;
            max-width: 100%;
            text-indent: 0.1em;
            letter-spacing: 0.07em;
        }
        .msg-pics,
        .msg-video {
            margin-left: 13px;
        }
    }

    .item-time {
        width: 100%;
        text-align: center;
    }

    .team-tip {
        width: 100%;
        text-align: center;
    }

    .bg {
        background: #e0e0e0;
    }
</style>
<style lang="scss">
    .u-msg {
        .el-checkbox__input {
            left: -30px;
            top: 20px;
        }
        .el-checkbox__inner {
            width: 18px;
            height: 18px;
        }
    }

    .u-msg .el-checkbox__inner::after {
        left: 6px;
        top: 2px;
        height: 8px;
    }

    @mixin lessWord {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    @mixin fl {
        display: flex;
        align-items: center;
    }

    .u-msg {
        .personal,
        .business, .order, .realOrder, .quote, .inventory, .pay {
            width: 280px;
            height: 136px;
            padding: 0 15px !important;
            color: #666 !important;
            background: #fff !important;
            .top {
                display: flex;
                margin: 15px 0 15px 0;
                overflow: hidden;
                div {
                    width: 60%;
                    text-align: left;
                }
                img {
                    width: 60px;
                    height: 60px;
                    border-radius: 5px;
                    margin-right: 10px;
                }
                h6 {
                    font-size: 16px;
                    line-height: 28px;
                    color: #000;
                    @include lessWord;
                    margin-bottom: 10px;
                }
                p {
                    font-size: 12px;
                    line-height: 24px;
                    border: 0;
                    @include lessWord;
                }
            }
            p {
                font-size: 14px;
                line-height: 35px;
                border-top: 1px solid #e6e6e6;
                @include lessWord;

                text-align: left;
            }
        }
        .pay {
            padding: 0 !important;
            height: auto;
            .content {
                height: 97px;
                background: #F89C49;
                color: #fff;
                .left {
                    padding: 10px;
                }
                .right {
                    div {
                        line-height: 30px;
                    }
                    p {
                        border: 0;
                        line-height: 20px;
                    }
                }
            }
            footer {
                height: 32px;
                line-height: 32px;
                color: #999;
                text-indent: 15px;
            }
        }
        .inventory {
            height: auto;
            h6 {
                padding-top: 10px;
                color: #000;
                font-size: 16px;
            }
            .content {
                align-items: end;
                .left {
                    padding: 10px;
                }
                .right {
                    width: calc(100% - 70px);
                    p {
                        border: 0;
                        margin: 0;
                        line-height: normal;
                    }
                    p:first-child {
                        padding: 12px 0;
                        color: #000;
                        @include lessWord;
                    }
                }
            }
            footer {
                @include fl;
                justify-content: space-between;
                border-top: 1px solid #ccc;
                p {
                    color: #000;
                    border: 0;
                }
            }
        }
        .content {
            @include fl;
        }
        .quote {
            height: auto;
            .content {
                .left {
                    padding: 10px;
                }
                .right {
                    h6 {
                        padding-top: 5px;
                        color: #000;
                        font-size: 16px;
                        line-height: 34px;
                    }
                    div {
                        line-height: 20px;
                        font-size: 14px;
                        word-break: break-word;
                    }
                }
            }
            footer {
                padding: 14px 0;
                text-align: right;
            }
        }
        .realOrder {
            width: 323px !important;
            color: #000 !important;
            width: auto;
            height: auto;
            h6 {
                font-size: 16px;
                line-height: 30px;
                padding-top: 10px;
            }
            .content {
                .left {
                    padding: 0 10px 10px 10px;
                }
                .right {
                    width: calc(100% - 102px);
                    div {
                        border: 0;
                        font-size: 14px;
                        font-weight: bold;
                    }
                    p {
                        border-top: 0;
                        color: #999999;
                    }
                }
            }
            footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 10px;
                span {
                    color: #f00;
                }
            }
        }
        .look {
            padding: 5px 8px;
            font-size: 12px;
            border: 0;
            color: #fff;
            outline: 0;
            width: 64px;
            height: 22px;
            background: linear-gradient(90deg, rgba(240, 155, 68, 1), rgba(248, 107, 45, 1));
            border-radius: 11px;
        }
        .order {
            > span {
                display: inline-block;
                line-height: 35px;
                color: black;
            }
            .pic {
                display: inline-block;
                width: 100%;
                @include lessWord;
            }
            p {
                position: relative;
                > a {
                    line-height: 30px;
                    color: #ff6749;
                    font-size: 12px !important;
                }
                span {
                    position: absolute;
                    right: 0;
                    line-height: 33px;
                    font-size: 20px;
                }
            }
            h6 {
                line-height: 30px !important;
                margin-bottom: 0 !important;
                font-size: 14px !important;
            }
            .top {
                margin: 0 0 10px 0;
                img {
                    width: 50px;
                    height: 50px;
                }
            }
            .busi {
                width: calc(100% - 60px) !important;
            }
        }
        .business {
            height: 144px;
            .top {
                margin: 12px 0 0 0;
                h6 {
                    line-height: 20px;
                    margin: 0;
                }
            }
            .busi {
                width: 72%;
            }
            .adress {
                font-size: 12px;
                @include lessWord;
                border: 0 none !important;
                img {
                    vertical-align: middle;
                    width: 14px;
                    height: 16px;
                }
            }
            .pic {
                height: 18px;
                img {
                    width: 18px;
                    height: 18px;
                    margin-right: 8px;
                }
            }
        }

        .transform180 {
            transform: rotate(-180deg);
        }

        .vin {
            height: 134px;
            line-height: 20px;
            .top {
                margin: 20px 0 12px 0;
            }
        }
    }
</style>
