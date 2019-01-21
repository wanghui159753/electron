<template>
    <bg>
        <header>
            <p></p>
            <p class="tit">选择配件</p>
            <p>确认</p>
        </header>
        <div class="parts">
            <el-input placeholder="输入配件关键词"></el-input>
            <div class="list">
                <el-radio-group v-model="val">
                    <el-radio v-for="x in 10 " :key="x" :label="x">变速箱及离合</el-radio>
                </el-radio-group>
            </div>
        </div>
    </bg>
</template>
<script>
import bg from "./background";
export default {
  components: { bg },
  data() {
    return {
      val: 1
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/brandType.scss";
.parts {
  background: #fff;
  text-align: center;
  width: 100%;
  position: absolute;
  top: 60px;
  bottom: 0;
  .list {
    text-align: left;
  }
}
</style>
<style>
.list .el-radio {
  display: block;
  line-height: 38px;
  margin-left: 20px;
}
.list .el-radio__label {
  font-size: 16px;
}
.list .el-radio__inner {
  width: 18px;
  height: 18px;
}
.parts .el-input__inner {
  width: 480px;
  height: 51px;
}

.parts .el-input {
  margin: 20px 0;
}
</style>
