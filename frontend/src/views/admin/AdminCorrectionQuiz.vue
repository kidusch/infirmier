<template>
   <main class="container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card mb-2">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/admin/admin-corrections`">Corrections</router-link>
            /
            <span class="font-semibold">{{ student?.name }} - {{ quiz?.title }}</span>
         </p>
      </header>

      <!-- Main content -->
      <main class="pt-4 w-full">

         <div v-html="quiz?.title"></div>

         <!-- Student's answer -->
         <div v-for="choice, index in quizChoiceList">
            <div class="py-5 flex items-center">
               <div>
                  <div class="flex items-center pb-1.5">
                     <label class="font-normal me-2 w-6">
                        <p class="text-sm text-black">
                           Oui
                        </p>
                     </label>

                     <input type="checkbox" :checked="userQuizChoiceAnswer(choice.id) === true" class="checkbox checkbox-primary" disabled />

                  </div>
                  <div class="flex items-center">
                     <label class="font-normal me-2 w-6">
                        <p class="text-sm text-black">
                           Non
                        </p>
                     </label>

                     <input type="checkbox" :checked="userQuizChoiceAnswer(choice.id) === false" class="checkbox checkbox-primary" disabled />
                  </div>
               </div>
               <label class="font-normal ml-4">
                  <p class="text-sm max-sm:text-xs text-black">
                     {{ "ABCDEFGHIJK".charAt(index) }} - {{ choice.text }}
                  </p>
               </label>
            </div>
         </div>

         <!-- Custom correction -->
         <div class="py-4">
            <div class="flex justify-between">
               <label for="title">Réponse personnalisée</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isCorrectionDisabled" @click="isCorrectionDisabled = !isCorrectionDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isCorrectionDisabled" @click="isCorrectionDisabled = !isCorrectionDisabled">
               </div>
            </div>

            <div class="standard-input-container">
               <textarea placeholder="Écrivez votre réponse ici..." type="text" class="h-96"
                  :value="correction"
                  @input="onCorrectionInputDebounced"
                  v-position="correctionPosition"
                  :disabled="isCorrectionDisabled"
               ></textarea>
            </div>
         </div>

         <button class="primary-btn px-10 mb-4" @click="onValidate">
            Valider correction
         </button>

      </main>

   </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { userOfId } from '/src/use/useUser.ts'
import { quizOfId } from '/src/use/useQuiz'
import { theUserQuiz, updateUserQuiz } from '/src/use/useUserQuiz'
import { listOfQuizChoices } from '/src/use/useQuizChoice'
import { theUserQuizChoice } from '/src/use/useUserQuizChoice'

import { app } from '/src/client-app.js'
import router from "/src/router"


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   userId: {
      type: Number,
      required: true
   },
   quizId: {
      type: Number,
      required: true
   },
})

const student = computed(() => userOfId.value(props.userId))
const quiz = computed(() => quizOfId.value(props.quizId))
const userQuiz = computed(() => theUserQuiz.value(props.userId, props.quizId))
const quizChoiceList = computed(() => listOfQuizChoices.value(props.quizId))

const userQuizChoiceAnswer = computed(() => (quiz_choice_id) => {
   const userQuizChoice = theUserQuizChoice.value(props.userId, quiz_choice_id)
   return userQuizChoice?.answer
})

// handle correction editing
const localCorrection = ref()
const correction = computed(() => localCorrection.value || userQuiz.value.custom_correction)
app.service('user_quiz').on('update', userQuiz => {
   localCorrection.value = userQuiz.custom_correction
})
const correctionPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onCorrectionInput = async (ev) => {
   localCorrection.value = ev.target.value
   correctionPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateUserQuiz(userQuiz.value.id, { custom_correction: ev.target.value })
}
const onCorrectionInputDebounced  = useDebounceFn(onCorrectionInput, 500)
const isCorrectionDisabled = ref(true)


const onValidate = async () => {
   try {
      await updateUserQuiz(userQuiz.value.id, {
         custom_correction_status: 'corrected',
         custom_correction_date: new Date(),
      })
   } catch(err) {
      alert("Erreur lors de l'enregistrement")
   }
   try {
      await app.service('notification').pushNotification(student.value.id, { title: "Devenir Infirmier", text: "Vous avez reçu une correction personnalisée" })
   } catch(err) {
      alert("Erreur lors de l'envoi de la notification à l'étudiant")
   }
   await router.push(`/admin/admin-corrections`)
}
</script>
