import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/dashboard.vue'),
  },
  {
    path: '/settings',
    component: () => import('../views/settings.vue'),
  },
  {
    path: '/settings/general',
    component: () => import('../views/settings/general.vue'),
  },
  {
    path: '/settings/dashboard',
    component: () => import('../views/settings/dashboard.vue'),
  },
];

export default routes;
