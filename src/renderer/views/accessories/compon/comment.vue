<template>
<div class="comment">
 <h2>店铺评论</h2>
    <div class="cont">
       
        <div v-for="x in 5" :key="x" class="smble">
            <div class="usinfo">
                <img src="@/../../static/image/gtq.jpg" alt="图片加载失败">
                <div>
                    <p>用户A</p>
                    <p class="data">2018-08-29 18:11</p>
                </div>
            </div>
            <div class="content">
                <p>一如既往的好，手机验证是正品，加了这个油，发动机的声音都是那么好听！老客户了！</p>
            </div>
            <div class="img">
                <img v-for="x in 3" :key="x" src="@/../../static/image/touxiang.jpeg" alt="图片加载失败">
            </div>
        </div>
    </div>
</div>    
</template>
<script>
import request from "@/utils/request";
export default {
  props: ["id"],
  data() {
    return {
      pl: null
    };
  },
  created() {
    //请求已配置好，暂无数据
    console.log(this.id);
    request({
      url: "/merchant/autoSellerComment/" + this.id,
      method: "get"
    }).then(res => {
      this.pl = res.data;
      console.log(res.data);
    });
  }
};
</script>
<style lang="scss" scoped>
h2 {
  line-height: 21px;
  border-left: 3px solid #ff6749;
  margin: 10px 0;
  font-size: 24px;
  line-height: 35px;
  padding-left: 1em;
}
.comment {
  font-size: 18px;
  color: #333;
  display: flex;
  padding: 20px;
  flex-direction: column; 
  .cont {
    padding-left: 67px;
    display: flex;
    flex-direction: column;
    background: #fff;
    width: 100%;
    border-radius: 5px;
    box-shadow: 0px 0px 14px -2px #000;
  }
  .smble {
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    flex-direction: column;
    .usinfo {
      display: flex;
      margin-top: 10px;
      img {
        width: 47px;
        height: 47px;
        border-radius: 50%;
        margin-right: 14px;
      }
      div {
        display: flex;
        flex-direction: column;
      }
      .data {
        font-size: 13px;
        padding-top: 12px;
        color: #999;
      }
    }
    .content {
      font-size: 16px;
      line-height: 50px;
    }
    .img {
      margin-bottom: 20px;
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
