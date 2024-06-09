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
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-topic/${ue_id}/${sub_ue_id}/${topic_id}`">{{ topic?.name }}</router-link>
            /
            <span class="font-semibold">QCM : {{ quiz?.title }}</span>
         </p>
      </header>

      <!-- Header -->
      <section class="w-full flex justify-between">
         <h3 class="opacity-50">
            QCM
         </h3>

         <div class="flex gap-6">
            <label class="inline-flex gap-3 items-center cursor-pointer">
               <p class="font-semibold text-black">Acquis</p>

               <input type="checkbox" class="sr-only peer" :checked="userQuiz?.done" @input="ev => onDoneClick(ev.target.checked)">
               <div
                  class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#76EE59]">
               </div>

            </label>

            <div class="cursor-pointer link hover:text-red-600 text-blue-600" @click="gotoStudy">
               cours
            </div>

         </div>
      </section>



        <!-- Main content -->
        <main class="py-4 w-full">
            <h4 class="py-2 font-semibold">
               {{ quiz?.question }}
            </h4>
            <p class="opacity-50">(Sélectionnez toutes les réponses correctes)</p>

            <!-- MCQ / QCM -->
            
            <div v-for="choice, index in quizChoiceList">
               <div class="py-5 flex items-center">
                  <div>
                     <div class="flex items-center pb-1.5">
                        <label class="font-normal me-2 w-6">
                           <p class="text-sm text-black">
                              Oui
                           </p>
                        </label>

                        <input type="checkbox" :checked="answersDict[choice.id] === true" @click="(ev) => setAnswer(choice.id, true, ev.target.checked)" class="checkbox checkbox-primary" />

                     </div>
                     <div class="flex items-center">
                        <label class="font-normal me-2 w-6">
                           <p class="text-sm text-black">
                              Non
                           </p>
                        </label>

                        <input type="checkbox" :checked="answersDict[choice.id] === false" @click="(ev) => setAnswer(choice.id, false, ev.target.checked)" class="checkbox checkbox-primary" />
                     </div>
                  </div>
                  <label class="font-normal ml-4">
                     <p class="text-sm max-sm:text-xs text-black">
                        {{ "ABCDEFGHIJK".charAt(index) }} - {{ choice.text }}
                     </p>
                  </label>

               </div>
            </div>
            
        </main>

        <footer class="flex-1 flex flex-col justify-end pb-8">
            <button class="primary-btn px-4" @click="gotoResults">
               Vérifier mes réponses
            </button>
        </footer>

   </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

import { ueOfId } from '/src/use/useUE'
import { subUEOfId } from '/src/use/useSubUE'
import { topicOfId } from '/src/use/useTopic'
import { quizOfId } from '/src/use/useQuiz'
import { theUserQuiz, updateUserQuiz } from '/src/use/useUserQuiz'
import { listOfQuizChoices } from '/src/use/useQuizChoice'
import { getTheUserQuizChoice, theUserQuizChoice, updateUserQuizChoice } from '/src/use/useUserQuizChoice'

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


onMounted(async () => {
   for (const quizChoice of quizChoiceList.value) {
      const userQuizeChoice = await getTheUserQuizChoice(props.userid, quizChoice.id)
      answersDict.value[quizChoice.id] = userQuizeChoice.answer
   }
})

const onDoneClick = async (done) => {
   await updateUserQuiz(userQuiz.value.id, { done })
}

const setAnswer = async (quiz_choice_id, value, checked) => {
   const userQuizeChoice = await getTheUserQuizChoice(props.userid, quiz_choice_id)
   const answer = checked ? value : null
   await updateUserQuizChoice(userQuizeChoice.id, { answer })
   answersDict.value[quiz_choice_id] = answer
}

const gotoStudy = () => {
   router.push(`/home/${props.userid}/study-topic/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}`)
}

const gotoResults = () => {
   router.push(`/home/${props.userid}/revise-quiz-results/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${props.quiz_id}`)
}
</script>