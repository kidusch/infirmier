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

import { getUserCourseList } from '/src/use/useUserCourse'
import { getUserCardList } from '/src/use/useUserCard'
import { getUserQuizList } from '/src/use/useUserQuiz'
import { getUserCaseStudyList } from '/src/use/useUserCaseStudy'
import { courseState } from '/src/use/useCourse'
import { cardState } from '/src/use/useCard'
import { quizState } from '/src/use/useQuiz'
import { caseStudyState } from '/src/use/useCaseStudy'
import { topicState } from '/src/use/useTopic'
import { subUEState } from '/src/use/useSubUE'
import { getUEList } from '/src/use/useUE'

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
   const userid = props.userid

   // preload ues, topics, courses, etc. by blocks to prevent hundreds of small backend requests
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

      const topicList = await app.service('topic').findMany({})
      for (const topic of topicList) {
         topicState.value.topicCache[topic.id] = topic
         topicState.value.topicStatus[topic.id] = 'ready'
      }
      for (const subUE of subUEList) {
         topicState.value.topicListStatus[subUE.id] = 'ready'
      }
      perc.value = 30

      // read courses by batches of 10
      const courseList = await app.service('course').findMany({})
      for (const course of courseList) {
         courseState.value.courseCache[course.id] = course
         courseState.value.courseStatus[course.id] = 'ready'
      }
      
      for (const topic of topicList) {
         courseState.value.courseListStatus[topic.id] = 'ready'
      }
      perc.value = 40

      const cardList = await app.service('card').findMany({})
      for (const card of cardList) {
         cardState.value.cardCache[card.id] = card
         cardState.value.cardStatus[card.id] = 'ready'
      }
      for (const topic of topicList) {
         cardState.value.cardListStatus[topic.id] = 'ready'
      }
      perc.value = 50

      const quizList = await app.service('quiz').findMany({})
      for (const quiz of quizList) {
         quizState.value.quizCache[quiz.id] = quiz
         quizState.value.quizStatus[quiz.id] = 'ready'
         quizState.value.quizListStatus[quiz.topic_id] = 'ready'
      }
      for (const topic of topicList) {
         quizState.value.quizListStatus[topic.id] = 'ready'
      }
      perc.value = 60

      const caseStudyList = await app.service('case_study').findMany({})
      for (const caseStudy of caseStudyList) {
         caseStudyState.value.caseStudyCache[caseStudy.id] = caseStudy
         caseStudyState.value.caseStudyStatus[caseStudy.id] = 'ready'
         caseStudyState.value.caseStudyListStatus[caseStudy.topic_id] = 'ready'
      }
      for (const topic of topicList) {
         caseStudyState.value.caseStudyListStatus[topic.id] = 'ready'
      }
      perc.value = 70

      await getUserCourseList(userid)
      perc.value = 80
      await getUserCardList(userid)
      perc.value = 90
      await getUserQuizList(userid)
      perc.value = 95
      await getUserCaseStudyList(userid)
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
