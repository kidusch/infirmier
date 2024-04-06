
import { createRouter, createWebHistory } from 'vue-router'

import FrontPage from '/src/views/FrontPage.vue'
import Student from '/src/views/Student.vue'


const routes = [
   {
      path: '/',
      component: FrontPage,
   },
   {
      path: '/signup',
      component: () => import('/src/views/Signup.vue'),
   },
   {
      path: '/local-signup',
      component: () => import('/src/views/LocalSignup.vue'),
   },
   {
      path: '/login',
      component: () => import('/src/views/Signin.vue'),
   },
   {
      path: '/local-login',
      component: () => import('/src/views/LocalSignin.vue'),
   },
   {
      path: '/student/:userid',
      component: Student,
      meta: { requiresAuth: true },
   },
]

const router = createRouter({
   history: createWebHistory(),
   routes
})


router.beforeEach(async (to, from, next) => {
   console.log('from', from.path, 'to', to.path)

   if (to.meta.requiresAuth) {
   }

   next()
})

export default router
