<template>
    <div class="item" v-if="item">
        <el-col :span="2" :class="{finishs:item.enquiry.status}">
            <div class="headPic">
                <img :src="item.enquiry.logo" width="50" height="50" alt="">
            </div>
        </el-col>
        <el-col :span="5" :class="{finishs:item.enquiry.status}">
            <div class="carname">
                <p>
                    {{item.enquiry.vehicleBrand}}
                    <span v-if="item.enquiry.type=='PRECISE'">（{{item.enquiry.vehicleSerie}}）</span>
                </p>
                <p style="font-size:12px">{{formatTime(item.enquiry.createTime)}}</p>
            </div>
        </el-col>
        <el-col :span="7" :class="{finishs:item.enquiry.status}">
            <div class="parts">
                <p v-if="item.enquiry.type=='PRECISE'"><span>共{{item.partList.length}}件</span>{{item.partList|toString}}
                </p>
                <p v-else>{{item.enquiry.remark}}</p>
            </div>
        </el-col>
        <el-col :span="2">
            <div class="imglist" v-if="item.imageList" @click="look">
                <img width="60" :src="item.imageList.length?item.imageList[0].image:require('../../../../../static/image/noPic.png')" alt="">
                <p v-if="item.imageList.length">共{{item.imageList.length}}张</p>
            </div>
        </el-col>
        <el-col :span="5" class="buyer">
            <div class="finish finishs">
                <img src="@/../../static/image/finish.png" alt v-if="item.enquiry.status">
            </div>
            <p class="buyerInfo" v-if="$route.fullPath!=='/shopcar/index'">
                {{item.enquiry.identityParentName+':'}}<span>{{item.enquiry.identitySubName}}</span></p>
            <p class="buyerInfo" v-else>{{item.enquiry.userName}}</p>
            <p class="area finishs">
                <img :src="url[isFinish]" width="10" height="12" alt>
                {{item.enquiry.province}}
                {{item.enquiry.city}} {{ item.enquiry.region}}
            </p>
            <p class="sf" :class="{finishs:item.enquiry.status}">
                <img v-if="item.enquiry.authList.includes('实地认证经销商')" src="@/../../static/image/shidi.png" width="102"
                     height="22" alt="">
                <img v-if="item.enquiry.authList.includes('实地认证汽修厂')" src="@/../../static/image/jxs.png" width="102"
                     height="22" alt="">
            </p>
        </el-col>
        <el-col :span="3" class="actived" :class="{finishs:item.enquiry.status}">
            <div v-if="$route.fullPath==='/quotation/index'">
                <el-button
                        :type="item.enquiry.status?'info':'primary'"
                        @click="goDetail(item)"
                        :disabled="item.enquiry.status"
                >修改报价
                </el-button>
            </div>
            <div v-else-if="['/quote/index/one','/quote/index/two','/shopcar/index'].includes($route.fullPath)">
                <el-button class="look"
                           plain
                           :type="item.enquiry.status?'info':''"
                           @click="goQuote(item)"
                           :disabled="item.enquiry.status&&item.enquiry.accid!=$store.state.im.userUID"
                >立即查看
                    <span class="badge" v-if="item.enquiry.isQuote">报</span>
                </el-button>
                <!-- <span>忽略</span> -->
            </div>
            <p class="num" v-if="item.enquiry.quoteCount"><span>{{item.enquiry.quoteCount}}</span>个汽配商报价</p>
        </el-col>
    </div>

</template>
<script>
    import {lookPhoto} from "@/api/admission/admission";
    import {finish} from "@/api/quote/quote";
    import {getLocal} from "@/utils/localstorage";
    import {formatTime} from "@/utils/index";

    export default {
        filters: {
            toString(val) {
                let str = '';
                val.forEach((item, index) => {
                    str = str + item.subName + (index == val.length - 1 ? '' : '、');
                })
                return str
            }
        },
        props: ["item",'page'],
        data() {
            return {
                url: [
                    require("../../../../../static/image/cirlePosi.png"),
                    require("../../../../../static/image/grayPosi.png")
                ],
                isFinish: this.item.enquiry.status ? 1 : 0,
                show: false,
                num: 3
            };
        },
        methods: {
            formatTime(time) {
                return formatTime(time)
            },
            yesNO() {
                return isFinite == 1;
            },
            goDetail(item) {
                this.yesNO()
                    ? this.$message.warning("当前采购单已完成")
                    : this.$router.push({
                        path: "/quotation/detail",
                        query: {id: item.enquiryId, quoteId: item.quoteId}
                    });
            },
            goQuote(item) {
                this.yesNO()
                    ? this.$message.warning("当前采购单已完成")
                    : this.$router.push({
                        path: "/quote/details",
                        query: {
                            id: item.enquiryId
                        }
                    });
            },
            finish(item, dom) {
                if (/继续发布/.test(dom.target.innerHTML)) {
                    this.$router.push({
                        path: "/shopping/index/purchase",
                        query: {
                            id: item.enquiryId
                        }
                    });
                } else {
                    finish({
                        id: item.enquiryId
                    }).then(res => {
                        this.$message.success("提交完成");
                        this.isFinish = true;
                    });
                }
            },
            look() {
                this.item.imageList.length ? lookPhoto(0, this.item.imageList) : null;
            }
        }
    };
</script>
<style lang="scss" scoped>
    .badge {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 19px;
        height: 19px;
        font-size: 12px;
        background: #ff0000;
        border-radius: 100%;
        color: white !important;
        line-height: 19px;
    }

    .imglist {
        width: 60px;
        height: 60px;
        overflow: hidden;
        background: #eee;
        position: relative;
        p {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            color: #fff;
            font-size: 12px;
            line-height: 16px;
        }
    }

    .finishs {
        filter: grayscale(100%);
    }

    .item > div {
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    @mixin fl {
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    @mixin center {
        justify-content: center;
        flex-direction: column;
    }

    .look {
        color: #FC684F;
        border-color: #FC684F;
    }

    .look:hover {
        background: #FC684F;
        color: white;
    }

    .lookMore {
        width: 100%;
        height: 16px;
        text-align: left;
        text-decoration: underline;
        cursor: pointer;
    }

    .parts {
        p {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            span {
                color: #FC684F;
            }
        }
    }

    .item {
        padding: 5px 0;
        line-height: 24px;
        border-bottom: 1px solid #cccccc;
        position: relative;
        display: flex;
        justify-content: space-around;
        font-size: 14px;
        background: #fff;
        > div {
            > p {
                > span {
                    color: #FC684F;
                    margin-right: 5px;
                }
            }
        }
        .dialogxy {
            width: 500px;
            height: 300px;
        }
        .num {
            width: 130px;
            line-height: 24px;
            font-size: 12px;
        }
        .carInfo {
            margin-left: 24px;
            color: #333;
            align-items: center;
            overflow: hidden;
            p {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .carname {
                width: 70%;
                display: flex;
                @include center;
            }
            img {
                margin-right: 23px;
            }
            .frame {
                cursor: pointer;
                color: #fc684f;
                text-decoration: underline;
            }
        }
        .Accessories {
            flex-direction: column;
            font-size: 12px;
            height: 113px;
            overflow: hidden;
            div {
                img {
                    position: relative;
                    top: -2px;
                    width: 14px;
                    height: 14px;
                    vertical-align: middle;
                }
                p {
                    display: inline-block;
                }
            }
        }
        .pic {
            @include center;
            div {
                width: 80px;
                height: 80px;
                position: relative;
                overflow: hidden;
                border-radius: 5px;
                background: #dedede;
                p {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 20px;
                    text-align: center;
                    color: #fff;
                    width: 100%;
                    line-height: 20px;
                    background: rgba(0, 0, 0, 0.3);
                }
            }
            img {
                width: 100%;
            }
        }
        .buyer {
            @include fl;
            align-items: center;
            color: #000;
            position: relative;
            .finish {
                position: absolute;
                right: -26px;
                top: 0;
                bottom: 5px;
                display: flex;
                align-items: center;
                z-index: 10;
                img {
                    width: 74px;
                    height: 56px;
                }
            }
            p {
                font-size: 12px;
            }
            .buyerInfo {
                font-weight: bold;
                font-size: 14px;
                > span {
                    color: #000;
                    font-weight: 500;
                }
            }
            img {
                margin-right: 6px;
                height: 12px;
                position: relative;
                top: 2px;
            }
            .sf {
                img {
                    width: 102px;
                    height: 22px;
                }
            }
            .area {
                color: #fc684f;
            }
        }
        .actived {
            @include fl;
            align-items: center;
            color: #666;
            .el-button {
                position: relative;
                padding: 0;
                width: 100px;
                height: 30px;
                font-size: 12px;
                margin-right: 10px;
            }
            span {
                color: red;
            }
        }
        .connect {
            cursor: pointer;
            img {
                vertical-align: middle;
            }
            span {
                color: #666;
            }
        }
    }

    .buyerInfo {
        width: 100%;
        text-align: center;
    }

    .headPic {
        position: relative;
        width: 50px;
        height: 50px;
    }
</style>
<style>
    .headPic .el-badge {
        position: absolute;
        top: -5px;
        right: -8px;
    }

    .headPic .el-badge .el-badge__content {
        width: 20px;
        height: 20px;
        background: red;
        font-size: 12px;
        padding: 0;
        border-radius: 50%;
    }
</style>