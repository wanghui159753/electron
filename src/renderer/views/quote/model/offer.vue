<template>
    <div class="offerArea" v-if="spot">
        <header @mousedown="savePosition" @mousemove="setStyle" @mouseup="mocuseMove=false">
            <p></p>
            <p>报价</p>
            <p class="save el-icon-close" style="cursor: pointer" @click.stop="save"></p>
        </header>
        <div class="ffBg">
            <div class="content">
                <h3>配件名称： <span>{{allInfo.partList[index].subName}}</span></h3>
                <div class="one" v-for="(item,index) in addArr" :key="index+10" v-if="addArr.length"
                     :class="{isReset: isReset===index,lastBorder:index==addArr.length-1}">
                    <div class="left">
                        <span>
                            {{item.parts?item.parts.split(',')[1]:item.classifyName }}
                        </span>
                        <span>
                            {{item.isHave?item.isHave.split(',')[1]:item.typeName }}
                        </span>
                        <span>
                            ¥<span>{{item.priceS }}</span>
                        </span>
                    </div>
                    <div class="right">
                        <span @click="modify(index)">修改</span>
                        <span @click="delList(index)">删除</span>
                    </div>
                </div>
                <div class="one" v-else>您还没有报价</div>
                <div class="one margin">
                    <el-radio-group v-model="whether">
                        <el-radio :label="'CASH'+','+spot.CASH">现货</el-radio>
                        <el-radio :label="'RESERVE'+','+spot.RESERVE">预定</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="ishave">
                <div class="entry">
                    <span class="blod">配件类型：</span>
                    <el-select placeholder="请选择" v-model="parts">
                        <el-option
                                v-for="item in options"
                                :key="item.label"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disable"
                        >
                        </el-option>
                    </el-select>
                    <el-input placeholder="请输入单价" v-model="price" @keyup.native="reg">
                        <span slot="prefix" style="line-heihgt:100%;display:inline-block;padding:11px 5px;">￥</span>
                    </el-input>
                    <el-button type="primary" @click="add" :disabled="Boolean(!(parts&&whether&&price))">确定</el-button>
                </div>
                <div style="position: relative;display: flex">
                    <p class="blod">备&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp注<span>：&nbsp</span></p>
                    <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="请输入补充说明"
                            v-model="value.notes"
                            :maxlength="550">
                    </el-input>
                    <span style="position: absolute;right: 35px;bottom: -16px;font-size: 14px;">{{550-value.notes.length}}/550</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {getPartType} from "@/api/quote/quote";
    import {FloatMul} from "../../../utils";

    export default {
        data() {
            return {
                whether: "CASH,现货",
                parts: "",
                options: [],
                spot: null,
                //已添加的报价
                addArr: [],
                allInfo: null,
                price: "",
                isReset: "",
                mocuseMove: false,
                position: null,
                saveType: []
            };
        },
        methods: {
            savePosition(e) {
                let dom = document.querySelector('.offerArea')
                this.mocuseMove = true;
                this.position = {
                    event: {
                        x: parseInt(getComputedStyle(dom, null)['right']),
                        y: parseInt(getComputedStyle(dom, null)['top']),
                    },
                    mouse: {
                        x: e.clientX,
                        y: e.clientY
                    }
                }
            },
            setStyle(e) {
                if (this.mocuseMove) {
                    let dom = document.querySelector('.offerArea')
                    dom.style.top = this.position.event.y + (e.clientY - this.position.mouse.y) + 'px';
                    dom.style.right = this.position.event.x + (this.position.mouse.x - e.clientX) + 'px';
                }
            },
            reg() {
                let reg = /^[0-9]+([.]{0,1}[0-9]{0,2})$/;
                if (!reg.test(this.price)) {
                    let newValue = this.price.slice(0, -1);
                    this.price = reg.test(newValue) ? newValue : 1;
                }
            },
            //输出结果
            save(i) {
                this.allInfo.notes = this.value.notes;
                this.allInfo.partList[this.index].quotePartItemList = this.addArr.length
                    ? this.addArr
                    : null;
                this.$emit("input", this.allInfo);
                !(i == 1) && this.$emit('hid')
            },
            modify(i) {
                this.isReset = i;
                let obj = this.addArr[i];
                this.parts = obj.parts;
                this.price = obj.priceS;
                this.whether = obj.isHave;
            },
            delList(i) {
                this.options.forEach(v => {
                    if (v.value == this.addArr[i].parts) {
                        v.disable = false;
                    }
                    ;
                })
                this.addArr.splice(i, 1);
            },
            add() {
                let obj = {
                    parts: this.parts,
                    price:FloatMul(this.price,100),
                    priceS: this.price.indexOf('.') > -1 ? this.price : this.price + '.00',
                    isHave: this.whether
                };
                if (
                    this.parts &&
                    this.price &&
                    this.whether &&
                    Number(this.price) &&
                    this.price.indexOf(".") != 0
                ) {
                    if (this.isReset !== "") {
                        this.addArr.splice(this.isReset, 1, obj);
                        this.isReset = "";
                        this.$message.success("修改成功");
                    } else {
                        if (this.addArr.length < 4) {
                            this.addArr.push(obj);
                            this.options.forEach(item => {
                                if (item.value == this.parts) {
                                    item.disable = true;
                                }
                            });
                        } else {
                            this.$message.warning("最多可报价四个");
                        }
                    }
                    this.save(1);
                    this.price = "";
                    this.parts = "";
                } else {
                    this.whether ? null : this.$message.warning("请选择现货或预定");
                    parseFloat(this.price) ? null : this.$message.warning("报价只能为数字");
                    this.price.indexOf(".") == 0
                        ? this.$message.warning("小数点之前不能为空")
                        : null;
                    this.parts ? null : this.$message.warning("请选择配件");
                    this.price ? null : this.$message.warning("请填写价格");
                }
            },
            analysis() {
                this.options.map(item => {
                    item.disable = false;
                })
                this.value.notes = this.value.notes || '';
                this.allInfo = JSON.parse(JSON.stringify(this.value));
                let quoteList = this.value.partList[this.index].quotePartItemList;
                if (quoteList) {
                    quoteList.forEach(item => {
                        let index = this.saveType.indexOf(item.parts.split(',')[0]);
                        if (index > -1) this.options[index].disable = true;
                    });
                    this.addArr = quoteList;
                } else {
                    this.addArr = []
                }
            }
        },
        props: ["index", "value"],
        watch: {
            index() {
                this.analysis();
            }
        },
        created() {
            getPartType().then(res => {
                this.spot = res.data.type;
                for (var x in res.data.classify) {
                    this.saveType.push(x)
                    this.options.push({
                        value: x + "," + res.data.classify[x],
                        label: res.data.classify[x],
                        disable: false
                    });
                }
                this.analysis();
            });
        }
    };
</script>
<style lang="scss" scoped>
    .offerArea {
        width: 520px;
        max-height: 488px;
        position: fixed;
        right: 3vw;
        top: 15vh;
        z-index: 20;
        background: white;
        border-radius: 10px;
        box-shadow: 0px 0px 10px 0px rgba(204, 204, 204, 1);
    }

    header {
        height: 50px;
        background: #000000;
        line-height: 50px;
        color: white;
        cursor: move;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        p {
            font-size: 18px;
        }
        .save {
            font-size: 16px;
            line-height: 50px;
        }
    }

    .ffBg {
        border-radius: 10px;
        padding: 20px 0 30px 0;
        width: 100%;
        padding-left: 20px;
        font-size: 16px;
        color: #000;
        background-color: #fff;
        h3 {
            font-size: 16px;
        }
        .margin {
            margin-top: 20px;
        }
        .blod {
            font-weight: bold;
            vertical-align: middle;
        }
        .one {
            display: flex;
            justify-content: space-between;
            padding-left: 87px;
            line-height: 38px;
            height: 38px;
            border-radius: 3px;
            .left {
                span {
                    margin-right: 8px;
                    span {
                        color: #ff6749;
                        margin-left: 5px;
                    }
                }
            }
            .right {
                cursor: pointer;
                text-decoration: underline;
                span {
                    margin-right: 24px;
                }
            }
        }
        .ishave {
            .el-select {
                width: 140px;
                height: 34px;
            }
            .el-input {
                width: 160px;
                height: 34px;
            }
            .el-button {
                width: 80px;
                height: 40px;
            }
            .el-input__inner {
                padding: 0 10px;
            }
            .entry {
                margin-bottom: 38px;
            }
            .el-textarea {
                width: 391px;
                height: 76px;
                textarea {
                    width: 458px;
                    height: 76px;
                }
            }
        }
    }

    .lastBorder {
        border-bottom: 1px solid #cccccc;
    }

    .isReset {
        background: #e7e7e7;
    }
</style>
<style>
    .ffBg .el-radio__inner {
        width: 20px;
        height: 20px;
    }

    .ffBg .el-radio__label {
        font-size: 16px;
    }

    .ffBg .el-input__inner {
        background-color: #fff;
    }

    .ffBg textarea {
        resize: none;
    }
</style>
