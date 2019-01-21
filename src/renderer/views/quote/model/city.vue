<template>
    <bg>
        <header>
            <p></p>
            <p class="tit">选择城市</p>
            <p>确认</p>
        </header>
        <div class="area">
            <div class="province">
                <p v-for="(x,index) in 10" :key="x" :class="{bgcr:index==isclick}">河南省</p>
            </div>
            <div class="city">
                <el-radio-group v-model="city">
                    <el-radio :label="x" v-for="x in 10" :key="x">南阳市</el-radio>
                </el-radio-group>
            </div>
        </div>
    </bg>
</template>
<script>
import bg from "./background";
export default {
  data() {
    return {
      city: "",
      isclick: 0
    };
  },
  components: {
    bg
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/brandType.scss";
.area {
  display: flex;
  line-height: 60px;
  text-indent: 2em;
  position: relative;
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
