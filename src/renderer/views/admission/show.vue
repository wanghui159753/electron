<template>
    <div class="bg">
        <hed style="margin: 0"></hed>
        <div class="scrollbar" style="
    height: calc(100% - 58px); padding-top:15px;">
            <bt :num="n" v-if="$route.path!=='/admission/index/Record'"/>
            <keep-alive>
                <router-view v-model="n"></router-view>
            </keep-alive>
        </div>
    </div>
</template>
<script>
import hed from "./bt/header.vue";
import bt from "./bt/step";
import request from "@/utils/request";
import { setLocal, getLocal } from "@/utils/localstorage";
import { getdetails } from "@/api/admission/admission.js";
export default {
  data() {
    return {
      n: 0
    };
  },
  watch: {
    $route(to) {
      to.path == "/admission/index" ? this.creat() : null;
    }
  },
  methods: {
    creat() {
      getdetails().then(res => {
        setLocal("myshop", JSON.stringify(res.data));
        this.istrue(res.data);
      });
    },
    istrue(res) {
      if (res.status == "OK") {
        this.$router.push("/admission/index/resultSucc");
      } else if (res.status == "AWAIT") {
        this.$router.push("/admission/index/onAudit");
      } else if (res.status == "FAILURE") {
        this.$router.push("/admission/index/resultError");
      } else {
        this.$router.push("/admission/index/step1/0");
      }
    }
  },
  components: { hed, bt },
  created() {
    this.creat();
  },
  actived() {
    this.creat();
  }
};
</script>
<style scoped>
el-button {
  width: 280px;
  height: 50px;
}
.bg {
  background: #f3f3f3;
    height: 100%;
}
</style>