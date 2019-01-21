<template>
	<div class="oic">
		<div class="picList">
			<div v-for="(item,index) in picArr"
			class="pics"
			:key="index" 
			>
				<img :src="item">
				<el-row class="btn">
					<el-button class="btns" size="small" type="primary" v-show="index!==0" @click="top1(item,index)">置顶</el-button>
					<el-button class="btns" size="small" type="primary" @click="del">删除</el-button>
					<el-button class="btns" size="small" type="primary" @click="reset">修改</el-button>
				</el-row>
			</div>
		</div>
		<div class="upPic">
			<el-upload
			  class="avatar-uploader"
			  action="https://jsonplaceholder.typicode.com/posts/"
			  :show-file-list="false"
			  :on-success="handleAvatarSuccess"
			  :before-upload="beforeAvatarUpload">
			  <img src="static/image/upimg.png" width="50" height="50">
			  <p>继续添加</p>
			</el-upload>
			  <p>注：您最多可以添加5张图</p>
		</div>
		<div class="see">
			<!-- 图片裁切预留 -->
		</div>
	</div>
</template>
<script>
export default {
  name: "picCenter",
  data() {
    return {
      picArr: [
        "http://img17.3lian.com/d/file/201702/20/c916ff75d8cd86a2696987881aaa8961.jpg",
        "http://img17.3lian.com/d/file/201702/28/b714b678189ab7d26fd6f9fd8adae24f.jpg",
        "http://img17.3lian.com/d/file/201702/20/c916ff75d8cd86a2696987881aaa8961.jpg",
        "http://img17.3lian.com/d/file/201702/28/b714b678189ab7d26fd6f9fd8adae24f.jpg"
      ],
      imageUrl: ""
    };
  },
  methods: {
    top1(url, n) {
      this.picArr.splice(n, 1);
      this.picArr.unshift(url);
    },
    del(n) {
      this.picArr.splice(n, 1);
    },
    reset() {},
    handleAvatarSuccess(res, file) {
      this.picArr.push(URL.createObjectURL(file.raw));
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      const len = this.picArr.length == 5;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      if (len) {
        this.$message.error("最多上传五张");
      }
      return isJPG && isLt2M && len;
    }
  }
};
</script>
<style scoped lang="scss">
.oic {
  width: 605px;
  padding: 66px 0 0 46px;
}
.pics img {
  width: 481px;
  height: 203px;
}
.pics {
  font-size: 0;
  margin-bottom: 8px;
  position: relative;
}
picList {
  height: 620px;
  overflow: auto;
}
.btn {
  position: absolute;
  top: 57px;
  right: 0;
}
.btn button {
  display: block;
  margin: 7px 0;
}
.btns {
  padding: 6px 14px;
}
.avatar-uploader .el-upload {
  background: black;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #ff6749;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.upPic {
  width: 481px;
  padding: 30px 0 0 0;
  text-align: center;
  color: #333333;
  img {
    display: inline-block;
    margin-bottom: 12px;
  }
  p {
    font-size: 15px;
  }
}
.upPic > p {
  font-size: 18px;
  transform: scale(0.5);
}
</style>