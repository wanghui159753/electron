<template>
    <div class="buyParts scrollbar">
        <had class="top">
            <div>
                <p @click="tab(1)" :class="{isCurrent:current==0}">买配件(发布)</p>
                <p @click="tab(0)" :class="{isCurrent:current==1}">我的采购单</p>
            </div>            
        </had>
        <router-view> 
        </router-view>
    </div>
</template>

<script>
import had from "./model/hed";
import purchase from "./purchase";
export default {
  name: "index",
  components: { purchase, had },
  computed: {
    current() {
      return this.$route.fullPath == "/shopping/index/release" ? 1 : 0;
    }
  },
  methods: {
    tab(i) {
      this.$router.push({
        path: i ? "/shopping/index/purchase" : "/shopping/index/release"
      });
    }
  },
  data() {
    return {};
  }
};
</script>

<style scoped lang='scss'>
.buyParts {
  overflow: auto;
  background: #fff;
}
.top {
  background: #ededed;
  div {
    color: #000;
    display: flex;
    margin: 0 auto;
    font-size: 18px;
    p {
      width: 134px;
      text-align: center;
      border: 4px solid transparent;
      cursor: pointer;
      font-weight: 600;
    }
  }
}
.isCurrent {
  color: #fc684f;
  border-bottom: 4px solid #fc684f !important;
  border-radius: 5px;
}
</style>