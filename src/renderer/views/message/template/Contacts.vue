<template>
    <div v-if="forwardList">
        <el-checkbox-group class="checkGrop" :class="{bg:auto2==index}" @click.native="togoBg2(index)" v-for="(item,index) in forwardList" :key="index" v-model="selectArr" @change="msg_Forward(value,item)" size="small">
            <label class="forwardUser">
            <el-checkbox :label="item" border></el-checkbox>
            <img :src="item.avatar" alt="" width="33" height="33">
            <span class="name" v-if="item.name">{{item.name}}</span>
            <span class="name" v-else>{{item.id}}</span>
            </label>
        </el-checkbox-group>    
    </div>
</template>
<script>
export default {
  props: ["value", "forwardList",'searchName'],
  data() {
    return {
      auto2: 0,
      selectArr: [],
      retransmissionlist: []
    };
  },
  watch: {
    selectArr(val) {
      this.$emit("input", this.retransmissionlist);
    },
    // value(val) {
    //   this.retransmissionlist = val;
    //   this.selectArr = this.retransmissionlist.map(
    //     item => item.id || item.account
    //   );
    // }
  },
  methods: {
    togoBg2(index) {
      this.auto2 = index;
    }
  }
};
</script>
<style lang="scss" scoped>
.checkGrop {
  line-height: 60px;
  height: 60px;
}
.forwardUser {
  display: inline-block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .el-checkbox {
    float: left;
    .el-checkbox__label {
      display: none;
    }
  }
  img {
    float: left;
    position: relative;
    top: 13px;
    margin-right: 13px;
    border-radius: 10%;
  }
  .name {
    float: left;
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 50%;
  }
}
.forwardUser .el-checkbox__inner::after {
  left: 6px;
  top: 2px;
  height: 8px !important;
}
</style>
