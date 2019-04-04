<template>
    <bg>
        <header>
            <p @click="save">取消</p>
            <p class="tit">选择配件</p>
            <p @click="save(1)">确认</p>
        </header>
        <div class="parts">
            <el-input placeholder="输入配件关键词" v-model="search" @keyup="find"></el-input>
            <div class="listPart scrollbar">
                <el-checkbox-group v-model="val" :max="3">
                    <el-checkbox @click.native="warn" v-for="(x ,index) in partsList " :key="index" :label="x.id+','+x.name">{{x.name}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
    </bg>
</template>
<script>
    import bg from "@/components/background.vue";
    import {filters} from "@/api/quote/quote";

    export default {
        props:['value'],
        components: {bg},
        data() {
            return {
                search:"",
                //配件绑定值
                val: [],
                partsList: [],
                all:[]
            };
        },
        watch:{
            search(val){
                val?this.find():this.partsList=this.all;
            }
        },
        methods:{
            warn(){
                this.val.length==3?this.$message.warning("最多可添加三个"):null;
            },
            save(i){
              let obj=this.value;

              obj.part.isShow=false;
              obj.isShow=true;
                if(i==1){
                    this.$emit('input',obj)
                    obj.part.cont=this.val;
                }
            },
            find(){
                this.partsList=this.all.filter(item=>{
                    return item.name.indexOf(this.search)>=0
                })
            },
        },
        created() {
            this.val=this.value.part.cont;
            filters().then(res => {
                this.partsList = res.data;
                this.all=res.data;
            })
        }
    };
</script>
<style lang="scss" scoped>
    @import "../../../styles/brandType.scss";
    header{
        p{
            font-size: 16px;
            color: #FC684F;
            padding: 0 10px;
        }
        .tit{
            font-size: 18px;
            color: #333;
        }
    }
    .parts {
        background: #fff;
        text-align: center;
        width: 100%;
        position: absolute;
        top: 60px;
        bottom: 0;
        .listPart {
            height: calc(100% - 91px);
            background: #fff;
            text-align: left;
        }
    }
</style>
<style>
    .listPart .el-checkbox {
        display: block;
        line-height: 38px;
        margin-left: 20px;
    }

    .listPart .el-checkbox__label {
        font-size: 16px;
    }

    .listPart .el-checkbox__inner {
        width: 18px;
        height: 18px;
        border-radius: 50%;
    }
    .listPart .el-checkbox__inner::after{
        height: 9px;
        left: 6px;
        top: 2px;
    }

    .parts .el-input__inner {
        width: 480px;
        height: 51px;
    }

    .parts .el-input {
        margin: 20px 0;
    }
</style>
