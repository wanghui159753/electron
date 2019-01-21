<template>
    <div class="q-offer">
        <div class="q-offer-title">
          <div class="q-offer-title-t clearfloat">
            <section class="q-offer-t-i"><img src="../../../../static/image/touxiang.jpeg" alt=""></section>
            <section class="q-offer-t-c">
                <p>修理厂（福建厦门） </p>
                <p class="color-ff6749">车架号：ZEEFZ58E3601506387</p>
            </section>
          </div>
          <div class="text-height">采购车型：<span class="color-ff6749">法拉利F430 2009款</span></div>
          <div class="text-height">参考价格表：单位 元/件</div>
        </div>

        <div class="q-offer-table">
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column align="center" prop="date"></el-table-column>
                <el-table-column align="center" label="原配件">
                  <template slot-scope="scope">
                      {{scope.row.name}} <i class="el-icon-arrow-right" @click="dialogVisible = true"></i>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="address" label="附配件"></el-table-column>
                <el-table-column align="center" prop="date" label="拆车件"></el-table-column>
                <el-table-column align="center" prop="name" label="品牌件"></el-table-column>
                <el-table-column align="center" prop="address"></el-table-column>
            </el-table>
        </div>
        <div class="q-offer-input">
            <div class="bg-input-w">
                <el-input type="textarea" placeholder="您可以填写备注信息"></el-input>
            </div>
            <div class="bg-input-w">
                <el-input readonly="readonly" type="textarea" placeholder="（您最多可以添加9张图片）"></el-input>
                <el-button size="mini" type="primary">上传图片</el-button>
            </div>
        </div>
        <div class="q-offer-bottom">
            <el-button size="mini">取消</el-button>
            <el-button size="mini" type="primary">确定报价（ENTER）</el-button>
        </div>


        <el-dialog title="您可以选择" :visible.sync="dialogVisible" class="offer-dialog" width="40%">
          <div class="offer-d-radio">
            <el-radio v-model="radio" :label="1"><i class="el-icon-circle-check-outline" :class="{'color-ff6749': radio == 1}"></i> 现货</el-radio>
            <el-radio v-model="radio" :label="2"><i class="el-icon-circle-check-outline" :class="{'color-ff6749': radio == 2}"></i> 预定</el-radio>
          </div>
          <div class="offer-d-checkbox">
            <el-checkbox-group v-model="checkboxGroup" size="mini" v-if="radio==1">
              <el-checkbox-button :label="1">11</el-checkbox-button>
              <el-checkbox-button :label="2">12</el-checkbox-button>
              <el-checkbox-button :label="3">13</el-checkbox-button>
              <el-checkbox-button :label="4">14</el-checkbox-button>
              <el-checkbox-button :label="5">15</el-checkbox-button>
              <el-checkbox-button :label="6">11</el-checkbox-button>
              <el-checkbox-button :label="7">12</el-checkbox-button>
              <el-checkbox-button :label="8">13</el-checkbox-button>
              <el-checkbox-button :label="9">14</el-checkbox-button>
              <el-checkbox-button :label="10">15</el-checkbox-button>
            </el-checkbox-group>
            <el-checkbox-group v-model="checkboxGroup" size="mini" v-if="radio==2">
              <el-checkbox-button :label="1">1去玩儿育</el-checkbox-button>
              <el-checkbox-button :label="2">1去玩儿育</el-checkbox-button>
              <el-checkbox-button :label="3">1去玩儿育</el-checkbox-button>
              <el-checkbox-button :label="4">1去玩儿育</el-checkbox-button>
              <el-checkbox-button :label="5">1去玩儿育</el-checkbox-button>
              <el-checkbox-button :label="6">1去玩儿育</el-checkbox-button>
              <el-checkbox-button :label="7">1去玩儿育</el-checkbox-button>
              <el-checkbox-button :label="8">1去玩儿育</el-checkbox-button>
              <el-checkbox-button :label="9">1去玩儿育</el-checkbox-button>
              <el-checkbox-button :label="10">1阿萨德发过火</el-checkbox-button>
            </el-checkbox-group>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 弹出框
      dialogVisible: false,
      radio: 1,
      checkboxGroup: [],
      tableData: [
        { date: "as", name: "12", address: "adf" },
        { date: "as", name: "12", address: "adf" },
        { date: "as", name: "12", address: "adf" },
        { date: "as", name: "12", address: "adf" },
        { date: "as", name: "12", address: "adf" },
        { date: "as", name: "12", address: "adf" }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.q-offer {
  .q-offer-title {
    padding: 0 20px;
    .q-offer-title-t {
      section {
        float: left;
      }
      .q-offer-t-i {
        width: 70px;
        img {
          width: 100%;
        }
      }
      .q-offer-t-c {
        padding-top: 25px;
        line-height: 25px;
      }
    }
  }
  .q-offer-input {
    display: flex;
    padding: 20px 10px;
    .bg-input-w {
      position: relative;
      padding-right: 20px;
    }
  }
  .q-offer-bottom {
    text-align: right;
  }
  .offer-d-radio {
    padding: 10px 0px;
    border-bottom: 1px solid #e1e1e1;
    text-align: center;
  }
  .offer-d-checkbox {
    .el-checkbox-group {
      .el-checkbox-button {
        margin: 10px 5px;
        border: 1px solid #dcdfe6;
      }
    }
  }
}
</style>

<style lang="scss">
.q-offer {
  .q-offer-table {
    .el-table--striped {
      .el-table__body tr.el-table__row--striped {
        td {
          background-color: #dcdcdc;
        }
      }
    }
  }
  .el-table th {
    background-color: #ff6749;
    color: #291c1c;
  }
  .el-table td {
    border-left: 1px solid #999999;
  }
  .q-offer-input {
    .bg-input-w {
      position: relative;
      .el-textarea__inner {
        min-width: 350px !important;
        min-height: 145px !important;
      }
      .el-button {
        position: absolute;
        bottom: 10px;
        right: 30px;
      }
    }
  }
  .offer-dialog {
    .el-dialog__body {
      padding: 0 20px 30px 20px;
      .offer-d-radio {
        .el-radio__input {
          display: none;
        }
      }
      .offer-d-checkbox {
        .el-checkbox-group {
          .el-checkbox-button {
            .el-checkbox-button__inner {
              border: none;
            }
          }
          .el-checkbox-button:first-child .el-checkbox-button__inner {
            border-radius: 0px !important;
          }
          .el-checkbox-button:last-child .el-checkbox-button__inner {
            border-radius: 0px !important;
          }
        }
      }
    }
  }
}
.q-offer .q-offer-table .el-table tr.el-table__row td:nth-of-type(1) {
  border-left: none;
}
#msgbox {
  background: #f3f3f3;
}
</style>

