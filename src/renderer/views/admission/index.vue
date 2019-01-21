<template>
<div>
<step1 class="forms"></step1>
<router-view></router-view>
</div>
</template>
<script>
import step1 from "./step/step1";
console.log(step1);
export default {
  name: "admission",
  data() {
    return {};
  },
  methods: {
    pu() {
      this.$emit("input", 0);
    }
  },
  components: { step1 },
  created() {
    this.pu()
  },
  activated() {
    this.pu()
  }
};
</script>
<style <style lang="scss" scoped>
.forms {
  margin: 0 auto;
}
</style>