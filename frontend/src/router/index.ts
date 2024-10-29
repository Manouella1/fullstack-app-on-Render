import { createRouter, createWebHistory, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import LoginRegister from '../views/LoginRegister.vue';
import ForumPage from '../views/ForumPage.vue';
import { useAuthStore } from '../store';

const routes = [
  { path: '/', component: LoginRegister },
  {
    path: '/forum',
    component: ForumPage,
    beforeEnter: (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const authStore = useAuthStore();
      if (!authStore.token) {
        next('/');
      } else {
        next();
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
