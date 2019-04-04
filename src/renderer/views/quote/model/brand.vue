<template>
    <bg>
        <div class="fix">
            <div class="header">
                <header>
                    <p @click="save(0)">取消</p>
                    <p class="tit">选择品牌</p>
                    <p @click="save(1)">确认</p>
                </header>
            </div>
            <div class="search">
                <el-input placeholder="搜索车型，如本田 日产" v-model="searBrand"></el-input>
            </div>
        </div>
        <div class="list scrollbar">
            <item v-for="(item,index) in brandList" :key="index" :item="item" :selArr="selArr" @sel="addIt"></item>
        </div>
    </bg>

</template>
<script>
import bg from "@/components/background.vue";
import item from "./brandItem";
import { brand } from "@/api/quote/quote";

export default {
  props: ["value"],
  data() {
    return {
      searBrand: "",
      brandList: [],
      allBrand: [],
      saveList: [],
      selArr: []
    };
  },
  components: { bg, item },
  watch: {
    searBrand(val) {
      this.brandList = val
        ? [
            {
              搜索结果: this.allBrand.filter(item => {
                return item.name.indexOf(val) != -1;
              })
            }
          ]
        : this.saveList;
    }
  },
  methods: {
    //返回结果
    save(i) {
      let obj = this.value;
      obj.isShow = false;
      if (i == 1) {
        obj.cont = this.selArr;
        this.$emit("input", obj);
      }
    },
    addIt(obj) {
      let index1 = null;
      this.selArr.some((item, index) => {
        item.id == obj.id ? (index1 = index) : null;
        return item.id == obj.id;
      })
        ? this.selArr.splice(index1, 1)
        : this.selArr.length < 4
          ? this.selArr.push(obj)
          : this.$message.warning("最多添加4个");
    },
    //获取品牌列表并筛选完毕
    list() {
        this.$store.commit('setLoading',true)
      let word = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      brand().then(res => {
        this.allBrand = res.data;
        var arr = [];
        for (var i = 0; i < word.length; i++) {
          var obj = {};
          obj[word[i]] = res.data.filter(item => {
            return item.initial == word[i];
          });
          arr.push(obj);
        }
        this.brandList = arr;
        this.saveList = arr;
          this.$store.commit('setLoading',false)
      });
    }
  },
  created() {
    this.selArr = this.value.cont;
    this.list();
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/brandType.scss";

.search {
  @include fl;
  justify-content: center;
  align-items: center;
  background: #fff;
  height: 108px;
  .el-input {
    width: 480px;
    .el-input__inner {
      height: 51px;
    }
  }
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
.list {
  height: calc(100vh - 200px);
  overflow: auto;
}
</style>
