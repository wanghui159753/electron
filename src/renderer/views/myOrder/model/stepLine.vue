<template>
    <div class="steps">
        <div class="one" :style="{width:word.length==4?'145px':'195px'}" v-for="(x,i) in word" :key="x">
            <div>
                <div :style="{backgroundColor:num>=i?'#fc684f':''}"></div>
            </div>
            <p>{{x}}</p>
        </div>
        <div class="line"  :class="{min:word.length!=4}"></div>
    </div>
</template>
<script>
    export default {
        props: {
            status:{
                type:String,
                default: ''
            },
            autoseller:{
                type: Boolean
            },
            refund:{
                type:String,
                default:''
            },
            afterSale:{
                type:Boolean
            }
        },
        data() {
            return {
                word: ["待付款", "待发货", "待收货", "交易完成"],
                wordCopy: ["待付款", "待发货", "待收货", "已完成"],
                refundStatus:['申请售后','同意退货退款','卖家收货退款','退款成功'],
                refunds:['申请售后','同意退款','退款成功'],
                refundReject:['申请售后','同意退款','退款审核失败'],
                num:-1
            };
        },
        watch: {
            status() {
                this.initStep()
            }
        },
        methods: {
            initStep() {
                this.$nextTick(()=>{
                    let obj = document.querySelectorAll('.circle');
                    if(this.status=='FINISH'||this.afterSale){
                        if(this.refund=='REFUND'){
                            this.word=this.refunds.indexOf(this.status)>-1?this.refunds:this.refundReject;
                        }else{
                            this.word=this.wordCopy.indexOf(this.status)>-1?this.wordCopy:this.refundStatus
                        }
                    }
                    this.num=this.word.indexOf(this.status)
                })
            }
        },
        watch:{
            status(val){
                this.initStep();
            }
        },
        mounted() {
            this.initStep()
        }
    };
</script>
<style lang="scss" scoped>
    .steps {
        padding: 15px 100px;
        height: 70px;
        position: relative;
        .one {
            float: left;
            position: relative;
            z-index: 2;
            text-align: center;
            div {
                width: 20px;
                height: 20px;
                margin: 0 auto;
                border-radius: 50%;
                border: 1px solid #fc684f;
                background: #fff;
                div {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: white;
                    margin: 1.5px auto;
                    border:0;
                }
            }
            p {
                font-size: 14px;
                margin-top: 5px;
                color: #fc684f;
            }
        }
        .line {
            height: 2px;
            width: 421px;
            position: absolute;
            bottom: 43px;
            left: 180px;
            background: #fc684f;
            z-index: 1;
        }
        .min{
            width: 400px;
            left: 190px;
        }
    }
</style>
