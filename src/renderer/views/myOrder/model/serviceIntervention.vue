<template>
    <div class="form">
        <div>
            <span style="width: 100%">订单编号: {{del.tradeNo}}</span>
        </div>
        <div>
            <span>申请人</span>
            <input type="text" v-model="form.name" placeholder="请输入申请人姓名"  maxlength="15">
        </div>
        <div>
            <span>联系方式</span>
            <input v-model="form. mobile" type="number" placeholder="请输入手机号码" maxlength="11">
        </div>
        <div>
            <span>申请原因</span>
            <textarea cols="30" rows="10" v-model="form.describe" placeholder="请输入申请原因" maxlength="500"></textarea>
        </div>
        <div class="act">
            <el-button @click="$emit('input',false)">取消</el-button>
            <el-button type="primary" @click="commit">提交</el-button>
        </div>
    </div>
</template>
<script>
    import {customerService} from '@/api/myorder/index'

    export default {
        props: ['del', 'type'],
        data() {
            return {
                form: {
                    name: '',
                    mobile: '',
                    describe: '',
                    tradeNo: ''
                },
                message: {
                    name: '名称不能为空',
                    mobile: '电话不能为空',
                    describe: '描述不能为空'
                },
                reg:{
                    mobile: /^[1][3,4,5,7,8,9][0-9]{9}$/
                }
            }
        },
        methods: {
            commit() {
                if (!this.check()) return;
                this.$store.commit('setLoading', true)
                customerService(this.form).then(res => {
                    this.$message.success('售后申请已提交，工作人员将尽快处理')
                    this.$emit('input', false)
                })
            },
            check() {
                for (let x in this.form) {
                    if (!this.form[x]) {
                        this.$message.error(this.message[x])
                        return false
                    }
                    if(x == 'mobile'){
                        if(!this.reg[x].test(this.form[x])){
                            this.$message.error('手机号格式错误，请检查')
                        }
                    }
                }
                return true;
            },
            backSome(val) {
                if (this.type) {
                    return this.del.orderSellerInfo[val]
                } else {
                    return this.del.orderBuyerInfo[val]
                }
            }
        },
        created() {
            this.form.name = this.backSome('name');
            this.form.mobile = this.backSome('mobile');
            this.form.tradeNo=this.del.tradeNo;
        }
    }
</script>
<style lang="scss" scoped>
    .form {
        font-size: 16px;
        font-weight: bold;
        color: #000;
        .act {
            text-align: center;
            .el-button {
                width: 110px;
                height: 40px;
                margin-left: 50px;
            }
        }
        > div {
            overflow: hidden;
            margin: 10px 0;
            text-align: left;
            span {
                float: left;
                width: 80px;
                height: 36px;
            }
            input, textarea {
                font-size: 14px;
                text-indent: 16px;
                width: 300px;
                height: 36px;
                outline: 0;
            }
            textarea {
                padding: 10px 0 0 0;
                height: 140px;
                resize: none;
            }
        }
    }
</style>