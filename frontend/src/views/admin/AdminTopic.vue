<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-ue`">Unités d'enseignement</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-sub-ue/${ue_id}`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-topics/${ue_id}/${sub_ue_id}`">{{ subUE?.name }}</router-link>
            /
            <span class="font-semibold">{{ topic?.name }}</span>
         </p>
      </header>

      <!-- Header -->
      <header class="py-4">
         <div class="flex sm:items-center items-start gap-1.5">
            <h3 class="">
               {{ topic?.name }}
            </h3>
         </div>
      </header>

      <main class="flex flex-col gap-6 pb-4">

         <div class="flex justify-between items-center bg-accent py-2 px-4 rounded-xl">
            <h4 class="text-primary">
               Cours
            </h4>
            <img class="h-4" src="/src/assets/thick-arrow-right.svg" alt="arrow">
         </div>

         <div class="flex flex-col gap-3">

            <div>
               <label for="title">Fiches</label>

               <div class="flex flex-col gap-3">
                  <div v-for="card, index in cardList">
                     <ListItem
                        :index="index" :list="cardList"
                        @update="(e1, e2) => updateCards(e1, e2)"
                        @remove="deleteCard(card.id)"
                        @select="selectCard(card.id)"
                     ></ListItem>
                  </div>

                  <div>
                     <div class="flex gap-3 items-center">
                        <input v-model="newCardTitle" class="standard-input flex-1" placeholder="Titre nouvelle fiche" type="text">
                        <div class="flex gap-1.5" @click="addCard">
                           <img class="h-4 cursor-pointer" src="/src/assets/add.svg" alt="delete">
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <!-- <button class="primary-btn w-max text-base px-6">Ajouter une fiche</button> -->

         </div>

         <div class="flex flex-col gap-3">

            <div>
               <label for="title">QCM</label>
               <div class="flex gap-3 items-center">
                     <input class="standard-input flex-1" placeholder="Type des cellules" type="text">
                     <div class="flex gap-1.5">
                        <img class="h-4 cursor-pointer" src="/src/assets/delete.svg" alt="delete">
                        <img class="h-4 cursor-pointer" src="/src/assets/thick-arrow-right.svg" alt="arrow">
                     </div>
               </div>
            </div>

            <div>
               <div class="flex gap-3 items-center">
                     <input class="standard-input flex-1" placeholder="....." type="text">
                     <div class="flex gap-1.5">
                        <img class="h-4 cursor-pointer" src="/src/assets/delete.svg" alt="delete">
                        <img class="h-4 cursor-pointer" src="/src/assets/thick-arrow-right.svg" alt="arrow">
                     </div>
               </div>
            </div>

            <button class="primary-btn w-max text-base px-6">Ajouter un QCM</button>

         </div>

         <div class="flex flex-col gap-3">

            <div>
               <label for="title">Etudes de cas</label>
               <div class="flex gap-3 items-center">
                     <input class="standard-input flex-1" placeholder="Étude #1" type="text">
                     <div class="flex gap-1.5">
                        <img class="h-4 cursor-pointer" src="/src/assets/delete.svg" alt="delete">
                        <img class="h-4 cursor-pointer" src="/src/assets/thick-arrow-right.svg" alt="arrow">
                     </div>
               </div>
            </div>

            <div>
               <div class="flex gap-3 items-center">
                     <input class="standard-input flex-1" placeholder="Étude #2" type="text">
                     <div class="flex gap-1.5">
                        <img class="h-4 cursor-pointer" src="/src/assets/delete.svg" alt="delete">
                        <img class="h-4 cursor-pointer" src="/src/assets/thick-arrow-right.svg" alt="arrow">
                     </div>
               </div>
            </div>

            <div>
               <div class="flex gap-3 items-center">
                     <input class="standard-input flex-1" placeholder="....." type="text">
                     <div class="flex gap-1.5">
                        <img class="h-4 cursor-pointer" src="/src/assets/add.svg" alt="delete">
                     </div>
               </div>
            </div>

         </div>

      </main>

   </main>


   <div class="link m-2" @click="back">back</div>

   <h1 class="text-xl font-semibold">{{ topic && topic.name }}</h1>

   <div>
      <p class="inline">Cours</p>
      <span class="link m-2" @click="adminCourse">select</span>
   </div>

   <hr/>

   <h1 class="text-xl font-semibold">Fiches de révision</h1>
   <ul v-for="card, index in cardList">
      <ListItem
         :index="index" :list="cardList"
         @update="(e1, e2) => updateCards(e1, e2)"
         @remove="deleteCard(card.id)"
         @select="selectCard(card.id)"
      ></ListItem>
   </ul>
   <button class="btn btn-primary" @click="addCard">Ajouter une fiche</button>


   <h1 class="text-xl font-semibold">Quiz</h1>
   <ul v-for="quiz, index in quizList">
      <ListItem
         :index="index" :list="quizList"
         @update="(e1, e2) => updateQuizs(e1, e2)"
         @remove="deleteQuiz(quiz.id)"
         @select="selectQuiz(quiz.id)"
      ></ListItem>
   </ul>
   <button class="btn btn-primary" @click="addQuiz">Ajouter un Quiz</button>


   <h1 class="text-xl font-semibold">Études de cas</h1>
   <ul v-for="caseStudy, index in caseStudyList">
      <ListItem
         :index="index" :list="caseStudyList"
         @update="(e1, e2) => updateCaseStudies(e1, e2)"
         @remove="deleteCaseStudy(caseStudy.id)"
         @select="selectCaseStudy(caseStudy.id)"
      ></ListItem>
   </ul>
   <button class="btn btn-primary" @click="addCaseStudy">Ajouter une étude de cas</button>

</template>

<script setup>
import { ref, onMounted } from 'vue'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopic } from '/src/use/useTopic'
import { getCardList, createCard, updateCard, removeCard } from '/src/use/useCard'
import { getQuizList, createQuiz, updateQuiz, removeQuiz } from '/src/use/useQuiz'
import { getCaseStudyList, createCaseStudy, updateCaseStudy, removeCaseStudy } from '/src/use/useCaseStudy'
import router from '/src/router'

import ListItem from '/src/components/ListItem.vue'

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
const cardList = ref([])
const newCardTitle = ref('')
const quizList = ref([])
const caseStudyList = ref([])

onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topic.value = await getTopic(props.topic_id)
   await updateCardList()
   await updateQuizList()
   await updateCaseStudyList()
})

const adminCourse = () => {
   router.push(`/home/${props.userid}/admin-course/${props.topic_id}`)
}

async function updateCardList() {
   cardList.value= await getCardList(props.topic_id)
}

async function updateCards(e1, e2) {
   await updateCard(e1.id, { rank: e1.rank })
   await updateCard(e2.id, { rank: e2.rank })
   updateCardList()
}

const selectCard = (card_id) => {
   router.push(`/home/${props.userid}/admin-card/${props.topic_id}/${card_id}`)
}

const addCard = async () => {
   await createCard(props.topic_id, newCardTitle.value)
   await updateCardList()
}

const deleteCard = async (id) => {
   await removeCard(id)
   await updateCardList()
}


async function updateQuizList() {
   quizList.value = await getQuizList(props.topic_id)
}

async function updateQuizs(e1, e2) {
   await updateQuiz(e1.id, { rank: e1.rank })
   await updateQuiz(e2.id, { rank: e2.rank })
   updateQuizList()
}

const selectQuiz = (quiz_id) => {
   router.push(`/home/${props.userid}/admin-quiz/${props.topic_id}/${quiz_id}`)
}

const addQuiz = async () => {
   const quiz = await createQuiz(props.topic_id)
   await updateQuizList()
   selectQuiz(quiz.id)
}

const deleteQuiz = async (id) => {
   await removeQuiz(id)
   await updateQuizList()
}


async function updateCaseStudyList() {
   caseStudyList.value = await getCaseStudyList(props.topic_id)
}

async function updateCaseStudies(e1, e2) {
   await updateCaseStudy(e1.id, { rank: e1.rank })
   await updateCaseStudy(e2.id, { rank: e2.rank })
   updateCaseStudyList()
}

const selectCaseStudy = (case_study_id) => {
   router.push(`/home/${props.userid}/admin-case-study/${props.topic_id}/${case_study_id}`)
}

const addCaseStudy = async () => {
   const caseStudy = await createCaseStudy(props.topic_id)
   await updateCaseStudyList()
   selectCaseStudy(caseStudy.id)
}

const deleteCaseStudy = async (id) => {
   await removeCaseStudy(id)
   await updateCaseStudyList()
}

const back = () => {
   router.back()
}
</script>
