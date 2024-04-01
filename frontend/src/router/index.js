
import { createRouter, createWebHistory } from 'vue-router'

import FrontPage from '/src/views/FrontPage.vue'
import Signup from '/src/views/Signup.vue'
import Signin from '/src/views/Signin.vue'
import Student from '/src/views/Student.vue'

import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'

const user = useSessionStorage('user', {})


const routes = [
   {
      path: '/',
      component: FrontPage,
   },
   {
      path: '/signup',
      component: Signup,
   },
   {
      path: '/signin',
      component: Signin,
   },
   {
      path: '/student/:userid',
      component: Student,
      meta: { requiresAuth: true },
      beforeEnter: async (to, from) => {
         const user_ = await app.service('auth').setCnxUser(parseInt(to.params.userid))
         // store user in session storage
         user.value = user_
         return true
      },
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
