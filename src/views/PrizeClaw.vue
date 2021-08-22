<template>
  <div class="page-wrap">
    <div class="machine-bg">
      <div class="game-per">
        <div class="scene-bottom">
          <div
            class="claw-stick"
            :style="{
              transform: `rotateX(-90deg) translate3d(${claw.x}px,${claw.y}px,${claw.z}px)`
            }"
          >
            <div
              :class="{
                claw: true,
                catching: catching
              }"
              ref="claw"
            >
              <div class="claw-left" @animationend="_onCatchEnd"></div>
              <div class="claw-right"></div>
              <div class="claw-center"></div>
            </div>
          </div>
          <div class="toy-group">
            <div
              class="toy-item"
              v-for="(item, index) in toys"
              :key="index"
              :style="{
                top: item.top - vpx(20) + 'px',
                left: item.left + 'px'
              }"
            >
              <div
                :style="{
                  backgroundImage: `url(${item.img})`
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="action-btn"
        :style="{
          opacity: ing ? 0.5 : 1
        }"
        @click="_action"
      >
        <div class="btn-pattern"></div>
      </div>
      <div class="joystick-holder">
        <div class="joystick-per">
          <div
            class="joystick"
            :style="{
              transform: `rotate3d(${joyStick.rx}, ${joyStick.ry},${joyStick.rz}, ${joyStick.deg}deg)`
            }"
          ></div>
        </div>
      </div>

      <div
        class="ctrl-box"
        ref="ctrl"
        :style="{
          opacity: debug ? 0.6 : 0
        }"
      >
        <span>触摸控制器</span>
        <div class="ctrl-dot" ref="dot"></div>
      </div>
    </div>
  </div>
</template>
<script>
import createDrag from '@/rpf/createDrag';
import setFPS from '@/rpf/setFPS';
import clamp from 'ramda/src/clamp';
import vpx from '@/rpf/vpx';
import anime from 'animejs';

const maxPosAbs = vpx(100);
const maxJoyStickDeg = 30;
const minClawX = vpx(50);
const maxClawX = vpx(650);
const maxClawZ = vpx(700);
const clawInitY = vpx(-950);
const clawDropY = vpx(-700);

const cols = 4;
const colWidth = 700 / 4;
const colHeight = 700 / 3;
const toys = Array(12)
  .fill('')
  .map((item, index) => {
    return {
      img: require(`@/assets/PrizeClaw/toy${index + 1}.png`),
      left: (index % cols) * vpx(colWidth),
      top: Math.floor(index / cols) * vpx(colHeight)
    };
  });

export default {
  name: 'PrizeClaw',
  data() {
    return {
      debug: false,
      catching: false,
      ing: false,
      joyStick: {
        rx: 0,
        ry: 0,
        rz: 0,
        deg: 0
      },
      claw: {
        x: minClawX,
        y: clawInitY,
        z: 0
      }
    };
  },
  computed: {
    toys() {
      return toys;
    }
  },
  mounted() {
    let pos = {
      x: 0,
      y: 0
    };

    this.dragIns = createDrag(this.$refs.ctrl, {
      inertial: false,
      onStart: () => {
        this.joyTw && this.joyTw.cancel();
        this.joyTw = setFPS(() => {
          if (this.ing) {
            return;
          }
          this.claw.x = clamp(minClawX, maxClawX, this.claw.x + pos.x / 10);
          this.claw.z = clamp(-maxClawZ, 0, this.claw.z + pos.y / 10);
        });
      },
      onUpdate: ({ delta }) => {
        pos.x = clamp(-maxPosAbs, maxPosAbs, pos.x + parseInt(delta.x));
        pos.y = clamp(-maxPosAbs, maxPosAbs, pos.y + parseInt(delta.y));
        this._renderCtrlDot(pos);
      },
      onEnd: () => {
        // 爪子松手摇摆
        const max = 6;
        const frames = Array(4)
          .fill('')
          .map((item, index) => {
            if (pos.x > 0) {
              return index % 2 === 0 ? -(max - index * 2) : max - index * 2;
            } else {
              return index % 2 === 0 ? max - index * 2 : -(max - index * 2);
            }
          });

        anime({
          targets: this.$refs.claw,
          keyframes: frames.map(item => {
            return {
              rotate: item + 'deg',
              duration: 200,
              easing: 'linear'
            };
          })
        });

        this.joyTw && this.joyTw.cancel();
        pos.x = 0;
        pos.y = 0;
        this._renderCtrlDot(pos, true);
      }
    });
  },
  beforeDestroy() {
    this.joyTw && this.joyTw.cancel();
    this.dropTw && this.dropTw.cancel();
    this.dragIns && this.dragIns.cancel();
  },
  methods: {
    vpx(val) {
      return vpx(val);
    },
    _renderCtrlDot(pos, isEnd) {
      this.$refs.dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;

      // 爪子摇摆
      if (!isEnd) {
        this.$refs.claw.style.transform = `rotate(${
          15 * (pos.x / maxPosAbs)
        }deg)`;
      }

      // 摇杆
      const xVec = pos.x / maxPosAbs;
      const yVec = pos.y / maxPosAbs;
      this.joyStick.rx = -yVec;
      this.joyStick.rz = xVec;
      this.joyStick.deg =
        maxJoyStickDeg * Math.max(Math.abs(xVec), Math.abs(yVec));
    },
    _action() {
      if (this.ing) {
        return;
      }
      this.ing = true;
      this.dropTw && this.dropTw.cancel();
      this.dropTw = setFPS(() => {
        this.claw.y += 2;
        if (this.claw.y >= clawDropY) {
          this.dropTw.cancel();
          this.catching = true;
        }
      });
    },
    _onCatchEnd() {
      this.dropTw && this.dropTw.cancel();
      this.dropTw = setFPS(() => {
        this.claw.y -= 2;
        if (this.claw.y <= clawInitY) {
          this.dropTw.cancel();
          this.catching = false;
          this.ing = false;
          console.log(333);
        }
      });
      // this.catching = false;
    }
  }
};
</script>
<style lang="scss" scoped>
$maxPosAbs: 100;

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
  background-color: #6332c8;
}

.machine-bg {
  position: relative;
  background-image: url('~@/assets/PrizeClaw/machine.png');
}

.game-per {
  width: vw(700);
  height: vw(700);
  position: absolute;
  top: vw(60);
  right: 0;
  left: 0;
  margin: auto;
  // border: 1px solid red;
  perspective: 220vw;
  perspective-origin: center top;
}

.scene-bottom {
  width: 100%;
  height: 100%;
  transform: rotateX(90deg);
  transform-origin: center bottom;
  transform-style: preserve-3d;
  // border: 1px solid red;
}

.claw-stick {
  height: vw(550);
  background-repeat: repeat-y;
  background-image: url('~@/assets/PrizeClaw/claw_stick.png');
  position: absolute;
  top: vw(520);
  left: 0;
  margin-left: vw(-7);
  transform-origin: center top;
}

.claw-left {
  background-image: url('~@/assets/PrizeClaw/claw_left.png');
  position: absolute;
  top: vw(50);
  left: vw(-80);
  transform-origin: right top;
  /* transform: rotate(-45deg); */
}

.claw-right {
  background-image: url('~@/assets/PrizeClaw/claw_right.png');
  position: absolute;
  top: vw(50);
  right: vw(-80);
  transform-origin: left top;
  /* transform: rotate(45deg); */
}

@keyframes clawLeftCatchAni {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-45deg);
  }
}
@keyframes clawRightCatchAni {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(45deg);
  }
}

.claw {
  width: vw(100);
  height: vw(100);
  position: absolute;
  bottom: 0;
  left: 50%;
  margin-left: vw(-50);
  transform-origin: center top;

  &.catching {
    .claw-left {
      animation: clawLeftCatchAni 0.5s linear both;
    }
    .claw-right {
      animation: clawRightCatchAni 0.5s linear both;
    }
  }
}

.claw-center {
  background-image: url('~@/assets/PrizeClaw/claw_center.png');
  position: absolute;
  bottom: 0;
  left: 50%;
  margin-left: vw(-77/2);
}

.sel-toy {
  width: vw(180);
  position: absolute;
  left: 50%;
  top: 110%;
  margin-left: vw(-200/2);
  z-index: 3;
}

.action-btn {
  background-image: url('~@/assets/PrizeClaw/btn_start.png');
  position: absolute;
  top: vw(790);
  left: vw(280);
}

.btn-pattern {
  background-image: url('~@/assets/PrizeClaw/start_btn.png');
  position: absolute;
  left: 0;
  right: 0;
  bottom: vw(30);
  margin: auto;
  width: vw(320);
  height: vw(110);
}
.joystick-holder {
  background-image: url('~@/assets/PrizeClaw/joystick_holder.png');
  position: absolute;
  top: vw(800);
  left: vw(100);
}

.joystick-per {
  perspective: 300px;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.joystick {
  background-image: url('~@/assets/PrizeClaw/joystick.png');
  position: absolute;
  bottom: vw(30);
  left: vw(-13);
  transform-origin: center bottom;
  // /* border: 1px solid blue; */
}

.toy-group {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform-origin: center bottom;
  transform: rotateX(-5deg);
}

.toy-item {
  width: vw(700/4);
  height: vw(700/3);
  background-size: 100%;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: center bottom;
  transform: rotateX(-85deg);

  > div {
    width: vw(200);
    height: vw(200);
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: vw(-100);
    margin-top: vw(-100);
    background-size: 100%;
  }
}

.ctrl-box {
  position: absolute;
  top: vw(670);
  left: vw(40);
  width: vw($maxPosAbs * 2);
  height: vw($maxPosAbs * 2);
}
.ctrl-dot {
  width: vw(50);
  height: vw(50);
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: vw(-25);
  margin-top: vw(-25);
  border-radius: 50%;
}

.debug-btn {
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
}
</style>
