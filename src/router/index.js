import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import PrizeClaw from '../views/PrizeClaw.vue';
import TwistingEgg from '../views/TwistingEgg.vue';
import SlotMachine from '../views/SlotMachine.vue';
import RedpocketRain from '../views/RedpocketRain/index.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/PrizeClaw',
    name: 'PrizeClaw',
    component: PrizeClaw
  },
  {
    path: '/TwistingEgg',
    name: 'TwistingEgg',
    component: TwistingEgg
  },
  {
    path: '/SlotMachine',
    name: 'SlotMachine',
    component: SlotMachine
  },
  {
    path: '/RedpocketRain',
    name: 'RedpocketRain',
    component: RedpocketRain
  }
];

const router = new VueRouter({
  routes
});

export default router;
