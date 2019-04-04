<template>
    <div class="menu-wrapper" ref="ad">
        <!-- 如果路由hidden为false,并且children有值 -->
        <template v-for="item in routes" v-if="!item.hidden&&item.children&&getShow(item)">
            <!-- item.alwaysShow -->
            <router-link
                    v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow"
                    :to="item.path+'/'+item.children[0].path"
                    :key="item.children[0].name"
            >
                <el-menu-item
                        :index="item.path"
                        :class="{'submenu-title-noDropdown':!isNest}"
                        @dblclick.native="changVuex(item)"
                >
                    <svg-icon
                            v-if="item.children[0].meta&&item.children[0].meta.icon"
                            :icon-class="item.children[0].meta.icon"
                            class="svgico"
                    ></svg-icon>
                    <span
                            v-if="item.children[0].meta&&item.children[0].meta.title"
                            slot="title"
                    >{{item.children[0].meta.title}}</span>
                    <el-badge
                            class="mark"
                            :value="newMsg"
                            :max="99"
                            :hidden="newMsg <=0"
                            v-if="item.children[0].meta.title=='消息'&&newMsg!=0"
                    />
                    <el-badge
                            class="mark"
                            :value="newFriendSysMsg"
                            :max="99"
                            :hidden="newFriendSysMsg <=0"
                            v-if="item.children[0].meta.title=='通讯录'&& newFriendSysMsg!=0"
                    />
                    <el-badge
                            class="mark"
                            :value="newSysMsg"
                            :max="99"
                            :hidden="newSysMsg <=0"
                            v-if="item.children[0].meta.title=='通知'&& newSysMsg!=0"
                    />
                </el-menu-item>
            </router-link>

            <el-submenu v-else :index="item.name||item.path" :key="item.name">
                <template slot="title">
                    <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
                    <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
                </template>

                <template v-for="child in item.children" v-if="!child.hidden">
                    <sidebar-item
                            :is-nest="true"
                            class="nest-menu"
                            v-if="child.children&&child.children.length>0"
                            :routes="[child]"
                            :key="child.path"
                    ></sidebar-item>
                    <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
                        <el-menu-item :index="item.path+'/'+child.path">
                            <div>
                                <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
                                <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
                            </div>
                        </el-menu-item>
                    </router-link>
                </template>
            </el-submenu>
        </template>
    </div>
</template>

<script>
    import {ipcRenderer} from "electron";

    const path = require("path");
    import {getMyEnquiryDetail} from "@/api/quote/quote.js";
    import {getSysUnred} from "@/api/im/user.js";
    import {refreshActive} from "@/api/accessories/index.js";
    import {clearInterval} from 'timers';
    import {setSysUnread, setSysAllUnread} from "@/api/im/user.js";
    const remote = require('electron').remote;
    const WindowsToaster = require("node-notifier").WindowsToaster;
    const os = require("os");
    const fs = require("fs");
    export default {
        name: "SidebarItem",
        props: {
            routes: {
                type: Array,
                default: []
            },
            isNest: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                audio:null
            };
        },
        methods: {
            getShow(item) {
                if (item.children[0].meta.title == '汽配门店') {
                    return this.storeInformation != '配件商'
                } else if (item.children[0].meta.title == '我的报价单') {
                    return this.storeInformation == '配件商'
                }else {
                    return true
                }
            },
            changVuex(item) {
                if (item.path.indexOf("/message") > -1) {
                    let flag = !this.$store.state.user.dbclick;
                    this.$store.commit("SET_DBCLICK", flag);
                }
            },
            // 是否显示侧边栏的bar
            hasOneShowingChildren(children) {
                const showingChildren = children.filter(item => {
                    return !item.hidden;
                });
                if (showingChildren.length === 1) {
                    return true;
                }
                return false;
            },
            reset(flag) {
                flag ? (this.newMsg = 0) : null;
            },
            playAudio(){
                ipcRenderer.send('receiveMsg')
                //音频处理
                const AC = new window.AudioContext();
                //线上地址
                const buf = fs.readFileSync(path.join(__static,'./audio/dilidili.mp3'));
                const uint8Buffer = Uint8Array.from(buf);
                let bs;
                // 音频解码
                AC.decodeAudioData(uint8Buffer.buffer)
                    .then(audioBuf => {
                        bs = AC.createBufferSource();
                        bs.buffer = audioBuf;
                        let gainNode = AC.createGain();
                        bs.connect(gainNode)
                        gainNode.connect(AC.destination)
                        gainNode.gain.value = 0.3;
                        bs.start()
                    });
            },
            makeNotice(obj, boo) {
                if(boo){
                    this.playAudio();
                }
                let that = this;
                if (os.release().split(".")[0] > 7) {
                    var notifier = new WindowsToaster({
                        withFallback: false,
                        customPath: void 0
                    });
                    notifier.notify({
                        title: obj.content.title,
                        message: obj.content.body || obj.content.content,
                        icon: path.join(__dirname,"../../../../../../static/image/xdpx.png"),
                        sound: false,
                        wait: true,
                        id: obj.content.newsId || obj.content.enquiryId,
                        appID: "xdpx"
                    });
                    notifier.on("click", (notifierObject, options) => {
                        that.customSysMsgs.map(v => {
                            if ((v.content.enquiryId || obj.content.newsId) == options.id) {
                                that.clickNotice(v);
                            }
                        });
                    });
                } else {
                    if (Notification.permission == "granted") {
                        let myNotification = new Notification(obj.content.title, {
                            body: obj.content.body || obj.content.content,
                            icon:
                                "http://testcdn.xindongpeixun.com/oss/20181212/4a568a0d8a5a49799df0ddb1690eeebb.png",
                            silent: true,
                            sound: boo ? path.join(
                                __dirname,
                                "./../../../../../../static/audio/dilidili.mp3"
                            ) : ath.join(
                                __dirname,
                                "./../../../../../../static/audio/1.mp3"
                            )
                        });
                        myNotification.onclick = () => {
                            that.clickNotice(obj);
                            myNotification.close();
                        };
                    }
                }
            },
            clickNotice(type) {
                remote.getCurrentWindow().isVisible() ? remote.getCurrentWindow().show() : remote.getCurrentWindow().focus()
                if (type.content.classify == "QUOTE") {
                    // this.$router.push("/shopcar/index");
                    this.$message.error("请在手机APP查看");
                } else if (type.content.classify == "ENQUIRY") {
                    this.$router.push({
                        path: "/quote/details",
                        query: {
                            id: type.content.enquiryId
                        }
                    });
                } else if (type.content.classify.indexOf("AUTH") != -1) {
                    this.$router.push("/admission/index");
                } else {
                    this.$router.push("/news/" + type.content.newsId);
                }
                setSysAllUnread().then(res => {
                    this.$store.state.im.customSysMsgUnread = 0;
                    this.$store.state.im.customSysMsgs = [];
                    this.$store.dispatch("resetSysMsgs", {type: 1});
                })
            }
        },
        computed: {
            storeInformation() {
                return this.$store.state.user.storeInformation.identityParentName
            },
            customSysMsgs() {
                return this.$store.state.im.customSysMsgs;
            },
            newSysMsg: {
                get() {
                    return this.$store.state.im.customSysMsgUnread;
                },
                set(a) {
                    return a;
                }
            },
            newFriendSysMsg: {
                get() {
                    var sysmsg = 0;
                    let arr = this.$store.state.im.sysMsgs.filter(v => {
                        return v.type == 'applyFriend'
                    });
                    if (arr.length > 0) {
                        sysmsg += arr.length;
                    }
                    return sysmsg;
                },
                set(a) {
                    return a;
                }
            },
            newMsg: {
                get() {
                    var msg = 0;
                    this.$store.state.im.sessionlist.map(item => {
                        if (
                            item.scene == "team" &&
                            this.$store.state.im.muteList[item.to] != 1
                        ) {
                            msg += item.unread;
                        } else if (item.scene == "p2p") {
                            msg += item.unread;
                        }
                    });
                    return msg;
                },
                set(a) {
                    return a;
                }
            }
        },
        watch: {
            newSysMsg(newVal, oldVal) {
                let that = this;
                let length = this.$store.state.im.customSysMsgs.length;
                if (length > 0&&newVal>oldVal) {
                    let obj = this.$store.state.im.customSysMsgs[length - 1];
                    const h = this.$createElement;
                    //此处用于屏蔽报价，功能暂无
                    if (obj.content.classify == 'QUOTE') {
                        setSysUnread({id: newVal.id}).then(res => {
                            --this.$store.state.im.customSysMsgUnread
                        })
                        return
                    }
                    if (obj.content.classify.indexOf("ENQUIRY") != -1) {
                        getMyEnquiryDetail({enquiryId: obj.content.enquiryId}).then(
                            result => {
                                obj.content.body = result.data.vehicleBrand + " ";
                                if (result.data.partList != null && result.data.partList.length > 0) {
                                    result.data.partList.map(v => {
                                        obj.content.body += v.subName + " ";
                                    });
                                }
                                this.$notify({
                                    title: obj.content.title,
                                    message: h(
                                        "i",
                                        {style: "color: red;font-size:12px"},
                                        obj.content.body
                                    ),
                                    duration: 4000,
                                    onClick() {
                                        that.clickNotice(obj);
                                    }
                                });
                                this.makeNotice(obj, true);
                            }
                        );
                    } else if (
                        obj.content.classify == "SYS_NEWS" ||
                        obj.content.classify.indexOf("AUTH") != -1
                    ) {
                        this.$notify({
                            title: obj.content.title,
                            message: h(
                                "i",
                                {style: "color: red;font-size:12px"},
                                obj.content.content
                            ),
                            duration: 4000,
                            onClick() {
                                that.clickNotice(obj);
                            }
                        });
                        this.makeNotice(obj, false);
                    }
                }
            },
            newMsg(newVal, oleVal) {
                if (newVal > oleVal) {
                    if (newVal > 0) {
                        ipcRenderer.send("triggerAudio");
                        ipcRenderer.send("isTwinkle", true);
                        ipcRenderer.once("sendState", function (event, data) {
                            if (data) {
                                ipcRenderer.send("receiveMsg");
                            }
                        });
                    }
                }else{
                    ipcRenderer.send("cancal");
                }
            }
        },
        mounted() {
            this.$store.state.im.customSysMsgs = [];
            let time = setInterval(() => {
                refreshActive().then(res => {
                    clearInterval(time)
                })
            }, 180000)
        }
    };
</script>

<style socped>
    .menu-wrapper {
        -moz-user-select: -moz-none;
        -moz-user-select: none;
        -o-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .el-menu {
        position: initial !important;
    }

    .menu-wrapper .el-menu-item {
        position: relative;
        background-color: black !important;
    }

    .menu-wrapper .el-menu-item .el-badge {
        position: absolute;
        right: 29px;
        top: 5px;
    }

    .menu-wrapper a {
        border-top: 1px solid #222;
    }

    .menu-wrapper a:nth-last-child(2) {
        border-bottom: 1px solid #222;
    }

    .menu-wrapper a:last-child {
        position: absolute;
        bottom: 50px;
        left: 0;
        border-top: 0;
    }
</style>


<style>
    .el-notification:before {
        content: url("http://testcdn.xindongpeixun.com/oss/20181212/4a568a0d8a5a49799df0ddb1690eeebb.png");
        width: 50px;
        height: 50px;
        padding-top: 4px;
    }

    .el-notification__content img {
        width: 50px;
        height: 50px;
    }

    .el-notification__content:after {
        content: "www.zjxdpx.com";
        display: block;
        font-size: 13px;
        color: #aaa;
    }

    .menu-wrapper .svgico {
        /* width:20px;
        height:20px; */
        padding-top: 10px;
    }

    .el-badge__content {
        background: red;
        border-radius: 100%;
    }
</style>

