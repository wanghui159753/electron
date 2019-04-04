<template>
    <div class="offeList" v-if="list">
        <had>
            <div class="tit">我的报价单</div>
        </had>
        <list class="myquote" :quoteList='list'></list>
        <pager :total='list.total' @sizeChange='next'></pager>
    </div>
</template>
<script>
    import had from "../shopping/model/hed";
    import list from "../quote/model/quoteOneList";
    import pager from "@/components/pager/pager";
    import {getMyQuote} from "@/api/quote/quote.js";

    export default {
        components: {had, list, pager},
        data() {
            return {
                list: null
            };
        },
        methods: {
            next(i) {
                this.getList(i);
            },
            getList(i) {
                this.$store.commit('setLoading', true)
                getMyQuote({
                    pageNo: i || 1
                }).then(res => {
                    this.list = res.data;
                    this.$store.commit('setLoading', false)
                });
            }
        },
        created() {
            this.getList();
        }
    };
</script>
<style lang="scss" scoped>
    .offeList {
        height: calc(100% - 10px);
        header {
            background: #dedede;
        }
        .tit {
            text-align: center;
            width: 100%;
            color: #000;
            font-weight: 600;
        }
        .myquote {
            height: calc(100% - 88px);
            overflow: hidden;
        }
    }
</style>
