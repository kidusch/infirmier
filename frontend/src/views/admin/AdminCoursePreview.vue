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
         <div v-html="courseContent?.content"></div>
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
import { courseContentOfCourseId } from '/src/use/useCourseContent'

const courseContent = computed(() => courseContentOfCourseId.value(props.course_id))

const back = () => {
   router.back()
}
</script>
