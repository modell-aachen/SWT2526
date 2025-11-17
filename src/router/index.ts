import { createRouter, createWebHistory } from 'vue-router'
import ViewPage from '@/views/ViewPage/ViewPage.vue'
import EditPage from '@/views/EditPage/EditPage.vue'

const routes = [
  { path: '/view', component: ViewPage },
  { path: '/edit', component: EditPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
