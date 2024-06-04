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
            <h2 class="font-semibold">
               {{ ue.name }}
            </h2>
            <div class="progress-list">
               <template v-for="subUE in subUEListDict[ue.id]">
                  <div v-if="!subUE.hidden" class="progress-item cursor-pointer" @click="select(ue, subUE)">
                     <!-- <img src="/src/assets/progress-bar-0.svg"> -->
                     <div class="w-14 h-14">
                        <!-- <jcb-radial :value="subUEProgressDict[subUE.id]"></jcb-radial> -->
                        <jcb-radial :value="subUEProgress(userid, subUE.id)"></jcb-radial>
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
import { subUEProgress } from '/src/use/useProgress'
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

const subUEProgressDict = ref({})

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
      //    subUEProgressDict.value[subUE.id] = count === 0 ? 0 : Math.round(sum / count)
      // }
   }
})

const select = (ue, subUE) => {
   router.push(`/home/${props.userid}/study-sub-ue/${ue.id}/${subUE.id}`)
}
</script>