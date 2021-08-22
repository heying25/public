<template>
  <div class="page-wrap">
    <div class="game-wrap" ref="game"></div>
    <div class="clock">{{ time }}</div>
    <div class="progress">
      <div
        class="progress-fill"
        :class="{
          active: start
        }"
      ></div>
    </div>
    <div class="start-btn" v-if="showBtn" @click="onClickStart">开始</div>
  </div>
</template>
<script>
import game from './game';

export default {
  data() {
    return {
      showBtn: true,
      start: false,
      time: 10
    };
  },
  mounted() {
    const width = 750;
    const height = width / (window.innerWidth / window.innerHeight);
    game.launch({
      parent: this.$refs.game,
      width,
      height
    });
  },
  beforeDestroy() {
    clearInterval(this.timer);
    game.destroy();
  },
  methods: {
    onClickStart() {
      this.showBtn = false;
      this.start = true;
      game.restart();
      let rest = 10;
      this.time = rest;
      this.timer = setInterval(() => {
        rest--;
        this.time = rest;
        if (rest === 0) {
          clearInterval(this.timer);
          this.start = false;
          this.showBtn = true;
          game.pause();
        }
      }, 1000);
    }
  }
};
</script>
<style lang="scss" scoped>
.page-wrap {
  background-image: url('~@/assets/RedpocketRain/bg.png');
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: center;
}

.game-wrap {
  position: relative;
  width: 100%;
  height: 100%;

  ::v-deep canvas {
    width: 100%;
  }
}

.clock {
  background-image: url('~@/assets/RedpocketRain/clock.png');
  position: absolute;
  top: vw(10);
  left: vw(10);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: vw(50);
  font-weight: bold;
}

@keyframes progAni {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-100%, 0, 0);
  }
}

.progress {
  background-image: url('~@/assets/RedpocketRain/progress.png');
  position: absolute;
  top: vw(50);
  left: vw(150);
  border-radius: vw(20);
  overflow: hidden;

  &-fill {
    background-image: linear-gradient(0deg, #fbc063, #fff);
    position: absolute;
    width: 100%;
    height: 100%;

    &.active {
      animation: progAni 10s linear both;
    }
  }
}

.start-btn {
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 32px;
  -webkit-tap-highlight-color: transparent;
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
