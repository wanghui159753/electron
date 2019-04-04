<template>
    <div class="page" :key="total">
        <el-pagination
                :page-size="size||10"
                layout="prev, pager, next, jumper"
                :total="total"
                background
                @current-change="getMore"
        >
        </el-pagination>
    </div>
</template>
<script>
export default {
  props: ["total",'size'],
  methods: {
    getMore(i) {
      this.$emit("sizeChange", i);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
