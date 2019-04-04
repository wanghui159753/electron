<template>
    <header class="assessories">
        <div class="search">
            <input placeholder="搜索品牌/汽配经销商" v-model="search" @keyup.enter="sendObj">
            <button @click="sendObj">搜索</button>
        </div>
        <ul class="Recommend">
            <li v-for="(x,index) in hotBrand" :key="x" :class="{left_border:index==0,color:index==3||index==5}"
                @click="sendObj(x)">{{x}}
            </li>
        </ul>
    </header>
</template>
<script>
    import {getLocal, setLocal} from "@/utils/localstorage";
    import {getMyShop} from "@/api/admission/admission";
    import request from "@/utils/request";

    export default {
        props: ["cityname",'search'],
        data() {
            return {
                storinfo: null,
                // search: "",
                hotBrand: ["大众", "丰田", "宝马", "奔驰", "玛莎拉蒂", "福特", "特斯拉"]
            };
        },
        methods: {
            sendObj(str) {
                setLocal('accessoriesKeyword', this.search)
                this.$router.push({
                    path: "/accessories/searchList",
                    query: {keyWord: str||this.search}
                });
            },
            esc(el) {
                el.target.className.indexOf("iscity") !== -1 ||
                el.target.parentNode.className.indexOf("iscity") !== -1
                    ? null
                    : this.$emit("input", false);
            }
        },
        actived() {
            this.search = getLocal('accessoriesKeyword') || '';
        },
        mounted() {
            this.search = getLocal('accessoriesKeyword') || '';
            document.body.addEventListener("click", this.esc);
        },
        beforeDestroy() {
            document.body.removeEventListener("click", this.esc);
        }
    };
</script>
<style lang="scss" scoped>
    .assessories {
        height: 86px;
        padding-top: 5px;
        background: #fff;
        display: block;
        .Recommend {
            width: 440px;
            margin: 0 auto;
            overflow: hidden;
            .left_border {
                border-left: 0;
            }
            .color {
                color: #fc684f;
            }
            li:hover {
                text-decoration: underline;
            }
            li {
                color: #333;
                list-style: none;
                float: left;
                padding: 0 9px;
                font-size: 12px;
                line-height: 12px;
                border-left: 1px solid #ccc;
                cursor: pointer;
            }
        }
        .search {
            margin: 0 auto 13px;
            width: 440px;
            height: 42px;
            border: 1px solid #fc684f;
            display: flex;
            input {
                width: 360px;
                height: 40px;
                text-indent: 12px;
                border: 0;
                outline: 0;
            }
            button:hover {
                background: rgba(252, 104, 79, 0.8);
            }
            button {
                transition: all 0.3s;
                border: 0;
                outline: 0;
                width: 80px;
                background: #fc684f;
                color: #fff;
                font-size: 14px;
            }
        }
    }
</style>