<template>
    <div>
        <p>财务数据</p>
        <order></order>
    </div>
</template>
<script>
import order from "@/components/order/order.vue"

export default {
  name: "StateMent",
  components:{order}
};
</script>
<style scoped>
</style>
