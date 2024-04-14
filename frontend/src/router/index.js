
import { createRouter, createWebHistory } from 'vue-router'

import FrontPage from '/src/views/FrontPage.vue'


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
      path: '/local-signup-confirm/:token',
      component: () => import('/src/views/LocalSignupConfirm.vue'),
      props: true
   },
   {
      path: '/google-signup-confirm/:userid',
      component: () => import('/src/views/GoogleSignupConfirm.vue'),
      props: true
   },
   {
      path: '/set-password/:token',
      component: () => import('/src/views/SetPassword.vue'),
      props: true
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
      path: '/local-signin',
      component: () => import('/src/views/LocalSignin.vue'),
   },
   {
      path: '/forgotten-password',
      component: () => import('/src/views/ForgottenPassword.vue'),
   },

   {
      path: '/admin-ue',
      component: () => import('/src/views/AdminUE.vue'),
   },



   {
      path: '/student/:userid',
      component: () => import('/src/views/Student.vue'),
      meta: { requiresAuth: true },
      props: route => ({
         userid: parseInt(route.params.userid),
      }),
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
