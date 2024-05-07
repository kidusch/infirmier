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
      <header class="py-2">
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
            <img class="h-4" src="/src/assets/thick-arrow-right.svg" @click="adminCourse">
         </div>

         <div class="flex flex-col gap-3">
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

               <div class="flex gap-3 items-center">
                  <input v-model="newCardTitle" class="standard-input flex-1" placeholder="Titre nouvelle fiche" type="text">
                  <div class="flex gap-1.5" @click="addCard">
                     <img class="h-4 cursor-pointer" src="/src/assets/add.svg" alt="delete">
                  </div>
               </div>
            </div>
         </div>

         <div class="flex flex-col gap-3">
            <label for="title">QCM</label>

            <div class="flex flex-col gap-3">
               <div v-for="quiz, index in quizList">
                  <ListItem
                     :index="index" :list="quizList"
                     @update="(e1, e2) => updateQuizs(e1, e2)"
                     @remove="deleteQuiz(quiz.id)"
                     @select="selectQuiz(quiz.id)"
                  ></ListItem>
               </div>

               <div class="flex gap-3 items-center">
                  <input v-model="newQuizTitle" class="standard-input flex-1" placeholder="Titre nouveau QCM" type="text">
                  <div class="flex gap-1.5" @click="addQuiz">
                     <img class="h-4 cursor-pointer" src="/src/assets/add.svg" alt="delete">
                  </div>
               </div>
            </div>
         </div>

         <div class="flex flex-col gap-3">
            <label for="title">Cas d'étude</label>

            <div class="flex flex-col gap-3">
               <div v-for="caseStudy, index in caseStudyList">
                  <ListItem
                     :index="index" :list="caseStudyList"
                     @update="(e1, e2) => updateCaseStudies(e1, e2)"
                     @remove="deleteCaseStudy(caseStudy.id)"
                     @select="selectCaseStudy(caseStudy.id)"
                  ></ListItem>
               </div>

               <div class="flex gap-3 items-center">
                  <input v-model="newCaseStudyTitle" class="standard-input flex-1" placeholder="Titre nouveau cas d'étude" type="text">
                  <div class="flex gap-1.5" @click="addCaseStudy">
                     <img class="h-4 cursor-pointer" src="/src/assets/add.svg" alt="delete">
                  </div>
               </div>
            </div>
         </div>

      </main>

   </main>

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
const newQuizTitle = ref('')
const caseStudyList = ref([])
const newCaseStudyTitle = ref('')

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
   newCardTitle.value = ''
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
   await createQuiz(props.topic_id, newQuizTitle.value)
   await updateQuizList()
   newQuizTitle.value = ''
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
   await createCaseStudy(props.topic_id, newCaseStudyTitle.value)
   await updateCaseStudyList()
   newCaseStudyTitle.value = ''
}

const deleteCaseStudy = async (id) => {
   await removeCaseStudy(id)
   await updateCaseStudyList()
}

const back = () => {
   router.back()
}
</script>
