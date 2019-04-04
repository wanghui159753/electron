<template>
    <div class="item">
        <div class="letter">
            <p>{{Object.keys(item)[0]}}</p>
        </div>
        <div class="list" v-for="(x , index) in item" :key="index" v-if="x.length">
            <div class="one" v-for="(obj , index1) in x" :key="index1" @click="selIt(obj)">
                <div>
                    <img :src="obj.logo" width="70" alt="图片加载失败">
                    <img src="@/../../static/image/sel.png" alt="" class="sel"
                         :class="{show:isShow(obj)}">
                </div>
                <p>{{obj.name}}</p>
            </div>
        </div>
        <div class="list" v-else>暂无内容</div>
    </div>
</template>
<script>
export default {
  methods: {
    isShow(obj) {
      if (this.selArr.constructor == Object) {
        return this.selArr.id == obj.id;
      } else {
        let flag = this.selArr.some(item => item.id == obj.id);
        return flag;
      }
    },
    selIt(obj) {
      this.$emit("sel", obj);
    }
  },
  props: ["item", "selArr"]
};
</script>
<style lang="scss" scoped>
.item {
  .letter {
    height: 44px;
    font-size: 18px;
    color: #333;
    p {
      padding-top: 10px;
      line-height: 34px;
      text-indent: 2em;
    }
  }
  .list {
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    padding: 15px 30px;
    font-size: 16px;
    color: #333333;
  }
  .one {
    width: 110px;
    text-align: center;
    margin: 7px 0;
    div {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 5px;
      border: 1px solid #999999;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      overflow: hidden;
    }
    .sel {
      position: absolute;
      right: -21px;
      top: 0;
      width: 0;
      height: 0;
      transition: all 0.3s;
    }
    .show {
      width: 42px;
      height: 18px;
    }
    p {
      line-height: 36px;
    }
  }
}
</style>
