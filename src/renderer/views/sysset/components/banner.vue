<template>
  <div style="overflow:hidden">
    <div class="banner-con">
      <div class="banner-header">
        <p>排序</p>
        <p>图片</p>
        <p>操作</p>
      </div>
      <draggable element="ul" v-model="imglist" :move="getdata" @update="datadragEnd">
        <transition-group>
          <li v-for="item in imglist" :key="item.id">
            <div class="banner-id">
              <p>{{item.id}}</p>
            </div>
            <div class="banner-img">
              <div class="upload-con" v-if="item.img!==''">
                <img :src="item.img" class="uploadImage" align="top">
              </div>
              <div class="imgList">
                <!-- <el-input type="file" prefix-icon="el-icon-plus avatar-uploader-icon" v-if="item.img ==''">上一页</el-input> -->
                <i class="el-icon-plus avatar-uploader-icon" v-if="item.img ==''"></i>
                <span v-if="item.img ==''">添加图片</span>
                <input
                  class="avatar-uploader"
                  type="file"
                  @change="upPic($event,item.id)"
                  title="请选择图片"
                >
              </div>
            </div>
            <div class="banner-btn">
              <el-button size="medium" @click="subImg">修改</el-button>
              <el-button size="medium" @click="deleteImg(item.id)">删除</el-button>
            </div>
          </li>
        </transition-group>
      </draggable>
      <p style="color:red;font-size:13px;text-align:center;height:25px;line-height:25px;">↑↓上下拖动可更换排序</p>
    </div>
    <div class="banner-right">
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="item in imglist" :key="item.id">
          <img :src="item.img" style="width: 100%;">
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<script>
// import Sortable from "sortablejs";
import draggable from "vuedraggable";
var req = require("@/utils/upPic");
import { resetDetil, getdetails } from "@/api/admission/admission.js";
import { getBannerlist, modifyBanner } from "@/api/merchant/banner.js";
export default {
  data() {
    return {
      imglist: [
        { id: 1, img: "" },
        { id: 2, img: "" },
        { id: 3, img: "" },
        { id: 4, img: "" },
        { id: 5, img: "" }
      ]
    };
  },
  components: {
    draggable
  },
  mounted() {
    this.getform();
  },
  methods: {
    //行拖拽
    getdata(evt) {
      console.log(evt.draggedContext.element.id);
    },
    datadragEnd(evt) {
      for (let i in this.imglist) {
        this.imglist[i].id =(++i);
      }
      this.subImg();
    },
    drag() {
      const el = document.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];
      Sortable.create(el, {
        disabled: !this.enableDrag,
        ghostClass: "sortable-ghost",
        setData: function(dataTransfer) {
          dataTransfer.setData("Text", "");
        }
      });
    },
    upPic(obj, ind) {
      req.up(
        obj.target,
        this,
        res => {
          if (res) {
            this.imglist[ind - 1].img =res;
          }
          obj.target.value = "";
        },
        obj.target.parentNode.children[0]
      );
    },
    deleteImg(ind) {
      this.imglist[ind - 1].img = "";
      this.subImg();
    },
    subImg() {
      let imges = this.imglist.map(v => {
        return v.img;
      });
      imges = imges.filter(v => {
        return v !== "";
      });
      this.imglist.forEach((v, i) => {
        imges.map((val, ind) => {
          if (i == ind) {
            v = val;
          }
        });
      });

      modifyBanner(imges).then(res => {
        if (res.code == 200) {
          this.$message.success("修改成功");
          // this.getform()
        }
      });
    },
    getform() {
      getBannerlist().then(req => {
        this.imglist.forEach((val, i) => {
          req.data.map((v, ind) => {
            if (ind == i) {
              val.img = v.image;
            }
          });
        });
      });
    }
  }
};
</script>

<style lang="scss">
.banner-con {
  height: 100%;
  width: 38%;
  margin-top: 30px;
  float: left;
  .banner-header {
    width: 100%;
    height: 50px;
    overflow: hidden;
    background: #e7e7e7;
    p {
      float: left;
      width: 30%;
      text-align: center;
      line-height: 50px;
    }
  }
  li {
    list-style: none;
    background: white;
    height: 90px;
    border-bottom: 1px solid #aaa;
  }
  li > div {
    float: left;
  }
  .banner-id {
    width: 33%;
    text-align: center;
    padding: 35px 0;
  }
  .banner-img {
    width: 33%;
    position: relative;
    height: 100%;
    cursor: pointer;
  }
  .banner-btn {
    height: 100%;
    padding: 15px 0;
  }
  .el-button--medium {
    width: 35px;
    text-align: center;
    padding: 20px 0;
    border: 0;
    margin: 0;
    color: #aaa;
    text-decoration: underline;
  }
  .uploadImage {
    cursor: pointer;
    border: 0;
    width:auto;
    height:auto;
    max-width:100%;
    max-height:100%;
  }
  .upload-con {
    display: block;
    position: absolute;
    cursor: pointer;
    margin: auto;
    top: 0;
    bottom: 0;
    width: 85px;
    height: 60px;
  }
  .imgList span:hover{
    color: rgb(248, 121, 36) !important;
  }
  .imgList {
    position: absolute;
    display: block;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 20px;
    left: 0;
    right: 0;
    cursor: pointer;
    span {
      color: #aaa;
      cursor: pointer;
    }
    .avatar-uploader-icon {
      font-size: 14px;
      border: 1px solid #ccc;
      color: #aaa;
      cursor: pointer;
    }
    input[type="file"] {
      color: transparent;
      cursor: pointer;
    }
    .avatar-uploader {
      position: absolute;
      left: 0;
      top: 0;
      width: 80px;
      z-index: 200;
      opacity: 0;
    }
  }
}
.banner-right {
  float: left;
  height: 200px;
  width: 50%;
  margin-left: 10%;
}
</style>
<style>
.el-carousel {
  height: 200px;
}
.el-carousel__container {
  height: 200px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

