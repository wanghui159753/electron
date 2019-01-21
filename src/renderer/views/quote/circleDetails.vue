<template>
        <div class="cirDetail">
            <hd></hd>
            <div class="buying">
                <div class="carInfo">
                    <img src="@/../../static/image/bmw.png" alt="">
                    <div class="name">
                        <p class="carName">别克（昂科拉）2018款 28T 手动 两驱 都市进取版</p>
                        <p>LGWED2A299E007834</p>
                    </div>
                </div>
                <div class="picList">
                    <div class="img" v-for="x in 4" :key="x">
                        <img src="@/../../static/image/gtq.jpg" alt="">
                    </div>
                </div>
                <div class="remark">
                    <p>备注：</p><span>我想要正版 原厂货，现货，能越快送到越好，价钱不是问题</span>
                </div>
            </div>
            <div class="bill">
                <h3>需求清单</h3>
                <div class="table">
                    <el-row class="head">
                        <el-col :span="4">排序(共88件)</el-col>
                        <el-col :span="4">配件名称</el-col>
                        <el-col :span="12">报价</el-col>
                        <el-col :span="4">清空</el-col>
                    </el-row>
                    <el-row class="baby" v-for="x in 3" :key="x">
                        <el-col :span="4">{{x}}</el-col>
                        <el-col :span="4">变速箱及离合器</el-col>
                        <el-col :span="12" class="press">
                            <div class="myprice">
                                <div v-for="x in 4" :key="x" :class="{borde:x==1}">
                                    <p>原厂件 现货</p>
                                    <p class="price">10000</p>
                                </div>
                            </div>

                            <!-- <div class="myprice">立即报价</div> -->
                        </el-col>
                        <el-col :span="4">修改</el-col>
                    </el-row>
                </div>
                <div class="send"><el-button type="primary">发送给买家</el-button>    </div>
            </div>
            <div class="ready">
                <h3>报价卖家</h3>
                <div class="socaler">
                    <div class="one" v-for="x in 6" :key="x">
                        <img src="@/../../static/image/car.jpg" alt="" class="headPic">
                        <div class="right">
                            <p class="name">杭州宝鹏汽配有限...</p>
                            <p><img src="@/../../static/image/position.png" alt=""> 浙江省 杭州市</p>
                            <div>
                                <img src="@/../../static/image/cash.png" alt="">
                                <img src="@/../../static/image/cash2.png" alt="">
                                <img src="@/../../static/image/cash3.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
import hd from "../admission/bt/header";
export default {
  components: {
    hd
  }
};
</script>
<style lang="scss" scoped>
@mixin fl {
  display: flex;
}
.buying {
  padding-left: 40px;
  .carInfo {
    @include fl;
    height: 50px;
    .name {
      margin-left: 12px;
      font-size: 14px;
      color: #fc684f;
      .carName {
        color: #333;
        margin-bottom: 14px;
      }
    }
  }
  .picList {
    @include fl;
    padding: 31px 0 23px 0;
    div {
      width: 90px;
      height: 90px;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .remark {
    @include fl;
    padding: 12px;
    width: 80%;
    height: 60px;
    border: 1px solid #ccc;
    font-size: 14px;
    color: #666666;
    border-radius: 5px;
    span {
      color: #333;
    }
  }
}
h3 {
  font-size: 18px;
  border-bottom: 1px solid #f96f26;
  line-height: 40px;
  margin: 20px 0;
}
.bill {
  padding-left: 40px;
  font-size: 14px;
  .head {
    @include fl;
    text-align: center;
    height: 44px;
    background: #fc684f;
    color: #fff;
    line-height: 44px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .baby {
    @include fl;
    height: 70px;
    line-height: 70px;
    border: 1px solid #cccccc;
    border-top: 0 none;
    text-align: center;
    .press {
      @include fl;
      justify-content: center;
      align-items: center;
      .myprice {
        @include fl;
        width: 100%;
        border: 1px solid #cccccc;
        border-radius: 5px;
      }
      div {
        width: 25%;
        height: 50px;
        border-left: 1px solid #cccccc;

        p {
          line-height: 25px;
        }
        .price {
          color: #fc684f;
        }
      }
    }
  }
  .el-button {
    width: 160px;
    height: 40px;
    display: block;
    margin: 30px auto;
  }
}
.borde {
  border: 0 none !important;
}

.ready {
  padding-left: 40px;
  .socaler {
    @include fl;
    flex-wrap: wrap;
  }
  .one {
    margin-right: 50px;
    margin-bottom: 40px;
    border: 1px solid #e6e6e6;
    @include fl;
    width: 260px;
    height: 120px;
    padding: 10px;
    padding-right: 0;
    .headPic {
      width: 100px;
      height: 100px;
      margin-right: 10px;
    }
    .right {
      font-size: 12px;
      color: #333;
      div {
        height: 48px;
        margin-top: 17px;
      }
      p {
        img {
          width: 12px;
          height: 14px;
        }
      }
      .name {
        font-size: 14px;
        line-height: 33px;
      }
      img {
        width: 22px;
        height: 22px;
        vertical-align: middle;
      }
    }
  }
}
</style>
