<template>
    <div class="bigbg">
        <div class="car">
            <header>
                <h2>主营车型</h2>
                <span @click="getcar">确认</span>
            </header>
            <div class="usSelect">
                <p>已选<span>{{selected.length}}</span>款：</p>
                <ul class="iconList">
                    <li v-for="i in selected" :key="i.id" v-if="selected.length!==0">
                        <img src="@/../../static/image/del.png" alt="图片加载失败" class="off" @click="del(i)">
                        <img :src="i.logo" alt="图片加载失败" class="carLogo">
                        <p>{{i.name}}</p>
                    </li>
                    <li v-if="selected.length==0" class="non">空空如也，快来添加点什么吧！！！</li>
                </ul>
            </div>
            <div class="distributor">
                <div class="left scrollbar">
                    <p v-for="(x,index) in info" :key="x.id" :class="{bg:index==bg}" @click="getlist(x.id,index)">
                        {{x.name}} <i v-show="parent[index].cont!==0&&parent[index].cont!=undefined">{{parent[index].cont}}</i>
                    </p>
                </div>
                <ul class="right scrollbar">
                    <li v-for="(i,index) in carList?carList.children:[]" :key="i.id">
                        <img src="@/../../static/image/del.png" v-if="off[index]" alt="" class="off"
                             @click="del(i,carList)">
                        <img :src="i.logo" alt="图片加载失败" class="carLogo" @click="add(i,index,carList)">
                        <p>{{i.name}}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import request from "@/utils/request";
import { getLocal, setLocal } from "@/utils/localstorage";
import { getcalList } from "@/api/admission/admission.js";

export default {
  name:'car',
  data() {
    return {
      ss: false,
      info: [],
      carList: null,
      selected: [],
      bg: 0,
      off: [],
      sel: {},
      parent: []
    };
  },
  props:['scoped'],
  methods: {
    //向上返回所选品牌
    getcar() {
      var sel = [];
      this.selected.forEach(item => {
        var obj = {};
        obj.labelId = Number(item.id);
        obj.brandId = item.brandId;
        obj.labelName = item.name;
        obj.brandName = item.name;
        obj.parentId = Number(item.parent.id);
        obj.parentName = item.parent.name;
        obj.type = item.type;
        obj.img= item.logo;
        obj.partId = item.partId;
        sel.push(obj);
      });
      this.$emit("getcar", {
        is: false,
        s: sel,
        original:this.selected
      });
    },
    del(i, par) {
      this.selected = this.selected.filter(item => {
        return i.id != item.id;
      });
      if (par) {
        this.parent.forEach(item => {
          item.id == par.id ? item.cont-- : null;
        });
      } else {
        this.parent.forEach(item => {
          i.parent.id == item.id ? item.cont-- : null;
        });
      }
    },
    getlist(n, bg) {
      this.bg = bg;
      var arr = this.info.filter(item => {
        return item.id == n;
      });
      this.carList = arr[0];
    },
    add(i, n, parents) {
      this.selected.length == 4
        ? this.$message.warning("最多添加4个")
        : this.selected.filter(item => {
            return item.id == i.id;
          }).length == 0
          ? cont.call(this)
          : this.$message.warning("当前已选择");
      function cont() {
        this.selected.push(i);
        this.$set(this.selected[this.selected.length - 1], "parent", parents);
        this.parent.forEach((e, index) => {
          if (e.cont && e.id == parents.id) {
            e.cont++;
          } else if (e.id == parents.id) {
            this.$set(this.parent[index], "cont", 1);
          }
        });
      }
    }
  },
  created() {
    if (getLocal("carlist")) {
      this.info = JSON.parse(getLocal("carlist"));
      this.parent = JSON.parse(getLocal("carlist"));
      this.carList = this.info[0];
    } else {
      getcalList().then(res => {
        setLocal("carlist", JSON.stringify(res.data));
        this.info = res.data;
        this.carList = res.info[0];
        this.parent = this.info;
      });
    }
  },
  mounted() {
    this.selected = this.scoped||[];
     document.body.onclick = function(e) {
      e.target.className == "bigbg" ? this.getcar() : null;
    }.bind(this);
  }
};
</script>
<style lang="scss" scoped>
.bigbg {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 180px;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 500;
    overflow: auto;
    .scrollbar{
        height: calc( 100vh);
    }
}

.car {
  cursor: pointer;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  width: 600px;
  background: #f6f6f6;
  overflow: hidden;
  header {
    position: relative;
    text-align: center;
    h2 {
      width: 100%;
      text-align: center;
      font-size: 24px;
    }
    span {
      position: absolute;
      right: 20px;
      color: #ff6749;
      font-size: 18px;
    }
  }
}

.usSelect {
  width: 600px;
  padding: 20px 26px;
  background: #fff;
  margin-bottom: 10px;
  p {
    font-size: 18px;
    margin-bottom: 9px;
    span {
      color: #ff6749;
    }
  }
  ul {
    padding-top: 10px;
    overflow: hidden;
    li {
      float: left;
      cursor: pointer;
      position: relative;
      width: 100px;
      height: 138px;
      list-style: none;
      text-align: center;
      margin-right: 8px;
      .carLogo {
        padding: 10px;
        width: 80px;
        height: 80px;
        background: #fff;
        display: inline-block;
        margin-top: 12px;
      }
      .off {
        width: 24px;
        height: 24px;
        position: absolute;
        top: 0;
        right: 0;
      }
      p {
        font-size: 16px;
      }
    }
  }
}

.distributor {
  overflow: hidden;
    height: calc(100% - 277px);
  .left {
    width: 180px;
    float: left;
    background: #ffffff;
      height: 100%;
    p {
      position: relative;
      height: 69px;
      line-height: 25px;
      font-size: 18px;
      text-align: center;
      line-height: 69px;
      border: 1px solid transparent;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      i {
        position: absolute;
        width: 22px;
        height: 22px;
        right: 4px;
        top: 15px;
        background: #ff6749;
        border-radius: 50%;
        text-align: center;
        line-height: 22px;
        color: white;
        font-size: 14px;
      }
    }
  }
  .right {
    float: right;
    width: 400px;
    padding-top: 10px;
      height: 100%;
    li {
      float: left;
      position: relative;
      width: 98px;
      height: 138px;
      list-style: none;
      text-align: center;
      .carLogo {
        padding: 10px;
        width: 80px;
        height: 80px;
        background: #fff;
        display: inline-block;
        margin-top: 12px;
      }
      .off {
        width: 24px;
        height: 24px;
        position: absolute;
        top: 0;
        right: 0;
        display: none;
      }
    }
  }
}

.hid {
  display: hidden;
}

.iconList .non {
  width: 100%;
  height: 138px;
  font-size: 20px;
  color: #ff6749;
  line-height: 138px;
}

.distributor .left .bg {
  color: #ff6749;
  border-right: 1px solid #ff6749;
}
</style>