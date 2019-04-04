<template>
    <div class="chatEditor">
        <div class="bottom">
            <div class="bottom-fun">
                <ul>
                    <li>
                        <div>
                            <el-tooltip class="item" effect="light" content="发送表情" placement="bottom-start">
                                <img src="@/../../static/image/biaoqing.png" alt="表情图片" @click.stop="showEmoji">
                            </el-tooltip>
                        </div>
                        <transition name="fade">
                            <div class="boxShow">
                                <Emojies
                                        :type="type"
                                        :scene="scene"
                                        :to="to"
                                        v-show="isEmojiShown"
                                        @add-emoji="addEmoji"
                                        @hide-emoji="hideEmoji"
                                        @blur="hideEmoji"
                                ></Emojies>
                            </div>
                        </transition>
                    </li>
                    <li>
                        <label>
                            <el-tooltip class="item" effect="light" content="发送图片" placement="bottom-start">
                                <img src="@/../../static/image/tupian.png" alt>
                            </el-tooltip>
                            <input
                                    type="file"
                                    ref="openFile"
                                    id="file"
                                    @change="openFile"
                                    name="openFile"
                                    multiple="multiple"
                            >
                        </label>
                    </li>
                    <li @click="sendMyCard">
                        <el-tooltip class="item" effect="light" content="发送个人名片" placement="bottom-start">
                            <img src="@/../../static/image/mingpian.png" alt class="myCard">
                        </el-tooltip>
                    </li>
                    <li @click="newOrder" v-if="showOrderOrPayNow">
                        <el-tooltip class="item" effect="light" content="生成订单" placement="bottom-start">
                            <img src="@/../../static/image/doc.png" alt class="myCard">
                        </el-tooltip>
                    </li>
                    <!--//清单-->
                    <!--<li @click="$emit('seller')" class="item-li" v-if="showOrderOrPayNow">-->
                    <!--<el-tooltip class="item" effect="light" content="发送清单" placement="bottom-start">-->
                    <!--<img src="@/../../static/image/inventory.png" width="24" alt="">-->
                    <!--</el-tooltip>-->
                    <!--</li>-->
                    <li @click="pay=true" class="item-li" v-if="showOrderOrPayNow">
                        <el-tooltip class="item" effect="light" content="立即付款" placement="bottom-start">
                            <img src="@/../../static/image/payNow.png" width="24" alt="">
                        </el-tooltip>
                    </li>
                    <!-- <li>
                                          <vueCropper
                                            ref="cropper"
                                            :img="option.img"
                                            :outputType="option.outputType"
                                            :canScale="true"
                                            :autoCrop="true"
                                            :autoCropWidth="130"
                                            :autoCropHeight="130"
                                            :fixedBox="true"
                                            :canMove="true"
                                            :canMoveBox="false"
                                            ></vueCropper>
                                            <el-tooltip class="item" effect="light" content="截图" placement="bottom-start">
                                              <img @click="screenshot" src="@/../../static/image/sendbuy.png" alt="">
                                            </el-tooltip>
                    </li>-->
                    <!-- <li @click="paymentData.show=true" class="item-li">
                                            <el-tooltip class="item" effect="light" content="发送求购" placement="bottom-start">
                                              <img src="@/../../static/image/sendbuy.png" alt="">
                                            </el-tooltip>
                                        </li>
                                        <li class="item-li" >
                                            <el-tooltip class="item" effect="light" content="开单收款" placement="bottom-start">
                                              <img src="@/../../static/image/receipt.png" alt="">
                                            </el-tooltip>
                                        </li>
                                        <li @click="partsData.show=true" class="item-li">
                                            <el-tooltip class="item" effect="light" content="发送车型" placement="bottom-start">
                                              <img src="@/../../static/image/sendcartype.png" alt="" >
                                            </el-tooltip>
                    </li>-->
                </ul>
                <div class="clearfix">
                    <img
                            v-if="$store.state.im.currSessionId==null||$store.state.im.currSessionId.includes('p2p')"
                            class="b-f-img"
                            src="@/../../static/image/adduser.png"
                            alt
                            @click="chatAddFriends"
                    >
                    <span style="font-size:16px;color:#aaa">按</span>
                    <el-button size="mini" class="enter" @click="submit">Enter 发送</el-button>
                </div>
            </div>

            <div class="bottom-input" v-contextmenu:contextmenuTextArea @contextmenu="curClear">
                <v-contextmenu ref="contextmenuTextArea" class="contextmenuTextArea">
                    <v-contextmenu-item @click="copy" v-if="copyShow">复制</v-contextmenu-item>
                    <v-contextmenu-item @click="paste" v-else>粘贴</v-contextmenu-item>
                </v-contextmenu>
                <quill-editor
                        class="textarea"
                        name="file"
                        id="files"
                        v-model="value"
                        ref="area"
                        :options="editorOption"
                        @keyup.enter.native.exact="submit"
                        @keyup.13.shift.native="dr"
                        @keydown.45.native.prevent.stop="preventInsert"
                        @focus="editBlur"
                        @click.native="foucsIt"
                        @change="textChange"
                ></quill-editor>
            </div>
        </div>
        <payNow v-if="pay" :pay-now="true" v-model="pay" @detailInfo="getDetail"></payNow>
        <el-dialog
                width="450px"
                height="533px"
                center
                :modal-append-to-body="false"
                :visible.sync="choosePay"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :append-to-body="false"
                top="8%"
                :before-close="handleClose"
                @close="close"
                custom-class="payCode">
            <h5 slot="title">已生成订单，请尽快支付</h5>
            <choosePay v-if="choosePay" @start="training" @stop="close(1)" v-model="choosePay" :address="null" :del="detailInfo"></choosePay>
        </el-dialog>
        <pay-finish v-if="payFinish" :pay-now="true" v-model="payFinish" :detail="detailInfo"></pay-finish>
        <div class="sendCustomMsg" v-if="customMsg">
            <i class="el-icon-close" @click.stop.prevent="clearLocal"></i>
            <div class="content">
                <div class="left">
                    <img :src="customMsg.content.msgContent.brandLogo" width="50" alt="">
                </div>
                <div class="right">
                    <h6>采购 {{customMsg.content.msgContent.brandName}}</h6>
                    <div class="parts">{{customMsg.content.msgContent.partName}}</div>
                </div>
            </div>
            <footer>
                <el-button @click="send">发送</el-button>
            </footer>
        </div>
    </div>
</template>

<script>
    import {training} from '@/api/myorder/index';
    import {getBase64, getLocalBase64} from "@/api/im/baseMethod";
    import {quilleditor, Quill} from "vue-quill-editor";
    import Emojies from "@/components/ChatEmoji2.vue";
    import Bus from "@/utils/bus.js";
    import {nativeImage} from "electron";
    import {getUserIdOrAccid} from '@/utils/index';
    import payNow from './enterMoney';
    import choosePay from '@/components/pay/choosePay';
    import {getLocal,setLocal} from "../../utils/localstorage";
    import payFinish from './paySunncess';

    const {clipboard, ipcRenderer} = require("electron");
    export default {
        components: {
            payNow,
            Emojies,
            quilleditor,
            choosePay,
            payFinish
            // VueCropper
        },
        props: {
            type: String,
            scene: String,
            to: String
        },
        data() {
            return {
                aitObj: [],
                noticeAit: [],
                editorOption: {
                    placeholder: "",
                    modules: {
                        toolbar: ["image", "video"]
                    }
                },
                customMsg:null,
                pay: false,
                detailInfo: null,
                imgSrc: "",
                isEmojiShown: false,
                value: "",
                file: [],
                accept: "",
                content: "",
                copyShow: false,
                choosePay: false,
                payFinish: false
            };
        },
        computed: {
            //富文本实例
            quill: {
                get() {
                    return this.$refs.area.quill;
                },
                set(a) {
                    return a;
                }
            },
            showOrderOrPayNow() {
                return (this.$store.state.im.currSessionId || '').includes('p2p')
            },
            cursession(){
                return this.$store.state.im.currSessionId
            }
        },
        methods: {
            clearLocal() {
                setLocal('readyCustom', null);
                this.customMsg=null;
            },
            send() {
                this.customMsg.content.msgContent = JSON.stringify(this.customMsg.content.msgContent);
                this.$store.dispatch('sendMsg', this.customMsg)
                setLocal('readyCustom', null);
                this.customMsg=null;
            },
            handleClose(done) {
                this.$confirm('确定关闭付款页面吗?')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
            close(val) {
                clearTimeout(this.timer);
                if(!val){
                    !this.payFinish && this.$message.error('若支付成功，请前往订单查看');
                }
            },
            training() {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    training({tradeNo: this.detailInfo.tradeNo})
                        .then(res => {
                            if (res.data.payTime) {
                                this.choosePay = false;
                                this.detailInfo = res.data;
                                this.payFinish = true;
                                clearTimeout(this.timer);
                                this.sendMsg();
                            }else
                                this.training();
                        })
                }, 1500)
            },
            sendMsg() {
                this.$store.dispatch("sendMsg", {
                    scene: 'p2p',
                    to: this.$store.state.im.currSessionId.substring(4),
                    type: "custom",
                    content: {
                        msgType: 8,
                        msgContent: JSON.stringify({
                            orderId: this.detailInfo.id,
                            buyerId: this.detailInfo.buyerUserId,
                            buyerName: this.detailInfo.buyerUserName,
                            orderNum: this.detailInfo.tradeNo,
                            sellerId: this.detailInfo.sellerUserId,
                            sellerName: this.detailInfo.sellerUserName,
                            orderTime: this.detailInfo.payTime,
                            orderPrice: this.detailInfo.totalAmount,
                            orderFrom: 'pay'
                        })
                    }
                });
            },
            getDetail(val) {
                this.detailInfo = val;
                this.choosePay = true;
                this.pay = false;
                this.training();
            },
            newOrder() {
                let store = this.$store.state.im;
                ipcRenderer.send('orderWindowCreated', JSON.stringify({
                    userId: getUserIdOrAccid(store.currSessionInfo.account),
                    accid: store.currSessionId.substring(4)
                }))
            },
            dr() {
                this.quill.insertText(this.getCursor(), "\n");
            },
            preventInsert() {
                return false;
            },
            contextmenuTextArea() {
                document.getElementsByClassName("contextmenuTextArea")[0].style.display = "none";
            },
            copy() {
                let index = this.quill.getSelection((focus = true));
                let content = this.quill.getContents(index.index, index.length).ops;
                if (content.length == 1) {
                    if (typeof content[0].insert == "string") {
                        clipboard.writeText(content[0].insert);
                    } else {
                        clipboard.writeImage(
                            nativeImage.createFromDataURL(content[0].insert.image)
                        );
                    }
                } else {
                    this.content = content;
                    clipboard.clear();
                }
            },
            foucsIt(e) {
            },
            movingcursor(val) {
                let index = this.quill.getLength();
                this.quill.setSelection(val || index + 1);
            },
            paste() {
                let clipboardContent = clipboard.readText() || clipboard.readImage();
                if (typeof clipboardContent == "object") {
                    if (clipboardContent.isEmpty()) {
                        if (this.content) {
                            this.content.forEach(item => {
                                if (typeof item.insert == "object") {
                                    this.insertInto(item.insert.image);
                                } else {
                                    this.quill.insertText(this.getCursor(), item.insert);
                                }
                            });
                        }
                    } else {
                        this.insertInto(clipboardContent.toDataURL({scaleFactor: 1000000}))
                    }
                } else {
                    let ele = document.querySelector('.ql-editor');
                    let arr = clipboardContent.split('\n').map((item, index, arr) => {
                        return index < arr.length - 2 && item !== '' ? `<p>${item}</p ><p><br style="display:none"/></p >` : `<p>${item}</p >`
                    })
                    if (this.value) {
                        let str = this.quill.getText().substring(0, this.getCursor()) + clipboardContent + this.quill.getText().substring(this.getCursor(), this.quill.getText().length);
                        str = str.split('\n').map((item, index, arr) => {
                            if (item != '') {
                                return index < arr.length - 2 ? `<p>${item}</p ><p><br style="display:none"/></p >` : `<p>${item}</p >`
                            }
                        })
                        ele.innerHTML = (str.join(''));
                    } else
                        ele.innerHTML = arr.join('');
                }
            },
            curClear(event) {
                this.imgSrc = event.target.src;
                this.copyShow = this.quill.getSelection((focus = true)).length;
                this.$nextTick(() => {
                    let dom = document.getElementsByClassName("contextmenuTextArea")[0];
                    dom.style.display = "block";
                    dom.style.top = event.pageY + "px";
                    dom.style.left = event.pageX + "px";
                    dom = null;
                });
            },
            //发送个人名片
            sendMyCard() {
                this.$emit("sendcard", {boo: true, type: "card"});
            },
            getCursor() {
                return this.quill.getSelection((focus = true)).index || 0;
            },
            addEmoji(emojiName) {
                this.quill.insertText(this.getCursor(), emojiName);
                this.hideEmoji();
                this.movingcursor(this.getCursor());
            },
            hideEmoji() {
                this.isEmojiShown = false;
            },
            showEmoji(event) {
                this.isEmojiShown = !this.isEmojiShown;
            },
            openFile() {
                let filePath = this.$refs.openFile;
                let size = 0;
                if (filePath.value.endsWith('mp4')) {
                } else if (
                    filePath.value.endsWith('png') ||
                    filePath.value.endsWith('jpg')
                ) {
                    for (let index = 0; index < filePath.files.length; index++) {
                        size += filePath.files[index].size;
                        if (size < 10240000) {
                            this.uploadPic(filePath.files[index]);
                        } else {
                            filePath.value = "";
                            this.$message.warning("上传图片过大，请分批上传");
                        }
                    }
                } else {
                    this.$message.warning("请上传png,jpg格式的图片");
                    return;
                }
                filePath.value = "";
            },
            getSimpleText(html) {
                let reg = new RegExp(/<img[^>]*?(src="[^"]*?")[^>]*?>/, "g");
                if (html) {
                    html = html.replace(reg, "placeImgs");
                    return html;
                } //匹配img
                //执行替换成空字符
            },
            sendMsgs(obj) {
                if (typeof obj == "object") {
                    this.$store.dispatch("previewFileMsg", {
                        scene: this.scene,
                        to: this.to,
                        dataURL: obj.image
                    });
                } else {
                    let value = obj.replace(/<\/?p[^>]*>/g, "");
                    value = value.replace(/<\/?br[^>]*>/g, "\n")
                    this.$store.dispatch("sendMsg", {
                        type: "text",
                        scene: this.scene,
                        to: this.to,
                        text: value
                    });
                }
            },
            getFile(item) {
                for (var i = 0; i < this.file.length; i++) {
                    if (this.file[i].url == item.insert.image) {
                        return this.file[i];
                    }
                }
            },
            checkAit(str) {
                if (this.$store.state.im.currSessionInfo.scene !== "team") {
                    return false;
                }
                if (str.indexOf("@") == -1) {
                    return false;
                } else if (str.indexOf("@所有人") != -1) {
                    if (
                        this.$store.state.im.currChatroomInfo.owner ==
                        this.$store.state.im.myInfo.account
                    ) {
                        return [];
                    } else {
                        return false;
                    }
                } else {
                    let accounts = [];
                    for (let i = 0; i < this.aitObj.length; i++) {
                        if (str.indexOf(this.aitObj[i].fromNick) > -1) {
                            accounts.push(this.aitObj[i].from);
                        }
                    }
                    return [...new Set(accounts)];
                }
            },
            sendAitMsg(dispatchArr, str) {
                let arr = this.checkAit(str);
                let value = str.replace(/<\/?p[^>]*>/g, "");
                value = value.replace(/<\/?br[^>]*>/g, "\n")
                if (!arr) {
                    this.sendMsgs(str.trim());
                } else {
                    if (arr.length) {
                    }
                    this.$store.dispatch("ait", {
                        to: this.to,
                        text: value.trim(),
                        accounts: arr,
                        custom: arr.length ? value.trim() : JSON.stringify({ait: "所有人"})
                    });
                }
            },
            submit() {
                let dispatchArr = this.quill.getContents().ops;
                if (dispatchArr.length == 1) {
                    if (dispatchArr[0].insert.trim()) {
                        dispatchArr[0].insert = dispatchArr[0].insert.replace(/[\r\n]/g, "");
                        this.sendAitMsg(dispatchArr, this.value);
                    }
                } else {
                    dispatchArr.forEach(item => {
                        if (typeof item.insert == "string") {
                            if (item.insert.trim())
                                this.sendAitMsg(dispatchArr, item.insert.trim());
                        } else {
                            this.sendMsgs(item.insert);
                        }
                    });
                }
                this.value = "";
                this.$emit("goTop");
            },
            editBlur() {
                if (this.isEmojiShown == true) {
                    this.isEmojiShown = false;
                }
            },
            onDrag(e) {
                e.stopPropagation();
                e.preventDefault();
            },
            onDrop(e) {
                e.stopPropagation();
                e.preventDefault();
                var dt = e.dataTransfer;
                let size = 0;
                for (var i = 0; i !== dt.files.length; i++) {
                    size += dt.files[i].size;
                    if (size < 10240000) {
                        this.uploadPic(dt.files[i]);
                    } else {
                        this.$message.warning("上传图片过大，请分批上传");
                    }
                }
            },
            pasteHandle(e) {
                let clipboardData = e.clipboardData;
                let i = 0;
                let items, item, types;
                if (clipboardData) {
                    items = clipboardData.items;
                    if (!items) {
                        return;
                    }
                    item = items[0];
                    types = clipboardData.types || [];

                    for (; i < types.length; i++) {
                        if (types[i] === "Files") {
                            item = items[i];
                            break;
                        }
                    }
                    if (item && item.kind === "file" && item.type.match(/^image\//i)) {
                        let obj = clipboard.readImage();
                        this.uploadFile(obj.toPNG(), obj.getSize());
                    }
                }
            },
            //光标处插入
            insertInto(res) {
                let index = this.getCursor();
                this.$refs.area.quill.insertEmbed(index, "image", res);
                this.setSize();
                // 获取vue-quill-editor对象光标位置，插入图片，使光标在右边
                this.movingcursor(index + 1);
            },
            uploadPic(file) {
                getLocalBase64(
                    file,
                    function (res) {
                        this.insertInto(res);
                    }.bind(this)
                );
            },
            uploadFile(file, size) {
                Bus.$off("fileUrl");
                this.sendFileInput(file);
                Bus.$on("fileUrl", result => {
                    if (result !== null || result !== undefined) {
                        if (size) {
                            result.w = size.width;
                            result.h = size.height;
                        }
                        this.file.push(result);
                        let myQuill = this.$refs.area.quill;
                        let index = this.getCursor();

                        myQuill.insertEmbed(
                            index,
                            "image",
                            result.ext !== "video" ? result.url : result.url + "?vframe"
                        );
                        this.setSize();
                        // 获取vue-quill-editor对象光标位置，插入图片，使光标在右边
                        this.movingcursor(index + 1);
                    }
                });
            },
            off() {
                Bus.$off("sendImgUrl");
                Bus.$off("clearRich");
                Bus.$off("aitOne");
                let dropbox = document.querySelector(".textarea");
                if (dropbox) {
                    dropbox.removeEventListener("dragenter", this.onDrag);
                    dropbox.removeEventListener("dragover", this.onDrag);
                    dropbox.removeEventListener("drop", this.onDrop);
                }
                this.$refs.area.quill.root.removeEventListener("paste", this.pasteHandle);
                document.removeEventListener("click", this.backFalse);
                dropbox = null;
            },
            setSize() {
                let dom = document.querySelectorAll(".ql-editor>p img");
                dom.forEach(element => {
                    element.style = "witdh:100px;height:50px;margin-right:2px;";
                });
                dom = null;
            },
            sendFileInput(file) {
                this.$refs.sendFileInput = file.path;
                this.$store.dispatch("sendFileMsg", {
                    scene: "p2p",
                    to: this.to,
                    file
                });
            },
            chatAddFriends() {
                this.$emit("openaddFriend", this.to);
            },
            backFalse(e) {
                if (!this.$el.contains(e.target)) {
                    this.isEmojiShown = false;
                }
            },
            changev() {
                this.$emit("changev", {
                    value: this.getSimpleText(this.value),
                    old: this.value
                });
            },
            textChange(e) {
                if (e.quill.getLength() > 700) {
                    let length = e.quill.getLength() - 700
                    e.quill.deleteText(700, length)
                }
            },
            aite(data, oldData, user) {
                data.forEach(item => {
                    item.insert == '@' && console.log(555)
                })
            }
        },
        created() {
            document.addEventListener("click", this.backFalse);
        },
        mounted() {
            this.customMsg = getLocal('readyCustom') ? JSON.parse(getLocal('readyCustom')) : null;
            let that = this;
            this.quill.keyboard.addBinding({key: "V", ctrlKey: "true"}, function (range, context) {
                that.paste();
            });
            this.quill.keyboard.addBinding({key: "C", ctrlKey: "true"}, function (range, context) {
                that.copy();
            });
            Bus.$on("aitOne", content => {
                this.quill.insertText(this.getCursor(), "@" + content.fromNick + " ");
                this.aitObj.push(content);
            });
            Bus.$on("clearRich", item => {
                this.value = "";
            });
            this.quill.on('text-change', this.aite);
            let dropbox = document.querySelector(".textarea");
            dropbox.addEventListener("dragenter", this.onDrag, false);
            dropbox.addEventListener("dragover", this.onDrag, false);
            dropbox.addEventListener("drop", this.onDrop, false);
            // document.addEventListener("cut", this.cut, false);
            // dropbox.addEventListener("paste", this.pasteHandle, false);
            dropbox = null;
            this.$refs.area.quill.root.addEventListener("paste", this.pasteHandle, false);
            Bus.$on("sendImgUrl", content => {
                if (content) {
                    let file = document.querySelectorAll(".ql-editor p")[0];
                    let img = document.createElement("img");
                    img.src = content;
                    img.style = "witdh:100px;height:50px;margin-right:2px;";
                    file.appendChild(img);
                    file = null;
                }
                return;
            });
        },
        watch: {
            value() {
                this.changev();
                this.movingcursor(this.getCursor());
            },
            cursession(){
                this.clearLocal();
            },
        },
        beforeDestroy() {
            clearTimeout(this.timer)
            this.off();
            Object.assign(this.$data, this.$options.data());
        }
    };
</script>
<style scoped lang="scss">
    @mixin showpoint{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .chatEditor {
        background: #000;
        .sendCustomMsg {
            box-shadow: 0px 0px 8px 0px rgba(129, 129, 129, 0.7);
            border-radius: 5px;
            width: 280px;
            height: 136px;
            padding: 0 15px;
            color: #666;
            background: #fff;
            position: absolute;
            top: -66px;
            right: calc(50% - 140px);
            z-index: 15;
            .el-icon-close {
                position: absolute;
                right: 5px;
                top: 5px;
            }
            .el-button {
                width: 110px;
                height: 30px;
                padding: 0;
            }
            .content {
                display: flex;
                align-items: center;
                .left {
                    padding: 10px;
                }
                .right {
                    width: 185px;
                    h6 {
                        @include showpoint;
                        padding-top: 5px;
                        color: #000;
                        font-size: 16px;
                        line-height: 34px;
                    }
                    div {
                        @include showpoint;
                        white-space: normal;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
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

    }
    .bottom {
        height: 100%;
        .bottom-fun {
            display: flex;
            justify-content: space-between;
            background-color: #f9f9f9 !important;
            padding: 5px 10px 0 10px;
            .b-f-img {
                float: left;
                margin-right: 10px;
                margin-top: 5px;
                cursor: pointer;
            }
            li {
                display: inline-block;
                width: 32px;
                padding: 5px 4px;
                cursor: pointer;
                position: relative;
                margin: 0 4px;
                height: 100%;
                img {
                    vertical-align: middle;
                }
                #file {
                    display: none;
                }
            }
            .item-li:last-child {
                width: 48px;
            }
        }
        .bottom-input {
            height: 100%;
            position: relative;
            .el-textarea {
                background-color: #f9f9f9 !important;
            }
            .textarea {
                background-color: #f9f9f9 !important;
                height: 100%;
                overflow: hidden;
                width: 100%;
            }
            .files {
                position: absolute;
                top: 10px;
                left: 10px;
                opacity: 0;
                display: none;
            }
        }
    }

    .chatEditor .el-button {
        color: #999;
        background: #f3f3f3;
        border: 1px solid rgba(138, 138, 138, 0.5);
        margin-top: 5px;
    }

</style>
<style>
    .chatEditor .enter:active {
        background-color: skyblue;
        color: white;
    }

    .ql-editor {
        height: 176px;
    }

    .chatEditor {
        height: 100%;
    }

    .ql-container.ql-snow {
        border: 0;
    }

    .ql-snow .ql-editor img {
        height: 50px;
        margin-right: 5px;
    }

    .bottom-input .el-textarea .el-textarea__inner {
        background-color: #f3f3f3 !important;
        border: 1px solid #f3f3f3 !important;
    }

    chatlist input[type="file"] {
        color: transparent;
    }

    .splitter-pane {
        padding: 0 !important;
    }
</style>
