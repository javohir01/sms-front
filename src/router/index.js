import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/statistics',
          name: 'Статистика',
          component: () => import('@/views/StatisticsView.vue')
        },
        {
          path: '/main',
          name: 'Главная',
          component: () => import('@/views/StatisticsView.vue')
        },
        {
          path: '/frames',
          name: 'SMS шаблоны',
          component: () => import('@/views/StatisticsView.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router