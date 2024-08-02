<template>
    <main class="flex-1 container max-w-7xl mt-16">

      <!-- Settings -->
      <section class="w-full flex justify-end">
         <div class="link hover:text-red-600 text-blue-600" @click="back">
            Retour
         </div>
      </section>

      <!-- Course content -->
      <main class="mt-4">
         <div v-html="course?.content"></div>
      </main>

   </main>
</template>

<script setup>
import { computed } from 'vue'

import { courseOfId } from '/src/use/useCourse'

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
   course_id: {
      type: Number,
      required: true
   },
})

const course = computed(() => courseOfId.value(props.course_id))

const back = () => {
   router.back()
}
</script>
