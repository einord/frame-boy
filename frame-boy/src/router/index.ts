import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/dashboard.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/settings.vue'),
  },
  {
    path: '/settings/general',
    component: () => import('@/views/settings/general.vue'),
  },
  {
    path: '/settings/dashboard',
    component: () => import('@/views/settings/dashboard.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
