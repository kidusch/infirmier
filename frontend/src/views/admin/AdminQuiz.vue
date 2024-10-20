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
            <router-link class="cursor-pointer hover:underline" :to="`/admin/admin-topic/${ue_id}/${sub_ue_id}/${topic_id}`">{{ topic?.name }}</router-link>
            /
            <span class="font-semibold">QCM</span>
         </p>
      </header>

      <main class="flex flex-col gap-3">
         <div>
            <div class="flex justify-between">
               <label for="title">Titre</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isTitleDisabled" @click="isTitleDisabled = !isTitleDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isTitleDisabled" @click="isTitleDisabled = !isTitleDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <input placeholder="Titre..." type="text"
                  :value="title"
                  @input="onTitleInputDebounced"
                  v-position="titlePosition"
                  :disabled="isTitleDisabled"
               />
            </div>
         </div>
         <div>
            <div class="flex justify-between">
               <label for="title">Texte de la question</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isQuestionDisabled" @click="isQuestionDisabled = !isQuestionDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isQuestionDisabled" @click="isQuestionDisabled = !isQuestionDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <textarea placeholder="Question..." type="text" class="h-32"
                  :value="question"
                  @input="onQuestionInputDebounced"
                  v-position="questionPosition"
                  :disabled="isQuestionDisabled"
               ></textarea>
            </div>
         </div>

         <div class="flex flex-col gap-3">
            <label for="title">Choix possibles</label>

            <div class="flex flex-col gap-3">
               <div v-for="choice, index in quizChoiceList">
                  <SortableListItem
                     field="text"
                     :index="index" :list="quizChoiceList"
                     @update="updateChoiceList"
                     @remove="deleteChoice(choice.id)"
                     @select="selectChoice(choice.id)"
                  ></SortableListItem>
               </div>

               <div class="flex gap-3 items-center">
                  <input v-model="newQuizChoiceTitle" class="standard-input flex-1" placeholder="Texte du nouveau choix" type="text">
                  <div class="flex gap-1.5" @click="addQuizChoice">
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
import { useDebounceFn } from '@vueuse/core'

import { ueOfId } from '/src/use/useUE'
import { subUEOfId } from '/src/use/useSubUE'
import { topicOfId } from '/src/use/useTopic'
import { quizOfId, updateQuiz } from '/src/use/useQuiz'
import { listOfQuizChoices, getQuizChoiceList, createQuizChoice, removeQuizChoice } from '/src/use/useQuizChoice'

import { app } from '/src/client-app.js'

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
   quiz_id: {
      type: Number,
      required: true
   },
})

const ue = computed(() => ueOfId.value(props.ue_id))
const subUE = computed(() => subUEOfId.value(props.sub_ue_id))
const topic = computed(() => topicOfId.value(props.topic_id))
const quiz = computed(() => quizOfId.value(props.quiz_id))
const quizChoiceList = computed(() => listOfQuizChoices.value(props.quiz_id))

// handle title editing
const localTitle = ref()
const title = computed(() => localTitle.value || quiz.value.title)
app.service('quiz').on('update', quiz => {
   localTitle.value = quiz.title
})
const titlePosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onTitleInput = async (ev) => {
   localTitle.value = ev.target.value
   titlePosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateQuiz(props.quiz_id, { title: ev.target.value })
}
const onTitleInputDebounced = useDebounceFn(onTitleInput, 500)
const isTitleDisabled = ref(true)

// handle question editing
const localQuestion = ref()
const question = computed(() => localQuestion.value || quiz.value.question)
app.service('quiz').on('update', quiz => {
   localQuestion.value = quiz.question
})
const questionPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onQuestionInput = async (ev) => {
   localQuestion.value = ev.target.value
   questionPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateQuiz(props.quiz_id, { question: ev.target.value })
}
const onQuestionInputDebounced = useDebounceFn(onQuestionInput, 500)
const isQuestionDisabled = ref(true)

// custom directive (v-position on <input> or <textarea>) which restores cursor position
   const vPosition = {
   updated: (el, binding) => {
      // binding.value is the directive argument, here the cursor position ref { start, end }
      el.selectionStart, el.selectionEnd = binding.value.start, binding.value.end
   }
}

const selectChoice = (quiz_choice_id) => {
   router.push(`/admin/admin-quiz-choice/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${props.quiz_id}/${quiz_choice_id}`)
}

const newQuizChoiceTitle = ref('')

const addQuizChoice = async () => {
   await createQuizChoice(props.quiz_id, newQuizChoiceTitle.value)
   newQuizChoiceTitle.value = ''
}

const deleteChoice = async (id) => {
   if (window.confirm("Supprimer ?")) {
      await removeQuizChoice(id)
   }
}
</script>