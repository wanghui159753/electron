<template>
    <div class="scrollbars">
        <div class="top">
            <div class="buyer">
                买家 <span>{{$store.state.im.myInfo.nick}}</span>
            </div>
            <div class="seller">
                卖家 <p v-if="showName.length" @click="$emit('chooseSeller')">{{showName.join(';')}}<span>可多选</span></p>
                <p v-else @click="$emit('chooseSeller')">选择卖家</p>
            </div>
        </div>
        <div class="details">
            <div class="carInfo">
                <h4>车辆信息</h4>
                <div class="sel">
                    <div style="margin-right: 14px">品牌</div>
                    <div class="right">
                        <div v-if="publish.vehicleBrand">
                            <div class="borderCCC">
                                <img :src="publish.logo" width="28" alt="">
                                <div>
                                    <p class="brandName">{{publish.vehicleBrand}}</p>
                                </div>
                            </div>
                            <div class="reselection" @click="showCar=true">
                                重新选择>
                            </div>
                        </div>

                        <div v-else class="borderCCC ounBor" @click="showCar=true">
                            <p>选择车型></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="orderList">
                <h4>需求清单</h4>
                <div class="table">
                    <div class="top">
                        <el-col :span="3">排序</el-col>
                        <el-col :span="12">配件名称</el-col>
                        <el-col :span="4">操作</el-col>
                        <el-col :span="5" style="cursor:pointer;" @click.native="delPart"><img
                                src="@/../../static/image/rubish.png" alt=""> 清空全部
                        </el-col>
                    </div>
                    <div class="list" v-for="(item,x) in publish.partList" :key="x" :class="{addBg:x%2}">
                        <el-col :span="3">{{x+1}}</el-col>
                        <el-col :span="12" style="position: relative">
                            <el-input v-model="item.subName" placeholder="请添加配件" @focus="item.isShow=true"></el-input>
                            <part-s
                                    class="parts"
                                    :inputValue="item.subName"
                                    :partsList="partsList"
                                    @choose="choose(item,arguments)"
                                    v-show="item.isShow&&item.subName">
                            </part-s>
                        </el-col>
                        <el-col :span="4"><img src="@/../../static/image/delpic.png" alt="" @click="delPart(x)">
                        </el-col>
                        <el-col :span="5"></el-col>
                    </div>
                    <div class="addMore">
                        <div @click="publish.partList.push({subName:'',isShow:false})">
                            <span>+</span>继续添加
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="send">
            <el-button type="primary" @click="sendRequest">发送清单</el-button>
        </div>
        <brand v-model="publish" v-if="showCar" @close="showCar=false"></brand>
    </div>
</template>
<script>
    import partS from '@/components/order/partSearch';
    import {getLocal, setLocal} from "@/utils/localstorage";
    import {accessory, imCreatedInventory} from "@/api/quote/quote";
    import brand from '../../shopping/model/pulb';
    import {getUserIdOrAccid} from '@/utils/index';

    export default {
        props: ['seller'],
        components: {partS, brand},
        data() {
            return {
                publish: {
                    logo: "",
                    partList: [{
                        subName: '',
                        isShow: false
                    }],
                    vehicleBrand: ""
                },
                showCar: false,
                partsList: [],
                brandShow: false,
                useSeller: [],
                showName: []
            }
        },
        created() {
            this.getPartList()
        },
        watch: {
            seller(val) {
                console.log(val)
                this.showName = [];
                let cur = this.$store.state.im.currSessionInfo;
                let flag = false;
                val.forEach(item => {
                    if (item.id == cur.id) flag = true;
                    this.showName.push(item.alias || item.name || item.nick);
                })
                this.useSeller = flag ? val : val.push(cur)
                !flag && this.showName.push(cur.alias || cur.name || cur.nick);
            }
        },
        methods: {
            sendRequest() {
                if(!this.useSeller.length){
                    this.$message.error('卖家不能为空');
                    return;
                }else if(!this.publish.logo){
                    this.$message.error('品牌不能为空');
                    return;
                }else if(!this.publish.partList.length) {
                    this.$message.error('配件不能为空');
                    return;
                }
                this.publish.partList=this.publish.partList.filter(item=>item.subName)
                imCreatedInventory(this.publish).then(res => {
                    this.getUserId(res.data);
                    this.$emit('input',false)
                })
            },
             getUserId(data){
                this.useSeller.forEach(item=>{
                    let accid=item.account||item.to||item.id.substring(4);
                        item.userId=getUserIdOrAccid(accid);
                        this.sendMsg(data,item)
                })
            },
            sendMsg(data,item){
                this.$store.dispatch("sendMsg", {
                    scene: 'p2p',
                    to:item.account||item.to||item.id.substring(4),
                    type: "custom",
                    content: {
                        msgType: 6,
                        msgContent: JSON.stringify({
                            //测试清单
                            orderId:data.id,
                            buyerId:this.$store.state.user.userInfos.userId,
                            buyerName:this.$store.state.im.myInfo.nick,
                            sellerId:item.userId,
                            brandName:data.vehicleBrand,
                            partName:data.partList.map(item=>{
                                return item.subName
                            }).join(',')
                        })
                    }
                });
            },
            delPart(x) {
                this.publish.partList.splice(x, 1);
            },
            initPartsList(res) {
                res.data.forEach(item => {
                    item.children.forEach(val => {
                        this.partsList.push(val);
                    });
                });
            },
            choose(val, item) {
                val.subName = item[0].name;
                val.isShow = false;
            },
            getPartList() {
                if (getLocal("allParts")) {
                    this.initPartsList(JSON.parse(getLocal("allParts")));
                } else {
                    accessory().then(res => {
                        setLocal("allParts", JSON.stringify(res));
                        this.initPartsList(res);
                        this.$store.commit('setLoading', false)
                    });
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    .scrollbars {
        color: #000;
        .parts {
            width: 100%;
            position: absolute;
            left: 0;
            top: 48px;
        }
        > .top {
            display: flex;
            div {
                line-height: 32px;
            }
            span, p {
                display: inline-block;
                margin-left: 7px;
                height: 34px;
                line-height: 32px;
                border: 1px solid #ccc;
                border-radius: 6px;
                padding: 0 15px;
            }
            div:first-child {
                margin-right: 50px;
                span {
                    width: 240px;
                }
            }
            .seller {
                display: flex;
                p {
                    span {
                        border: 0;
                        color: #ccc;
                        padding: 0;
                    }
                }
            }
        }
    }
    .send {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #F2F2F2;
        height: 56px;
        text-align: center;
        border-top: 1px solid #ccc;
        box-shadow:0px 0px 8px 0px rgba(129,129,129,0.7);
        .el-button {
            width: 120px;
            height: 40px;
            margin-top: 9px;
            img {
                vertical-align: middle;
            }
        }
    }
    h4 {
        font-size: 18px;
        border-left: 3px solid #FC684F;
        margin: 20px 0;
        text-indent: 12px;
    }

    .orderList {
        width: 664px;
        text-align: center;
        h4 {
            text-align: left
        }
        .top {
            background: #fc684f;
            height: 40px;
            line-height: 40px;
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;
            color: #fff;
            img {
                vertical-align: text-top;
            }
        }
        .list,
        .addMore {
            cursor: pointer;
            height: 56px;
            line-height: 56px;
            border: 1px solid #ccc;
            border-top: 0;
        }
        .list {
            .addParts {
                position: relative;
                border: 1px solid #ccc;
                border-radius: 5px;
                height: 36px;
                line-height: 36px;
                margin-top: 10px;
                text-indent: 2em;
                text-align: left;
                font-size: 14px;
                cursor: pointer;
            }
            img {
                vertical-align: middle;
            }
            .el-input__inner {
                background: #fff;
            }
        }
        .addMore {
            color: #fc684f;
            text-decoration: underline;
            margin-bottom: 60px;
            span {
                margin-right: 6px;
                display: inline-block;
                border: 1px solid #ccc;
                width: 16px;
                height: 16px;
                vertical-align: text-top;
                line-height: 14px;
            }
        }
    }

    .sel {
        font-size: 14px;
        line-height: 31px;
        display: flex;
        .right {
            .reselection {
                cursor: pointer;
                height: 100%;
                line-height: 34px;
                color: #fc684f;
                margin-left: 10px;
            }
            img {
                float: left;
                margin: 2px 10px 2px 0px;
            }
            span {
                float: left;
                margin-right: 10px;
            }
            .ounBor {
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 0 15px;
                text-indent: 2em;
                text-indent: 0;
                p {
                    text-decoration: underline;
                    color: #fc684f;
                }
            }
            div {
                cursor: pointer;
                float: left;
                .borderCCC {
                    float: left;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    padding: 0 10px;
                }
                span {
                    float: left;
                    margin-right: 10px;
                }
            }
            .brandName {
                font-size: 16px;
                line-height: 32px;
            }
        }
    }
</style>