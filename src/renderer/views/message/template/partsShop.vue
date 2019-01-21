<template>
    <el-dialog title="配件求购" :visible.sync="partsData.show" class="partsShop" center>
        <div class="outer-container">
            <div class="inner-container">
                <div class="content">
                    <el-row>
                        <el-col :span="15">
                            <el-input placeholder="输入品牌/车型" size="mini"></el-input>
                        </el-col>
                        <el-col :span="1"> &emsp; </el-col>
                        <el-col :span="4">
                            <el-button size="mini" type="primary">选择</el-button>
                        </el-col>
                    </el-row>
                    <br>
                    <el-row>
                        <el-col :span="15">
                            <el-input placeholder="输入17位车架号" size="mini"></el-input>
                        </el-col>
                        <el-col :span="1"> &emsp; </el-col>
                        <el-col :span="4">
                            <el-button size="mini" type="primary">搜索</el-button>
                        </el-col>
                    </el-row>
                    <br>
                    <el-form label-position="top" size="mini">
                        <el-form-item label="配件名称">
                            <div class="bg-input-w">
                                <el-input readonly="readonly" type="textarea" placeholder="如：左大灯，又转向灯，前保险杠（多种配件请区分）"></el-input>
                                <el-button size="mini" type="primary">选择</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item label="品质范围" class="p-pzfwei">
                            <el-row>
                                <el-col :span="6">
                                    <img src="@/../../static/image/duigou.png" alt=""> <span>原厂</span>&ensp; 
                                </el-col>
                                <el-col :span="6">
                                    <img src="@/../../static/image/duigou.png" alt=""> <span>拆车</span>&ensp; 
                                </el-col>
                                <el-col :span="6">
                                    <img src="@/../../static/image/duigou.png" alt=""> <span>品牌</span>&ensp; 
                                </el-col>
                                <el-col :span="6">
                                    <img src="@/../../static/image/duigou.png" alt=""> <span>其他</span>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="配件名称">
                            <div class="bg-input-w">
                                <el-input type="textarea" placeholder="您可以填写备注信息"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="图片附件">
                            <div class="bg-input-w">
                                <el-input readonly="readonly" type="textarea" placeholder="（您最多可以添加9张图片）"></el-input>
                                <el-button size="mini" type="primary">上传图片</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <el-button class="parts-submit" size="mini" type="primary">立即发布</el-button>
    </el-dialog>
</template>

<script>
export default {
  props: {
    partsData: {
      type: Object,
      default: {
        show:false
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.message {
  .partsShop {
    .outer-container,
    .content {
      height: calc(100vh - 115px);
    }
    .inner-container {
      width: 100%;
    }
    //   position: relative;
    .el-form {
      .p-pzfwei {
        img {
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
