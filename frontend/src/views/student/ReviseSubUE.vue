<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-ue`">RÉVISIONS</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-ue`">{{ ue?.name }}</router-link>
            /
            <span class="font-semibold">{{ subUE?.name }}</span>
         </p>
      </header>

      <!-- Header -->
      <header class="py-2">
         <h3 class="opacity-50 flex items-center gap-2.5">
            <div class="ml-2 mt-3 w-14">
               <jcb-radial class="w-14" :value="subUEReviseProgress(userid, sub_ue_id)"></jcb-radial>
            </div>
            {{ subUE?.name }}
         </h3>
      </header>

      <!-- Main content -> courses list -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
            <div class="progress-list">
               <template v-for="topic in topicList">
                  <div v-if="!topic.hidden" class="progress-item cursor-pointer" @click="selectTopic(topic)">
                     <div class="w-12">
                        <jcb-radial class="w-12" :value="topicReviseProgress(userid, topic.id)"></jcb-radial>
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
// import { getCardList } from '/src/use/useCard'
// import { getQuizList } from '/src/use/useQuiz'
// import { getCaseStudyList } from '/src/use/useCaseStudy'
// import { getTheUserCard } from '/src/use/useUserCard'
// import { getTheUserQuiz } from '/src/use/useUserQuiz'
// import { getTheUserCaseStudy } from '/src/use/useUserCaseStudy'
import { topicReviseProgress, subUEReviseProgress } from '/src/use/useProgress'
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
// const topicStudyProgressDict = ref({})
const progress = ref(0)

onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topicList.value = await getTopicList(props.sub_ue_id)
   // let totalSum = 0
   // let totalCount = 0
   // for (const topic of topicList.value) {
   //    let count = 0
   //    let sum = 0
   //    const cardList = await getCardList(topic.id)
   //    const quizList = await getQuizList(topic.id)
   //    const caseStudyList = await getCaseStudyList(topic.id)
   //    for (const card of cardList) {
   //       const userCard = await getTheUserCard(props.userid, card.id)
   //       count += 1
   //       sum += (userCard.done ? 100 : 0)
   //    }
   //    for (const quiz of quizList) {
   //       const userQuiz = await getTheUserQuiz(props.userid, quiz.id)
   //       count += 1
   //       sum += (userQuiz.done ? 100 : 0)
   //    }
   //    for (const caseStudy of caseStudyList) {
   //       const userCaseStudy = await getTheUserCaseStudy(props.userid, caseStudy.id)
   //       count += 1
   //       sum += (userCaseStudy.done ? 100 : 0)
   //    }
   //    const percentage = count === 0 ? 0 : Math.round(sum / count)
   //    topicStudyProgressDict.value[topic.id] = percentage
   //    totalSum += percentage
   //    totalCount += 1
   // }
   // progress.value = totalCount === 0 ? 0 : Math.round(totalSum / totalCount)
})

const selectTopic = (topic) => {
   router.push(`/home/${props.userid}/revise-topic/${props.ue_id}/${props.sub_ue_id}/${topic.id}`)
}
</script>