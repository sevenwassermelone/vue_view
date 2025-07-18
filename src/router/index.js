import { createRouter, createWebHistory } from 'vue-router';
// import Home from '../views/Home.vue';
// import About from '../views/About.vue';

import ptzl from '../views/ptzl.vue';


const routes = [
  {
    path: '/ptzl',//首页
    name: 'ptzl',
    component: ptzl
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;