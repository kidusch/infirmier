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
      <header>
         <h3 class="opacity-50 flex items-center gap-2.5">
            <div class="ml-2 mt-3 w-12">
               <jcb-radial class="w-12" :value="topicStudyProgress(userid, topic?.id)"></jcb-radial>
            </div>
            {{ topic?.name }}
         </h3>
      </header>


      <!-- Main content -> courses list -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
            <div class="progress-list">
               <template v-for="course in courseList">
                  <div v-if="!course.hidden" class="progress-item cursor-pointer" @click="selectCourse(course)">
                     <div class="w-14">
                        <jcb-radial class="w-14" :value="courseStudyProgress(userid, course.id)"></jcb-radial>
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
import { ref, onMounted, computed } from 'vue'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopic } from '/src/use/useTopic'
import { getCourseList } from '/src/use/useCourse'
import { courseStudyProgress, topicStudyProgress } from '/src/use/useProgress'

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

onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topic.value = await getTopic(props.topic_id)
   courseList.value = await getCourseList(props.topic_id)
})

const move = ref(false)

const selectCourse = (course) => {
   router.push(`/home/${props.userid}/study-course/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${course.id}`)
}
</script>
