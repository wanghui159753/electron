<template>
    <div class="comdition">
        <div class="left">
            <ul class="tab">
                <li @click="sortType=1" :class="{isActive:sortType==1}">默认</li>
                <li @click="sortType=3" :class="{isActive:sortType==3}">活跃 <img src="@/../../static/image/Odown.png"
                                                                                width="9" alt="" v-if="sortType==3"><img
                        v-else src="@/../../static/image/down.png" width="9" alt=""></li>
                <li @click="sortType=4" :class="{isActive:sortType==4}">评分 <img src="@/../../static/image/Odown.png"
                                                                                width="9" alt="" v-if="sortType==4"><img
                        v-else src="@/../../static/image/down.png" width="9" alt=""></li>
            </ul>
            <div class="brand" @click="changeCarBrand" v-if="brand">
                <img :src="brand.logo" width="28" alt>
                <p style="color:#000">{{brand.name}}</p>
            </div>
            <div class="brand" @click="changeCarBrand" v-if="!brand">
                <img src="@/../../static/image/carType.png" width="28" alt>
                <p>选择车型 精准匹配</p>
            </div>
            <el-cascader
                    :options="options"
                    v-model="selectedOptions"
                    @change="handleChange"
                    placeholder="请选择城市"
            ></el-cascader>
        </div>
        <div class="right" @click="refresh">
            <img src="@/../../static/image/reload.png" width="16" alt>
            <span>刷新</span>
        </div>
    </div>
</template>
<script>
    import request from "@/utils/request";
    import {merchantCity, getSpecialCity} from "@/api/basicData/basicData.js";

    export default {
        props: ["brand"],
        data() {
            return {
                putinfo: "",
                myinfo: {},
                sortType: 1,
                options: [],
                selectedOptions: []
            };
        },
        watch: {
            sortType(val) {
                this.emitEvent();
            }
        },
        methods: {
            refresh() {
                this.sortType = 1;
                this.selectedOptions = []
                this.emitEvent();
                this.$emit("reLoad");
            },
            changeCarBrand() {
                this.$emit("changeCarBrand");
            },
            handleChange(e) {
                this.emitEvent();
            },
            emitEvent() {
                this.$emit("sendObj", {
                    sortType: this.sortType,
                    provinceId: this.selectedOptions[0]
                        ? this.selectedOptions[0].split(",")[0]
                        : null,
                    regionId: this.selectedOptions[2]
                        ? this.selectedOptions[2].split(",")[0]
                        : null,
                    cityId: this.selectedOptions[1]
                        ? this.selectedOptions[1].split(",")[0]
                        : null
                });
            },
            search() {
                this.$emit("keyword", this.putinfo);
            },
            reset() {
                this.$emit("reset");
            },
            initArea() {
                merchantCity().then(res => {
                    this.options = getSpecialCity(res.data,3);
                });
            }
        },
        created() {
            this.initArea();
            request({
                url: "merchant/merchant/session/info",
                method: "get"
            }).then(res => {
                this.myinfo = res.data;
            });
        }
    };
</script>
<style lang="scss" scoped>
    @mixin fl {
        float: left;
    }

    .comdition {
        cursor: pointer;
        padding: 0 16px;
        overflow: hidden;
        background: #f8f8fa;
        justify-content: space-between;
        div {
            height: 50px;
            line-height: 50px;
        }
        .left {
            float: left;
            overflow: hidden;
            .tab {
                float: left;
                display: flex;
                list-style: none;
                margin-right: 32px;
                .isActive {
                    color: #ff6749;
                    border-color: #ff6749;
                }
                li {
                    text-align: center;
                    width: 80px;
                    height: 50px;
                    line-height: 50px;
                    border-bottom: 3px solid transparent;
                }
            }
            .brand {
                float: left;
                width: 175px;
                padding: 0 10px;
                height: 36px;
                margin-right: 32px;
                margin-top: 7px;
                border: 1px solid #e5e5e5;
                display: flex;
                align-items: center;
                font-size: 13px;
                color: #cccccc;
                line-height: 36px;
                img {
                    margin-right: 13px;
                }
            }
        }
        .right {
            float: right;
            font-size: 16px;
            img {
                vertical-align: text-top;
            }
        }
    }
</style>
<style lang='scss'>
    .comdition {
        .el-cascader {
            margin-top: 10px;
            float: left;
            .el-icon-arrow-down,
            .el-icon-arrow-up {
                line-height: 30px;
            }
        }
        .el-cascader,
        .el-input__inner,
        .el-input {
            width: 116px !important;
            height: 30px;
            line-height: 30px;
        }
    }
</style>
