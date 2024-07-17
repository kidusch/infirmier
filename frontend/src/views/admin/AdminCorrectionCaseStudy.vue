<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-corrections`">Corrections</router-link>
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
               <div class="flex gap-2">
                  <img class="cursor-pointer h-5 mb-1" src="/src/assets/edit.svg" @click="disabledText = !disabledText">
               </div>
            </div>

            <div class="standard-input-container">
               <textarea placeholder="Écrivez votre réponse ici..." type="text"
                  :value="userCaseStudy?.custom_correction"
                  @input="debouncedInputText"
                  :disabled="disabledText"
               ></textarea>
            </div>
         </div>

         <label class="inline-flex gap-3 items-center cursor-pointer mb-4">
            <p class="font-semibold text-black">Correction valide</p>
            <input type="checkbox" class="sr-only peer" :checked="!userCaseStudy?.correction_required" @input="ev => onValidateClick(!ev.target.checked)">
            <div
               class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#76EE59]">
            </div>
         </label>

      </main>

   </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { userOfId } from '/src/use/useUser'
import { caseStudyOfId } from '/src/use/useCaseStudy'
import { theUserCaseStudy, updateUserCaseStudy } from '/src/use/useUserCaseStudy'


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

const disabledText = ref(true)

const onInputText = async (ev) => {
   userCaseStudy.value = await updateUserCaseStudy(userCaseStudy.value.id, { custom_correction: ev.target.value })
}
const debouncedInputText = useDebounceFn(onInputText, 500)

const onValidateClick = async (correction_required) => {
   await updateUserCaseStudy(userCaseStudy.value.id, { correction_required })
   if (!correction_required) {
      await app.service('notification').pushNotification(student.id, { title: "Devenir Infirmier", text: "Vous avez reçu une correction personnalisée" })
   }
}
</script>
