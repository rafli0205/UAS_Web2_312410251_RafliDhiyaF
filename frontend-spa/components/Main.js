// components/main.js
import { Home } from './Home.js';
import { Login } from './Login.js';
import { Dashboard } from './Dashboard.js';
import { Barang } from './Barang.js';
import { api, forceLogout } from './services.js';

const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

const routes = [
  { path: '/', name: 'home', component: Home, meta: { requiresAuth: false } },
  { path: '/login', name: 'login', component: Login, meta: { requiresAuth: false } },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: Home, meta: { requiresAuth: true } },
      { path: 'barang', name: 'barang', component: Barang, meta: { requiresAuth: true } },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const token = localStorage.getItem('api_token');

  if (to.meta.requiresAuth && (!isLoggedIn || !token)) {
    return next({ name: 'login' });
  }

  if (to.name === 'login' && isLoggedIn && token) {
    return next({ name: 'dashboard' });
  }

  next();
});

const AppRoot = {
  template: `<router-view></router-view>`,
};

const app = createApp(AppRoot);
app.config.globalProperties.$api = api;
app.config.globalProperties.$forceLogout = forceLogout;
app.use(router);
app.mount('#app');