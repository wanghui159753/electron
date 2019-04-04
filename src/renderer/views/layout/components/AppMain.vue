<template>
  <section class="app-main">
      <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
}

</script>
