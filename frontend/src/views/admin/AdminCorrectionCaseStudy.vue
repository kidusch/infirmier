<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/admin/admin-corrections`">Corrections</router-link>
            /
            <span class="font-semibold">{{ student?.name }} - {{ caseStudy?.title }}</span>
         </p>
      </header>

      <!-- Main content -->
      <main class="pt-4 w-full">

         <!-- Case study description -->
         <div v-html="caseStudy?.content"></div>

         <!-- Student's answer -->
         <div class="py-4">
            <div class="flex justify-between">
               <label for="title">Réponse de l'étudiant</label>
            </div>

            <div class="standard-input-container">
               <textarea type="text" disabled
                  :value="userCaseStudy?.answer"
               ></textarea>
            </div>
         </div>

         <!-- Custom answer -->
         <div class="py-4">
            <div class="flex justify-between">
               <label for="title">Réponse personnalisée</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isContentDisabled" @click="isContentDisabled = !isContentDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isContentDisabled" @click="isContentDisabled = !isContentDisabled">
               </div>
            </div>

            <div class="standard-input-container">
               <textarea placeholder="Écrivez votre réponse ici..." type="text"
                  :value="correction"
                  @input="onCorrectionInputDebounced"
                  v-position="correctionPosition"
                  :disabled="isContentDisabled"
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
import { caseStudyOfId } from '/src/use/useCaseStudy'
import { theUserCaseStudy, updateUserCaseStudy } from '/src/use/useUserCaseStudy'

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
   caseStudyId: {
      type: Number,
      required: true
   },
})

const student = computed(() => userOfId.value(props.userId))
const caseStudy = computed(() => caseStudyOfId.value(props.caseStudyId))
const userCaseStudy = computed(() => theUserCaseStudy.value(props.userId, props.caseStudyId))

// handle custom correction editing
const localCorrection = ref()
const correction = computed(() => localCorrection.value || userCaseStudy.value.custom_correction)
app.service('user_case_study').on('update', userCaseStudy => {
   localCorrection.value = userCaseStudy.custom_correction
})
const correctionPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onCorrectionInput = async (ev) => {
   localCorrection.value = ev.target.value
   correctionPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateUserCaseStudy(userCaseStudy.value.id, { custom_correction: ev.target.value })
}
const onCorrectionInputDebounced = useDebounceFn(onCorrectionInput, 500)
const isContentDisabled = ref(true)

// custom directive (v-position on <input> or <textarea>) which restores cursor position
const vPosition = {
   updated: (el, binding) => {
      // binding.value is the directive argument, here the cursor position ref { start, end }
      el.selectionStart, el.selectionEnd = binding.value.start, binding.value.end
   }
}

const onValidate = async () => {
   try {
      await updateUserCaseStudy(userCaseStudy.value.id, {
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
