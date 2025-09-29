import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';

const createHistory = process.env.SERVER
  ? createMemoryHistory
  : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

// export default router;
const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createHistory(process.env.VUE_ROUTER_BASE),
  routes,
});

export default router;