
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
      path: '/home/:userid',
      component: () => import('/src/views/Home.vue'),
      meta: { requiresAuth: true },
      props: route => ({
         userid: parseInt(route.params.userid),
      }),
      children: [
         {
            path: 'admin-ue',
            component: () => import('/src/views/admin/AdminUE.vue'),
         },
         {
            path: 'admin-sub-ue/:ue_id',
            component: () => import('/src/views/admin/AdminSubUE.vue'),
            props: route => ({
               ue_id: parseInt(route.params.ue_id),
            }),
         },
         {
            path: 'admin-topics/:sub_ue_id',
            component: () => import('/src/views/admin/AdminTopics.vue'),
            props: route => ({
               sub_ue_id: parseInt(route.params.sub_ue_id),
            }),
         },
         {
            path: 'admin-topic/:topic_id',
            component: () => import('/src/views/admin/AdminTopic.vue'),
            props: route => ({
               topic_id: parseInt(route.params.topic_id),
            }),
         },
         {
            path: 'admin-course/:topic_id',
            component: () => import('/src/views/admin/AdminCourse.vue'),
            props: route => ({
               topic_id: parseInt(route.params.topic_id),
            }),
         },
         
         {
            path: 'student',
            component: () => import('/src/views/Student.vue'),
         },
      ],
   },


   // {
   //    path: '/admin-ue',
   //    meta: { requiresAuth: true },
   //    component: () => import('/src/views/admin/AdminUE.vue'),
   // },
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
