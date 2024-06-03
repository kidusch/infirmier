<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/study-ue`">COURS</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/study-ue`">{{ ue?.name }}</router-link>
            /
            <span class="font-semibold">{{ subUE?.name }}</span>
         </p>
      </header>

      <!-- Header -->
      <header class="py-2">
         <h3 class="opacity-50">
            {{ subUE?.name }}
         </h3>
      </header>

      <!-- Main content -> topics list -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
            <div class="progress-list">
               <template v-for="topic in topicList">
                  <div class="progress-item cursor-pointer" @click="selectTopic(topic)">
                     <div class="w-14 h-14">
                        <jcb-radial :value="topicProgressDict[topic.id]"></jcb-radial>
                     </div>
                     <p>
                        {{ topic?.name }}
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

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopicList } from '/src/use/useTopic'
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
})

const ue = ref()
const subUE = ref()
const topicList = ref([])
const topicProgressDict = ref({})

onMounted(async () => {
   console.log('onMounted StudentSubUE', props.userid)
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topicList.value = await getTopicList(props.sub_ue_id)
   // for (const topic of topicList.value) {
   //    let count = 0
   //    let sum = 0
   //    const courseList = await getCourseList(topic.id)
   //    for (const course of courseList) {
   //       const user_course = await getTheUserCourse(props.userid, course.id)
   //       sum += (user_course.done ? 100 : 0)
   //       count += 1
   //    }
   //    topicProgressDict.value[topic.id] = count === 0 ? 0 : Math.round(sum / count)
   // }
})

const selectTopic = (topic) => {
   router.push(`/home/${props.userid}/study-topic/${props.ue_id}/${props.sub_ue_id}/${topic.id}`)
}
</script>