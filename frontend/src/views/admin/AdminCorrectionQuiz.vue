<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-corrections`">Corrections</router-link>
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

                     <input type="checkbox" :checked="userQuizChoiceAnswer(choice.id) === true" class="checkbox checkbox-primary" />

                  </div>
                  <div class="flex items-center">
                     <label class="font-normal me-2 w-6">
                        <p class="text-sm text-black">
                           Non
                        </p>
                     </label>

                     <input type="checkbox" :checked="userQuizChoiceAnswer(choice.id) === false" class="checkbox checkbox-primary" />
                  </div>
               </div>
               <label class="font-normal ml-4">
                  <p class="text-sm max-sm:text-xs text-black">
                     {{ "ABCDEFGHIJK".charAt(index) }} - {{ choice.text }}
                  </p>
               </label>
            </div>
         </div>

         <!-- Custom answer -->
         <div class="py-4">
            <div class="flex justify-between">
               <label for="title">Réponse personnalisée</label>
               <div class="flex gap-2">
                  <img class="cursor-pointer h-5 mb-1" src="/src/assets/edit.svg" @click="disabledText = !disabledText">
               </div>
            </div>

            <div class="standard-input-container">
               <textarea placeholder="Écrivez votre réponse ici..." type="text"
                  :value="userQuiz?.custom_correction"
                  @input="debouncedInputText"
                  :disabled="disabledText"
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

import { userOfId } from '/src/use/useUser'
import { quizOfId } from '/src/use/useQuiz'
import { theUserQuiz, updateUserQuiz } from '/src/use/useUserQuiz'

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

const disabledText = ref(true)

const onInputText = async (ev) => {
   userQuiz.value = await updateUserQuiz(userQuiz.value.id, { custom_correction: ev.target.value })
}
const debouncedInputText = useDebounceFn(onInputText, 500)

const onValidate = async () => {
   try {
      await updateUserQuiz(userQuiz.value.id, { custom_correction_status: 'corrected' })
   } catch(err) {
      alert("Erreur lors de l'enregistrement")
   }
   try {
      await app.service('notification').pushNotification(student.value.id, { title: "Devenir Infirmier", text: "Vous avez reçu une correction personnalisée" })
   } catch(err) {
      alert("Erreur lors de l'envoi de la notification à l'étudiant")
   }
   await router.push(`/home/${props.userid}/admin-corrections`)
}
</script>
