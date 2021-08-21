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
          desc: '',
          pathName: '/PrizeClaw',
          img: ''
        },
        {
          name: '扭蛋机',
          desc: '',
          pathName: '/TwistingEgg',
          img: ''
        },
        {
          name: '老虎机',
          desc: '',
          pathName: '/SlotMachine',
          img: ''
        },
        {
          name: '红包雨',
          desc: '',
          pathName: '/RedpocketRain',
          img: ''
        },
        {
          name: '数红包',
          desc: '',
          pathName: '',
          img: ''
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
    height: vw(200);
    margin: vw(20) auto;
    border: 1px solid rgb(221, 221, 221);
    border-radius: 4px;
    padding: 10px;
    box-shadow: rgb(0 0 0 / 30%) 0px 10px 20px;
  }
  .item-name {
    color: #000;
    font-size: vw(26);
    text-align: left;
    width: vw(200);
    margin: vw(20);
  }
}
</style>
