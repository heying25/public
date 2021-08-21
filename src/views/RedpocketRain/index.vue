<template>
  <div class="redpocket-rain">
    <div :id="containerId" class="rain-container"></div>
    <div class="start-btn" v-if="!ing" @click="startRain">点击开始红包雨</div>
  </div>
</template>

<script>
import launch from './index.js';
export default {
  name: 'RedpocketRain',
  data() {
    return {
      containerId: 'phaser-game',
      ing: false
    };
  },
  methods: {
    startRain() {
      this.gameInstance = launch(this.containerId);
      this.ing = true;
      this.gameInstance.finishCallback = () => {
        this.ing = false;
      };
    }
  },
  destroyed() {
    this.gameInstance.destroy(false);
  }
};
</script>

<style lang="scss" scoped>
.redpocket-rain {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
}
.rain-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  ::v-deep canvas {
    display: block;
    width: 100%;
    height: 100vh;
  }
}
.start-btn {
  width: vw(400);
  height: vw(100);
  border-radius: vw(15);
  position: absolute;
  top: vw(500);
  left: 0;
  right: 0;
  margin: auto;
  background-color: #f7b63e;
  color: #ac4b1c;
  font-size: vw(40);
  text-align: center;
  line-height: vw(100);
}
</style>
