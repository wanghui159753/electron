<template>
  <div class="bigBox">
    <usinfo v-model="iscity" :cityname="cityName"></usinfo>
    <condition v-model="iscartype" @keyword="keywoed" :brand="brandID" @reset="reset"></condition>
    <list :search="seach"></list>
  <cartype v-if="iscartype" @brandid="send"></cartype>
  <city v-if="iscity" @city="choose"></city>
    <div class="block" v-if="seach">
      <el-pagination
          :page-size="15"
          background
          @size-change="handleSizeChange"
          layout=" prev, pager, next, jumper"
          :total="seach?seach.total:0"
            v-if="seach.total"
          >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import usinfo from "./compon/head";
import condition from "./compon/condition";
import list from "./compon/list";
import cartype from "./compon/typech";
import city from "./compon/city";
import request from "@/utils/request";
import Bus from "@/utils/bus";
export default {
  name: "Accessories",
  components: { usinfo, list, condition, cartype, city },
  data() {
    return {
      iscity: false,
      iscartype: false,
      seach: null,
      cityName: "杭州",
      keyWord: "",
      cityId: null,
      brandID: null,
      contextMenuData: {
        menuName: null,
        axios: {
          x: null,
          y: null
        },
        menulists: [
          {
            fnHandler: "copy",
            icoName: "fa fa-home fa-fw",
            btnName: "复制"
          },
          {
            fnHandler: "stickiness",
            icoName: "fa fa-home fa-fw",
            btnName: "粘粘"
          }
        ]
      },
      transferIndex: {
        type: Number,
        default: 0
      }
    };
  },
  methods: {
    //重置
    reset(i) {
      request({
        url: "/merchant/auto/seller/keyword/page",
        method: "get",
        data: {
          pageSize: 14,
          page: i ? i : 0
        }
      }).then(res => {
        this.seach = res.data;
        console.log(res, "商户列表");
      });
    },
    //获取选择城市
    choose(obj) {
      this.iscity = false;
      this.cityName = obj.name;
      this.cityId = obj.id;
      if (!this.brandID) {
        request({
          url: "/merchant/auto/seller/page",
          params: {
            cityId: this.cityId
          },
          method: "get"
        }).then(res => {
          this.seach = res.data;
        });
      } else {
        request({
          url: "/merchant/auto/seller/page",
          params: {
            cityId: this.cityId,
            labelId: this.brandID.id
          },
          method: "get"
        }).then(res => {
          this.seach = res.data;
        });
      }
    },
    keywoed(str) {
      this.keyWord = str;
      console.log(str);
      request({
        url: "/merchant/auto/seller/keyword/page?keyword=" + this.keyWord
      }).then(res => {
        this.seach = res.data;
      });
    },
    //获取品牌ID
    send(x) {
      this.iscartype = false;
      this.brandID = x;
      if (this.cityId) {
        request({
          url: "/merchant/auto/seller/page",
          params: {
            cityId: this.cityId,
            labelId: x.id
          },
          method: "get"
        }).then(res => {
          this.seach = res.data;
        });
      } else {
        request({
          url: "/merchant/auto/seller/page",
          params: {
            labelId: x.id
          },
          method: "get"
        }).then(res => {
          this.seach = res.data;
        });
      }
    },
    //点击页码
    handleSizeChange(i) {
      this.reset(i);
    },
    //当前页码变化
    handleCurrentChange() {},
    showMenu(index) {
      this.transferIndex = index; // tranfer index to child component
      event.preventDefault();
      var x = event.clientX;
      var y = event.clientY;
      this.contextMenuData.axios = {
        x,
        y
      };
    },
    savedata(e) {
      console.log("click:" + e);
    },
    newdata() {
      console.log(2222);
    }
  },
  created() {
    this.reset();
  },
  watch: {
    "contextMenuData.axios"(val) {
      var x = val.x;
      var y = val.y;
      var _this = this;
      var index = _this.transferIndex;
      var menuName = "vue-contextmenuName-" + _this.contextMenuData.menuName;
      var menu = document.getElementsByClassName(menuName)[index];
      menu.style.display = "block";
      menu.style.left = x + "px";
      menu.style.top = y + "px";
      document.addEventListener(
        "mouseup",
        function() {
          menu.style.display = "none";
        },
        false
      );
    }
  },
  mounted() {
    document.body.onclick = el => {
      if (el.target.className == "typeCar") {
        this.iscartype = false;
      }
    };
  }
};
</script>
<style scoped>
.bigBox {
  position: relative;
}
.block {
  text-align: center;
  margin-bottom: 20px;
}
.block .el-pagination {
  display: inline-block;
}
</style>
