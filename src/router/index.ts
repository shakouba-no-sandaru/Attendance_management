import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory('/'),
  routes: [
    // ログイン画面
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    // ホーム画面
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    // 勤怠管理画面
    {
      path: '/attendance',
      name: 'attendance',
      component: () => import('../views/AttendanceView.vue')
    },
    // 従業員マスタ画面
    {
      path: '/master',
      name: 'master',
      component: () => import('../views/MasterView.vue')
    }
  ]
})

export default router;
