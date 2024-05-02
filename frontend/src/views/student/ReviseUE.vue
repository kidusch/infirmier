<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="py-4">
         <h3 class="lg:opacity-50">
            Révisions des cours
         </h3>
      </header>

      <!-- Main content -> courses list -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl" v-for="ue in ueList">
            <h2 class="font-semibold">
               {{ ue.name }}
            </h2>
            <div class="progress-list">
               <template v-for="subUE in subUEListDict[ue.id]">
                  <div class="progress-item cursor-pointer" @click="select(ue, subUE)">
                     <!-- <img src="/src/assets/progress-bar-0.svg"> -->
                     <div class="w-14">
                        <jcb-radial :value="subUEProgressDict[subUE.id]"></jcb-radial>
                     </div>
                     <p>
                        {{ subUE.name }}
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

import { getUEList } from '/src/use/useUE'
import { getSubUEList } from '/src/use/useSubUE'
import { getTopicList } from '/src/use/useTopic'
import { getCardList } from '/src/use/useCard'
import { getQuizList } from '/src/use/useQuiz'
import { getCaseStudyList } from '/src/use/useCaseStudy'
import { getTheUserCard } from '/src/use/useUserCard'
import { getTheUserQuiz } from '/src/use/useUserQuiz'
import { getTheUserCaseStudy } from '/src/use/useUserCaseStudy'
import router from "/src/router"

import 'jcb-radial'


const ueList = ref([])
const subUEListDict = ref({})
const subUEProgressDict = ref({})

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
      for (const subUE of subUEListDict.value[ue.id]) {
         let count = 0
         let sum = 0
         const topicList = await getTopicList(subUE.id)
         for (const topic of topicList) {
            const cardList = await getCardList(topic.id)
            const quizList = await getQuizList(topic.id)
            const caseStudyList = await getCaseStudyList(topic.id)
            for (const card of cardList) {
               const userCard = await getTheUserCard(props.userid, card.id)
               count += 1
               sum += (userCard.done ? 100 : 0)
            }
            for (const quiz of quizList) {
               const userQuiz = await getTheUserQuiz(props.userid, quiz.id)
               count += 1
               sum += (userQuiz.done ? 1 : 0)
            }
            for (const caseStudy of caseStudyList) {
               const userCaseStudy = await getTheUserCaseStudy(props.userid, caseStudy.id)
               count += 1
               sum += (userCaseStudy.done ? 1 : 0)
            }
         }
         subUEProgressDict.value[subUE.id] = count === 0 ? 0 : Math.round(sum / count)
      }
   }
})

const select = (ue, subUE) => {
   router.push(`/home/${props.userid}/revise-sub-ue/${ue.id}/${subUE.id}`)
}
</script>