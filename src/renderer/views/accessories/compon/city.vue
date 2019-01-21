<template>
    <div class="city">
        <div class="cit">
            <h2>热门城市</h2>
            <div class="list">
                <template v-for="x in cityL?cityL:[]">
                <el-button type="primary" v-for="i in x.children" :key="i.id" @click="chooseCity(i)">{{i.name}}</el-button>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      cityL: null
    };
  },
  created() {
    request({
      url: "/vehicle/base/area/open/city/merchant/tree",
      method: "get"
    }).then(res => {
      this.cityL = res.data;
    });
  },
  methods: {
    chooseCity(i) {
        this.$emit("city",{
            name:i.name,
            id:i.id
        })
    }
  }
};
</script>
<style scoped lang="scss">
.city {
  position: fixed;
  top: 35%;
  left: 180px;
  right: 0;
  display: flex;
  justify-content: center;
  .cit {
    width: 441px;
    padding: 15px 55px;
    overflow: hidden;
    background: #fff;
    h2 {
      font-size: 24px;
      color: #f07013;
      border-left: 6px solid #ff6749;
      text-indent: 0.5em;
      margin-bottom: 15px;
    }
    div {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0;
      .el-button {
        margin: 0;
        width: 140px;
        height: 44px;
        margin: 5px 0;
        background: #f07013;
      }
      .el-button:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
