<template>
	<p @click="goout">系统设置</p>
</template>
<script>
import { removeLocal } from "@/utils/localstorage.js";
import { logout } from "@/api/user/login.js";
export default {
  methods: {
    goout() {
      console.log(111);
      logout().then(res => {});
      this.$router.push("/login");
      removeLocal("loginToken");
    }
  }
};
</script>
