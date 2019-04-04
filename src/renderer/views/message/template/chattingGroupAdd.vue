<template>
    <div class="groupBox" @mousewheel="stopBable">
        <div class="left">
            <el-input placeholder="搜索联系人" v-model="searchName">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <div class="list scrollbar" v-if="friendList.length>0">
                <el-checkbox-group
                        :max="addType=='attorn'?1:100"
                        class="checkGrop"
                        v-for="(item,index) in friendList"
                        :key="index"
                        v-model="selarr"
                        size="small"
                >
                    <label class="forwardUser" @click="change(item)">
                        <el-checkbox :label="JSON.stringify(item)"></el-checkbox>
                        <img
                                :src="item.avatar||'https://cdn.xindongpeixun.com/oss/20181017/d871a7d7268644b8b7f47d3a4fb8ad32.png'"
                                alt
                                width="33"
                                height="33"
                        >
                        <span
                                class="name"
                                v-if="item.nickInTeam||item.name||item.nick"
                        >{{item.nickInTeam||item.name||item.nick}}</span>
                        <span class="name" v-else>{{item.id}}</span>
                    </label>
                </el-checkbox-group>
            </div>
        </div>
        <div class="right scrollbar">
            <p class="isSelect">已选择联系人</p>
            <div class="selected" v-for="(item,index) in selarr" :key="index">
                <img :src="toObj(item).avatar||'https://cdn.xindongpeixun.com/oss/20181017/d871a7d7268644b8b7f47d3a4fb8ad32.png'"
                     width="30" height="30" alt>
                <p>{{toObj(item).nickInTeam||toObj(item).name||toObj(item).nick||toObj(item).id}}</p>
                <i class="el-icon-error" @click="delitem(toObj(item))"></i>
            </div>
            <div class="result">
                <el-button @click="$emit('input',false)">取消</el-button>
                <el-button type="primary" v-if="addType=='delect'" @click="delectItem">删除</el-button>
                <el-button type="primary" @click="addPerple" v-else>确定</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import util from "@/utils";
    import {mapGetters} from "vuex";
    import {friendAndDialog} from "@/api/im/baseMethod.js";
    import {backScene} from "@/api/im/baseMethod"

    export default {
        props: ["value", "addType", "to", 'custom', "shareCardObj"],
        data() {
            return {
                selarr: [],
                searchName: "",
                arr: [],
                show: true,
                friendList: []
            };
        },
        watch: {
            searchName(val) {
                if (this.addType == "delect") {
                    this.friendList = val
                        ? this.friendList.filter(
                            item => (item.nickInTeam || item.nick).indexOf(val) > -1
                        )
                        : this.arr;
                } else {
                    this.friendList = friendAndDialog(this, util);
                }
            }
        },
        methods: {
            stopBable(e) {
                e.stopPropagation()
            },
            toObj(val) {
                return JSON.parse(val);
            },
            change(val) {
                if (this.addType == "attorn") {
                    this.selarr.splice(0, 1, JSON.stringify(val));
                }
            },
            delectItem() {
                this.$store.dispatch("removeTeamMembers", {
                    id: this.$store.state.im.currSessionId.substring(5),
                    accounts: this.selarr.map(item => {
                        item = this.toObj(item);
                        return item.account;
                    })
                });
                this.$emit("input", false);
            },
            sendCustomMsg(type, str) {
                this.selarr.forEach(element => {
                    let obj = JSON.parse(element);
                    this.$store.dispatch("sendMsg", {
                        scene: obj.scene || backScene(obj.id, 1),
                        to: obj.to || backScene(obj.id, 0),
                        type: "custom",
                        content: {
                            msgType: type,
                            msgContent: JSON.stringify(str)
                        }
                    });
                });
                this.$emit("input", false);
                this.$message.success('分享成功')
            },
            addPerple() {
                let obj = this.addType == "share" || this.addType == "shareCard" ? null : this.dispatchObj();
                if (this.addType == "created") {
                    this.$store.dispatch("newChatRoom", obj);
                } else if (this.addType == "team") {
                    obj.id=obj.id.substring(1)
                    this.$store.dispatch("teamAdd", obj);
                } else if (this.addType == "new") {
                    obj.done=function (val) {
                        this.$emit("input", false);
                        this.$emit("changeIndex",val);
                    }.bind(this)
                    this.$store.dispatch("newChatRoom", obj);
                    return;
                } else if (this.addType == "card") {
                    this.selarr.forEach(element => {
                        let obj = JSON.parse(element);
                        this.$store.dispatch("sendMsg", {
                            scene: this.$store.state.im.currSessionInfo.scene || backScene(this.$store.state.im.currSessionInfo.id, 1),
                            to: this.$store.state.im.currSessionInfo.to || backScene(this.$store.state.im.currSessionInfo.id, 0),
                            type: "custom",
                            content: {
                                msgType: 1,
                                msgContent: JSON.stringify({
                                    name: obj.name || obj.nick,
                                    account: obj.to || obj.account,
                                    avatar: obj.avatar
                                })
                            }
                        });
                    });
                    this.$emit("input", false);
                    return;
                } else if (this.addType == "share") {
                    this.sendCustomMsg(2, this.custom)
                } else if (this.addType == "shareCard") {
                    this.sendCustomMsg(1, this.shareCardObj)
                }else if (this.addType == "seller") {
                    this.$emit('seller',this.selarr.map(item=>{
                        return JSON.parse(item)
                    }))
                } else {
                    this.$store.dispatch("transferTeam", obj);
                }
                this.$emit("input", false);
                this.$emit("changeIndex");
            },
            getAccounts() {
                let str = "【群】";
                let arr = this.selarr.map((item, index) => {
                    item = this.toObj(item);
                    index < 3
                        ? (str =
                        str +
                        item.name +
                        (index == 2 || index == this.selarr.length - 1 ? "" : "、"))
                        : null;
                    return item.to || item.account;
                });
                return {
                    name: str,
                    accounts: arr
                };
            },
            dispatchObj() {
                return Object.assign(
                    {
                        id: (this.$store.state.im.currSessionId||'').substring(4),
                        type: "advanced"
                    },
                    this.getAccounts()
                );
            },

            delitem(val) {
                this.selarr = this.selarr.filter(item => {
                    item = this.toObj(item);
                    return item.id ? item.id !== val.id : item.account !== val.account;
                });
            },
            getFriendList() {
                if (
                    this.addType == "created" ||
                    this.addType == "team" ||
                    this.addType == "new" ||
                    this.addType == "card"
                ) {
                    this.friendList = friendAndDialog(this, util).filter(
                        item => item.scene !== "team"
                    );
                } else if (this.addType == "share" || this.addType == 'shareCard'||this.addType == 'seller') {
                    this.friendList = friendAndDialog(this, util)
                } else {
                    this.friendList = this.$store.state.im.teamMembers.filter(
                        item => item.account != this.$store.state.im.myInfo.account
                    );
                }
                this.arr = this.friendList;
            }
        },
        computed: {
            userInfos() {
                return this.$store.state.im.userInfos;
            },
            ...mapGetters(["im"])
        },
        created() {
            this.getFriendList();
            if (this.addType == "new") {
                this.friendList.forEach(item => {
                    if (item.id == this.im.currSessionId) {
                        this.selarr.push(JSON.stringify(item));
                    }
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
    .groupBox {
        width: 570px;
        height: 524px;
        overflow: hidden;
        display: flex;
        text-align: center;
        .el-input {
            display: inline-block;
            width: 240px;
            height: 30px;
            margin-bottom: 20px;
        }
        .left {
            border-right: 2px solid #dedede;
            .list {
                overflow: auto;
                height: calc(100% - 33px);
            }
        }
        .left,
        .right {
            width: 50%;
            padding: 20px 0;
        }
        .isSelect {
            font-size: 12px;
            color: #999;
            line-height: 30px;
            text-align: left;
            text-indent: 20px;
        }
        .right {
            overflow: auto;
            .selected {
                width: 100%;
                display: flex;
                padding-left: 20px;
                height: 60px;
                line-height: 60px;
                align-items: center;
                p {
                    width: 70%;
                    margin-left: 15px;
                    text-align: left;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                i {
                    line-height: 60px;
                }
            }
        }
        .result {
            position: absolute;
            right: 0;
            bottom: 0;
            height: 80px;
            padding: 15px;
            text-align: center;
            .el-button {
                width: 90px;
                height: 30px;
                margin: 10px;
                padding: 0;
            }
        }
    }

    .checkGrop {
        line-height: 60px;
        height: 60px;
    }

    .forwardUser {
        display: inline-block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .el-checkbox {
            float: left;
            margin-right: 20px;
            .el-checkbox__label {
                display: none;
            }
        }
        img {
            float: left;
            position: relative;
            top: 13px;
            margin-right: 13px;
            border-radius: 10%;
        }
        .name {
            float: left;
            font-size: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 50%;
        }
    }

    .forwardUser .el-checkbox__inner::after {
        left: 6px;
        top: 2px;
        height: 8px !important;
    }
</style>
<style lang="scss">
    .diaBox {
        .el-dialog {
            .el-dialog__body,
            .el-dialog__header {
                padding: 0;
            }
        }
        .el-checkbox-group {
            padding: 0 10px;
        }
    }

    .diaBox .el-checkbox-group:hover {
        background: #ccc;
        z-index: 222;
    }
</style>
