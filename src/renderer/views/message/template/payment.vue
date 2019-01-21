<template>
    <el-dialog title="开单收款" :visible.sync="paymentData.show" class="payment" center>
        <div class="outer-container">
            <div class="inner-container">
                <div class="content">
                    <div class="p-user-title">
                        <img src="@/../../static/image/touxiang.jpeg" alt="">
                        <p>赵丽</p>
                    </div>
                    <el-form label-position="top" size="mini">
                        <el-form-item label="收款金额" class="payment-money">
                            <el-input type="text" style="font-size:48px">
                                <strong class="el-input__icon" slot="prefix">￥：</strong>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="订单备注（选填）">
                            <div class="bg-input-w">
                                <el-input type="textarea" placeholder="声明：填写的内容将作为出现交易纠纷时候平台判决的唯一依据"></el-input>
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
        <el-button class="parts-submit" size="mini" type="primary">确定收款</el-button>
    </el-dialog>
</template>

<script>
export default {
  props: {
    paymentData: {
      type: Object,
      default: {
        show: false
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.message {
  .payment {
    .outer-container,
    .content {
      height: calc(100vh - 115px);
    }
    .inner-container {
      width: 100%;
    }
    .p-user-title {
      width: 100%;
      text-align: center;
      img {
        width: 83px;
      }
      p {
        font-size: 24px;
        color: #ff6749;
      }
    }
  }
}
</style>
