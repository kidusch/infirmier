<template>

   <main class="container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card mb-2">
         <p class="leading-loose">
            <span class="font-semibold">Corrections</span>
         </p>
      </header>


      <main class="flex flex-col gap-6 pb-4">

         <div class="flex flex-col gap-3">

            <template v-for="userCaseStudy in listOfUncorrectedUserCaseStudy">
               <div class="flex gap-3 items-center border-b-2 justify-between">
                  <div class="flex items-center justify-start gap-3">
                     <div>
                        <div class="">{{ userOfId(userCaseStudy.user_id).name }} - Étude de cas</div>
                        <div class="text-sm text-blue-300">{{ hasSubscription(userCaseStudy.user_id) ? "Abonné - " : "" }} {{ formattedDatetime(userCaseStudy.custom_correction_date) }}</div>
                     </div>
                  </div>
                  <img class="h-4 cursor-pointer" src="/src/assets/thick-arrow-right.svg" @click="selectUserCaseStudy(userCaseStudy)">
               </div>
            </template>

            <template v-for="userQuiz in listOfUncorrectedUserQuiz">
               <div class="flex gap-3 items-center border-b-2 justify-between">
                  <div class="flex items-center justify-start gap-3">
                     <div>
                        <div class="">{{ userOfId(userQuiz.user_id).name }} - Quiz</div>
                        <div class="text-sm text-blue-300">{{ hasSubscription(userQuiz.user_id) ? "Abonné - " : "" }} {{ formattedDatetime(userQuiz.custom_correction_date) }}</div>
                     </div>
                  </div>
                  <img class="h-4 cursor-pointer" src="/src/assets/thick-arrow-right.svg" @click="selectUserQuiz(userQuiz)">
               </div>
            </template>

            <template v-if="listOfUncorrectedUserCaseStudy.length + listOfUncorrectedUserQuiz.length === 0">
               <div>Aucune correction à faire</div>
            </template>

         </div>
      </main>
   </main>

</template>

<script setup>
// import { computed, ref } from 'vue'

import { userOfId, hasSubscription } from '/src/use/useUser'
import { listOfUncorrectedUserCaseStudy } from '/src/use/useUserCaseStudy'
import { listOfUncorrectedUserQuiz } from '/src/use/useUserQuiz'

import { formattedDatetime } from '/src/lib/utilities'

import router from "/src/router"

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const selectUserCaseStudy = (userCaseStudy) => {
   router.push(`/admin/admin-correction-case-study/${userCaseStudy.user_id}/${userCaseStudy.case_study_id}`)
}

const selectUserQuiz = (userQuiz) => {
   router.push(`/admin/admin-correction-quiz/${userQuiz.user_id}/${userQuiz.quiz_id}`)
}
</script>
