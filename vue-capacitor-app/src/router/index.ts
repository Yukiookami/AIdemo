import { createRouter, createWebHistory } from 'vue-router'
import AIChat from '../views/AIChat/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/aichat',
    },
    {
      path: '/aichat',
      name: 'AIChat',
      component: AIChat,
    },
  ],
})

export default router
