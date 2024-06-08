<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-ue`">RÉVISIONS</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-ue`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-sub-ue/${ue_id}/${sub_ue_id}`">{{ subUE?.name }}</router-link>
            /
            <span class="font-semibold">{{ topic?.name }}</span>
         </p>
      </header>

      <!-- Header -->
      <header class="py-2">
         <div class="flex items-center justify-between">

            <div class="flex items-center">
               <h3 class="opacity-50">{{ topic?.name }}</h3>

               <div class="ml-4 mt-3 w-14">
                  <jcb-radial class="w-14" :value="topicReviseProgress(userid, topic_id)"></jcb-radial>
               </div>
            </div>

            <div class="ml-4 cursor-pointer link hover:text-red-600 text-blue-600" @click="gotoStudy">
               cours
            </div>

         </div>
      </header>

      <!-- Main content -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
            
            <div class="progress-list">
               <template v-for="card in cardList">
                  <div v-if="!card.hidden" class="progress-item cursor-pointer" @click="selectCard(card)">
                     <div class="w-14">
                        {{ isTheUserCardDone(card.id) ? "✔️": "" }}
                     </div>
                     <p>
                        Fiche : {{ card?.title }}
                     </p>
                  </div>
               </template>
            </div>

            <div class="progress-list">
               <template v-for="quiz in quizList">
                  <div v-if="!quiz.hidden" class="progress-item cursor-pointer" @click="selectQuiz(quiz)">
                     <div class="w-14">
                        {{ isTheUserQuizDone(quiz.id) ? "✔️": "" }}
                     </div>
                     <p>
                        QCM : {{ quiz?.title }}
                     </p>
                  </div>
               </template>
            </div>

            <div class="progress-list">
               <template v-for="caseStudy in caseStudyList">
                  <div v-if="!caseStudy.hidden" class="progress-item cursor-pointer" @click="selectCaseStudy(caseStudy)">
                     <div class="w-14">
                        {{ isTheUserCaseStudyDone(caseStudy.id) ? "✔️": "" }}
                     </div>
                     <p>
                        Étude de cas : {{ caseStudy?.title }}
                     </p>
                  </div>
               </template>
            </div>
         </div>

      </main>

   </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

import { ueOfId } from '/src/use/useUE'
import { subUEOfId } from '/src/use/useSubUE'
import { topicOfId } from '/src/use/useTopic'
import { listOfCards } from '/src/use/useCard'
import { listOfQuizs } from '/src/use/useQuiz'
import { listOfCaseStudies } from '/src/use/useCaseStudy'
import { theUserCard } from '/src/use/useUserCard'
import { theUserQuiz } from '/src/use/useUserQuiz'
import { theUserCaseStudy } from '/src/use/useUserCaseStudy'
import { topicReviseProgress } from '/src/use/useProgress'
import router from "/src/router"


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   ue_id: {
      type: Number,
      required: true
   },
   sub_ue_id: {
      type: Number,
      required: true
   },
   topic_id: {
      type: Number,
      required: true
   },
})

const ue = computed(() => ueOfId.value(props.ue_id))
const subUE = computed(() => subUEOfId.value(props.sub_ue_id))
const topic = computed(() => topicOfId.value(props.topic_id))

const cardList = computed(() => listOfCards.value(props.topic_id))
const quizList = computed(() => listOfQuizs.value(props.topic_id))
const caseStudyList = computed(() => listOfCaseStudies.value(props.topic_id))


const isTheUserCardDone = computed(() => (cardId) => {
   const userCard = theUserCard.value(props.userid, cardId)
   return userCard && userCard.done
})

const isTheUserQuizDone = computed(() => (quizId) => {
   const userQuiz = theUserQuiz.value(props.userid, quizId)
   return userQuiz && userQuiz.done
})

const isTheUserCaseStudyDone = computed(() => (caseStudyId) => {
   const userCaseStudy = theUserCaseStudy.value(props.userid, caseStudyId)
   return userCaseStudy && userCaseStudy.done
})

const selectCard = (card) => {
   router.push(`/home/${props.userid}/revise-card/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${card.id}`)
}

const selectQuiz = (quiz) => {
   router.push(`/home/${props.userid}/revise-quiz/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${quiz.id}`)
}

const selectCaseStudy = (caseStudy) => {
   router.push(`/home/${props.userid}/revise-case-study/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${caseStudy.id}`)
}

const gotoStudy = () => {
   router.push(`/home/${props.userid}/study-topic/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}`)
}
</script>