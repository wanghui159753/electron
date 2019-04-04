<template>
    <div class="quote-list">
        <ul class="title">
            <el-col :span="2" class="type border">品牌</el-col>
            <el-col :span="5" class="border">车型</el-col>
            <el-col :span="7" class="border">配件清单/询价留言</el-col>
            <el-col :span="2" class="border">图片附件</el-col>
            <el-col :span="5" class="border">采购商</el-col>
            <el-col :span="3">操作</el-col>
        </ul>
        <div class="scrollList scrollbar" v-if="quoteList.total">
            <item
                    v-for="(item,index) in quoteList.records"
                    :key="index"
                    :item="item"
                    @click.native="isShow"
            ></item>
        </div>
        <nothing v-else></nothing>
        <frames v-model="frameShow" v-if="frameShow" :vin="vin" @click.native="cancalSHow"></frames>
    </div>
</template>

<script>
    import item from "./quoteOneListItem";
    import frames from "./framNumberCopy";
    import nothing from "./nothing";
    import {finish} from "@/api/quote/quote";

    export default {
        props: ["quoteList"],
        components: {item, frames, nothing},
        mounted() {
            if (document.querySelector(".scrollbar")) {
                document.querySelector(".scrollbar").scrollTop = this.$route.meta.scollTopPosition;
            }
        },
        methods: {
            cancalSHow(e) {
                if (e.target.className == "bgc") {
                    this.frameShow = false;
                }
            },
            isShow(e) {
                if (
                    e.target.className == "frame" &&
                    e.target.innerHTML !== "车架号暂无"
                ) {
                    this.frameShow = true;
                    this.vin = e.target.innerHTML;
                } else if (e.target.className == "frame") {
                    this.$message.error("车架号暂无");
                }
            }
        },
        data() {
            return {
                frameShow: false,
                vin: ""
            };
        }
    };
</script>

<style lang="scss" scoped>
    div {
        span {
            color: #999;
        }
    }

    span {
        color: #fc684f;
    }

    .border {
        border-right: 1px solid #E6E6E6;
    }

    .quote-list .scrollList {
        overflow-x: hidden;
        height: calc(100% - 70px);
    }

    .title {
        display: flex;
        justify-content: space-around;
        background: linear-gradient(#e7e7e7, #f9f9f9);
        text-align: center;
        font-size: 14px;
        color: #333;
        font-weight: 600;
        line-height: 49px;
        border-bottom: 1px solid rgba(243, 243, 243, 0);
    }
</style>

