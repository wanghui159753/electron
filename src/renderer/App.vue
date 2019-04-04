<template>
    <div id="app" style="user-select: none">
        <custom-outer-border></custom-outer-border>
        <router-view></router-view>
    </div>
</template>
<script>
    const path = require("path");
    import CustomOuterBorder from "./components/CustomOuterBorder";
    import Vue from 'vue';
    export default {
        name: "xdpx",
        components: {
            CustomOuterBorder
        },
        mounted(){
            //im气泡点击
            ipcRenderer.on('ToThisUrl',function (e,url) {
                this.$router.push(url)
            }.bind(this))
        },
        provide() {
            return {
                reload: this.reload
            };
        },
        data() {
            return {
                isRouterAlive: true
            };
        },
        updated() {
            this.$store.dispatch("connect");
        },
        methods: {
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(function () {
                    this.isRouterAlive = true;
                });
            }
        }
    };
    window.onload=function () {
        window.VueEvent=new Vue();
        console.log(window.VueEvent,'.............')
    }
    const {ipcRenderer, remote} = require("electron");
    const fs = require("fs");
    window.addEventListener('keyup', (e) => {
        if (e.keyCode == 19) {
            remote.getCurrentWindow().webContents.openDevTools()
        }
    }, true)
//im语音
    let time = 0;
    ipcRenderer.on("playAudio", function () {
        let newDate = new Date().getTime();
        if (newDate - time > 500) {
            let AC = new AudioContext();
            let analyser = AC.createAnalyser();
            let buf = fs.readFileSync(path.join(__dirname, '../../dist/electron/static/audio/1.mp3'));
            let uint8Buffer = Uint8Array.from(buf)
            // 音频解码
            AC.decodeAudioData(uint8Buffer.buffer)
                .then(audioBuf => {
                    let  bs = AC.createBufferSource();
                    bs.buffer = audioBuf;
                    bs.connect(analyser);
                    analyser.connect(AC.destination);
                    bs.start();
                });
            time = newDate;
        }
    });
</script>

<style lang="scss">
    /* CSS */
    @import "./styles/index.scss";

    body {
        background: #fff;
    }

    #app {
        position: absolute;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
        border: 1px solid rgb(196, 194, 194);
        box-shadow: 10px 5px 5px rgb(196, 194, 194);
    }
</style>
