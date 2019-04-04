<template>
    <div class="bigBox" v-if="seach">
        <usinfo v-model="search"></usinfo>
        <condition
                v-model="iscartype"
                @sendObj="assignObj"
                :brand="brandID"
                @reset="reset"
                @changeCarBrand="iscartype=true"
                @reLoad="reLoad"
        ></condition>
        <cartype v-if="iscartype" @brandid="send" @close='close'></cartype>
        <div class="backTop el-icon-upload2" @click="goTop" :style="style"></div>
        <div class="scrollBox scrollbar" @scroll="scroll">
            <list :search="seach" class="computedHeight"></list>
            <div class="page" v-if="seach.total>40">
                <el-pagination
                        :page-size="seach.size"
                        background
                        @current-change="handleSizeChange"
                        layout=" prev, pager, next, jumper"
                        :total="seach.total||0"
                        v-if="seach.total"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import usinfo from "./compon/head";
    import condition from "./compon/condition";
    import list from "./compon/list";
    import cartype from "./compon/typech";
    import city from "./compon/city";
    import request from "@/utils/request";
    import Bus from "@/utils/bus";
    import {getAutosellerPage} from "@/api/accessories/index.js";

    export default {
        name: "Accessories",
        components: {usinfo, list, condition, cartype, city},
        data() {
            return {
                search: '',
                requestObj: {
                    pageNo: 1,
                    pageSize: 40,
                    labelId: null,
                    cityId: null,
                    sortType: 1
                },
                iscartype: false,
                seach: null,
                cityId: {},
                brandID: null,
                style: {
                    display: "none"
                },
                contextMenuData: {
                    menuName: null,
                    axios: {
                        x: null,
                        y: null
                    },
                    menulists: [
                        {
                            fnHandler: "copy",
                            icoName: "fa fa-home fa-fw",
                            btnName: "复制"
                        },
                        {
                            fnHandler: "stickiness",
                            icoName: "fa fa-home fa-fw",
                            btnName: "粘粘"
                        }
                    ]
                },
                transferIndex: {
                    type: Number,
                    default: 0
                }
            };
        },
        methods: {
            close() {
                this.iscartype = false;
            },
            reLoad() {
                this.search = '';
                this.brandID = null;
                this.assignObj({
                    pageNo: 1,
                    pageSize: 40,
                    labelId: null,
                    cityId: null,
                    sortType: 1
                });
                this.goTop()
            },
            //返回顶部
            scroll(e) {
                if (e.srcElement.scrollTop > 500) {
                    this.style.display = "block";
                } else {
                    this.style.display = "none";
                }
            },
            goTop() {
                let dom = document.getElementsByClassName("scrollBox")[0];
                dom.scrollTop = 0;
                dom = null;
                this.style.display = "none";
            },
            assignObj(obj) {
                this.$store.commit('setLoading', true)
                this.requestObj = Object.assign(this.requestObj, obj);
                getAutosellerPage(this.requestObj).then(res => {
                    this.$store.commit('setLoading', false)
                    this.seach = res.data;
                });
            },
            //重置
            reset(i) {
                this.assignObj({});
            },
            //获取品牌ID
            send(x) {
                this.iscartype = false;
                this.brandID = x;
                this.assignObj({labelId: x.id}); //x.brandId
            },
            //点击页码
            handleSizeChange(i) {
                this.goTop();
                this.assignObj({pageNo: i});
            },
            showMenu(index) {
                this.transferIndex = index; // tranfer index to child component
                event.preventDefault();
                var x = event.clientX;
                var y = event.clientY;
                this.contextMenuData.axios = {
                    x,
                    y
                };
            },
            backUp(el) {
                if (el.target.className == "typeCar") {
                    this.iscartype = false;
                }
            }
        },
        created() {
            this.reset();
        },
        watch: {
            "contextMenuData.axios"(val) {
                var x = val.x;
                var y = val.y;
                var _this = this;
                var index = _this.transferIndex;
                var menuName = "vue-contextmenuName-" + _this.contextMenuData.menuName;
                var menu = document.getElementsByClassName(menuName)[index];
                menu.style.display = "block";
                menu.style.left = x + "px";
                menu.style.top = y + "px";
                document.addEventListener(
                    "mouseup",
                    function () {
                        menu.style.display = "none";
                    },
                    false
                );
            }
        },
        mounted() {
            document.body.addEventListener("click", this.backUp);
        },
        beforeDestroy() {
            document.body.removeEventListener("click", this.backUp);
        }
    };
</script>
<style scoped lang='scss'>
    .scrollBox {
        height: calc(100% - 135px);
        background: #fff;
    }

    .backTop {
        width: 44px;
        height: 44px;
        position: fixed;
        right: 10px;
        bottom: 60px;
        font-size: 30px;
        border: 1px solid #ccc;
        text-align: center;
        line-height: 44px;
        color: #ccc;
        z-index: 5;
        background: #fff;
    }

    .backTop:hover {
        color: black;
        cursor: pointer;
    }

    .bigBox {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        .page {
            position: initial;
        }
    }

    .block .el-pagination {
        display: inline-block;
    }
</style>
