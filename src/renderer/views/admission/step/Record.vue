  <template>
  <div class="msg">
    <el-table
      :data="tableData"
      border
      style="width: 90%;margin:0 auto;"
      class="tabn"
      v-if="tableData.length"
      >
      <el-table-column
        prop="name"
        label="审核情况"
        width="180">
      </el-table-column>
      <el-table-column
        prop="date"
        label="时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="reason"
        label="说明"
        @cell-click="alertBox"
        >
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      :page-size="20"
      layout="prev, pager, next, jumper"
      :total="e"
      background="#FC684F"
      v-if="tableData.length"
      >
    </el-pagination>
    <div class="nothing" v-if="!tableData.length">
      <img src="@/../../static/image/nothing.png" alt="">
      <p>暂无历史审核记录</p>
    </div>
  </div>
  </template>

  <script>
import request from "@/utils/request";
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "已通过",
          reason: ""
        },
        {
          date: "2016-05-04",
          name: "已通过",
          reason: ""
        },
        {
          date: "2016-05-01",
          name: "未通过",
          reason: "系统超时"
        },
        {
          date: "2016-05-03",
          name: "未通过",
          reason: "身份信息未通过"
        }
      ],
      n: 1,
      alldata: []
    };
  },
  computed: {
    e() {
      return this.alldata.length;
    }
  },
  methods: {
    handleSizeChange(e) {
      this.tableData = this.alldata.splice(15 * e - 20, 15 * e);
    },
    alertBox() {
      // console.log(111)
    }
  },
  created() {
    request({
      url: "merchant/i/auto/seller/audit/page",
      data: {
        integer: this.n,
        pageSize: 1000
      }
    }).then(res => {
      console.log(res);
      var arr = [];
      res.data.records.forEach(item => {
        var t = new Date(item.createTime);
        let str = "";
        item.messageList.forEach((i, index) => {
          str += i + " ";
        });
        arr.push({
          date: t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate(),
          name: item.result == "OK" ? "已通过" : "未通过",
          reason: item.messageList.join(" ； ")
        });
      });
      arr = arr.reverse();
      this.tableData = arr.length < 20 ? arr : arr.slice(0, 15);
      this.alldata = arr;
    });
  }
};
</script>
  <style lang="scss" scoped>
.msg {
  height: 850px;
  min-height: 100%;
}

.el-table {
  text-align: center;
}
.el-pagination {
  text-align: center;
}
.nothing {
  text-align: center;
  padding: 100px 0;
  p {
    font-size: 24px;
    color: #666;
  }
}
</style>
<style>
.el-table td,
.el-table th.is-leaf {
  text-align: center;
}
.el-table th {
  background: #e6e6e6;
}
</style>

  