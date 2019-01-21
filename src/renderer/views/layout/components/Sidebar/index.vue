<template>
  <scroll-bar>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="activeName"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#FF6749"
      @select="handleSelect"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import ScrollBar from "@/components/ScrollBar";
import Menu from "@/configs/menu.js";
export default {
  /**
   * show-timeout 展开菜单的延时
   * default-active 当前激活菜单的Index
   * collapse 是否折叠水平收起菜单
   */
  data() {
    return {
      activeName: "/" + this.$route.path.substring(1).split("/")[0]
    };
  },
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.$router.options.routes;
      // return Menu;
    },
    isCollapse() {
      // return !this.sidebar.opened;
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeName = key;
    }
  },
  watch: {
    $route() {
      this.activeName = "/" + this.$route.path.substring(1).split("/")[0];
    }
  }
  // created() {
  //   this.activeName = "/" + this.$route.path.substring(1).split("/")[0];
  // }
};
</script>
<style type="text/css">

</style>