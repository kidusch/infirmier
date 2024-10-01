<template>
    <main class="container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card mb-2">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/student/revise-ue`">RÉVISIONS</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/student/revise-ue`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/student/revise-sub-ue/${ue_id}/${sub_ue_id}`">{{ subUE?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/student/revise-topic/${ue_id}/${sub_ue_id}/${topic_id}`">{{ topic?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/student/revise-quiz/${ue_id}/${sub_ue_id}/${topic_id}/${quiz_id}`">QCM : {{ quiz?.title }}</router-link>
            /
            <span class="font-semibold">Résultats</span>
         </p>
      </header>

      <!-- Header -->
      <header class="py-2">
         <h3 class="opacity-50">
            SCORE : {{ score > 0 ? '+' : '' }}{{ score }}
         </h3>
      </header>

      <!-- Settings -->
      <section class="w-full flex justify-end gap-6">

         <!-- <button @click="gotoStudy">
            <img class="h-5" src="/src/assets/courses.svg" alt="course">
         </button> -->
         <div class="cursor-pointer link hover:text-red-600 text-blue-600" @click="gotoStudy">
            cours
         </div>

      </section>


      <!-- Main content -->
      <main class="w-full">

         <h4 class="font-semibold">
            {{ quiz.question }}
         </h4>

         <div v-for="quizChoice, index in quizChoiceList">
            <div class="py-3">
               <div class="font-semibold">
                  <p class="text-black">
                     {{ "ABCDEFGHIJK".charAt(index) }} - {{ quizChoice.text }}
                  </p>
               </div>

               <!-- <div :class="{'text-green-600': isGoodAnswer(quizChoice, answersDict[quizChoice.id]), 'text-red-600': !isGoodAnswer(quizChoice, answersDict[quizChoice.id])}">
                  {{ answerLabel(quizChoice, answersDict[quizChoice.id]) }}
               </div> -->

               <div :class="{'text-green-600': isGoodAnswer(quizChoice, answerOfQuizChoice(quizChoice.id)), 'text-red-600': !isGoodAnswer(quizChoice, answerOfQuizChoice(quizChoice.id))}">
                  {{ answerLabel(quizChoice, answerOfQuizChoice(quizChoice.id)) }}
               </div>

               <div class="text-gray-500">
                  {{ (quizChoice.answer ? 'OUI' : 'NON') }} : {{ quizChoice.comment }}
               </div>

            </div>
         </div>

         <!-- custom correction -->
         <div class="mt-4" v-if="userQuiz?.custom_correction_status === 'corrected'">
            <label for="title">Correction personnalisée</label>
            <div v-html="userQuiz?.custom_correction"></div>
         </div>

      </main>

      <footer class="flex-1 flex flex-col justify-end py-8">
         <router-link class="primary-btn px-4" :to="`/student/revise-topic/${ue_id}/${sub_ue_id}/${topic_id}`">
            Continuer
         </router-link>
      </footer>

   </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

import { getUE, ueOfId } from '/src/use/useUE'
import { getSubUE, subUEOfId } from '/src/use/useSubUE'
import { getTopic, topicOfId } from '/src/use/useTopic'
// import { getQuiz } from '/src/use/useQuiz'
// import { getTheUserQuiz } from '/src/use/useUserQuiz'
// import { getQuizChoiceList } from '/src/use/useQuizChoice'
// import { getTheUserQuizChoice } from '/src/use/useUserQuizChoice'

import { quizOfId } from '/src/use/useQuiz'
import { theUserQuiz, updateUserQuiz } from '/src/use/useUserQuiz'
import { listOfQuizChoices } from '/src/use/useQuizChoice'
import { theUserQuizChoice } from '/src/use/useUserQuizChoice'

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

const ue = computed(() => ueOfId.value(props.ue_id))
const subUE = computed(() => subUEOfId.value(props.sub_ue_id))
const topic = computed(() => topicOfId.value(props.topic_id))
const quiz = computed(() => quizOfId.value(props.quiz_id))
const userQuiz = computed(() => theUserQuiz.value(props.userid, props.quiz_id))
const quizChoiceList = computed(() => listOfQuizChoices.value(props.quiz_id))


const answersDict = ref({})
// const score = ref(0)


onMounted(async () => {
   // ue.value = await getUE(props.ue_id)
   // subUE.value = await getSubUE(props.sub_ue_id)
   // topic.value = await getTopic(props.topic_id)
   // quiz.value = await getQuiz(props.quiz_id)
   // quizChoiceList.value = await getQuizChoiceList(props.quiz_id)
   // for (const quizChoice of quizChoiceList.value) {
   //    const userQuizChoice = await getTheUserQuizChoice(props.userid, quizChoice.id)
   //    answersDict.value[quizChoice.id] = userQuizChoice.answer
   //    if (isGoodAnswer(quizChoice, userQuizChoice.answer)) {
   //       score.value += quizChoice.positive_points
   //    } else if (isWrongAnswer(quizChoice, userQuizChoice.answer)) {
   //       score.value -= quizChoice.negative_points
   //    }
   // }
   // userQuiz.value = await getTheUserQuiz(props.userid, props.quiz_id)
})

const answerOfQuizChoice = computed(() => (quizChoiceId) => {
   const userQuizChoice = theUserQuizChoice.value(props.userid, quizChoiceId)
   return userQuizChoice?.answer
})

function isGoodAnswer(quizChoice, studentAnswer) {
   if (studentAnswer === null) return false
   if (studentAnswer === quizChoice.answer) return true
   return false
}

function isWrongAnswer(quizChoice, studentAnswer) {
   if (studentAnswer === null) return false
   if (studentAnswer !== quizChoice.answer) return true
   return false
}

const answerLabel = (quizChoice, studentAnswer) => {
   if (studentAnswer === null) return `Absence de réponse (0 point)`
   if (studentAnswer === quizChoice.answer) return `Bonne réponse (${quizChoice.positive_points} points)`
   return `Mauvaise réponse (-${quizChoice.negative_points} points)`
}

const score = computed(() => quizChoiceList.value.reduce((accu, quizChoice) => {
   const userQuizChoice = theUserQuizChoice.value(props.userid, quizChoice.id)
   if (isGoodAnswer(quizChoice, userQuizChoice.answer)) {
      accu += quizChoice.positive_points
   } else if (isWrongAnswer(quizChoice, userQuizChoice.answer)) {
      accu -= quizChoice.negative_points
   }
   return accu
}, 0))

const gotoStudy = () => {
   router.push(`/student/study-topic/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}`)
}
</script>