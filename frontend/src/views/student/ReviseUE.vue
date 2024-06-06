<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <span>RÉVISIONS</span>
         </p>
      </header>

      <!-- Main content -> courses list -->
      <main class="flex flex-col gap-6 pb-6">
         
         <template v-for="ue in ueList">
            <div v-if="!ue.hidden" class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
               <!-- <h2 class="font-semibold">
                  {{ ue.name }}
               </h2> -->
               <h3 class="font-semibold flex items-center gap-2.5">
                  <div class="ml-2 mt-3 w-14">
                     <jcb-radial class="w-14" :value="ueReviseProgress(userid, ue?.id)"></jcb-radial>
                  </div>
                  {{ ue?.name }}
               </h3>

               <div class="progress-list">
                  <template v-for="subUE in subUEListDict[ue.id]">
                     <div v-if="!subUE.hidden" class="progress-item cursor-pointer" @click="select(ue, subUE)">
                        <div class="w-12">
                           <jcb-radial class="w-12" :value="subUEReviseProgress(userid, subUE.id)"></jcb-radial>
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
// import { getTopicList } from '/src/use/useTopic'
// import { getCardList } from '/src/use/useCard'
// import { getQuizList } from '/src/use/useQuiz'
// import { getCaseStudyList } from '/src/use/useCaseStudy'
// import { getTheUserCard } from '/src/use/useUserCard'
// import { getTheUserQuiz } from '/src/use/useUserQuiz'
// import { getTheUserCaseStudy } from '/src/use/useUserCaseStudy'
import { subUEReviseProgress, ueReviseProgress } from '/src/use/useProgress'
import router from "/src/router"

// import 'jcb-radial'


const ueList = ref([])
const subUEListDict = ref({})
// const subUEStudyProgressDict = ref({})

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

onMounted(async () => {
   ueList.value = await getUEList()
   for (const ue of ueList.value) {
      subUEListDict.value[ue.id] = await getSubUEList(ue.id)
      // for (const subUE of subUEListDict.value[ue.id]) {
      //    let totalSum = 0
      //    let totalCount = 0
      //    const topicList = await getTopicList(subUE.id)
      //    for (const topic of topicList) {
      //       let count = 0
      //       let sum = 0
      //       const cardList = await getCardList(topic.id)
      //       const quizList = await getQuizList(topic.id)
      //       const caseStudyList = await getCaseStudyList(topic.id)
      //       for (const card of cardList) {
      //          const userCard = await getTheUserCard(props.userid, card.id)
      //          count += 1
      //          sum += (userCard.done ? 100 : 0)
      //       }
      //       for (const quiz of quizList) {
      //          const userQuiz = await getTheUserQuiz(props.userid, quiz.id)
      //          count += 1
      //          sum += (userQuiz.done ? 100 : 0)
      //       }
      //       for (const caseStudy of caseStudyList) {
      //          const userCaseStudy = await getTheUserCaseStudy(props.userid, caseStudy.id)
      //          count += 1
      //          sum += (userCaseStudy.done ? 100 : 0)
      //       }
      //       const percentage = count === 0 ? 0 : Math.round(sum / count)
      //       totalSum += percentage
      //       totalCount += 1
      //    }
      //    subUEStudyProgressDict.value[subUE.id] = totalCount === 0 ? 0 : Math.round(totalSum / totalCount)
      // }
   }
})

const select = (ue, subUE) => {
   router.push(`/home/${props.userid}/revise-sub-ue/${ue.id}/${subUE.id}`)
}
</script>