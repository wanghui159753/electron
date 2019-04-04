<template>
    <div class="quote">
        <div class="quote-top">
            <p></p>
            <div class="center">
                <div @click="$router.push('/quote/index/one');num=1;" :class="{borBg:num==1}">急需报价</div>
                <div @click="$router.push('/quote/index/two');num=2" :class="{borBg:num==2}" >与我相关</div>
            </div>
            <p></p>
        </div>  
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>
<script>
    export default {
        name: "Quote",
        data() {
            return {
                activeIndex: "/quote/index/one",
                num:1
            };
        },
        methods: {
            handleSelect(val) {
            }
        },
        watch: {
            activeIndex() {
                this.activeIndex = this.$route.path;
            }
        },
        created() {
            this.activeIndex = this.$route.path;
        }
    };
</script>
<style lang="scss" scoped>
    .quote {
        background-color: #f3f3f3;
        height: calc(100vh - 30px);
        ul {
            li {
                line-height: 58px !important;
                height: 58px !important;
            }
        }
        .quote-top {
            background-color: #f3f3f3;
            position: relative;
            display: flex;
            justify-content: space-around;
            height: 58px;
            line-height: 58px;
            .center {
                display: flex;
                justify-content: center;
                border: none;
                text-align: center;
                cursor: pointer;
                div {
                    width: 134px;
                    color: #291c1c;
                    font-size: 18px;
                    height: auto;
                    font-weight: 600;
                    line-height: 58px;
                    border-bottom: 4px solid transparent;
                }
            }
        }
    }
    .borBg{
        border-bottom: 4px solid #FC684F !important;
        color:#FC684F !important;
    }
</style>

