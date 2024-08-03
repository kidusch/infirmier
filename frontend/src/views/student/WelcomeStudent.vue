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

   <!-- <div class="w-64 h-64">
      <a-scene embedded>
         <a-camera position="0 1.6 3" look-controls wasd-controls></a-camera>

         <a-light type="ambient" color="#888"></a-light>
         <a-light type="directional" position="-1 2 1" intensity="1"></a-light>

         <a-entity
            position="0 1.6 0"
            scale="0.5 0.5 0.5"
            rotation="0 180 0"
            gltf-model="#model"
         ></a-entity>

         <a-assets>
            <a-asset-item id="model" src="/src/3D/model.dae"></a-asset-item>
         </a-assets>
      </a-scene>
   </div> -->

   <!-- <a-scene>
      <a-cylinder color="#FFC65D"></a-cylinder>
   </a-scene> -->

   <!-- <model-collada
      :backgroundAlpha="0"
      :rotation="{
         x: - Math.PI / 2,
         y: 0,
         z: 0,
      }"
      src="/model.dae"
   /> -->


   <vue3dLoader
      height="200"
      filePath="/src/3D/model.dae"
      fffilePath="https://ftp.jcbuisson.dev/3d-models/chair.dae"
   ></vue3dLoader>


   <!-- computing... modal spinner-->
   <div class="fixed inset-0 flex items-center justify-center" v-if="perc > 0">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="w-96 h-96 border-t-8 border-white border-solid rounded-full mx-auto animate-spin"></div>
      <div class="absolute inset-0 flex items-center justify-center">
         <div>
            <div class="text-center font-bold text-white text-2xl">Préchargement...</div>
            <div class="text-center font-bold text-white text-3xl mt-4">{{ perc }} %</div>
         </div>
      </div>
   </div>

</template>

<script setup>
import { onMounted, ref } from 'vue'

import 'aframe'
// import { ModelCollada } from 'vue-3d-model'

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

import router from '/src/router'
import { app } from '/src/client-app.js'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const perc = ref(0)

onMounted(async () => {
   // preload ues, topics, courses, etc. by batches to prevent hundreds of small backend requests
   const BATCHSIZE = 20
   try {
      const ueList = await getUEList()
      perc.value = 10

      const subUEList = await app.service('sub_ue').findMany({})
      for (const subUE of subUEList) {
         subUEState.value.subUECache[subUE.id] = subUE
         subUEState.value.subUEStatus[subUE.id] = 'ready'
      }
      for (const ue of ueList) {
         subUEState.value.subUEListStatus[ue.id] = 'ready'
      }
      perc.value = 20

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
         topicCursor = topicList[topicList.length - 1].id
         if (topicList.length < BATCHSIZE) hasMoreTopîc = false
      }
      perc.value = 30

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
         courseCursor = courseList[courseList.length - 1].id
         if (courseList.length < BATCHSIZE) hasMoreCourse = false
      }
      
      for (const topic of topicList) {
         courseState.value.courseListStatus[topic.id] = 'ready'
      }
      perc.value = 40

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
         cardCursor = cardList[cardList.length - 1].id
         if (cardList.length < BATCHSIZE) hasMoreCard = false
      }
      perc.value = 50

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
         quizCursor = quizList[quizList.length - 1].id
         if (quizList.length < BATCHSIZE) hasMoreQuiz = false
      }

      for (const topic of topicList) {
         quizState.value.quizListStatus[topic.id] = 'ready'
      }
      perc.value = 60

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
         caseStudyCursor = caseStudyList[caseStudyList.length - 1].id
         if (caseStudyList.length < BATCHSIZE) hasMoreCaseStudy = false
      }
      perc.value = 70

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
         userCourseCursor = userCourseList[userCourseList.length - 1].id
         if (userCourseList.length < BATCHSIZE) hasMoreUserCourse = false
      }
      perc.value = 80

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
         userCardCursor = userCardList[userCardList.length - 1].id
         if (userCardList.length < BATCHSIZE) hasMoreUserCard = false
      }
      perc.value = 90

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
         userQuizCursor = userQuizList[userQuizList.length - 1].id
         if (userQuizList.length < BATCHSIZE) hasMoreUserQuiz = false
      }
      perc.value = 95

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
         userCaseStudyCursor = userCaseStudyList[userCaseStudyList.length - 1].id
         if (userCaseStudyList.length < BATCHSIZE) hasMoreUserCaseStudy = false
      }
      perc.value = 100

   } catch(err) {
      console.log('err', err)
   } finally {
      perc.value = 0
   }
})

const onClick = () => {
   router.push(`/home/${props.userid}/study-ue`)
}
</script>
