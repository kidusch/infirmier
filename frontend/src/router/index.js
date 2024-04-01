
import { createRouter, createWebHistory } from 'vue-router'
import FrontPage from '/src/views/FrontPage.vue'
import Signup from '/src/views/Signup.vue'
import Signin from '/src/views/Signin.vue'
import Student from '/src/views/Student.vue'
import AfterGoogleSignup from '/src/views/AfterGoogleSignup.vue'

import app from '/src/client-app.js'

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
      beforeEnter: (to, from) => {
         app.service('auth').setCnxUser(parseInt(to.params.userid))
         return true
      },
   },
   {
      path: '/after-google-signup/:userid',
      component: AfterGoogleSignup,
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
