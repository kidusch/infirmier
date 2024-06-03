<template>
    <main class="flex-1 container max-w-7xl" :class="{ 'page-wrapper': move }">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/study-ue`">COURS</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/study-ue`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/study-sub-ue/${ue?.id}/${subUE?.id}`">{{ subUE?.name }}</router-link>
            /
            <span class="font-semibold">{{ topic?.name }}</span>
         </p>
      </header>

      <!-- Header -->
      <!-- <header class="py-2">
         <h3 class="lg:opacity-50">
            {{ topic?.name }}
         </h3>
      </header> -->

      
      <!-- Main content -> courses list -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
            <div class="progress-list">
               <template v-for="course in courseList">
                  <div class="progress-item cursor-pointer" @click="selectCourse(course)">
                     <div class="w-14 h-14">
                        <jcb-radial :value="courseProgressDict[course.id]"></jcb-radial>
                     </div>
                     <p>
                        {{ course?.title }}
                     </p>
                  </div>
               </template>
            </div>
         </div>

      </main>


   </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopic } from '/src/use/useTopic'
import { getCourseList } from '/src/use/useCourse'
import { getTheUserCourse } from '/src/use/useUserCourse'

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
})

const ue = ref()
const subUE = ref()
const topic = ref()
const courseList = ref([])
const courseProgressDict = ref({})

onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topic.value = await getTopic(props.topic_id)
   courseList.value = await getCourseList(props.topic_id)
   for (const course of courseList.value) {
      const user_course = await getTheUserCourse(props.userid, course.id)
      courseProgressDict.value[course.id] = user_course.done ? 100 : 0
   }
})

const move = ref(false)

const selectCourse = (course) => {
   router.push(`/home/${props.userid}/study-course/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${course.id}`)
}
</script>
