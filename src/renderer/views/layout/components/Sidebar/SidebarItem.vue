<template>
  <div class="menu-wrapper">
    <!-- 如果路由hidden为false,并且children有值 -->
    <template v-for="item in routes" v-if="!item.hidden&&item.children">
      <!-- item.alwaysShow -->
      <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow" :to="item.path+'/'+item.children[0].path"
        :key="item.children[0].name">
        <el-menu-item :index="item.path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon" class="svgico"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">{{item.children[0].meta.title}}</span>
          <el-badge class="mark" :value="newMsg" :max="99" v-if="item.children[0].meta.title=='消息'&&newMsg!=0&&$route.path.indexOf('message')==-1" />
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>
          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
             <div>
                <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
               <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
             </div>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  name: "SidebarItem",
  props: {
    routes: {
      type: Array,
      default: []
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 是否显示侧边栏的bar
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden;
      });
      if (showingChildren.length === 1) {
        return true;
      }
      return false;
    },
    reset(flag) {
      flag ? (this.newMsg = 0) : null;
    }
  },
  computed: {
    newMsg: {
      get() {
        var msg = 0;
        this.$store.state.im.sessionlist.forEach(item => {
          item.unread && this.$route.path.indexOf("message") == -1
            ? ipcRenderer.send("triggerAudio")
            : null;
          msg += item.unread;
        });
        return msg;
      },
      set(a) {
        return a;
      }
    }
  }
};
</script>

<style socped>
.menu-wrapper {
  -moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.el-menu-item {
  position: relative;
}
.el-badge {
  position: absolute;
  right: 29px;
  top: 5px;
}
</style>


<style>
.menu-wrapper .svgico {
  /* width:20px;
  height:20px; */
  padding-top: 10px;
}
</style>

