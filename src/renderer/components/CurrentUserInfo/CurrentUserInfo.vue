<template>
    <div>
         <div class="userInfo">
            <div class="infoBox">
               <img :src="users.avatar" alt="图片加载失败">
            </div>
            <div class="infoAccount">
                <p>{{users.nick}}</p>
            </div>
         </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["im"]),
    users() {
      return this.im.myInfo;
    }
  }
};
</script>
<style lang="scss" scoped>
.userInfo {
  display: flex;
  width: 160px;
  .infoBox {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    img {
      margin-top: 2px;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .infoAccount {
    line-height: 48px;
    padding-left: 6px;
  }
}
</style>

