<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-ue`">Révisions</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-ue`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-sub-ue/${ue_id}/${sub_ue_id}`">{{ subUE?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-topic/${ue_id}/${sub_ue_id}/${topic_id}`">{{ topic?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-quiz/${ue_id}/${sub_ue_id}/${topic_id}/${quiz_id}`">QCM : {{ quiz?.title }}</router-link>
            /
            <span class="font-semibold">Résultats</span>
         </p>
      </header>

      <!-- Header -->
      <header class="py-2">
         <h3 class="opacity-50">
            Résultats
         </h3>
      </header>

      <!-- Settings -->
      <section class="w-full flex justify-end gap-6">

         <button @click="gotoStudy">
            <img class="h-5" src="/src/assets/courses.svg" alt="course">
         </button>

      </section>


      <!-- Main content -->
      <main class="py-4 w-full">

         <h4 class="py-2 font-semibold text-gray-500">
            SCORE : {{ score > 0 ? '+' : '' }}{{ score }}
         </h4>

         <h4 class="py-2 font-semibold">
            {{ quiz.question }}
         </h4>

         <div v-for="quizChoice, index in quizChoiceList">
            <div class="py-3">
               <div class="font-semibold">
                  <p class="text-black">
                     {{ "ABCDEFGHIJK".charAt(index) }} - {{ quizChoice.text }}
                  </p>
               </div>

               <div :class="{'text-green-600': isGoodAnswer(quizChoice, answersDict[quizChoice.id]), 'text-red-600': !isGoodAnswer(quizChoice, answersDict[quizChoice.id])}">
                  {{ answerLabel(quizChoice, answersDict[quizChoice.id]) }}
               </div>

               <div class="text-gray-500">
                  {{ (quizChoice.answer ? 'OUI' : 'NON') }} : {{ quizChoice.comment }}
               </div>

            </div>
         </div>

      </main>

      <footer class="flex-1 flex flex-col justify-end pb-8">
         <button class="primary-btn px-4" @click="">
            Continuer
         </button>
      </footer>

   </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopic } from '/src/use/useTopic'
import { getQuiz } from '/src/use/useQuiz'
import { getTheUserQuiz } from '/src/use/useUserQuiz'
import { getQuizChoiceList } from '/src/use/useQuizChoice'
import { getTheUserQuizChoice } from '/src/use/useUserQuizChoice'

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
   quiz_id: {
      type: Number,
      required: true
   },
})

const ue = ref()
const subUE = ref()
const topic = ref([])
const quiz = ref([])
const userQuiz = ref([])
const quizChoiceList = ref([])

const done = ref(true)
const answersDict = ref({})
const score = ref(0)


onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topic.value = await getTopic(props.topic_id)
   quiz.value = await getQuiz(props.quiz_id)
   quizChoiceList.value = await getQuizChoiceList(props.quiz_id)
   for (const quizChoice of quizChoiceList.value) {
      const userQuizeChoice = await getTheUserQuizChoice(props.userid, quizChoice.id)
      answersDict.value[quizChoice.id] = userQuizeChoice.answer
      if (isGoodAnswer(quizChoice, userQuizeChoice.answer)) {
         score.value += quizChoice.positive_points
      } else {
         score.value -= quizChoice.negative_points
      }
   }

   userQuiz.value = await getTheUserQuiz(props.userid, props.quiz_id)
   done.value = userQuiz.value.done
})

function isGoodAnswer(quizChoice, studentAnswer) {
   if (studentAnswer === undefined) return false
   if (studentAnswer === quizChoice.answer) return true
   return false
}

const answerLabel = (quizChoice, studentAnswer) => {
   if (studentAnswer === undefined) return `Absence de réponse (-${quizChoice.negative_points} points)`
   if (studentAnswer === quizChoice.answer) return `Bonne réponse (${quizChoice.positive_points} points)`
   return `Mauvaise réponse (-${quizChoice.negative_points} points)`
}

const gotoStudy = () => {
   router.push(`/home/${props.userid}/study-topic/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}`)
}
</script>