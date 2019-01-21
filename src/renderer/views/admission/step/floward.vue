<template>  
            <div class="documents">
              <div class="lookpic">
                 <img src="@/../../static/image/del.png" alt="" class="off" @click="off">
               
                <img src="@/../../static/image/SketchMap.png" alt="" class="shili">
             </div>
        </div> 
</template>
<script>
export default {
  methods: {
    off() {
        this.$emit("input",false)
    }
  }
};
</script>

<style lang="scss" scoped>
.documents {
  position: fixed;
  top: 0;
  left: 180px;
  right: 0;
  background: rgba(233, 233, 233, 0.8);
  z-index: 2;
  padding: 12px 0;
  bottom:0;
  overflow:auto;
  h2 {
    text-align: center;
  }
  .lookpic {
    width: 860px;
    margin: 0 auto;
    background-color: #fff;
    position: relative;
    .shili{
        width: 100%;
        height: 100%;
    }
  }
}
.off {
  position: absolute;
  right: 3px;
  top: 3px;
  width: 30px;
  height: 30px;
}
</style>
