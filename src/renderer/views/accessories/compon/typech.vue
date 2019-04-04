<template>
    <div class="typeCar" >
        <div class="box" >
          <i class="el-icon-close" @click="$emit('close')"></i>
            <div class="left">
                <div v-for="(x,i) in list" :key="i" :class="{sl:(i+1)%2==1,sr:(i+1)%2==0}">
                    <p @click="changecarList(x.children,i)"><span  :class="{bor:isclass==i}">{{x.name}}</span><i>{{x.children?x.children.length:0}}</i></p>
                </div>
            </div>
            <div class="right scrollbar">
                <div v-for="x in carList" :key="x.id" @click="carid(x)" v-if="carList.length">
                    <img :src="x.logo" alt="图片加载失败">
                    <p>{{x.name}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { setLocal, getLocal } from "@/utils/localstorage";
import { getcalList } from "@/api/admission/admission";
export default {
  data() {
    return {
      list: null,
      carList: null,
      isclass: 0,
      show:true
    };
  },
  methods: {
    //找爸爸
    findFather(el, name) {
      let node = el;
      while (node.className !== name) {
        if (node.className != name) {
          node = node.parentNode;
        } else {
          break;
        }
      }
    },
    changecarList(x, i) {
      this.carList = x;
      this.isclass = i;
    },
    carid(x) {
      this.$emit("brandid", x);
    }
  },
  created() {
    if (getLocal("carlist")) {
      this.list = JSON.parse(getLocal("carlist"));
      this.carList = this.list[0].children;
    } else {
     getcalList().then(res => {
        setLocal("carlist", JSON.stringify(res.data));
        this.list = res.data;
        this.carList = this.list[0].children;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.left {
  cursor: pointer;
  float: left;
  width: 300px;
  border-right: 1px solid #bfbfbf;
  div {
    width: 149px;
    height: 78px;
    border-bottom: 1px solid #bfbfbf;
    float: left;
    padding-left: 10px;
  }
  p {
    margin-top: 29px;
    font-size: 15px;
    color: #333333;
    position: relative;
    line-height: 55px;
    border-bottom: 1px solid transparent;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    span {
      padding-bottom: 12px;
    }
  }
  i {
    width: 34px;
    height: 34px;
    background: #fb780e;
    font-size: 16px;
    display: block;
    transform: scale(0.6);
    position: absolute;
    top: 0;
    right: -5px;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 34px;
  }
}
.right {
  float: left;
  padding-top: 20px;
  width: 600px;
  overflow: auto;
  cursor: pointer;
  height: 546px;
  div:hover{
    border:1px solid #ccc;
  }
  div {
    float: left;
    width: 120px;
    height: 120px;
    text-align: center;
    margin: 10px;
    padding-top: 20px;
    border:1px solid transparent;
    img {
      display: inline-block;
      width: 43px;
      height: 43px;
    }
    p {
      font-size: 13px;
      color: #333333;
      line-height: 40px;
    }
  }
}
.typeCar {
  position: fixed;
  z-index: 10;
  left: 180px;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
}
.box {
  background: #fff;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 5px -1px 15px -3px #000;
  position: relative;
  .el-icon-close{
    position: absolute;
    right: 10px;
    top:5px;
    font-size: 25px;
    cursor: pointer;
  }
}
.left .bor {
  border-bottom: 1px solid #ff6749;
}
</style>
