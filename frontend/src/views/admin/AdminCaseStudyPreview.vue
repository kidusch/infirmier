<template>
    <main class="container max-w-7xl mt-14">

      <!-- Settings -->
      <section class="w-full flex justify-end">
         <div class="link hover:text-red-600 text-blue-600" @click="back">
            Retour
         </div>
      </section>

      <!-- Course content -->
      <main class="mt-4">
         <div v-html="caseStudy?.content"></div>
      </main>

   </main>
</template>

<script setup>
import { computed } from 'vue'

import { caseStudyOfId } from '/src/use/useCaseStudy'

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
   case_study_id: {
      type: Number,
      required: true
   },
})

const caseStudy = computed(() => caseStudyOfId.value(props.case_study_id))

const back = () => {
   router.back()
}
</script>
