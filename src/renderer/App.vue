<template>
    <div id="app">
        <custom-outer-border></custom-outer-border>
        <router-view></router-view>
    </div>
</template>

<script>
    import CustomOuterBorder from "./components/CustomOuterBorder";

    export default {
        name: "xdpx",
        components: {
            CustomOuterBorder
        },
        updated() {
            this.$store.dispatch("connect");
        }
    };
    const {ipcRenderer} = require("electron");
    const fs = require("fs");
    ipcRenderer.on("message", (event, {message, data}) => {
        console.log(message, data);
        switch (message) {
            case "isUpdateNow":
                if (confirm("现在更新？")) {
                    ipcRenderer.send("updateNow");
                }
                break;
            default:
                break;
        }
    });
    ipcRenderer.on("playAudio", function () {
        let audio = new Audio();
        audio.src = "@/../../static/audio/msg.ogg";
        audio.play();
    });
</script>

<style lang="scss">
    /* CSS */
    @import "./styles/index.scss";

    body {
        background: #f3f3f3;
    }

    #app {
        position: absolute;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
    }
</style>
