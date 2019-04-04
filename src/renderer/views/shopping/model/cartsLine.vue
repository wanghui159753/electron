<template>
    <div class="model scrollbar">
        <div class="oneModel" v-for="(e,index) in arr" :key="index">
            <div class="top">{{e.name}}</div>
            <div class="cartype">
                <div class="typeOne" v-for="(item,x) in e.children" :key="x" @click="selCar(item)">
                    <img :src="item.logo" alt="">
                    <p>{{item.name}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { model } from "@/api/quote/quote";
import { Serie } from "@/api/basicData/basicData";
export default {
  props: ["value", "sel", "keyWord"],
  created() {},
  data() {
    return {
      arr: [],
      savearr: []
    };
  },
  methods: {
    selCar(obj) {
      let val = this.value;
      val.vehicleSerie = obj.name;
      this.$emit("input", val);
      this.$emit("seach", obj);
    },
    getList(val) {
      Serie({
        brandId: val.id
      }).then(res => {
        this.savearr = res.data;
        this.arr = res.data;
      });
    }
  },
  watch: {
    sel(val) {
      this.getList(val);
    },
    keyWord(val) {
      if (val.cur == 2) {
        if (val.str == "") {
          this.arr = JSON.parse(JSON.stringify(this.savearr));
        } else {
          this.arr.filter(item => {
            item.children = item.children.filter(value => {
              let reg = new RegExp(val.str, "i");
              return reg.test(value.name);
            });
            return item.children.length;
          });
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.model {
  background: #fff;
  height: calc(100vh - 241px);
  overflow: auto;
  transition: all 1s;
  .top {
    text-indent: 1em;
    height: 44px;
    background: #f2f2f2;
    line-height: 44px;
  }
  .cartype {
    display: flex;
    flex-wrap: wrap;
  }
  .typeOne {
    margin: 11px;
    img {
      width: 80px;
      height: 60px;
    }
    p {
      font-size: 12px;
      text-align: center;
      line-height: 20px;
    }
  }
}
</style>