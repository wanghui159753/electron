<template>
    <div class="reject_content">
        <el-input type="textarea" v-model="reject.reason" maxLength="200" placeholder="请输入拒绝原因"></el-input>
        <div class="img">
            <div class="list">
                <div v-for="(x,i) in reject.imageList" :key="i">
                    <img class="del" src="@/../../static/image/del.png" @click="reject.imageList.splice(i,1)" alt="">
                    <img :src="x" width="80" alt="" @click="picLooker(i)">
                </div>
            </div>
            <label class="upload" v-if="reject.imageList.length<3">
                <input type="file" @change="upFile" style="display: none">
                <span class="el-icon-plus"></span>
            </label>
        </div>
    </div>
</template>
<script>
    const upPic = require("@/utils/upPic");
    export default {
        props: ['reject'],
        methods: {
            picLooker(i){

            },
            upFile(el) {
                if (this.reject.imageList.length >= 3) {
                    this.$message.warning('最多上传三张图片')
                    return
                }
                upPic.up({files: el.target.files}, this, res => this.reject.imageList.push(res), el.target.parentNode)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .reject_content{
        overflow: hidden;
        .img {
            float: left;
            label {
                display: inline-block;
                width: 80px;
                height: 80px;
                position: relative;
                border: 1px solid #ccc;
                font-size: 45px;
                color: #ccc;
                float: left;
                span {
                    margin: 15px;
                }
            }
            .list {
                float: left;
                div {
                    width: 80px;
                    height: 80px;
                    float: left;
                    position: relative;
                    background: #ddd;
                    margin-right: 20px;
                    .del{
                        width: 24px;
                        height: 24px;
                        position: absolute;
                        right: -9px;
                        top: -9px;
                    }
                }
            }
        }
    }

</style>
<style>
    .reject_content .el-textarea{
        margin-bottom: 20px;
        height: 160px;
        background: #E6E6E6;
    }
    .reject_content .el-textarea textarea{
        height: 100%;
        resize: none;
    }
</style>