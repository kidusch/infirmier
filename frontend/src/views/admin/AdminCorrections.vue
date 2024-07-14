<template>

   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <span class="font-semibold">Corrections</span>
         </p>
      </header>


      <main class="flex flex-col gap-6 pb-4">

         <div class="flex flex-col gap-3">

            <template v-for="userCaseStudy in listOfUncorrectedUserCaseStudyForPremium">
               <div class="flex gap-3 items-center border-b-2 justify-between">
                  <div class="flex items-center justify-start gap-3">
                     <div>
                        <div class="">{{ userOfId(userCaseStudy.user_id).name }}</div>
                        <div class="text-sm text-blue-300">{{ userCaseStudy.user_id }}, {{ userCaseStudy.case_study_id }}</div>
                     </div>
                  </div>
                  <img class="h-4 cursor-pointer" src="/src/assets/thick-arrow-right.svg" @click="selectUserCaseStudy(userCaseStudy)">
               </div>

            </template>

         </div>
      </main>
   </main>

</template>

<script setup>
import { computed, ref } from 'vue'

import { userOfId } from '/src/use/useUser'
import { listOfUncorrectedUserCaseStudy } from '/src/use/useUserCaseStudy'

import router from "/src/router"

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const listOfUncorrectedUserCaseStudyForPremium = computed(() => {
   return listOfUncorrectedUserCaseStudy.value.filter(userCaseStudy => {
      const user = userOfId.value(userCaseStudy.user_id)
      return (user?.premium)
   })
})

const selectUserCaseStudy = (userCaseStudy) => {
   router.push(`/home/${props.userid}/admin-correction-case-study/${userCaseStudy.user_id}/${userCaseStudy.case_study_id}`)
}

</script>
