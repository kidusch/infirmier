
import { createRouter, createWebHistory } from 'vue-router'

import { app } from '/src/client-app.js'
import { appState } from '/src/use/useAppState'

import FrontPage from '/src/views/FrontPage.vue'
import { restartApp } from '/src/use/useAuthentication'


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
            path: 'admin-misc',
            component: () => import('/src/views/admin/AdminMisc.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
            }),
         },
         {
            path: 'admin-ue',
            component: () => import('/src/views/admin/AdminUE.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
            }),
         },
         {
            path: 'admin-sub-ue/:ue_id',
            component: () => import('/src/views/admin/AdminSubUE.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
            }),
         },
         {
            path: 'admin-topics/:ue_id/:sub_ue_id',
            component: () => import('/src/views/admin/AdminTopics.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
            }),
         },
         {
            path: 'admin-topic/:ue_id/:sub_ue_id/:topic_id',
            component: () => import('/src/views/admin/AdminTopic.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
               topic_id: parseInt(route.params.topic_id),
            }),
         },
         {
            path: 'admin-course/:ue_id/:sub_ue_id/:topic_id/:course_id',
            // component: () => import('/src/views/admin/AdminCourseMkn.vue'),
            component: () => import('/src/views/admin/AdminCourseHtml.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
               topic_id: parseInt(route.params.topic_id),
               course_id: parseInt(route.params.course_id),
            }),
         },
         {
            path: 'admin-course-preview/:ue_id/:sub_ue_id/:topic_id/:course_id',
            // component: () => import('/src/views/admin/AdminCoursePreviewMkn.vue'),
            component: () => import('/src/views/admin/AdminCoursePreviewHtml.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
               topic_id: parseInt(route.params.topic_id),
               course_id: parseInt(route.params.course_id),
            }),
         },
         {
            path: 'admin-card/:ue_id/:sub_ue_id/:topic_id/:card_id',
            component: () => import('/src/views/admin/AdminCard.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
               topic_id: parseInt(route.params.topic_id),
               card_id: parseInt(route.params.card_id),
            }),
         },
         {
            path: 'admin-quiz/:ue_id/:sub_ue_id/:topic_id/:quiz_id',
            component: () => import('/src/views/admin/AdminQuiz.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
               topic_id: parseInt(route.params.topic_id),
               quiz_id: parseInt(route.params.quiz_id),
            }),
         },
         {
            path: 'admin-quiz-choice/:ue_id/:sub_ue_id/:topic_id/:quiz_id/:quiz_choice_id',
            component: () => import('/src/views/admin/AdminQuizChoice.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
               topic_id: parseInt(route.params.topic_id),
               quiz_id: parseInt(route.params.quiz_id),
               quiz_choice_id: parseInt(route.params.quiz_choice_id),
            }),
         },
         {
            path: 'admin-case-study/:ue_id/:sub_ue_id/:topic_id/:case_study_id',
            component: () => import('/src/views/admin/AdminCaseStudy.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
               topic_id: parseInt(route.params.topic_id),
               case_study_id: parseInt(route.params.case_study_id),
            }),
         },
         
         {
            path: 'welcome-student',
            component: () => import('/src/views/student/WelcomeStudent.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
            }),
         },
         {
            path: 'study-ue',
            component: () => import('/src/views/student/StudyUE.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
            }),
         },
         {
            path: 'study-sub-ue/:ue_id/:sub_ue_id',
            component: () => import('/src/views/student/StudySubUE.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
            }),
         },
         {
            path: 'study-topic/:ue_id/:sub_ue_id/:topic_id',
            component: () => import('/src/views/student/StudyTopic.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
               topic_id: parseInt(route.params.topic_id),
            }),
         },
         {
            path: 'study-course/:ue_id/:sub_ue_id/:topic_id/:course_id',
            // component: () => import('/src/views/student/StudyCourseMkn.vue'),
            component: () => import('/src/views/student/StudyCourseHtml.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
               topic_id: parseInt(route.params.topic_id),
               course_id: parseInt(route.params.course_id),
            }),
         },
         
         {
            path: 'revise-ue',
            component: () => import('/src/views/student/ReviseUE.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
            }),
         },
         {
            path: 'revise-sub-ue/:ue_id/:sub_ue_id',
            component: () => import('/src/views/student/ReviseSubUE.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
            }),
         },
         {
            path: 'revise-topic/:ue_id/:sub_ue_id/:topic_id',
            component: () => import('/src/views/student/ReviseTopic.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
               topic_id: parseInt(route.params.topic_id),
            }),
         },
         {
            path: 'revise-card/:ue_id/:sub_ue_id/:topic_id/:card_id',
            component: () => import('/src/views/student/ReviseCard.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
               topic_id: parseInt(route.params.topic_id),
               card_id: parseInt(route.params.card_id),
            }),
         },
         {
            path: 'revise-quiz/:ue_id/:sub_ue_id/:topic_id/:quiz_id',
            component: () => import('/src/views/student/ReviseQuiz.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
               topic_id: parseInt(route.params.topic_id),
               quiz_id: parseInt(route.params.quiz_id),
            }),
         },
         {
            path: 'revise-quiz-results/:ue_id/:sub_ue_id/:topic_id/:quiz_id',
            component: () => import('/src/views/student/ReviseQuizResults.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
               topic_id: parseInt(route.params.topic_id),
               quiz_id: parseInt(route.params.quiz_id),
            }),
         },
         {
            path: 'revise-case-study/:ue_id/:sub_ue_id/:topic_id/:case_study_id',
            component: () => import('/src/views/student/ReviseCaseStudy.vue'),
            props: route => ({
               userid: parseInt(route.params.userid),
               ue_id: parseInt(route.params.ue_id),
               sub_ue_id: parseInt(route.params.sub_ue_id),
               topic_id: parseInt(route.params.topic_id),
               case_study_id: parseInt(route.params.case_study_id),
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
   appState.value.isWaiting = false

   if (to.meta.requiresAuth) {
      try {
         // checks authentication + extends session at each route change
         await app.service('auth').checkAndExtend()
      } catch(err) {
         console.log('err', err.code, err.message)
         restartApp()
      }
   }

   next()
})

export default router
