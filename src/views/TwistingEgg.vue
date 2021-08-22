<template>
  <div class="page-wrap">
    <div class="safe-area">
      <div class="machine">
        <div class="machine-circle">
          <div
            v-for="(item, index) in balls"
            ref="balls"
            :class="['machine-ball', `machine-ball-${item.src}`]"
            :key="index"
            :style="{
              marginLeft: `-${vpx(typeSizeMap[item.type]) / 2}px`,
              marginTop: `-${vpx(typeSizeMap[item.type]) / 2}px`,
              width: `${vpx(typeSizeMap[item.type])}px`,
              height: `${vpx(typeSizeMap[item.type])}px`
            }"
          ></div>
        </div>
        <div class="machine-cover"></div>
        <div
          class="lottery-btn"
          @click="_drawLottery"
          :style="{
            opacity: ing ? 0.5 : 1
          }"
        ></div>
        <div
          :class="{ prize: true, anim: showPrize }"
          :style="{
            backgroundImage: `url(${prizeImg})`
          }"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import vpx from '@/rpf/vpx';
import randomInt from '@/rpf/randomInt';
import anime from 'animejs';

const machineRadius = 290;

function getCirclePos(p1, r) {
  const p2 = Math.sqrt(r * r - p1 * p1);
  return [-p2, p2];
}

const typeSizeMap = {
  small: 110,
  large: 220
};
const balls = [
  {
    src: 'ball_blue',
    type: 'small'
  },
  {
    src: 'ball_pink',
    type: 'small'
  },
  {
    src: 'ball_yellow',
    type: 'small'
  },
  {
    src: 'ball_blue',
    type: 'small'
  },
  {
    src: 'ball_pink',
    type: 'small'
  },
  {
    src: 'ball_yellow',
    type: 'small'
  },
  {
    src: 'prize_1',
    type: 'large'
  },
  {
    src: 'prize_2',
    type: 'large'
  },
  {
    src: 'prize_3',
    type: 'large'
  },
  {
    src: 'prize_4',
    type: 'large'
  },
  {
    src: 'prize_5',
    type: 'large'
  }
];

export default {
  name: 'TwistingEgg',
  data() {
    return {
      ing: false,
      prizeRes: null,
      showPrize: false
    };
  },
  computed: {
    typeSizeMap() {
      return typeSizeMap;
    },
    balls() {
      return balls.map(b => {
        // 初始化位置
        const size = typeSizeMap[b.type];
        const x = randomInt(
          -(machineRadius - size / 2),
          machineRadius - size / 2
        );
        const y = getCirclePos(x, machineRadius - size / 2)[1];
        return {
          ...b,
          pos: {
            x,
            y
          }
        };
      });
    },
    prizeImg() {
      let src;
      if (this.prizeRes) {
        src = require(`@/assets/TwistingEgg/prize_${this.prizeRes}.png`);
      } else {
        src = require(`@/assets/TwistingEgg/prize_1.png`);
      }
      return src;
    }
  },
  mounted() {
    this.$refs.balls.forEach((b, idx) => {
      const { pos } = this.balls[idx];
      b.style.transform = `translateX(${vpx(pos.x)}px) translateY(${vpx(
        pos.y
      )}px) translateZ(0)`;
    });
  },
  methods: {
    vpx(val) {
      return vpx(val);
    },
    _drawLottery() {
      if (this.ing) {
        return;
      }
      this.ing = true;
      this.prizeRes = null;
      this.showPrize = false;
      this._ballAnim();
    },
    _ballAnim() {
      const animProm = this.$refs.balls.map((b, idx) => {
        const moves = Array(10)
          .fill('')
          .map((_, index) => {
            const size = typeSizeMap[this.balls[idx].type];
            const x =
              randomInt(0, machineRadius - size / 2) *
              (index % 2 === 0 ? 1 : -1);

            const y = getCirclePos(x, machineRadius - size / 2)[
              randomInt(0, 1)
            ];
            return {
              translateX: vpx(x),
              translateY: vpx(y),
              translateZ: 0
            };
          });
        const initPos = this.balls[idx].pos;
        return anime({
          targets: b,
          easing: 'linear',
          duration: randomInt(2500, 3000),
          keyframes: moves.concat({
            translateX: vpx(initPos.x),
            translateY: vpx(initPos.y),
            translateZ: 0
          })
        }).finished;
      });
      Promise.all(animProm).then(() => {
        this.prizeRes = randomInt(0, 5);
        console.log('中奖结果', this.prizeRes);
        if (!this.prizeRes) {
          this._ballAnim();
        } else {
          this.showPrize = true;
          this.ing = false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$radius: 290;
.page-wrap {
  background-image: url('~@/assets/TwistingEgg/bg.jpg');
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: center;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.safe-area {
  position: relative;
  width: 100%;
  height: vw(1206);

  @media (min-aspect-ratio: 750/1206) {
    height: 100%;
  }
}

.machine {
  position: absolute;
  left: vw(20);
  bottom: vw(-30);
  background-image: url('~@/assets/TwistingEgg/machine.png');
}

.machine-cover {
  background-image: url('~@/assets/TwistingEgg/machine_cover.png');
  position: absolute;
  top: vw(50);
  left: vw(70);
}

.machine-circle {
  position: absolute;
  top: vw(0);
  left: vw(70);
  width: vw($radius * 2);
  height: vw($radius * 2);
  border: 1px solid red;
  border-radius: 50%;
}

.machine-ball {
  background-size: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  /* border: 1px solid red; */
  border-radius: 50%;

  &-ball_blue {
    background-image: url('~@/assets/TwistingEgg/ball_blue.png');
  }
  &-ball_yellow {
    background-image: url('~@/assets/TwistingEgg/ball_yellow.png');
  }
  &-ball_pink {
    background-image: url('~@/assets/TwistingEgg/ball_pink.png');
  }

  &-prize_1 {
    background-image: url('~@/assets/TwistingEgg/prize_1.png');
  }
  &-prize_2 {
    background-image: url('~@/assets/TwistingEgg/prize_2.png');
  }
  &-prize_3 {
    background-image: url('~@/assets/TwistingEgg/prize_3.png');
  }
  &-prize_4 {
    background-image: url('~@/assets/TwistingEgg/prize_4.png');
  }
  &-prize_5 {
    background-image: url('~@/assets/TwistingEgg/prize_5.png');
  }
}

.lottery-btn {
  background-image: url('~@/assets/TwistingEgg/lottery_btn.png');
  position: absolute;
  right: vw(80);
  bottom: vw(100);
}

@keyframes prizeAnim {
  from {
    transform: translate(0, 0) scale(0.5);
  }
  to {
    transform: translate(vw(-200), vw(200)) scale(1);
  }
}

.prize {
  width: vw(220);
  height: vw(220);
  background-size: 100%;
  background-repeat: no-repeat;
  position: absolute;
  top: vw(580);
  left: vw(420);
  z-index: 9;
  visibility: hidden;
  // background-image: url('~@/assets/TwistingEgg/prize_3.png');
  &.anim {
    visibility: visible;
    animation: prizeAnim 1s ease both;
  }
}
</style>
