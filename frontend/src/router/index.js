
import { createRouter, createWebHistory } from 'vue-router'

import FrontPage from '/src/views/FrontPage.vue'
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
      component: () => import('/src/views/Signup.vue'),
   },
   {
      path: '/local-signup',
      component: () => import('/src/views/LocalSignup.vue'),
   },
   {
      path: '/signin',
      component: () => import('/src/views/Signin.vue'),
   },
   {
      path: '/local-signin',
      component: () => import('/src/views/LocalSignin.vue'),
   },
   {
      path: '/student/:userid',
      component: Student,
      meta: { requiresAuth: true },
      beforeEnter: async (to, from) => {
         // // set socket.data.user & socket.data.expiresAt, whether authentication was local or by Google
         // const user_ = await app.service('auth').setCnxUser(parseInt(to.params.userid))
         // // store user in session storage
         // user.value = user_
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
