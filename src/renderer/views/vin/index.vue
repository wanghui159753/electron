<template>
    <div class="vin">
        <keep-alive>
            <div class="vin-container">
                <div class="top">
                    <el-input
                            v-model="input"
                            maxlength="17"
                            placeholder="请输17位车架号"
                            size="mini"
                            @keyup.enter.native="requestVin"
                    >
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <img src="@/../../static/image/close.png" width="18" alt v-if="input" @click="input=''">
                </div>
                <div class="left">
                    <div class="history">
                        <p @click="HZ=!HZ">历史纪录
                            <img src="@/../../static/image/open.png" :class="{togoOpen:HZ}" width="18" alt>
                        </p>
                    </div>
                    <div class="outer-container">
                        <v-contextmenu ref="contextmenu" class="contextmenu-left">
                            <v-contextmenu-item @click.native="del">删除</v-contextmenu-item>
                        </v-contextmenu>
                        <ul class="content inner-container" :class="{HZ:HZ}" v-if="history">
                            <li
                                    v-for="(item,index) in history"
                                    :key="index"
                                    @click="handleClick(index,item)"
                                    v-contextmenu:contextmenu
                                    @contextmenu="curClear(item,index,$event)"
                            >
                                <div slot="label" class="m-title" :class="{active: activeName == index}">
                                    <div class="m-title-left">
                                        <div class="t-l-conter">
                                            <h5>
                                                <span class="vin-button">VIN</span>
                                                {{item.vin.toUpperCase()}}
                                            </h5>
                                            <p>{{item.brand+'-'+item.series}}</p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <p @click="loadMore" v-if="this.total==10" class="loadMore">加载更多</p>
                        </ul>
                    </div>
                </div>
                <div class="right bg">
                    <div class="tit">心动配讯车架号查询</div>
                    <vin-right :dataVin="vinData" v-if="vinData"></vin-right>
                    <div class="nothing">
                        <img src='@/../../static/image/vinDefault.png' width="270" alt>
                    </div>
                </div>
            </div>
        </keep-alive>
    </div>
</template>

<script>
    import VinRight from "./model/vinRight";
    import {vin, delVin, vinHistory} from "@/api/basicData/basicData";
    import {ipcRenderer} from 'electron';
    export default {
        name: "Message",
        data() {
            return {
                input: "",
                activeName: 0,
                vinData: null,
                history: [],
                HZ: false,
                page: 1,
                total: 0,
                boo: false
            };
        },
        components: {
            VinRight
        },
        watch: {
            input(val, old) {
                if (!val) return;
                if(val.length==17){
                    (/^[a-zA-Z0-9]{17}$/g.test(this.input)) ? this.requestVin() : this.$message.error('请输入正确的车架号');
                }
            }
        },
        methods: {
            requestVin() {
                /^[a-zA-Z0-9]{17}$/.test(this.input)
                    ? vin({vin: this.input})
                        .then(res => {
                            this.vinData = res.data;
                            this.boo ? null : this.$message.success({message: "车架号查询完毕", duration: 1000});
                            this.boo = false;
                        })
                        .catch(() => {
                            this.boo ? null : this.$message.error({message: "此车架号查询无果", duration: 1000});
                        })
                    : this.boo ? null : this.$message.error({message: "请输入正确的车架号", duration: 1000});

            },
            loadMore() {
                this.page++;
                this.vinHistory({
                    pageNo: this.page
                });
            },
            curClear(item, index, event) {
                event.stopPropagation();
                this.activeName = index;
                this.sessionId = item.id;
                let dom = this.$refs.contextmenu;
                dom.style.top = event.pageY + "px";
                dom.style.display = "block";
                dom.style.left = event.pageX + "px";
            },
            del() {
                delVin({
                    id: this.history[this.activeName].id
                }).then(res => {
                    this.$message.success("删除成功");
                    this.history.splice(this.activeName, 1);
                });
            },
            handleClick(i, item) {
                this.boo = true;
                this.activeName = i;
                this.input = item.vin.toUpperCase();
            },
            vinHistory(obj) {
                vinHistory(obj).then(res => {
                    this.total = res.data.records.length;
                    this.history = this.history.concat(res.data.records);
                    if(res.data.records.length){
                        this.input = this.input || res.data.records[0].vin;
                    }
                });
            }
        },
        created() {
            this.vinHistory();
            this.input = this.$route.query.vin;
            ipcRenderer.send('llll')
        },
        beforeDistory() {
        }
    };
</script>

<style scoped lang="scss">
    .HZ {
        height: 0 !important;
    }

    .togoOpen {
        transform: rotate(-90deg);
    }

    .history {
        cursor: pointer;
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        text-indent: 1em;
        color: #291c1c;
        img {
            vertical-align: text-top;
            transition: all 0.5s;
        }
    }

    .outer-container,
    .content {
        width: 275px;
        height: calc(100vh - 180px);
        transition: all 0.5s;
    }

    .active {
        background-color: #e0e0e0;
        border-right: 2px solid #ff6749;
    }

    .vin {
        position: relative;
        .vin-container {
            display: flex;
            justify-content: space-between;
            position: relative;
            .top {
                display: inline-block;
                position: absolute;
                left: 10px;
                top: 28px;
                z-index: 50;
                img {
                    position: absolute;
                    right: 6px;
                    top: 15px;
                }
            }
            .left {
                background: #fff;
                padding-top: 100px;
                border-right: 1px solid #d7d7d7;
                border-top: 1px solid #d7d7d7;
                .loadMore {
                    text-align: center;
                    padding: 15px 0;
                    font-size: 14px;
                    color: #666;
                    text-decoration: underline;
                    cursor: pointer;
                }
                ul {
                    li {
                        list-style: none;
                    }
                    .m-title {
                        display: flex;
                        justify-content: space-between;
                        line-height: normal;
                        padding: 10px 5px;
                        border-bottom: 1px solid #e0e0e0;
                        .m-title-left {
                            display: flex;
                            justify-content: space-between;
                            color: #343232;
                        }
                        .t-l-conter {
                            padding-left: 10px;
                            text-align: left;
                            span.vin-button {
                                height: 20px;
                                padding: 0 5px;
                                display: inline-block;
                                background-color: #ff6749;
                                color: white;
                                line-height: 20px;
                                border-radius: 4px;
                                margin-right: 4px;
                            }
                            h5 {
                                font-size: 14px;
                                line-height: 28px;
                                color: #291c1c;
                            }
                            p {
                                font-size: 16px;
                                line-height: 20px;
                                color: #888584;
                                text-indent: 33px;
                            }
                        }
                    }
                }
            }
        }
        .right {
            width: calc(100% - 275px);
            background: #f3f3f3;
            .tit {
                height: 58px;
                font-size: 18px;
                color: #000;
                font-weight: 700;
                text-align: center;
                line-height: 58px;
                border-bottom: 1px solid #fff;
            }
            .nothing {
                height: calc(100% - 58px);
                width: 100%;
                background: #F5F5F5;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>
<style lang="scss">
    .vin {
        .el-input {
            width: 256px;
            height: 50px;
            input {
                width: 100%;
                height: 50px;
                font-size: 16px;
            }
            span {
                i {
                    font-size: 22px;
                }
            }
        }
    }
</style>