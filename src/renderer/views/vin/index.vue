<template>
    <div class="vin">
        <div class="vin-title">
            <div class="m-t-left">
              VIN查询
            </div>
            <div class="m-t-center"></div>
            <div class="m-t-right">
              <CurrentUserInfo></CurrentUserInfo>
            </div>
        </div>
        <keep-alive>
          <div class="vin-container">
              <div class="top">
                <el-input v-model="input" placeholder="请输入内容" size="mini" suffix-icon="el-icon-search"></el-input>
              </div>
              <div class="left outer-container">
                  <div class="inner-container">
                      <ul class="content">
                          <li v-for="index in 30" :key="index" @click="handleClick(index)">
                              <div slot="label" class="m-title" :class="{active: activeName == index}">
                                  <div class="m-title-left" >
                                      <div class="t-l-conter">
                                        <h5>LGBHSNDIE45878715345</h5>
                                        <p>日产-天籁 <span class="vin-button">vin</span></p>
                                      </div>
                                  </div>
                              </div>
                          </li>
                      </ul>
                  </div>
              </div>
              <div class="right bg">
                 <vin-right></vin-right>
              </div> 
          </div>
        </keep-alive>
    </div> 
</template>

<script>
import VinRight from "./model/vinRight";
import CurrentUserInfo from "@/components/CurrentUserInfo/CurrentUserInfo.vue";

export default {
  name: "Message",
  data() {
    return {
      input: "",
      activeName: 1
    };
  },
  components: {
    VinRight,
    CurrentUserInfo
  },
  methods: {
    handleClick(i) {
      console.log(i);
      this.activeName = i;
    }
  }
};
</script>

<style scoped lang="scss">
.outer-container,
.content {
  width: 275px;
  height: calc(100vh - 130px);
}
.active {
  background-color: #e0e0e0;
  border-right: 2px solid #ff6749;
}
.vin {
  position: relative;
  .vin-title {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    .m-t-left {
      width: 265px;
      text-align: center;
      line-height: 30px;
    }
    .m-t-center {
      width: calc(100% - 265px - 10px);
      text-align: center;
      line-height: 30px;
      cursor: pointer;
    }
    .m-t-right {
      width: 200px;
      position: absolute;
      right: -12px;
      top: 0px;
      .m-t-right-i {
        width: 30px;
        height: 30px;
        border-radius: 50px;
        img {
          width: 100%;
          border-radius: 50px;
        }
      }
      .m-t-right-t {
        line-height: 30px;
      }
    }
  }
  .vin-container {
    display: flex;
    justify-content: space-between;
    position: relative;
    .top {
      display: inline-block;
      position: absolute;
      left: 10px;
      top: 10px;
    }
    .left {
      padding-top: 50px;
      ul {
        li {
          list-style: none;
        }
        .m-title {
          display: flex;
          justify-content: space-between;
          line-height: normal;
          padding: 10px 5px;
          border-bottom: 1px solid #e0e0e0;
          .m-title-left {
            display: flex;
            justify-content: space-between;
            color: #343232;
          }
          .t-l-conter {
            padding-left: 10px;
            text-align: left;
            h5 {
              font-size: 16px;
              line-height: 28px;
              color: #291c1c;
            }
            p {
              font-size: 12px;
              line-height: 20px;
              color: #888584;
              span.vin-button {
                padding: 0 5px;
                display: inline-block;
                background-color: #ff6749;
                color: white;
              }
            }
          }
        }
      }
    }
  }
  .right {
    width: calc(100% - 275px);
  }
}
</style>
<style lang="scss">
.vin {
  .el-input__inner {
    background-color: #e0e0e0;
  }
}
</style>