<template>
   <main class="container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card mb-2">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/admin/admin-ue`">Unités d'enseignement</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/admin/admin-sub-ue/${ue_id}`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/admin/admin-topics/${ue_id}/${sub_ue_id}`">{{ subUE?.name }}</router-link>
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

         <div class="flex flex-col gap-3">
            <label for="title">Cours</label>

            <div class="flex flex-col gap-3">
               <div v-for="course, index in listOfCourse(topic_id)">
                  <SortableListItem
                     :index="index" :list="listOfCourse(topic_id)"
                     @update="(e1, e2) => updateCourses(e1, e2)"
                     @remove="deleteCourse(course)"
                     @select="selectCourse(course.id)"
                     @show="setCourseHidden(course.id, false)"
                     @hide="setCourseHidden(course.id, true)"
                  ></SortableListItem>
               </div>

               <div class="flex gap-3 items-center">
                  <input v-model="newCourseTitle" class="standard-input flex-1" placeholder="Titre nouveau cours" type="text">
                  <div class="flex gap-1.5" @click="addCourse">
                     <img class="h-4 cursor-pointer" src="/src/assets/add.svg" alt="delete">
                  </div>
               </div>
            </div>
         </div>

         <div class="flex flex-col gap-3">
            <label for="title">Fiches</label>

            <div class="flex flex-col gap-3">
               <div v-for="card, index in listOfCard(topic_id)">
                  <SortableListItem
                     :index="index" :list="listOfCard(topic_id)"
                     @update="(e1, e2) => updateCards(e1, e2)"
                     @remove="deleteCard(card)"
                     @select="selectCard(card.id)"
                     @show="setCardHidden(card.id, false)"
                     @hide="setCardHidden(card.id, true)"
                  ></SortableListItem>
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
               <div v-for="quiz, index in listOfQuiz(topic_id)">
                  <SortableListItem
                     :index="index" :list="listOfQuiz(topic_id)"
                     @update="(e1, e2) => updateQuizs(e1, e2)"
                     @remove="deleteQuiz(quiz)"
                     @select="selectQuiz(quiz.id)"
                     @show="setQuizHidden(quiz.id, false)"
                     @hide="setQuizHidden(quiz.id, true)"
                  ></SortableListItem>
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
               <div v-for="caseStudy, index in listOfCaseStudy(topic_id)">
                  <SortableListItem
                     :index="index" :list="listOfCaseStudy(topic_id)"
                     @update="(e1, e2) => updateCaseStudies(e1, e2)"
                     @remove="deleteCaseStudy(caseStudy)"
                     @select="selectCaseStudy(caseStudy.id)"
                     @show="setCaseStudyHidden(caseStudy.id, false)"
                     @hide="setCaseStudyHidden(caseStudy.id, true)"
                  ></SortableListItem>
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
import { ref, computed } from 'vue'

import { ueOfId } from '/src/use/useUE'
import { subUEOfId } from '/src/use/useSubUE'
import { topicOfId } from '/src/use/useTopic'
import { listOfCourse, createCourse, updateCourse, removeCourse } from '/src/use/useCourse'
import { listOfCard, createCard, updateCard, removeCard } from '/src/use/useCard'
import { listOfQuiz, createQuiz, updateQuiz, removeQuiz } from '/src/use/useQuiz'
import { listOfCaseStudy, createCaseStudy, updateCaseStudy, removeCaseStudy } from '/src/use/useCaseStudy'
import router from '/src/router'

import SortableListItem from '/src/components/SortableListItem.vue'

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

const ue = computed(() => ueOfId.value(props.ue_id))
const subUE = computed(() => subUEOfId.value(props.sub_ue_id))
const topic = computed(() => topicOfId.value(props.topic_id))

const newCourseTitle = ref('')
const newCardTitle = ref('')
const newQuizTitle = ref('')
const newCaseStudyTitle = ref('')


async function updateCourses(e1, e2) {
   await updateCourse(e1.id, { rank: e1.rank })
   await updateCourse(e2.id, { rank: e2.rank })
}

const selectCourse = (course_id) => {
   router.push(`/admin/admin-course/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${course_id}`)
}

const addCourse = async () => {
   await createCourse(props.topic_id, newCourseTitle.value)
   newCourseTitle.value = ''
}

const deleteCourse = async (course) => {
   if (window.confirm(`Supprimer "${course.title}" ?`)) {
      await removeCourse(course.id)
   }
}

const setCourseHidden = async (id, hidden) => {
   await updateCourse(id, { hidden })
}


async function updateCards(e1, e2) {
   await updateCard(e1.id, { rank: e1.rank })
   await updateCard(e2.id, { rank: e2.rank })
}

const selectCard = (card_id) => {
   router.push(`/admin/admin-card/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${card_id}`)
}

const addCard = async () => {
   await createCard(props.topic_id, newCardTitle.value)
   newCardTitle.value = ''
}

const deleteCard = async (card) => {
   if (window.confirm(`Supprimer "${card.title}" ?`)) {
      await removeCard(card.id)
   }
}

const setCardHidden = async (id, hidden) => {
   await updateCard(id, { hidden })
}


async function updateQuizs(e1, e2) {
   await updateQuiz(e1.id, { rank: e1.rank })
   await updateQuiz(e2.id, { rank: e2.rank })
}

const selectQuiz = (quiz_id) => {
   router.push(`/admin/admin-quiz/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${quiz_id}`)
}

const addQuiz = async () => {
   await createQuiz(props.topic_id, newQuizTitle.value)
   newQuizTitle.value = ''
}

const deleteQuiz = async (quiz) => {
   if (window.confirm(`Supprimer "${quiz.title}" ?`)) {
      await removeQuiz(quiz.id)
   }
}

const setQuizHidden = async (id, hidden) => {
   await updateQuiz(id, { hidden })
}


async function updateCaseStudies(e1, e2) {
   await updateCaseStudy(e1.id, { rank: e1.rank })
   await updateCaseStudy(e2.id, { rank: e2.rank })
}

const selectCaseStudy = (case_study_id) => {
   router.push(`/admin/admin-case-study/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${case_study_id}`)
}

const addCaseStudy = async () => {
   await createCaseStudy(props.topic_id, newCaseStudyTitle.value)
   await updateCaseStudyList()
   newCaseStudyTitle.value = ''
}

const deleteCaseStudy = async (caseStudy) => {
   if (window.confirm(`Supprimer "${caseStudy.title}" ?`)) {
      await removeCaseStudy(caseStudy.id)
   }
}

const setCaseStudyHidden = async (id, hidden) => {
   await updateCaseStudy(id, { hidden })
}
</script>
