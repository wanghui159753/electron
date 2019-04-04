<template>
    <div class="cars">
        <div class="left scrollbar">
            <p v-for="(x,index) in year" :key="x" @click="current=index" :class="{curbg:current==index}">{{x}}</p>
        </div>
        <div class="right scrollbar">
            <p v-for="item in data[year[current]]" :key="item.id" @click="upAll(item)">{{item.name}} <i class="el-icon-arrow-right"></i></p>
        </div>
    </div>
</template>
<script>
import { carModel } from "@/api/basicData/basicData";
export default {
  props: ["carLine", "keyWord"],
  data() {
    return {
      current: 0,
      data: {},
      saveData: {}
    };
  },
  computed: {
    year() {
      return Object.keys(this.data);
    }
  },
  watch: {
    carLine(val) {
      this.getlist(val);
    },
    keyWord(val) {
      if (val.cur == 3 && val.str) {
        this.current = 0;
        let data = {};
        this.year.forEach(item => {
          let arr = this.data[item].filter(value => {
            let reg = new RegExp(val.str, "i");
            return reg.test(value.name);
          });
          arr.length ? (data[item] = arr) : null;
        });
        this.data = data;
      } else if (val.cur == 3 && val.str == "") {
        this.data = JSON.parse(JSON.stringify(this.saveData));
      }
    }
  },
  methods: {
    getlist(val) {
      carModel({
        seriesId: val
      }).then(res => {
        this.saveData = res.data;
        this.data = res.data;
      });
    },
    upAll(obj) {
      this.$emit("input", obj.name);
      this.$emit("close");
    }
  }
};
</script>
<style lang="scss" scoped>
.cars {
  margin-top: 25px;
  display: flex;
  text-align: center;
  height: calc(100vh - 210px);
  overflow: auto;
  transition: all 1s;
  .left {
    width: 110px;
    p {
      height: 60px;
      line-height: 60px;
      border-left: 4px solid transparent;
      font-size: 18px;
    }
  }
  .right {
    width: 410px;
    background: #fff;
    font-size: 16px;
    p {
      height: 78px;
      line-height: 78px;
      border-bottom: 1px solid #ccc;
      position: relative;
      text-align: left;
      text-indent: 1em;
      i {
        position: absolute;
        right: 20px;
        top: 29px;
        font-size: 20px;
      }
    }
  }
  .right,
  .left {
    height: calc(100% - 56px);
    overflow: auto;
    transition: all 1s;
  }
  .curbg {
    border-left: 4px solid #fc684f !important;
    background: #fff;
  }
}
</style>
