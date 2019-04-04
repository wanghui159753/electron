<template>
  <had @click.native="close">
    <div class="fix">
      <header>
        <p></p>
        <p class="tit">选择品牌</p>
        <p>关闭</p>
      </header>
      <div class="search">
        <el-input placeholder="搜索车型，如本田 日产" v-model="searCar" @keyup.native="search"></el-input>
      </div>
      <div class="car" v-if="!isSearch&&chooseOne">
        <p @click="showBrand(1)" :class="{curbg:cur==1}">
          {{value.vehicleBrand||'品牌'}}
          <i class="el-icon-arrow-down"></i>
        </p>
        <p @click="showBrand(2)" :class="{curbg:cur==2}">
          {{value.vehicleSerie||'车系'}}
          <i class="el-icon-arrow-down"></i>
        </p>
      </div>
    </div>
    <div :class="{placeholder:chooseOne,placeholderLess:!chooseOne}"></div>
    <!-- 选择品牌 -->
    <div id="scrollId" class="list scrollbar" v-show="brandShow" :style="{height:chooseOne?'calc(100vh - 210px)':'calc(100vh - 170px)'}">
      <div class="anchor">
        <p v-for="(x,index) in word" :key="x" @click="scrollTo(index)">{{x}}</p>
      </div>
      <item
        v-for="(item,index) in brandList"
        :key="index"
        :item="item"
        :selArr="selArr"
        @sel="addIt"
      ></item>
    </div>
    <!-- 选择车型 -->
    <cars-line
      v-model="value"
      :keyWord="{str:searCar,cur:cur}"
      :sel="selArr"
      v-show="carsLineShow&&chooseOne"
      @seach="carLine"
    ></cars-line>
  </had>
</template>
<script>
import had from "@/components/background.vue";
import { brandType, model } from "@/api/quote/quote";
import item from "../../quote/model/brandItem";
import carsLine from "./cartsLine";
import { getLocal, setLocal } from "@/utils/localstorage.js";
export default {
  props: ["value"],
  components: { had, item, carsLine },
  data() {
    return {
      searCar: "",
      brandList: null,
      saveList: null,
      selArr: {},
      word: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      carsLineShow: false,
      carsShow: false,
      brandShow: true,
      carLineId: null,
      cur: 1,
      isSearch: false,
        chooseOne:true
    };
  },
  watch: {
    cur() {
      this.searCar = "";
    }
  },
  methods: {
    //切换
    showBrand(i) {
      if (!this.value.vehicleBrand && i == 2) {
        this.$message.warning("请选择品牌");
        return;
      }
      this.searCar = "";
      this.cur = i;
      this.brandShow = i == 1;
      this.carsLineShow = i == 2;
    },
    carLine(obj) {
      this.carLineId = obj.id;
      this.closeIt();
    },
    close(e) {
      if (e.target.className == "bgc") {
        this.searCar = "";
        this.$emit("close");
      }
    },
    closeIt() {
      this.searCar = "";
      this.$emit("close");
    },
    scrollTo(i) {
      let dom = document.getElementById("scrollId");
      dom.scrollTop = dom.children[i + 2].offsetTop;
    },
    addIt(obj) {
        let pushObj = this.value;
        pushObj.logo = obj.logo;
        if(this.chooseOne){
            this.value.vehicleSerie = "";
            this.value.vehicleModel = "";
            this.cur = 2;
            this.selArr = obj;
            this.carsLineShow = true;
            this.brandShow = false;
            pushObj.vehicleBrand = obj.name;
            this.$emit("input", pushObj);
        }else{
            pushObj.vehicleBrand = obj.name;
            this.$emit("input", pushObj);
            this.$emit('close')
        }
    },
    isGet(res) {
      this.allBrand = res.data.baseList;
      var arr = [];
      for (var i = 0; i < this.word.length; i++) {
        var obj = {};
        obj[this.word[i]] = res.data.baseList.filter(item => {
          return item.initial == this.word[i];
        });
        arr.push(obj);
      }
      arr.unshift({
        热门: res.data.hostList
      });
      this.saveList = JSON.parse(JSON.stringify(arr));
      this.brandList = arr;
    },
    list() {
      if (getLocal("allCar")) {
        this.isGet({ data: JSON.parse(getLocal("allCar")) });
      } else {
        brandType().then(res => {
          setLocal("allCar", JSON.stringify(res.data));
          this.isGet(res);
        });
      }
    },
    search() {
      if (this.cur == 1) {
        if (this.searCar == "") {
          this.brandList = JSON.parse(JSON.stringify(this.saveList));
        } else {
          this.brandList = this.brandList.filter(item => {
            let arr = item[Object.keys(item)[0]];
            arr = arr.filter(item => {
              return item.name.indexOf(this.searCar) > -1;
            });
            item[Object.keys(item)[0]] = arr;
            return arr.length > 0;
          });
        }
      }
    }
  },
  created() {
    this.list();
    this.$route.fullPath.includes('/message')&&(this.chooseOne=false);
    console.log(this.chooseOne,'=====')
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/brandType.scss";
@media (min-width: 1800px) {
  .anchor {
    top: 24% !important;
    line-height: 30px !important;
  }
}
.search {
  @include fl;
  justify-content: center;
  align-items: center;
  background: #fff;
  height: 80px;
  .el-input {
    width: 480px;
    .el-input__inner {
      height: 51px;
    }
  }
}
header {
  background: #e5e5e5;
  margin: 0;
  p {
    font-size: 16px;
    color: #fc684f;
    padding: 0 10px;
  }
  .tit {
    font-size: 18px;
    color: #333;
  }
}
.fix {
  width: 520px;
  position: fixed;
  top: 30px;
  right: 0;
  z-index: 20;
}
.placeholder {
  height: 210px;
}
.placeholderLess{
  height: 140px;
}
.anchor {
  font-size: 18px;
  line-height: 22px;
  position: fixed;
  top: 30%;
  right: 10px;
  text-align: center;
}
.list {
  position: relative;
  padding-bottom: 20px;
  height: calc(100vh - 210px);
  overflow: auto;
  transition: all 1s;
}
.car {
  height: 70px;
  text-align: center;
  line-height: 70px;
  background: #f7f7f7;
  .curbg {
    background: #fff;
  }
  i {
    font-size: 16px;
    color: #000;
    margin-left: 11px;
  }
  p {
    float: left;
    width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
