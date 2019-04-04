<template>
  <div class="newsDetail">
    <div class="newsDetail_header">
      <i class="el-icon-arrow-left" @click="$router.go(-1)">返回</i>
      <h3>{{title}}</h3>
      <div class="newsDetail_header_body">
        <span class="abstracts">摘要 : {{abstracts}}</span>
        <span class="time">发布时间 : {{time}}</span>
      </div>
    </div>

    <div class="newsDetail_body">
      <div class="newsDetail_content">
        <p id="newsDetail_body_body"></p>
        <div class="newsDetail_content_footer">
          <div class="newsDetail_content_content">
            <p>心动配讯运营中心</p>
            <p>{{otherTime}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getNews } from "@/api/news/news.js";
import { formatTime, parseTime } from "@/utils/index";
export default {
  data() {
    return {
      val: "",
      time: "",
      otherTime:'',
      title: "",
      body: "",
      abstracts: ""
    };
  },
  methods: {},
  created() {
      this.$store.commit('setLoading',true)},
   
  mounted() {
    getNews({ id: this.$route.params.id }).then(res => {
      console.log(res);
      this.time = parseTime(res.data.createTime);
      this.abstracts = res.data.abstracts;
      this.title = res.data.title;
      this.otherTime = parseTime(res.data.createTime,'{y}年{m}月{d}日');
      this.body = res.data.content || '';
      let newsBody = document.getElementById("newsDetail_body_body");
      newsBody.innerHTML = this.body;
        this.$store.commit('setLoading',false)
    });
  }
};
</script>
<style lang="scss">
.newsDetail::-webkit-scrollbar{
  width: 10px;
}
.newsDetail {
  width: 90%;
  margin: 30px auto 40px;
  border: 1px solid #e6e6e6;
  overflow: auto;
  height: calc(100vh - 12.5vh);
  .newsDetail_header_body {
    text-align: center;
  }
  .newsDetail_header_body {
    span {
      color: #e6e6e6;
      font-size: 14px;
      display: inline-block;
      padding: 0 20px;
    }
  }
  .newsDetail_header {
    line-height: 50px;
    height: 50px;
    width: 100%;
    z-index: 10;
    .el-icon-arrow-left {
      position: absolute;
      left: 5px;
      top: 30px;
      font-size: 20px;
      padding: 5px;
      cursor: pointer;
    }
    h3 {
      width: 100%;
      line-height: 50px;
      height: 50px;
      text-align: center;
    }
  }
  .newsDetail_content {
    width: 100%;
    display: flex;
    flex-direction: column;
    .newsDetail_content_footer {
      font-size: 16px;
      position: relative;
      .newsDetail_content_content {
        position: absolute;
        right: 0;
        padding-top: 30px;
        margin-bottom: 150px;
        >p {
          padding: 5px;
          text-align: center;
        }
      }
    }
    .newsDetail_body_title {
      width: 100%;
      text-align: center;
      height: 40px;
      line-height: 40px;
      font-size: 17px;
    }
    #newsDetail_body_body {
      height: 100%;
      text-align: center;
      font-size: 14px;
      padding-top: 20px;
      > p {
        color: #666;
      }
    }
  }
  .newsDetail_body {
    display: flex;
    border-top: 1px dotted #e6e6e6;
    flex-direction: column;
    margin: 50px 40px 0;
    .newsDetail_body_img {
      height: auto;
      margin: 0 5%;
      padding: 5% 0;
      border-top: 1px dotted #e6e6e6;
      img {
        width: 50%;
        height: 50%;
        display: block;
        margin: auto;
      }
    }
  }
}
</style>
