<template>
    <div class="inquiry">
        <div slot="title" class="title-user-img">
            <img v-if="markerData.avatar" :src="markerData.avatar" alt="图片加载失败">
            <img v-else src="@/../../static/image/DefaultUserIcon.png" alt="">
            <span>{{markerData.nick}}</span>
        </div>
        <div class="center-user">
            <p v-if="markerData.isFriend">备注名：
                <el-button type="text" v-if="!markShow" @click="markShow=true">{{mark||'点击添加备注'}}</el-button>
                <el-input size="mini" v-if="markShow" @blur="setAlias(markerData)" v-model="markNameCard"
                          @focus="getfocus"></el-input>
            </p>
            <p v-if="markerData.nickInTeam"><span>群昵称：</span> {{markerData.nickInTeam}}</p>
            <p><span>身份：</span>{{markerData.identityName||'未认证'}}</p>
            <p><span>所在地 ：</span>{{markerData.province||''}} - {{markerData.city||''}}</p>
            <P><span>入驻时间：</span>{{markerData.createTime |moment("YYYY-MM-DD")}}</P>
        </div>
        <div class="bottom-user" v-if="markerData.account!==$store.state.im.userUID">
            <p v-if="!markerData.isFriend" @click="addFriend">
                <el-button type="primary" size="mini" @click="addFriend">加好友</el-button>
            </p>
            <!--<p>-->
            <!--<el-button type="primary" size="mini" v-model="isBlack" @click="joinBlack(markerData)">加入黑名单</el-button>-->
            <!--</p>-->
            <p>
                <el-button type="primary" size="mini" v-model="isBlack" @click="shareCard">发送名片</el-button>
            </p>
            <!-- <el-button type="primary" size="mini" v-else>进入店铺</el-button> -->
            <p>
                <el-button type="primary" size="mini" @click="sendMsg" v-if="canSendMsg||markerData.isFriend">发消息
                </el-button>
            </p>
        </div>
    </div>

</template>

<script>
    import {getLocal} from "@/utils/localstorage.js";

    export default {
        props: {
            applyInquiry: {
                type: Object,
                default: {
                    data: {}
                }
            }
        },
        watch: {
            "applyInquiry.data"(val) {
                this.getCarList();
            }
        },
        computed: {
            data() {
                return this.applyInquiry.data;
            },
            canSendMsg() {
                if (this.$store.state.im.currSessionInfo.scene == 'p2p') return true
                let myId = this.$store.state.im.myInfo.account;
                if (myId == this.$store.state.im.currChatroomInfo.owner || this.supper.includes(myId)) {
                    return true
                }
            }
        },
        created() {
            this.supper = JSON.parse(getLocal('supper'))
        },
        data() {
            return {
                mark: "点击添加备注",
                markShow: false,
                markerData: {},
                showMsg: "",
                markNameCard: "点击添加备注",
                isBlack: true,
                flag: false,
                supper: []
            };
        },
        methods: {
            shareCard() {
                this.$emit('shareCard', {
                    name: this.applyInquiry.data.nick,
                    account: this.applyInquiry.data.account,
                    avatar: this.applyInquiry.data.avatar
                })
            },
            addFriend() {
                this.$emit("openaddFriend", this.markerData.account);
                this.$emit("input", false);
            },
            sendMsg() {
                this.$emit("changeIndex");
                this.$emit('talkto', 'p2p-'+this.data.account)
            },
            getCarList() {
                let obj = JSON.parse(JSON.stringify(this.markerData));
                var account = this.data.account;
                if (account !== undefined || account !== null) {
                    if (this.$store.state.im.userInfos[account] !== undefined) {
                        obj.isFriend = this.$store.state.im.userInfos[account].isFriend;
                        if (this.$store.state.im.userInfos[account].isFriend === true) {
                            this.markNameCard = this.$store.state.im.userInfos[account].alias;
                            this.mark = this.$store.state.im.userInfos[account].alias;
                            this.showMsg = "进入店铺";
                        } else {
                            this.showMsg = "加好友";
                        }
                    }
                }
                obj.tel = this.data.tel;
                obj.account = this.data.account;
                obj.avatar = this.data.avatar;
                obj.createTime = this.data.createTime;
                obj.gender = this.data.gender;
                obj.nick = this.data.nick || this.data.name;
                obj.sign = this.data.sign;
                obj.updateTime = this.data.updateTime;
                obj.nickInTeam = this.data.nickInTeam;
                obj.isFriend = this.$store.state.im.friendslist.some(
                    item => item.account == this.data.account
                );
                if (this.data.custom) {
                    obj.custom =
                        typeof this.data.custom == "string"
                            ? JSON.parse(this.data.custom)
                            : this.data.custom;
                    obj.identityName = obj.custom.identityName;
                    obj.province = obj.custom.province;
                    obj.city = obj.custom.city;
                }
                this.markerData = obj;
            },
            setAlias(info) {
                this.markShow = false;
                if (this.markNameCard.length > 15) {
                    this.$message.warning("备注长度不能超过15个字符");
                    return;
                }
                this.$store.dispatch("updateFriend", {
                    account: info.account,
                    alias: this.markNameCard.replace(/\s+/g, "")
                });
                this.mark = this.markNameCard
            },
            getfocus() {
                this.markNameCard = "";
            },
            joinBlack(blackData) {
                if (blackData.account == undefined) {
                    this.$message.error("当前未获取到联系人信息，请关闭窗口重试。");
                    return false;
                }
                const userUID = this.$store.state.im.userUID;
                if (userUID == blackData.account) {
                    this.$message.error("不能添加自己到黑名单");
                    return false;
                }
                this.$store.dispatch("updateBlack", {
                    account: blackData.account,
                    isBlack: this.isBlack
                });
                this.$message.success("加入黑名单成功");
            }
        }
    };
</script>
<style lang='scss' scoped>
    .inquiry {
        padding-top: 30px;
        .title-user-img {
            text-align: center;
            img {
                width: 45px;
                height: 45px;
                border-radius: 5px;
                vertical-align: baseline;
            }
            span {
                display: inline-block;
                line-height: 45px;
                width: 57%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .center-user {
            padding: 0px 5px;
            p {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding: 5px 10px;
                line-height: 28px;
            }
            .el-button--text {
                padding: 0px;
                color: #333;
            }
            .el-input {
                width: 54%;
                display: inline-block;
            }
        }
        .bottom-user {
            text-align: center;
            padding-top: 20px;
            p {
                margin-bottom: 10px;
            }
            .el-button {
                width: 50%;
            }
        }
    }
</style>