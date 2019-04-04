<template>
    <div class="app-wrapper"
         customClass="loginLoading"
         ondragstart="return false;"
         element-loading-text="数据初始化中">
        <keep-alive>
            <sidebar class="sidebar-container"></sidebar>
        </keep-alive>
        <div class="main-container">
            <transition name="el-zoom-in-center">
                <app-main class="transition-box" v-loading="isLoading"></app-main>
            </transition>
        </div>
    </div>
</template>

<script>
    import {Sidebar, AppMain} from "./components";
    import ResizeMixin from "./mixin/ResizeHandler";
    import {getSysUnred} from "@/api/im/user.js";
    import {loadfriendPage} from "@/api/im/friend.js";

    export default {
        name: "layout",
        data() {
            return {};
        },
        components: {
            Sidebar,
            AppMain
        },
        mixins: [ResizeMixin],
        created() {
            this.$store.state.im.customSysMsgs = [];
            this.$store.dispatch("resetSysMsgs", {type: 1});
            getSysUnred().then(req => {
                let num = req.data.unReadCount
                this.$store.state.im.customSysMsgUnread = num;
            })
        },
        computed: {
            sidebar() {
                return this.$store.state.app.sidebar;
            },
            device() {
                return this.$store.state.app.device;
            },
            isLoading() {
                return this.$store.state.app.loading;
            }
            // classObj() {
            //   return {
            //     hideSidebar: !this.sidebar.opened,
            //     withoutAnimation: this.sidebar.withoutAnimation,
            //     mobile: this.device === 'mobile'
            //   }
            // }
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../styles/mixin.scss";

    .app-wrapper {
        @include clearfix;
        position: absolute;
        top: 30px;
        bottom: 0;
        width: 100%;
        overflow: auto;
    }
</style>
<style>
    .app-wrapper > .el-loading-mask {
        position: fixed !important;
    }
</style>
