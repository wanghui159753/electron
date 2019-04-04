<template>
	<div class="box">
		<img src="@/../../static/image/off.png" @click="changeIt">
		<div class="vid">
			<video controls autoplay id="video" :src="url" loop></video>
		</div>
	</div>
</template>
<script type="text/javascript">
export default {
  props: ["url"],
  methods: {
    changeIt(e) {
      this.$emit("input", false);
      //当关闭视频播放窗口的时候,如果还未暂停就暂停当前播放
      var video = document.getElementById("video");
      if (!video.paused) {
        video.pause();
      }
      video = null;
    }
  }
};
</script>
<style lang="scss" scoped>
.box {
  font-size: 0;
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  border: 1px solid #e1e1e1;
  border-radius: 3px;
  z-index: 1000;
  padding: 0;
  background-color: white;
  .vid {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  img {
    position: absolute;
    top: 3%;
    right: 2%;
    z-index: 50;
  }
  video {
    width: 100%;
    height: 100%;
    max-height: 750px;
  }
}
</style>