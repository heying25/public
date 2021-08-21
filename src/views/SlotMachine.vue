<template>
  <div class="page-wrap">
    <div class="machine">
      <div class="show-box">
        <div ref="slot1" class="slot-machine-col"></div>
        <div ref="slot2" class="slot-machine-col"></div>
        <div ref="slot3" class="slot-machine-col"></div>
      </div>
      <div
        class="start-btn"
        :style="{
          opacity: clickAble ? 0.5 : 1
        }"
        @click="startMachine"
      />
    </div>
  </div>
</template>

<script>
import anime from 'animejs';
import randomInt from '@/rpf/randomInt';
import vpx from '@/rpf/vpx';
const sliceHeightPx = vpx(162);
export default {
  name: 'SlotMachine',
  data() {
    return {
      clickAble: false
    };
  },
  methods: {
    startMachine() {
      if (this.clickAble) {
        return;
      }
      this.clickAble = true;
      this.playLottery(randomInt(1, 4), randomInt(1, 4), randomInt(1, 4));
    },
    playLottery(n1, n2, n3) {
      const tl = anime.timeline({
        easing: 'easeInOutCubic',
        duration: 5000,
        complete: () => {
          console.log('动画结束');
          this.clickAble = false;
        }
      });
      tl.add({
        targets: this.$refs.slot1,
        backgroundPosition: [
          '0 0',
          `0 ${sliceHeightPx * 15 + n1 * sliceHeightPx}px`
        ]
      })
        .add(
          {
            targets: this.$refs.slot2,
            backgroundPosition: [
              '0 0',
              `0 ${sliceHeightPx * 15 + n2 * sliceHeightPx}px`
            ]
          },
          500
        )
        .add(
          {
            targets: this.$refs.slot3,
            backgroundPosition: [
              '0 0',
              `0 ${sliceHeightPx * 15 + n3 * sliceHeightPx}px`
            ]
          },
          1000
        );
    }
  }
};
</script>

<style lang="scss" scoped>
.page-wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #962619;
}
.machine {
  position: relative;
  margin: auto;
  background-image: url('~@/assets/SlotMachine/machine.png');
}

.show-box {
  width: vw(480);
  height: vw(170);
  position: absolute;
  top: vw(100);
  left: vw(110);
  overflow: hidden;
  border: 1px solid red;
}
.slot-machine-col {
  position: absolute;
  top: vw(10);
  left: vw(12);
  background-image: url('~@/assets/SlotMachine/prizes.png');
  background-size: 100%;
  background-repeat: repeat-y;
  background-position: 0 0;
}

.slot-machine-col:nth-child(2) {
  left: vw(168);
}
.slot-machine-col:nth-child(3) {
  left: vw(325);
}
.start-btn {
  background-image: url('~@/assets/SlotMachine/start-btn.png');
  position: absolute;
  left: vw(165);
  top: vw(342);
}
</style>