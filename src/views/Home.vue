<template>
  <div class="home">
    <div class="title">Enjoying Games</div>
    <div class="item-box">
      <div
        v-for="(item, index) in GameList"
        :key="index"
        class="item"
        @click="openGames(item)"
      >
        <div class="item-name">{{ item.name }}</div>
        <div class="item-desc">{{ item.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data() {
    return {
      GameList: [
        {
          name: '娃娃机',
          desc: '使用摇杆控制爪子的方向，对准想要抓取的娃娃，按下按钮，等待娃娃上钩~',
          pathName: '/PrizeClaw'
        },
        {
          name: '扭蛋机',
          desc: '按下按钮，开始扭蛋游戏，看看扭到什么好东西吧~',
          pathName: '/TwistingEgg'
        },
        {
          name: '老虎机',
          desc: '按下按钮，老虎机飞速转动，最后屏幕上三个图片一样即可获得胜利~',
          pathName: '/SlotMachine'
        },
        {
          name: '红包雨',
          desc: '做好准备，10s倒计时，看看你能拆开多少红包吧~',
          pathName: '/RedpocketRain'
        }
      ]
    };
  },
  methods: {
    openGames(item) {
      this.$router.push(item.pathName);
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}
.title {
  width: vw(750);
  height: vw(100);
  font-size: vw(60);
  font-weight: bold;
  text-align: center;
  color: #333;
  line-height: vw(100);
}
.item-box {
  width: vw(690);
  margin: vw(30);
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .item {
    width: vw(240);
    height: vw(260);
    margin: vw(20) auto;
    border: 1px solid rgb(221, 221, 221);
    border-radius: 4px;
    padding: 10px;
    box-shadow: rgb(0 0 0 / 30%) 0px 10px 20px;
  }
  &-name {
    color: #000;
    font-size: vw(26);
    text-align: left;
    width: vw(200);
    margin: vw(20);
  }
  .item-desc {
    color: #333;
    font-size: vw(22);
    text-align: left;
    width: vw(200);
    margin: vw(20) auto;
  }
}
</style>
