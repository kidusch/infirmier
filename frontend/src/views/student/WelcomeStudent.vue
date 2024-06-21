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
import { getUEList } from '/src/use/useUE'
import { getAllSubUE } from '/src/use/useSubUE'
import { getAllTopic } from '/src/use/useTopic'
import { getAllCourse } from '/src/use/useCourse'
import { getAllCard } from '/src/use/useCard'
import { getAllQuiz } from '/src/use/useQuiz'
import { getAllCaseStudy } from '/src/use/useCaseStudy'
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

   await getUserCourseList(props.userid)
   await getUserCardList(props.userid)
   await getUserQuizList(props.userid)
   await getUserCaseStudyList(props.userid)


   await getUEList()
   await getAllSubUE()
   await getAllTopic()
   await getAllCourse()
   await getAllCard()
   await getAllQuiz()
   await getAllCaseStudy()
})

const onClick = () => {
   router.push(`/home/${props.userid}/study-ue`)
}
</script>
