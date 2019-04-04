<template>
    <bg>
        <header>
            <p @click="save">取消</p>
            <p class="tit">选择城市</p>
            <p @click="save(1)">确认</p>
        </header>
        <div class="area scrollbar">
            <div class="province">
                <p v-for="(x,index) in cityList" :key="index" :class="{bgcr:index==isclick}" @click="isclick=index">
                    {{x.name}}</p>
            </div>
            <div class="city">
                <el-radio-group v-model="selCity">
                    <el-radio :label="item.id+','+item.name" v-for="(item,index) in city" :key="index">{{item.name}}
                    </el-radio>
                </el-radio-group>
            </div>
        </div>
    </bg>
</template>
<script>
    import bg from "@/components/background.vue";
    import {getCity} from "@/api/quote/quote";

    export default {
        props: ['value'],
        data() {
            return {
                selCity: "",
                isclick: 0,
                cityList: [],
                city: [],
                parent: null
            };
        },
        watch: {
            isclick(val) {
                this.city = this.cityList[val].children;
            },
            selCity() {
                this.parent = this.cityList[this.isclick];
                this.save(1)
            }
        },
        methods: {
            save(i) {
                let obj = this.value;
                obj.city.isShow = false;
                obj.isShow = true;
                if (i == 1) {
                    obj.city.cont = this.selCity;
                    obj.city.parent = this.parent;
                    this.$emit('input', obj);
                }
            }
        },
        components: {
            bg
        },
        created() {
            this.selCity = this.value.city.cont;
            getCity().then(res => {
                this.cityList = res.data;
                this.city = this.cityList[0].children;
            });
        }
    };
</script>
<style lang="scss" scoped>
    @import "../../../styles/brandType.scss";

    header {
        p {
            font-size: 16px;
            color: #FC684F;
            padding: 0 10px;
        }
        .tit {
            font-size: 18px;
            color: #333;
        }
    }

    .area {
        display: flex;
        line-height: 60px;
        text-indent: 2em;
        width: 100%;
        position: absolute;
        top: 60px;
        bottom: 0;
        .province {
            min-width: 170px;
        }
        p {
            height: 60px;
        }
        .city {
            position: absolute;
            left: 170px;
            right: 0;
            background: #fff;
            text-indent: 0;
            height: 100%;
            .el-radio {
                display: block;
            }
        }
        .el-radio-group {
            width: 100%;
            label {
                padding: 0;
                margin: 0;
                width: 100%;
                height: 60px;
                position: relative;
                p {
                    font-size: 18px;
                }
            }
        }
    }

    .bgcr {
        background: #fff;
    }
</style>
<style>
    .city .el-radio__input {
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -9px;
    }

    .city .el-radio__inner {
        width: 18px;
        height: 18px;
        margin-right: 40px;
    }

    .city .el-radio__label {
        font-size: 18px;
        line-height: 60px;
        padding-left: 50px;
    }
</style>
