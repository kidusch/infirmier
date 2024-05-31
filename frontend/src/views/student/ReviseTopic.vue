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
         <div class="flex items-center">
            <h3 class="opacity-50">{{ topic?.name }}</h3>

            <div class="ml-4 mt-3 w-14">
               <jcb-radial :value="progress"></jcb-radial>
            </div>

            <!-- <button class="mx-4" @click="gotoStudy">
               <img class="h-5" src="/src/assets/courses.svg" alt="course">
            </button> -->
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
                  <div class="progress-item cursor-pointer" @click="selectCard(card)">
                     <div class="w-14">
                        {{ userCardDict[card.id]?.done ? "✔️": "" }}
                     </div>
                     <p>
                        Fiche : {{ card?.title }}
                     </p>
                  </div>
               </template>
            </div>
            <div class="progress-list">
               <template v-for="quiz in quizList">
                  <div class="progress-item cursor-pointer" @click="selectQuiz(quiz)">
                     <div class="w-14">
                        {{ userQuizDict[quiz.id]?.done ? "✔️": "" }}
                     </div>
                     <p>
                        QCM : {{ quiz?.title }}
                     </p>
                  </div>
               </template>
            </div>
            <div class="progress-list">
               <template v-for="caseStudy in caseStudyList">
                  <div class="progress-item cursor-pointer" @click="selectCaseStudy(caseStudy)">
                     <div class="w-14">
                        {{ userCaseStudyDict[caseStudy.id]?.done ? "✔️": "" }}
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
import { ref, onMounted } from 'vue'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopic } from '/src/use/useTopic'
import { getCardList } from '/src/use/useCard'
import { getQuizList } from '/src/use/useQuiz'
import { getCaseStudyList } from '/src/use/useCaseStudy'
import { getTheUserCard } from '/src/use/useUserCard'
import { getTheUserQuiz } from '/src/use/useUserQuiz'
import { getTheUserCaseStudy } from '/src/use/useUserCaseStudy'
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

const ue = ref()
const subUE = ref()
const topic = ref([])
const cardList = ref()
const quizList = ref()
const caseStudyList = ref()
const userCardDict = ref({})
const userQuizDict = ref({})
const userCaseStudyDict = ref({})
const progress = ref(0)


onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topic.value = await getTopic(props.topic_id)

   cardList.value = await getCardList(props.topic_id)
   quizList.value = await getQuizList(props.topic_id)
   caseStudyList.value = await getCaseStudyList(props.topic_id)

   let count = 0
   let sum = 0
   for (const card of cardList.value) {
      const userCard = await getTheUserCard(props.userid, card.id)
      userCardDict.value[card.id] = userCard
      count += 1
      sum += (userCard.done ? 100 : 0)
   }
   for (const quiz of quizList.value) {
      const userQuiz = await getTheUserQuiz(props.userid, quiz.id)
      userQuizDict.value[quiz.id] = userQuiz
      count += 1
      sum += (userQuiz.done ? 100 : 0)
   }
   for (const caseStudy of caseStudyList.value) {
      const userCaseStudy = await getTheUserCaseStudy(props.userid, caseStudy.id)
      userCaseStudyDict.value[caseStudy.id] = userCaseStudy
      count += 1
      sum += (userCaseStudy.done ? 100 : 0)
   }
   progress.value = count === 0 ? 0 : Math.round(sum / count)
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