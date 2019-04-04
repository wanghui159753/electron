<template>
    <div class="custom-outer-border">
        <!--<div class="center">-->
            <!--<transition name="el-zoom-in-center">-->
                <!--<p v-if="news">心动配讯pc版1.0.2上线了</p>-->
            <!--</transition>-->
            <!--<transition name="el-zoom-in-center">-->
                <!--<p v-if="!news">心动配讯pc版有新的新闻了</p>-->
            <!--</transition>-->
        <!--</div>-->
        <div class="nav-title">
            <div class="left"></div>
            <div class="right" style="-webkit-app-region: no-drag">
                <div class="list" @click="minimize">
                    <img src="../../../../static/image/small.png" alt="图片加载失败">
                </div>
                <div class="list" @click="maximization">
                    <img src="../../../../static/image/big.png" alt="图片加载失败">
                </div>
                <div class="list last" @click="close">
                    <img src="../../../../static/image/off.png" alt="图片加载失败">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    const {ipcRenderer, remote} = require("electron");
    export default {
        name: "CustomOuterBorder",
        data() {
            return {
                width: 0,
                height: 0,
                // news: true,
                news:[1111,333,222,111]
            }
        },
        mounted() {
            // setInterval(() => {
            //     this.news .push(Math.random())
            // }, 2500)
        },
        methods: {
            //  窗口最小化
            minimize() {
                remote.getCurrentWindow().minimize();
            },
            // 窗口最大化
            maximization() {
                console.log(this.$store.state.im,'-----')
                let curWin = remote.getCurrentWindow();
                let arr = [window.screen.availWidth, window.screen.availHeight];
                if (curWin.id == 1) {
                    curWin.isMaximized() ? curWin.restore() : curWin.maximize();
                } else {
                    let curSize = curWin.getSize();
                    if (curSize[0] >= arr[0] && curSize[1] >= arr[1]) {
                        curWin.setBounds({
                            x: parseInt((arr[0] - this.width) / 2),
                            y: parseInt((arr[1] - this.height) / 2),
                            width: this.width,
                            height: this.height
                        });
                    } else {
                        this.width = curSize[0];
                        this.height = curSize[1];
                        curWin.maximize();
                    }
                }
            },
            // 窗口关闭
            close() {
                if (this.$route.path == "/order") {
                    remote.getCurrentWindow()&&remote.getCurrentWindow().close();
                } else {
                    remote.getCurrentWindow().hide();
                }
                if(this.$route.path.includes('/message/index')){
                    this.$store.dispatch('setCurrSession','')
                    this.$store.commit("setCurrSessionInfo",null);
                    this.$store.commit("updateCurrSessionMsgs",{type:'destroy'});

                }
            }
        }
    };
</script>
<style lang="scss">
    .custom-outer-border {
        -webkit-app-region: drag;
        .nav-title {
            display: flex;
            justify-content: space-between;
            .left {
                padding-left: 40px;
            }
            .right {
                width: 108px;
                display: flex;
                justify-content: space-between;
                .list {
                    width: 36px;
                    height: 30px;
                    margin: 0 auto;
                    padding: 4px 10px 0 10px;
                }
                .list:hover {
                    background-color: #e5e5e5;
                }
                .last:hover {
                    background-color: #e81123 !important;
                }
                .last {
                    img {
                        animation: scoll 3s infinite;
                    }
                }
                .list image {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .center {
            position: absolute;
            right: 0;
            top: 0;
            width: calc(100% - 180px);
            text-align: center;
            height: 30px;
            overflow: hidden;
            transition: all 1s;
            z-index: -1;
            background: #fff;
        }
    }
</style>
