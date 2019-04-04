<template>
    <ul>
        <li v-for="item in list" @click="chooseIt(item)" :key="item.id">{{item.name}}</li>
    </ul>
</template>
<script>
    export default {
        props:['list'],
        methods:{
            chooseIt(item){
                this.$emit('chooseLogisticsqq',item)
            }
        }
    }
</script>
<style lang="scss" scoped>
ul{
    position: absolute;
    left: 112px;
    top: 55px;
    border:1px solid #dedede;
    width: 243px;
    text-align: center;
    background: #fff;
    z-index: 2;
    li{
        cursor: pointer;
        list-style: none;
        height: 30px;
        border-top:1px solid #dedede;
        line-height: 30px;
    }
}
</style>