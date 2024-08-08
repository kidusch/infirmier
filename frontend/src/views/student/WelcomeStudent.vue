<template>
   <div class="container max-w-lg py-4 flex flex-col">

      <header class="w-full flex justify-center">
         <img class="w-64 h-64" src="/src/assets/logo.png" alt="logo">
      </header>

      <section class="flex-1 flex flex-col">

         <section class="flex flex-col">
            <h1>
               Bienvenue dans le
               <span class="text-primary">
                  Journal de bord Infirmier
               </span>
            </h1>
         </section>

         <div class="flex flex-col mt-2">
            <div class="justify-center flex my-8">
               <button class="primary-btn" @click="onClick">
                  Continuer
               </button>
            </div>
         </div>
      </section>
   </div>

</template>

<script setup>
import { onMounted, ref } from 'vue'

import { getUEList } from '/src/use/useUE'
import { subUEState } from '/src/use/useSubUE'
import { courseState } from '/src/use/useCourse'
import { cardState } from '/src/use/useCard'
import { quizState } from '/src/use/useQuiz'
import { caseStudyState } from '/src/use/useCaseStudy'
import { topicState } from '/src/use/useTopic'
import { userCourseState } from '/src/use/useUserCourse'
import { userCardState } from '/src/use/useUserCard'
import { userQuizState } from '/src/use/useUserQuiz'
import { userCaseStudyState } from '/src/use/useUserCaseStudy'
import { appState } from '/src/use/useAppState'

import { getWebPushSubscription } from '/src/lib/utilities.mjs'
import router from '/src/router'
import { app } from '/src/client-app.js'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

onMounted(async () => {
   // preload ues, topics, courses, etc. by batches to prevent hundreds of small backend requests
   const BATCHSIZE = 20
   try {
      const ueList = await getUEList()
      appState.value.spinnerWaitingText = [ "Chargement...", "10%" ]

      const subUEList = await app.service('sub_ue').findMany({})
      for (const subUE of subUEList) {
         subUEState.value.subUECache[subUE.id] = subUE
         subUEState.value.subUEStatus[subUE.id] = 'ready'
      }
      for (const ue of ueList) {
         subUEState.value.subUEListStatus[ue.id] = 'ready'
      }
      appState.value.spinnerWaitingText = [ "Chargement...", "20%" ]

      // read topic by batches
      let hasMoreTopîc = true
      let topicCursor = null
      while (hasMoreTopîc) {
         const topicList = await app.service('topic').findMany({
            take: BATCHSIZE,
            skip: topicCursor ? 1 : 0,
            cursor: topicCursor ? { id: topicCursor } : undefined,
            orderBy: { id: 'asc' },
         })
         for (const topic of topicList) {
            topicState.value.topicCache[topic.id] = topic
            topicState.value.topicStatus[topic.id] = 'ready'
         }
         for (const subUE of subUEList) {
            topicState.value.topicListStatus[subUE.id] = 'ready'
         }
         if (topicList.length < BATCHSIZE) {
            hasMoreTopîc = false
         } else {
            topicCursor = topicList[topicList.length - 1].id
         }
      }
      appState.value.spinnerWaitingText = [ "Chargement...", "30%" ]

      // collect all topics
      const topicList = Object.values(topicState.value.topicCache)

      // read course by batches
      let hasMoreCourse = true
      let courseCursor = null
      while (hasMoreCourse) {
         const courseList = await app.service('course').findMany({
            take: BATCHSIZE,
            skip: courseCursor ? 1 : 0,
            cursor: courseCursor ? { id: courseCursor } : undefined,
            orderBy: { id: 'asc' },
         })
         for (const course of courseList) {
            courseState.value.courseCache[course.id] = course
            courseState.value.courseStatus[course.id] = 'ready'
         }
         if (courseList.length < BATCHSIZE) {
            hasMoreCourse = false
         } else {
            courseCursor = courseList[courseList.length - 1].id
         }
      }
      // update list status for topics
      for (const topic of topicList) {
         courseState.value.courseListStatus[topic.id] = 'ready'
      }
      appState.value.spinnerWaitingText = [ "Chargement...", "40%" ]

      // collect all courses
      const courseList = Object.values(courseState.value.courseCache)

      // read card by batches
      let hasMoreCard = true
      let cardCursor = null
      while (hasMoreCard) {
         const cardList = await app.service('card').findMany({
            take: BATCHSIZE,
            skip: cardCursor ? 1 : 0,
            cursor: cardCursor ? { id: cardCursor } : undefined,
            orderBy: { id: 'asc' },
         })
         for (const card of cardList) {
            cardState.value.cardCache[card.id] = card
            cardState.value.cardStatus[card.id] = 'ready'
         }
         for (const topic of topicList) {
            cardState.value.cardListStatus[topic.id] = 'ready'
         }
         if (cardList.length < BATCHSIZE) {
            hasMoreCard = false
         } else {
            cardCursor = cardList[cardList.length - 1].id
         }
      }
      appState.value.spinnerWaitingText = [ "Chargement...", "50%" ]

      // collect all cards
      const cardList = Object.values(cardState.value.cardCache)

      // read quiz by batches
      let hasMoreQuiz = true
      let quizCursor = null
      while (hasMoreQuiz) {
         const quizList = await app.service('quiz').findMany({
            take: BATCHSIZE,
            skip: quizCursor ? 1 : 0,
            cursor: quizCursor ? { id: quizCursor } : undefined,
            orderBy: { id: 'asc' },
         })
         for (const quiz of quizList) {
            quizState.value.quizCache[quiz.id] = quiz
            quizState.value.quizStatus[quiz.id] = 'ready'
            quizState.value.quizListStatus[quiz.topic_id] = 'ready'
         }
         if (quizList.length < BATCHSIZE) {
            hasMoreQuiz = false
         } else {
            quizCursor = quizList[quizList.length - 1].id
         }
      }
      // update list status for topics
      for (const topic of topicList) {
         quizState.value.quizListStatus[topic.id] = 'ready'
      }
      appState.value.spinnerWaitingText = [ "Chargement...", "60%" ]

      // collect all quizzes
      const quizList = Object.values(quizState.value.quizCache)

      // read case_study by batches
      let hasMoreCaseStudy = true
      let caseStudyCursor = null
      while (hasMoreCaseStudy) {
         const caseStudyList = await app.service('case_study').findMany({
            take: BATCHSIZE,
            skip: caseStudyCursor ? 1 : 0,
            cursor: caseStudyCursor ? { id: caseStudyCursor } : undefined,
            orderBy: { id: 'asc' },
         })
         for (const caseStudy of caseStudyList) {
            caseStudyState.value.caseStudyCache[caseStudy.id] = caseStudy
            caseStudyState.value.caseStudyStatus[caseStudy.id] = 'ready'
            caseStudyState.value.caseStudyListStatus[caseStudy.topic_id] = 'ready'
         }
         for (const topic of topicList) {
            caseStudyState.value.caseStudyListStatus[topic.id] = 'ready'
         }
         if (caseStudyList.length < BATCHSIZE) {
            hasMoreCaseStudy = false
         } else {
            caseStudyCursor = caseStudyList[caseStudyList.length - 1].id
         }
      }
      appState.value.spinnerWaitingText = [ "Chargement...", "70%" ]

      // collect all case studies
      const caseStudyList = Object.values(caseStudyState.value.caseStudyCache)

      // read user_course by batches
      let hasMoreUserCourse = true
      let userCourseCursor = null
      while (hasMoreUserCourse) {
         const userCourseList = await app.service('user_course').findMany({
            where: { user_id: props.userid },
            take: BATCHSIZE,
            skip: userCourseCursor ? 1 : 0,
            cursor: userCourseCursor ? { id: userCourseCursor } : undefined,
            orderBy: { id: 'asc' },
         })
         for (const userCourse of userCourseList) {
            const key = props.userid + ':' + userCourse.course_id
            userCourseState.value.theUserCourseCache[key] = userCourse
            userCourseState.value.theUserCourseStatus[key] = 'ready'
         }
         if (userCourseList.length < BATCHSIZE) {
            hasMoreUserCourse = false
         } else {
            userCourseCursor = userCourseList[userCourseList.length - 1].id
         }
      }
      // set to null in cache (= not user_course for userid,courseid in dartabase) all other user_course for userid
      for (const course of courseList) {
         const key = props.userid + ':' + course.id
         if (userCourseState.value.theUserCourseCache[key] === undefined) {
            userCourseState.value.theUserCourseCache[key] = null
            userCourseState.value.theUserCourseStatus[key] = 'ready'
         }
      }
      appState.value.spinnerWaitingText = [ "Chargement...", "80%" ]

      // read user_card by batches
      let hasMoreUserCard = true
      let userCardCursor = null
      while (hasMoreUserCard) {
         const userCardList = await app.service('user_card').findMany({
            where: { user_id: props.userid },
            take: BATCHSIZE,
            skip: userCardCursor ? 1 : 0,
            cursor: userCardCursor ? { id: userCardCursor } : undefined,
            orderBy: { id: 'asc' },
         })
         for (const userCard of userCardList) {
            const key = props.userid + ':' + userCard.card_id
            userCardState.value.theUserCardCache[key] = userCard
            userCardState.value.theUserCardStatus[key] = 'ready'
         }
         if (userCardList.length < BATCHSIZE) {
            hasMoreUserCard = false
         } else {
            userCardCursor = userCardList[userCardList.length - 1].id
         }
      }
      // set to null in cache (= not user_card for userid, cardid in dartabase) all other user_card for userid
      for (const card of cardList) {
         const key = props.userid + ':' + card.id
         if (userCardState.value.theUserCardCache[key] === undefined) {
            userCardState.value.theUserCardCache[key] = null
            userCardState.value.theUserCardStatus[key] = 'ready'
         }
      }
      appState.value.spinnerWaitingText = [ "Chargement...", "90%" ]

      // read user_quiz by batches
      let hasMoreUserQuiz = true
      let userQuizCursor = null
      while (hasMoreUserQuiz) {
         const userQuizList = await app.service('user_quiz').findMany({
            where: { user_id: props.userid },
            take: BATCHSIZE,
            skip: userQuizCursor ? 1 : 0,
            cursor: userQuizCursor ? { id: userQuizCursor } : undefined,
            orderBy: { id: 'asc' },
         })
         for (const userQuiz of userQuizList) {
            const key = props.userid + ':' + userQuiz.quiz_id
            userQuizState.value.theUserQuizCache[key] = userQuiz
            userQuizState.value.theUserQuizStatus[key] = 'ready'
         }
         if (userQuizList.length < BATCHSIZE) {
            hasMoreUserQuiz = false
         } else {
            userQuizCursor = userQuizList[userQuizList.length - 1].id
         }
      }
      // set to null in cache (= not user_quiz for userid, quizid in dartabase) all other user_quiz for userid
      for (const quiz of quizList) {
         const key = props.userid + ':' + quiz.id
         if (userQuizState.value.theUserQuizCache[key] === undefined) {
            userQuizState.value.theUserQuizCache[key] = null
            userQuizState.value.theUserQuizStatus[key] = 'ready'
         }
      }
      appState.value.spinnerWaitingText = [ "Chargement...", "95%" ]

      // read user_case_study by batches
      let hasMoreUserCaseStudy = true
      let userCaseStudyCursor = null
      while (hasMoreUserCaseStudy) {
         const userCaseStudyList = await app.service('user_case_study').findMany({
            where: { user_id: props.userid },
            take: BATCHSIZE,
            skip: userCaseStudyCursor ? 1 : 0,
            cursor: userCaseStudyCursor ? { id: userCaseStudyCursor } : undefined,
            orderBy: { id: 'asc' },
         })
         for (const userCaseStudy of userCaseStudyList) {
            const key = props.userid + ':' + userCaseStudy.case_study_id
            userCaseStudyState.value.theUserCaseStudyCache[key] = userCaseStudy
            userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
         }
         if (userCaseStudyList.length < BATCHSIZE) {
            hasMoreUserCaseStudy = false
         } else {
            userCaseStudyCursor = userCaseStudyList[userCaseStudyList.length - 1].id
         }
      }
      // set to null in cache (= not user_case_study for userid, casestudyid in database) all other user_case_study for userid
      for (const caseStudy of caseStudyList) {
         const key = props.userid + ':' + caseStudy.id
         if (userCaseStudyState.value.theUserCaseStudyCache[key] === undefined) {
            userCaseStudyState.value.theUserCaseStudyCache[key] = null
            userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
         }
      }

   } catch(err) {
      console.log('err', err)
   } finally {
      appState.value.spinnerWaitingText = null
   }
})

const onClick = async () => {
   // create a subscription from the push manager and save/update it on the server
   // IT MUST BE DONE FROM A USER GESTURE
   try {
      const subscription = await getWebPushSubscription()
      if (subscription) await app.service('notification').addSubscription(props.userid, subscription)
   } catch(err) {
      console.log('err subscription', err)
   }
   // go to study UE
   router.push(`/student/study-ue`)
}
</script>
