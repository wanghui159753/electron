<template>
    <div class="quote-one">
        <div class="quote-one-top">
            <div class="left">
                <!-- <div>
                  <span :class="{backGround:tab}">待报价</span>
                  <span :class="{backGround:!tab}">已忽略</span>
                </div>-->
            </div>
            <div class="topHeader">
                <div class="serch">
                    <el-input placeholder="搜索品牌/配件名称" @keyup.enter.native="list(postData)" v-model="keyWord"></el-input>
                    <el-button @click="list(postData)" type="primary" icon="el-icon-search"></el-button>
                </div>
                <el-cascader
                        :options="options"
                        v-model="value"
                        @change="handleChange">
                </el-cascader>
                <div class="chooseCar" @click="brand.isShow=true">
                    <p class="noChoose" v-if="!brand.cont.length">全部车型品牌</p>
                    <div><span>{{brand.cont|Name}}</span></div>
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div class="reload" @click="reload"><img src="@/../../static/image/zhongzhi@2x.png" width="16" alt="">重置
                </div>
            </div>
        </div>
        <brand @click.native="hid" @input="req" v-if="brand.isShow" v-model="brand"></brand>
        <one-list class="qouteLists" :quoteList="quoteList" :key="Math.random()"></one-list>
        <pager @click.native="hid" :size="20" :total="quoteList.total" @sizeChange="getMore"></pager>
    </div>
</template>

<script>
    import OneList from "./model/quoteOneList";
    import screening from "./model/screening";
    import brand from "./model/brand";
    import city from "./model/city";
    import parts from "./model/parts";
    import {getList, getCity} from "@/api/quote/quote";
    import {myInfo} from "@/api/basicData/basicData";
    import {setLocal} from "@/utils/localstorage";
    import pager from "@/components/pager/pager";
    import {getSpecialCity} from "@/api/basicData/basicData"

    export default {
        filters: {
            Name(val) {
                let str = ''
                val.forEach((item, index) => {
                    str = str + item.name + (index == val.length - 1 ? '' : '、');
                })
                return str
            }
        },
        data() {
            return {
                tab: true,
                radio3: 1,
                quoteList: [],
                options: [],
                brand: {
                    isShow: false,
                    cont: []
                },
                value: [],
                keyWord: ''
            };
        },
        computed: {
            postData() {
                let province = this.value[0]
                    ? this.value[0].split(",")[1]
                    : "";
                let city = this.value[1]
                    ? this.value[1].split(",")[1]
                    : "";
                let brands = this.brand.cont
                    .map(item => {
                        return item.name;
                    })
                    .join(",");
                return {
                    province,
                    city,
                    brands,
                    pageSize: 20,
                    keyword: this.keyWord
                };
            }
        },
        components: {
            OneList,
            screening,
            city,
            parts,
            pager,
            brand
        },
        methods: {
            reload() {
                this.value = [];
                this.brand.cont = [];
                this.keyWord = '';
                this.list()
            },
            req(val) {
                this.brand = val;
                this.list(this.postData)
            },
            hid(e) {
                if (e.target.className == 'bgc') {
                    this.brand.isShow = false;
                }
            },
            handleChange() {
                this.list(this.postData)
            },
            hid(e) {
                if (e.target.className == "bgc") {
                    this.selobj.isShow = false;
                }
            },
            initCity() {
                getCity().then(res => {
                    this.options = getSpecialCity(res.data, 2)
                })
            },
            list(data) {
                this.$store.commit('setLoading', true)
                getList(data).then(res => {
                    this.quoteList = res.data;
                    this.$store.commit('setLoading', false)
                });
            },
            getMore(n) {
                this.list(Object.assign({pageNo: n}, this.postData));
            }
        },
        created() {
            this.list({pageSize: 20});
            this.initCity()
        }
    };
</script>

<style lang="scss" scoped>
    .quote-one {
        background: #fff;
        height: calc(100% - 58px);
    }

    .qouteLists {
        height: calc(100% - 118px);
    }

    .reload {
        cursor: pointer;
        line-height: 40px;
        color: #FF6749;
        img {
            vertical-align: text-bottom;
            margin-right: 7px;
        }
    }

    .topHeader {
        display: flex;
        padding: 19px 0 16px 0;
        .serch {
            width: 330px;
            height: 44px;
            position: relative;
            margin: 0 32px 0 23px;
            .el-input {
                height: 44px;
            }
            .el-button {
                position: absolute;
                width: 61px;
                height: 38px;
                padding: 0;
                right: 1px;
                top: 1px;
            }
        }
    }

    .chooseCar {
        margin: 0 20px 0 30px;
        cursor: pointer;
        width: 295px;
        height: 40px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(204, 204, 204, 1);
        border-radius: 4px;
        position: relative;
        line-height: 40px;
        font-size: 14px;
        padding-left: 10px;
        .noChoose {
            color: #999999;
        }
        div {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 94%;
        }
        i {
            position: absolute;
            right: 5px;
            top: 12px;
        }

    }
</style>
<style lang="scss">
    .topHeader {
        .serch {
            .el-input {
                input {
                    border-radius: 22px;
                    border-color: #fa5110;
                }
            }
            .el-button {
                border: 0;
                border-top-right-radius: 22px;
                border-bottom-right-radius: 22px;
            }
        }
        .el-cascader {
            width: 160px;
        }
    }
</style>


