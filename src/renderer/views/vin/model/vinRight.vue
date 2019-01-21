<template>
    <div class="vin-right">
        <div class="vin-right-top">
            <!--
            <section class="vin-right-t-l" @click.stop="prev"><img src="../../../../../static/image/Left Carousel.png" alt="" sizes="" srcset=""></section>
            <section class="vin-right-t-c"><img :src="imgsData[num]" alt="" sizes="" srcset=""></section>
            <section class="vin-right-t-r" @click.stop="next"><img src="../../../../../static/image/Right Carousel.png" alt="" sizes="" srcset=""></section>
            -->
        </div>
        <div class="vin-right-bottom">
            <el-table :data="tableData" :show-header="false" style="width: 100%">
                <el-table-column align="center" prop="date"></el-table-column>
                <el-table-column align="center" prop="name"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      imgsData: [
        "@/../../../static/image/avatar.png",
        "@/../../../static/image/touxiang.jpeg"
      ],
      num: 0,
      tableData: [
        { date: "品牌车系", name: "123" },
        { date: "123", name: "123" },
        { date: "123", name: "123" },
        { date: "123", name: "123" },
        { date: "123", name: "123" }
      ]
    };
  },
  methods: {
    prev() {
      if (this.num == 0) {
        this.num = this.imgsData.length;
      }
      this.num--;
    },
    next() {
      if (this.num == this.imgsData.length - 1) {
        this.num = -1;
      }
      this.num++;
    }
  }
};
</script>

<style lang="scss" scoped>
.vin-right {
  .vin-right-top {
    display: flex;
    justify-content: space-between;
    padding: 10px 30px;
    .vin-right-t-l,
    .vin-right-t-r {
      width: 161px;
      padding: 115px 10px;
      cursor: pointer;
      img {
        width: 100%;
      }
    }
    .vin-right-t-c {
      width: 100%;
      height: 342px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .vin-right-bottom {
    border: 1px solid #ebeef5;
    border-bottom: none;
    margin-top: 20px;
    margin: 20px 20px 0 20px;
  }
}
</style>

