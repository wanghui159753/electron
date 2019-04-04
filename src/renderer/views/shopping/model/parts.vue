<template>
    <bg>
        <div class="partBox">
            <header>
                <p></p>
                <p class="tit">请选择配件</p>
                <p @click="save">确认</p>
            </header>
            <div class="search">
                <el-input placeholder="请输入配件关键词" v-model="seach"></el-input>
            </div>
            <div class="selected">
                <h6>已选择<span> {{selArr.length}} </span>款配件：</h6>
                <div class="selList scrollbar">
                    <div v-for="(item,index) in selArr" :key="item.id">
                        <p>{{item.name}} <img src="@/../../static/image/del.png" alt="" @click="delIt(index)"></p>
                    </div>
                </div>
            </div>
            <div class="parts" v-if="!seach">
                <div class="left scrollbar">
                    <p v-for="(item,index) in partList" :key="index" @click="currentChane(index)" :class="{iscurrent:index==current}">{{item.name}}</p>
                </div>
                <div class="right scrollbar">
                  <el-checkbox-group v-model="selArr">
                    <div v-for='(item) in partList[current].children' :key="item.name">
                        <el-checkbox :label="item">{{item.name}}</el-checkbox>
                    </div>
                  </el-checkbox-group>
                </div>
            </div>
            <div class="parts scrollbar" v-else>
              <el-checkbox-group v-model="selArr">
                <div v-for='(item) in seachPart' :key="item.id" class="one">
                    <el-checkbox :label="item">{{item.name}}</el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
        </div>
    </bg>
</template>
<script>
import bg from "../../quote/model/background";
import { parts } from "@/api/basicData/basicData.js";
import { getLocal, setLocal } from "@/utils/localstorage";
export default {
  props: ["value"],
  components: { bg },
  data() {
    return {
      current: 0,
      partList: [],
      selArr: [],
      seach: "",
      allPart: []
    };
  },
  computed: {
    seachPart() {
      return this.allPart.filter(item => item.name.indexOf(this.seach) > 0);
    }
  },
  methods: {
    save() {
      this.selArr.forEach(item => {
        item.subId = item.id;
        item.subName = item.name;
      });
      this.$emit("input", this.selArr);
      this.$emit("hid");
    },
    delIt(i) {
      this.selArr.splice(i, 1);
    },
    getAllParts() {
      if (getLocal("allParts")) {
        this.partList = JSON.parse(getLocal("allParts"));
        this.initAllPart(this.partList);
      } else {
        parts().then(res => {
          this.partList = res.data;
          this.initAllPart(this.partList);
          setLocal("allParts", JSON.stringify(res.data));
        });
      }
    },
    currentChane(i) {
      this.current = i;
    },
    initAllPart(arr) {
      arr.forEach(item => {
        item.children.forEach(item1 => {
          this.allPart.push(item1);
        });
      });
    },
    back(e) {
      e.target.className == "bg" ? this.save() : null;
    }
  },
  created() {
    this.getAllParts();
    this.selArr = this.value.map(item => {
      delete item.subId;
      delete item.subName;
      return item;
    });
  },
  mounted() {
    document.body.addEventListener("click", this.back);
  },
  beforeDestroy() {
    document.body.removeEventListener("click", this.back);
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/brandType.scss";

.search {
  @include fl;
  justify-content: center;
  align-items: center;
  height: 80px;
  .el-input {
    width: 480px;
    .el-input__inner {
      background: #f7f7f7;
      height: 51px;
    }
  }
}
.parts .left p:hover {
  background: #f7f7f7;
}
.parts div label:hover {
  background: #dedede;
}
header {
  background: #dedede;
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
.selected {
  text-indent: 1.5em;
  h6 {
    font-size: 16px;
    color: #333;
    span {
      color: #fc684f;
    }
  }
  .selList {
    display: flex;
    flex-wrap: wrap;
    height: 90px;
    overflow: auto;
    div {
      width: 50%;
      display: flex;
      height: 46px;
      line-height: 46px;
      color: #000;
      p {
        position: relative;
        width: 95%;
      }
      img {
        position: absolute;
        top: 3px;
        right: -11px;
        width: 20px;
        height: 20px;
      }
    }
  }
}
.partBox {
  overflow: auto;
}
.parts {
  display: flex;
  color: #000;
  height: calc(100vh - 270px);
  .one {
    width: 100%;
    height: 60px;
    background: #fff;
    line-height: 60px;
  }
  .left {
    width: 184px;
    font-size: 16px;
    color: #000;
    height: 100%;
    overflow: auto;
    p {
      padding-left: 1em;
      height: 60px;
      display: flex;
      align-items: center;
    }
  }
  .right {
    font-size: 14px;
    width: 336px;
    height: 100%;
    overflow: auto;
    background: #fff;
    div {
      height: 50px;
      line-height: 50px;
      .el-checkbox__label {
        text-decoration: underline;
      }
    }
  }
}
.iscurrent {
  background: #fff;
}
</style>
<style>
.parts .el-checkbox__input {
  position: absolute;
  right: 40px;
  top: 16px;
}
.parts .el-checkbox__label {
  margin-left: 30px;
  color: #000;
}
.parts .el-checkbox__inner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
}
.parts .el-checkbox__inner::after {
  left: 6px;
  top: 3px;
}
.parts .el-checkbox {
  width: 100%;
}
.parts .el-checkbox-group {
  width: 100%;
}
</style>
