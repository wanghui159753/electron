<template>
  <div class="partBox">
    <ul class="scrollbar" v-if="filterList.length">
      <li v-for="(x) in filterList" :key="x.id" @mousedown="back(x)">
        <p class="smallParts">{{x.name}}</p>
        <p>{{x.parentName}}</p>
      </li>
    </ul>
    <p v-else>未检索到你要的配件</p>
  </div>
</template>
<script>
import { getLocal, setLocal } from "@/utils/localstorage";
import { accessory } from "@/api/quote/quote";
export default {
  props: ["inputValue", "partsList"],
  data() {
    return {
      filterList: []
    };
  },
  watch: {
    inputValue(val) {
      this.filterList = this.partsList.filter(item => {
        return item.name.indexOf(val) > -1;
      });
    }
  },
  methods: {
    back(x) {
      this.$emit("choose", x);
    }
  },
  created(){
    this.filterList = this.partsList.filter(item => {
        return item.name.indexOf(this.inputValue) > -1;
      });
  }
};
</script>
<style lang="scss">
@mixin flex {
  display: flex;
  justify-content: space-between;
}
.partBox {
  width: calc(100% - 10px);
  overflow: hidden;
  position: relative;
  font-size: 12px;
  top: -17px;
  border: 1px solid #ccc;
  border-radius: 3px;
  z-index: 500;
  background: #fff;
  border-top: 0;
  ul {
    width: 100%;
    max-height: 176px;
    height: auto;
    min-height: 36px;
    li:hover {
      background: #f3f3f3;
    }
    li {
      padding: 0 5px;
      height: 36px;
      border-bottom: 1px solid #e6e6e6;
      @include flex;
      line-height: 36px;
      p {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: #ccc;
        max-width: 20%;
      }
      .smallParts {
        max-width: 75%;
        color: #000;
      }
    }
  }
}
</style>
