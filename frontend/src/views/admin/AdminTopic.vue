<template>
   <h1 class="text-xl font-semibold">{{ topic && topic.name }}</h1>

   <div class="link m-2" @click="back">back</div>

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

import { getTopic } from '/src/use/useTopic'
import { getCardList, createCard, updateCard, removeCard } from '/src/use/useCard'
import { getQuizList, createQuiz, updateQuiz, removeQuiz } from '/src/use/useQuiz'
import { getCaseStudyList, createCaseStudy, updateCaseStudy, removeCaseStudy } from '/src/use/useCaseStudy'
import { getAuthenticatedUser } from '/src/use/useAuthentication'
import router from '/src/router'

import ListItem from '/src/components/ListItem.vue'

const props = defineProps({
   topic_id: {
      type: Number,
      required: true
   },
})

const topic = ref()
const cardList = ref([])
const quizList = ref([])
const caseStudyList = ref([])

onMounted(async () => {
   topic.value = await getTopic(props.topic_id)
   await updateCardList()
   await updateQuizList()
   await updateCaseStudyList()
})

const adminCourse = () => {
   router.push(`/home/${getAuthenticatedUser().id}/admin-course/${props.topic_id}`)
}

async function updateCardList() {
   const unorderedList = await getCardList(props.topic_id)
   cardList.value = unorderedList.sort((e1, e2) => e1.rank - e2.rank)
}

async function updateCards(e1, e2) {
   await updateCard(e1.id, { rank: e1.rank })
   await updateCard(e2.id, { rank: e2.rank })
   updateCardList()
}

const selectCard = (card_id) => {
   router.push(`/home/${getAuthenticatedUser().id}/admin-card/${props.topic_id}/${card_id}`)
}

const addCard = async () => {
   const card = await createCard(props.topic_id)
   await updateCardList()
   selectCard(card.id)
}

const deleteCard = async (id) => {
   await removeCard(id)
   await updateCardList()
}


async function updateQuizList() {
   const unorderedList = await getQuizList(props.topic_id)
   quizList.value = unorderedList.sort((e1, e2) => e1.rank - e2.rank)
}

async function updateQuizs(e1, e2) {
   await updateQuiz(e1.id, { rank: e1.rank })
   await updateQuiz(e2.id, { rank: e2.rank })
   updateQuizList()
}

const selectQuiz = (quiz_id) => {
   router.push(`/home/${getAuthenticatedUser().id}/admin-quiz/${props.topic_id}/${quiz_id}`)
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
   const unorderedList = await getCaseStudyList(props.topic_id)
   caseStudyList.value = unorderedList.sort((e1, e2) => e1.rank - e2.rank)
}

async function updateCaseStudies(e1, e2) {
   await updateCaseStudy(e1.id, { rank: e1.rank })
   await updateCaseStudy(e2.id, { rank: e2.rank })
   updateCaseStudyList()
}

const selectCaseStudy = (case_study_id) => {
   router.push(`/home/${getAuthenticatedUser().id}/admin-case-study/${props.topic_id}/${case_study_id}`)
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
