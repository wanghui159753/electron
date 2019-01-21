<template>
    <bg>
        <header>
            <p></p>
            <p class="tit">选择品牌</p>
            <p>确认</p>
        </header>
        <div class="search">
            <el-input placeholder="搜索车型，如本田 日产"></el-input>
        </div>
        <div class="list">
            <item v-for="x in 10" :key="x"></item>
        </div>
    </bg>
    
</template>
<script>
import bg from "./background";
import item from "./brandItem";
export default {
  components: { bg, item }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/brandType.scss";
.search{
    @include fl;
    justify-content: center;
    align-items: center;
    background: #fff;
    height: 108px;
    .el-input{
        width: 480px;
        .el-input__inner{
            height: 51px;
        }
    }
}
</style>
