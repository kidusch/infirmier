<template>
    <main class="flex-1 container max-w-7xl" :class="{ 'page-wrapper': move }">

      <!-- Settings -->
      <section class="w-full flex justify-end">
         <div class="link hover:text-red-600 text-blue-600" @click="back">
            retour
         </div>
      </section>

      <!-- Course content -->
      <main class="mt-4">
         <TextParts :userid="userid" :topic_id="topic_id" :card_id="undefined" :parts="parts" :highlight="highlight"></TextParts>
      </main>

   </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopic } from '/src/use/useTopic'
import { getCourse } from '/src/use/useCourse'
import { getTheUserCourse, updateUserCourse } from '/src/use/useUserCourse'

import parser from '/src/lib/grammar.js'
import TextParts from '/src/components/TextParts.vue'

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

const ue = ref()
const subUE = ref()
const topic = ref([])
const course = ref([])
const userCourse = ref()
const parts = ref([])
const done = ref(true)
const highlight = ref('yellow')

onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topic.value = await getTopic(props.topic_id)
   course.value = await getCourse(props.course_id)
   userCourse.value = await getTheUserCourse(props.userid, props.course_id)
   done.value = userCourse.value.done

   try {
      parts.value = parser.parse(course.value.content)
      console.log('parts', parts.value)
   } catch(err) {
      parts.value = ''
   }
})

const back = () => {
   router.back()
}
</script>
