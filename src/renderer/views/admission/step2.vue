<template>
    <div>
        <pic class="pic"></pic>
    </div>
</template>
<script>
import pic from "./step/stp2zj.vue";
export default {
  data() {
    return {};
  },
  components: {
    pic
  },
  methods: {
    pu() {
      this.$emit("input", 1);
    }
  },
  created() {
    this.pu();
  },
  actived() {
    this.pu();
  }
};
</script>
<style lang="scss" scoped>
</style>
