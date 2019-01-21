<template>
    <header>
        <span @click="back"  class="el-icon-arrow-left">返回</span>
        <p>{{tit}}</p>
        <div>
            <img :src="$store.getters.im.myInfo.avatar">
            <span>{{$store.getters.im.myInfo.nick}}</span>
        </div>
    </header>
</template>
<script>
export default {
  data(){
    return{
      tit:""
    }
  },
  watch:{
    $route(to,from){
      if(to.fullPath=="/admission/index/Record"){
        this.tit="历史审核记录"
      }else if(to.fullPath=="/admission/index/step1/1"||to.fullPath=="/admission/index/step1/0"){
        this.tit="填写基本信息"
      }else if(to.fullPath=="/admission/index/step2/1"||to.fullPath=="/admission/index/step2/0"){
        this.tit="入驻商铺认证信息"
      }else if(to.fullPath=="/admission/index/resultSucc"){
        this.tit="审核成功"
      }else if(to.fullPath=="/admission/index/resultError"){
        this.tit="审核失败"
      }else if(to.fullPath=="/admission/index/onAudit"){
        this.tit="审核中"
      }else{
        this.tit="采购详情"
      }
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss">
header {
  cursor: pointer;
  display: flex;
  text-align: center;
  justify-content: space-between;
  height: 78px;
  padding: 0 40px;
  width: 100%;
  line-height: 78px;
  margin-bottom: 20px;
  background: #fff;
  p {
    font-size: 24px;
  }
  span {
    font-size: 22px;
  }
  div {
    span {
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    img {
      width: 54px;
      height: 54px;
      vertical-align: middle;
      border-radius: 3%;
    }
  }
  .el-icon-arrow-left{
    line-height: 78px;
    font-weight: 700;
  }
}
.el-icon-arrow-left::before{
  font-size: 24px;
}
</style>
