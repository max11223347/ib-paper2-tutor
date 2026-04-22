import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import QuestionBank from '@/views/QuestionBank.vue'
import Outline from '@/views/Outline.vue'
import Tools from '@/views/Tools.vue'
import Feedback from '@/views/Feedback.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/question-bank', name: 'QuestionBank', component: QuestionBank },
  { path: '/outlines', name: 'Outline', component: Outline },
  { path: '/tools', name: 'Tools', component: Tools },
  { path: '/feedback', name: 'Feedback', component: Feedback }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
