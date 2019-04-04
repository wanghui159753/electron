<template>
    <div class="aboutme " v-if="aboutmeList">
        <div class="camp">
            <p v-if="coppe">我的主营：<span>{{brand}}</span></p>
        </div>
        <OneList class="qouteLists scrollbar" :quoteList="aboutmeList"></OneList>
        <div class="page" v-if="aboutmeList.total>10">
            <el-pagination
                    :page-size="10"
                    layout="prev, pager, next, jumper"
                    :total="aboutmeList.total"
                    background
                    @current-change="getMore"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {operation, getList, manageOperation} from "@/api/quote/quote";
    import OneList from "./model/quoteOneList";
    import pager from "@/components/pager/pager";

    export default {
        components: {OneList, pager},
        data() {
            return {
                aboutmeList: null,
                coppe: null,
                brand: "",
                part: ""
            };
        },
        methods: {
            getMore(i) {
                this.aboutme(i);
            },
            aboutme(i) {
                getList({
                    pageNo: i ? i : 1,
                    pageSize: 10,
                    sortType: 3,
                    brands: this.brand,
                    parts: this.part
                }).then(res => {
                    this.aboutmeList = res.data;
                });
            },
            getList() {
                operation()
                    .then(res => {
                        this.brand = res.data.map(item=>{
                            return item.labelName;
                        }).join(',')
                        this.coppe = res.data;
                    })
                    .catch(() => {
                        this.brand = '尚未入驻';
                        this.coppe = 1;
                        this.$message.error('请申请入驻后再查询')
                    })
                    .then(() => {
                        this.aboutme(1);
                    })
            },
            getMymangeScoped(){
                manageOperation().then(res=>{
                    this.brand =res.data.merchantBrandList.map(item=>{
                        return item.brandName;
                    }).join(',');
                    this.part=res.data.merchantPartsList.map(item=>{
                        return item.partsName;
                    }).join(',');
                    this.coppe = res.data;
                }).then(() => {
                    this.aboutme(1);
                })
            }
        },
        created() {
            console.log(this.$store.state.user.storeInformation.merchantFieldPass!='forward')
            if(this.$store.state.user.storeInformation.merchantFieldPass){
                this.getList();
            }else{
                this.getMymangeScoped();
            }
        }
    };
</script>

<style scoped lang="scss">
    .camp {
        height: 60px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        color: #333333;
        background: #fff;
        padding-left: 22px;
        span {
            color: #fc684f;
        }
    }
</style>
