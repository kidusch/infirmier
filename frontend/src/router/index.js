
import { createRouter, createWebHistory } from 'vue-router'

import FrontPage from '/src/views/FrontPage.vue'


const routes = [
   {
      path: '/',
      component: FrontPage,
   },

   {
      path: '/signup',
      component: () => import('/src/views/auth/Signup.vue'),
   },
   {
      path: '/local-signup-confirm/:token',
      component: () => import('/src/views/auth/LocalSignupConfirm.vue'),
      props: true
   },
   {
      path: '/google-signup-confirm/:userid',
      component: () => import('/src/views/auth/GoogleSignupConfirm.vue'),
      props: true
   },
   {
      path: '/set-password/:token',
      component: () => import('/src/views/auth/SetPassword.vue'),
      props: true
   },
   {
      path: '/local-signup',
      component: () => import('/src/views/auth/LocalSignup.vue'),
   },
   {
      path: '/login',
      component: () => import('/src/views/auth/Signin.vue'),
   },
   {
      path: '/forgotten-password',
      component: () => import('/src/views/auth/ForgottenPassword.vue'),
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
            path: 'admin-quiz/:topic_id/:quiz_id',
            component: () => import('/src/views/admin/AdminQuiz.vue'),
            props: route => ({
               topic_id: parseInt(route.params.topic_id),
               quiz_id: parseInt(route.params.quiz_id),
            }),
         },
         {
            path: 'admin-quiz-choice/:topic_id/:quiz_id/:quiz_choice_id',
            component: () => import('/src/views/admin/AdminQuizChoice.vue'),
            props: route => ({
               topic_id: parseInt(route.params.topic_id),
               quiz_id: parseInt(route.params.quiz_id),
               quiz_choice_id: parseInt(route.params.quiz_choice_id),
            }),
         },
         {
            path: 'admin-card/:topic_id/:card_id',
            component: () => import('/src/views/admin/AdminCard.vue'),
            props: route => ({
               topic_id: parseInt(route.params.topic_id),
               card_id: parseInt(route.params.card_id),
            }),
         },
         {
            path: 'admin-case-study/:topic_id/:case_study_id',
            component: () => import('/src/views/admin/AdminCaseStudy.vue'),
            props: route => ({
               topic_id: parseInt(route.params.topic_id),
               case_study_id: parseInt(route.params.case_study_id),
            }),
         },
         
         {
            path: 'student-ue',
            component: () => import('/src/views/student/StudentUE.vue'),
         },
         {
            path: 'student-sub-ue/:sub_ue_id',
            component: () => import('/src/views/student/StudentSubUE.vue'),
            props: route => ({
               sub_ue_id: parseInt(route.params.sub_ue_id),
            }),
         },
      ],
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
