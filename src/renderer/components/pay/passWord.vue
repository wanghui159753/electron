<template>
    <el-dialog
            title="验证交易密码"
            width="40%"
            custom-class="pass"
            :center="true"
            :visible.sync="show"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
    >
        <p>
            请输入交易密码
            <a href="" @click.prevent="$message.error('此功能未开通')">找回密码</a>
        </p>
        <ul>
            <li v-for="(item , ind) in passWord" :key="ind" class="payPassword"
                @keyup.stop="changefoucs($event,ind)">
                <input type="password" maxlength="1" :readonly="true" :value="item">
            </li>
        </ul>
    </el-dialog>
</template>
<script>
    export default {
        data() {
            return {
                passWord: new Array(6).fill(""),
                inputList: []
            };
        },
        props: ["dialogVisible"],
        methods: {
            changefoucs(event, ind) {
                if (event.keyCode == 8 && !this.inputList[Math.abs(ind)].readOnly) {
                    this.passWord.splice(Math.abs(ind), 1, "");
                    if (ind == 0) {
                        return;
                    }
                    ind = -ind;
                } else if ((event.keyCode > 95 && event.keyCode < 106) || (event.keyCode > 47 && event.keyCode < 58)) {
                    if(!this.inputList[ind].readOnly){
                        this.passWord.splice(Math.abs(ind), 1, event.key);
                    }
                } else if (!this.inputList[Math.abs(ind)].readOnly) {
                    this.inputList[Math.abs(ind)].value = ''
                    return
                }
                if (!this.inputList[Math.abs(ind)].readOnly || ind == 5) {
                    this.inputList[Math.abs(ind + 1)] &&
                    this.inputList[Math.abs(ind + 1)].removeAttribute("readOnly");
                    this.inputList[Math.abs(ind + 1)] &&
                    this.inputList[Math.abs(ind + 1)].focus();
                    this.inputList[Math.abs(ind)].setAttribute("readOnly", "true");
                }
            },
            initFoucs(len) {
                let ind = len ? len : 0;
                this.$nextTick(() => {
                    this.inputList = document.querySelectorAll(".payPassword input");
                    this.inputList[ind].removeAttribute("readOnly");
                    this.inputList[ind].focus();
                });
            }
        },
        computed:{
            show:{
                get(){
                    return this.dialogVisible;
                },
                set(){
                    this.$emit('withdraw')
                }
            }
        },
        watch: {
            passWord: {
                handler(newValue) {
                    newValue.length < 7 && this.$emit("getPass", newValue.join(""));
                },
                deep: true
            }
        },
        mounted() {
            this.initFoucs();
        }
    };
</script>
<style lang="scss">
    .pass {
        border-radius: 10px;
        width: 350px !important;
        position: relative;
        i {
            position: absolute;
            right: 5px;
            top: 5px;
            font-size: 20px;
            cursor: pointer;
        }
        .el-dialog__header {
            font-weight: 900;
            border-bottom: 1px solid #e6e6e6;
        }
        .el-dialog__body {
            padding: 10px 25px 30px 25px;
            p {
                text-align: center;
                line-height: 40px;
                height: 40px;
            }
            a {
                color: #4293cc;
                padding-left: 15px;
            }
        }
        ul {
            border-radius: 5px;
            border: 1px solid #e6e6e6;
            margin: auto;
            width: 278px;
            li:last-of-type {
                border: 0;
            }
            li {
                list-style: none;
                display: inline-block;
                width: 46px;
                height: 40px;
                border-right: 1px solid #e6e6e6;
                input {
                    width: 45px;
                    height: 40px;
                    border: 0;
                    border-radius: 5px;
                    text-align: center;
                    font-size: 40px;
                    color: transparent;
                    text-shadow: 0 0 0 #000;
                }

            }
        }
    }
</style>