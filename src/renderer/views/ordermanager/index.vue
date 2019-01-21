<template>
    <div>
        <p>订单管理</p>
        <CurrentUserInfo></CurrentUserInfo>
    </div>
</template>
<script>
import CurrentUserInfo from "@/components/CurrentUserInfo/CurrentUserInfo.vue";
export default {
  name: "OrderManager",
  components: {
    CurrentUserInfo
  }
};
</script>
<style scoped>
</style>
