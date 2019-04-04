<template>
    <bg>
        <header class="hd">
            <p @click="clear">清空</p>
            <p class="tit">筛选</p>
            <p @click="search">确认</p>
        </header>
        <div class="type">
            <div class="brand">
                <div class="total" @click="show('brand')">
                    <p class="fix">受理品牌</p>
                    <p><span v-if="!obj.brand.cont.length">不限品牌</span><i class="el-icon-arrow-right"></i></p>
                </div>
                <div class="selBrand" v-if="obj.brand.cont.length">
                    <div class="one" v-for="(obj , index1) in obj.brand.cont" :key="index1">
                        <div>
                            <img :src="obj.logo" width="70" alt="图片加载失败">
                            <img src="@/../../static/image/closeIt.png" alt="" class="delIt"
                                 @click="deleteIt('brand',index1)">
                        </div>
                        <p>{{obj.name}}</p>
                    </div>
                </div>
            </div>
            <div class="area">
                <div class="total" @click="show('city')">
                    <p class="fix">受理地区</p>
                    <p><span v-if="!obj.city.cont">不限地区</span><i class="el-icon-arrow-right"></i></p>
                </div>
                <div class="citySel" v-if="obj.city.cont">
                    <p>{{obj.city.cont.split(',')[1]}}
                        <img src="@/../../static/image/closeIt.png" alt="" class="delIt" @click="deleteIt('city')">
                    </p>
                </div>
            </div>
            <div class="classify">
                <div class="total" @click="show('part')">
                    <p class="fix">受理配件分类</p>
                    <p><span v-if="!obj.part.cont.length">不限分类</span><i class="el-icon-arrow-right"></i></p>
                </div>
                <div class="partSel" v-if="obj.part.cont.length">
                    <div class="one" v-for="(item ,index) in obj.part.cont" :key="index">
                        <p> {{item.split(',')[1]}}</p>
                        <img src="@/../../static/image/closeIt.png" alt="" class="delIt"
                             @click="deleteIt('part',index)">
                    </div>
                </div>
            </div>
        </div>
        <p class="tip">
            注：筛选条件越多，匹配将越精准，但询价的数量也会减少。
        </p>
        <brand @click.native="hid" v-if="obj.brand.isShow" v-model="obj"></brand>
        <city @click.native="hid" v-if="obj.city.isShow" v-model="obj"></city>
        <parts @click.native="hid" v-if="obj.part.isShow" v-model="obj"></parts>
    </bg>
</template>
<script>
import bg from "@/components/background.vue";

import brand from "./brand";
import city from "./city";
import parts from "./parts";
export default {
  props: ["value"],
  data() {
    return {
      obj: {
        brand: {
          isShow: false,
          cont: []
        },
        city: {
          isShow: false,
          cont: ""
        },
        part: {
          isShow: false,
          cont: []
        }
      }
    };
  },
  components: { bg, parts, city, brand },
  methods: {
    hid(e) {
      if (e.target.className == "bgc") {
        this.obj.brand.isShow = false;
        this.obj.city.isShow = false;
        this.obj.part.isShow = false;
      }
    },
    deleteIt(str, index) {
      index != undefined
        ? this.obj[str].cont.splice(index, 1)
        : (this.obj[str].cont = "");
    },
    search() {
      let obj = this.value;
      obj.city = this.obj.city;
      obj.brand = this.obj.brand;
      obj.parts = this.obj.parts;
      obj.isShow = false;
      this.$emit("input", obj);
      this.$emit("search");
    },
    clear() {
      let obj = this.value;
      obj.brand.cont = [];
      obj.city.cont = "";
      obj.city.parent = "";
      obj.part.cont = [];
      obj.isShow = false;
      this.$emit("input", obj);
      this.$emit("search");
    },
    show(str) {
      this.obj[str].isShow = true;
    }
  },
  created() {
    this.obj = this.value;
  }
};
</script>
<style lang="scss" scoped>
@mixin fl {
  display: flex;
  justify-content: space-between;
}

.hd {
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

.citySel {
  padding-bottom: 30px;
  p {
    position: relative;
    width: 120px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #f5f5f5;
    border-radius: 5px;
    overflow: hidden;
  }
}

.partSel {
  padding-bottom: 30px;
  .one {
    overflow: hidden;
    position: relative;
    width: 460px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #f5f5f5;
    margin-bottom: 10px;
    border-radius: 5px;
  }
}

.delIt {
  position: absolute;
  bottom: 0;
  right: 0;
}

.tip {
  text-align: center;
  color: #999;
  position: absolute;
  width: 100%;
  bottom: 20px;
  left: 0;
}

.type > div {
  padding: 0 20px;
  background: #fff;
  margin-bottom: 10px;
}

.type {
  .total {
    height: 80px;
    line-height: 80px;
    @include fl;
    p {
      font-size: 18px;
      color: #999;
    }
    .fix {
      color: #333;
      font-weight: 600;
    }
  }
}

.selBrand {
  @include fl;
  justify-content: flex-start;
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
