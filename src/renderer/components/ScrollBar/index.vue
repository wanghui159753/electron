<template>
    <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll">
        <div class="scroll-wrapper" ref="scrollWrapper" :style="{top: top + 'px'}">
            <div class="sysLogo" @click="show = !show">
                <div class="logoBox">
                    <img :src="myInfo.logo||require('../../../../static/image/logo.png')" width="60" alt="图片加载失败">
                </div>
                <div class="desc" v-if="myInfo">
                    <p class="title">{{myInfo.identityParentName+':'+ myInfo.identitySubName}}</p>
                    <p class="small-desc">{{myInfo.merchantFieldPass?'（已实地认证）':'（未实地认证）'}}</p>
                </div>
                <div class="desc" v-else>
                    <p class="title">心动配讯</p>
                    <p class="small-desc">真诚为你服务</p>
                </div>
            </div>
            <slot></slot>
        </div>
        <myinfo v-if="show" v-model="show" :myInfo="myInfo" @share="shareDialog"></myinfo>
        <div class="diaBox">
            <el-dialog v-if="shareShow" :visible.sync="shareShow" :modal-append-to-body="false">
                <dialogs v-model="shareShow" :addType="addType" :shareCardObj="shareCardObj" :custom="custom"></dialogs>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {getMyShop, session} from "@/api/admission/admission";
    import myinfo from "@/components/myInfo/myinfo";
    import dialogs from "@/views/message/template/chattingGroupAdd"
    import {setLocal} from "@/utils/localstorage"
    import {burseMain} from "@/api/myorder/index.js";
    const delta = 15;
    import {mapGetters} from "vuex";

    export default {
        name: "scrollBar",
        components: {myinfo, dialogs},
        data() {
            return {
                top: 0,
                show: false,
                shareShow: false,
                addType: '',
                custom: null,
                shareCardObj: null
            };
        },
        computed: {
            ...mapGetters(["im"]),
            users() {
                return this.im.myInfo;
            },
            myInfo() {
                return this.$store.state.user.storeInformation;
            }
        },
        created() {
            this.getMyInfo()
        },
        methods: {
            shareDialog() {
                this.addType = this.myInfo.identityParentName == '配件商'&&this.myInfo.autoSellerPass ? 'share' : 'shareCard';
                if (this.addType == 'share') {
                    this.custom = {
                        sellerId: this.myInfo.autoSellerId,
                        name: this.myInfo.name,
                        authList: this.myInfo.authList,
                        businessScope: this.myInfo.manageScope,
                        address: this.myInfo.autoSellerAddress.provinceName + this.myInfo.autoSellerAddress.cityName + this.myInfo.autoSellerAddress.regionName + this.myInfo.autoSellerAddress.regionName,
                        avatar: this.myInfo.logo
                    }
                } else {
                    this.shareCardObj = {
                        name: this.$store.state.im.myInfo.nick,
                        account: this.$store.state.im.myInfo.account,
                        avatar: this.$store.state.im.myInfo.avatar
                    }
                }
                this.shareShow = true;
            },
            getMyInfo() {
                session().then(res =>{
                    setLocal('myStore', JSON.stringify(res.data))
                    this.$store.commit("SET_STORE", res.data)
                }).then(()=>burseMain()).then(res=>{
                    setLocal('isSetPassword',res.data.bindPayPassword)
                })
            },
            handleScroll(e) {
                const eventDelta = e.wheelDelta || -e.deltaY * 3;
                const $container = this.$refs.scrollContainer;
                const $containerHeight = $container.offsetHeight;
                const $wrapper = this.$refs.scrollWrapper;
                const $wrapperHeight = $wrapper.offsetHeight;
                if (eventDelta > 0) {
                    this.top = Math.min(0, this.top + eventDelta);
                } else {
                    if ($containerHeight - delta < $wrapperHeight) {
                        if (this.top < -($wrapperHeight - $containerHeight + delta)) {
                            this.top = this.top;
                        } else {
                            this.top = Math.max(
                                this.top + eventDelta,
                                $containerHeight - $wrapperHeight - delta
                            );
                        }
                    } else {
                        this.top = 0;
                    }
                }
            }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../styles/variables.scss";

    .scroll-container {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: black;
        .scroll-wrapper {
            position: absolute;
            width: 100% !important;
            height: 100%;
        }
    }

    .sysLogo {
        // width:100%;
        // overflow:hidden;
        padding: 18px 0px;
        .logoBox {
            width: 100%;
            text-align: center;
            padding-top: 30px;
            img {
                display: inline-block;
                border-radius: 5px;
                width: 80px;
                height: 80px;
            }
        }
        .desc {
            text-align: center;
            font-size: 14px;
            line-height: 35px;
            .title {
                color: #fff;
            }
            .small-desc {
                color: #FCF64F;
                line-height: 20px;
            }
        }
    }
</style>
<style lang="scss">
    .scroll-container {
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