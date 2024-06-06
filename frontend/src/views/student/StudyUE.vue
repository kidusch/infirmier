<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <span>COURS</span>
         </p>
      </header>

      <!-- Main content -> courses list -->
      <main class="flex flex-col gap-6 pb-6">
         <template v-for="ue in ueList">
            <div v-if="!ue.hidden" class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
               <h3 class="font-semibold flex items-center gap-2.5">
                  <div class="ml-2 mt-3 w-14">
                     <jcb-radial class="w-14" :value="ueStudyProgress(userid, ue?.id)"></jcb-radial>
                  </div>
                  {{ ue?.name }}
               </h3>

               <div class="progress-list">
                  <template v-for="subUE in subUEListDict[ue.id]">
                     <div v-if="!subUE.hidden" class="progress-item cursor-pointer" @click="select(ue, subUE)">
                        <div class="w-12">
                           <jcb-radial class="w-12" :value="subUEStudyProgress(userid, subUE.id)"></jcb-radial>
                        </div>
                        <p>
                           {{ subUE.name }}
                        </p>
                     </div>
                  </template>
               </div>
            </div>
         </template>

      </main>

   </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { getUEList } from '/src/use/useUE'
import { getSubUEList } from '/src/use/useSubUE'
import { subUEStudyProgress, ueStudyProgress } from '/src/use/useProgress'
import router from "/src/router"

// import 'jcb-radial'


const ueList = ref([])
const subUEListDict = ref({})

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const subUEStudyProgressDict = ref({})

onMounted(async () => {
   ueList.value = await getUEList()
   for (const ue of ueList.value) {
      subUEListDict.value[ue.id] = await getSubUEList(ue.id)
      // for (const subUE of subUEListDict.value[ue.id]) {
      //    let count = 0
      //    let sum = 0
      //    const topicList = await getTopicList(subUE.id)
      //    for (const topic of topicList) {
      //       const courseList = await getCourseList(topic.id)
      //       for (const course of courseList) {
      //          const user_course = await getTheUserCourse(props.userid, course.id)
      //          sum += (user_course.done ? 100 : 0)
      //          count += 1
      //       }
      //    }
      //    subUEStudyProgressDict.value[subUE.id] = count === 0 ? 0 : Math.round(sum / count)
      // }
   }
})

const select = (ue, subUE) => {
   router.push(`/home/${props.userid}/study-sub-ue/${ue.id}/${subUE.id}`)
}
</script>