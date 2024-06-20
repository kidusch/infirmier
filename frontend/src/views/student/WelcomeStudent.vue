<template>
   <div class="container max-w-lg py-4 flex flex-col">

      <header class="w-full flex justify-center">
         <img class="w-64 h-64" src="/src/assets/logo.png" alt="logo">
      </header>

      <section class="flex-1 flex flex-col">

         <section class="flex flex-col">
            <h1>
               Bienvenue dans le
               <span class="text-primary">
                  Journal de bord Infirmier
               </span>
            </h1>
         </section>

         <div class="flex flex-col mt-2">

            <div>{{ loadingProgress }}</div>

            <div class="justify-center flex my-8">
               <button class="primary-btn" @click="onClick">
                  Continuer
               </button>
            </div>

         </div>
      </section>
   </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { loadingProgress } from '/src/use/useProgress'
// import { getUEList } from '/src/use/useUE'
// import { getSubUEList } from '/src/use/useSubUE'
// import { getTopicList } from '/src/use/useTopic'
import { getUserCourseList } from '/src/use/useUserCourse'
import { getUserCardList } from '/src/use/useUserCard'
import { getUserQuizList } from '/src/use/useUserQuiz'
import { getUserCaseStudyList } from '/src/use/useUserCaseStudy'
import router from '/src/router'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

onMounted(async () => {
   console.log('starting...')
   await getUserCourseList(props.userid)
   await getUserCardList(props.userid)
   await getUserQuizList(props.userid)
   await getUserCaseStudyList(props.userid)
   console.log('...done')


   // const ueList = await getUEList()
   // for (const ue of ueList) {
   //    const subUEList = await getSubUEList(ue.id)
   //    for (const subUE of subUEList) {
   //       const topicList = await getTopicList(subUE.id)
   //       for (const topic of topicList) {
   //          const courseList = await getCourseList(topic.id)
   //          for (const course of courseList) {

   //          }
   //       }
   //    }
   // }
})

const onClick = () => {
   router.push(`/home/${props.userid}/study-ue`)
}
</script>
