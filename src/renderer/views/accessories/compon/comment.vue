<template>
  <div class="comment">
    <h2>店铺评论</h2>
    <p class="kaifa">功能开发中</p>
    <!-- <div class="sortType">
      <el-radio-group v-model="radio2">
        <el-radio :label="1">全部</el-radio>
        <el-radio :label="2">好评</el-radio>
        <el-radio :label="3">中评</el-radio>
        <el-radio :label="4">差评</el-radio>
      </el-radio-group>
    </div>
    <div class="cont">
      <div v-for="x in 5" :key="x" class="smble">
        <div class="left">
          <img src="@/../../static/image/gtq.jpg" alt="加载失败">
        </div>
        <div class="right">
          <div class="usinfo">
            <div>
              <p>
                152***666
                <span class="type">维修厂</span>
              </p>
              <p>
                <el-rate v-model="value3" disabled></el-rate>
              </p>
            </div>
          </div>
          <div class="content">
            <p>快递小哥很给力，还送货上门的，帽子质量很好，皮质的防水效果是真的好，还送了手套，对比了其他家的，价格一样，但是没有送手套， 果</p>
          </div>
          <div class="img">
            <img v-for="x in 3" :key="x" src="@/../../static/image/touxiang.jpeg" alt="图片加载失败">
          </div>
        </div>
      </div>
      <page :total='50' :size='10' class="manger"></page>
    </div> -->
  </div>
</template>
<script>
import request from "@/utils/request";
import page from "@/components/pager/pager";
export default {
  props: ["id"],
  components: {
    page
  },
  data() {
    return {
      radio2: 3,
      pl: null,
      value3: 5
    };
  },
  created() {
    // request({
    //   url: "/merchant/autoSellerComment/" + this.id,
    //   method: "get"
    // }).then(res => {
    //   this.pl = res.data;
    // });
  }
};
</script>
<style lang="scss" scoped>
h2 {
  line-height: 21px;
  margin: 10px 0;
  color: #000;
  font-size: 16px;
  line-height: 35px;
}
.kaifa{
  line-height: 40px;
  text-align: center;
}
.comment {
  font-size: 18px;
  color: #333;
  display: flex;
  padding: 20px;
  flex-direction: column;
  .manger{
    position: initial;
    text-align: right;
    border:0;
  }
  .sortType {
    height: 36px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    background: #fafafa;
  }
  .cont {
    display: flex;
    flex-direction: column;
    background: #fff;
    width: 100%;
    border-radius: 5px;
    padding: 20px;
  }
  .smble {
    border-bottom: 1px solid #e9e9e9;
    padding: 20px 0;
    display: flex;
    .left {
      margin-right: 20px;
      img {
        width: 60px;
        height: 60px;
        border-radius: 5px;
      }
    }
    .usinfo {
      display: flex;
      .type {
        display: inline-block;
        padding: 0 5px;
        height: 18px;
        background: linear-gradient(90deg, #fb7d23, #fba729);
        border-radius: 2px;
        color: #fff;
        font-size: 12px;
        text-align: center;
        line-height: 18px;
      }
      div {
        p {
          div {
            line-height: 16px;
          }
        }
      }
      img {
        width: 47px;
        height: 47px;
        border-radius: 50%;
        margin-right: 14px;
      }
      .data {
        font-size: 13px;
        padding-top: 12px;
        color: #999;
      }
    }
    .content {
      font-size: 16px;
      line-height: 28px;
    }
    .img {
      display: flex;
      img {
        width: 109px;
        height: 109px;
        margin-right: 16px;
      }
    }
  }
}
</style>
