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
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-topic/${ue_id}/${sub_ue_id}/${topic_id}`">{{ topic?.name }}</router-link>
            /
            <span class="font-semibold">QCM</span>
         </p>
      </header>

      <main class="flex flex-col gap-3">
         <div>
            <div class="flex justify-between">
               <label for="title">Titre</label>
               <img class="h-5 mb-1" src="/src/assets/edit.svg"  @click="disabledTitle = !disabledTitle">
            </div>
            <div class="standard-input-container">
               <input placeholder="Titre..." type="text"
                  :value="quiz ? quiz.title : ''"
                  @input="debouncedInputTitle"
                  :disabled="disabledTitle"
               />
            </div>
         </div>
         <div>
            <div class="flex justify-between">
               <label for="title">Texte de la question</label>
               <div class="flex gap-2">
                  <img class="h-5 mb-1" src="/src/assets/edit.svg" @click="disabledQuestion = !disabledQuestion">
               </div>
            </div>
            <div class="standard-input-container">
               <textarea placeholder="Question..." type="text"
                  :value="quiz ? quiz.question : ''"
                  @input="debouncedInputQuestion"
                  :disabled="disabledQuestion"
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
import { listOfQuizChoices, createQuizChoice, removeQuizChoice } from '/src/use/useQuizChoice'
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

const onInputTitle = async (ev) => {
   await updateQuiz(props.quiz_id, { title: ev.target.value })
}
const debouncedInputTitle = useDebounceFn(onInputTitle, 500)

const disabledTitle = ref(true)

const onInputQuestion = async (ev) => {
   await updateQuiz(props.quiz_id, { question: ev.target.value })
}
const debouncedInputQuestion = useDebounceFn(onInputQuestion, 500)

const disabledQuestion = ref(true)

async function updateChoiceList() {
   quizChoiceList.value = await getQuizChoiceList(props.quiz_id)
}

const selectChoice = (quiz_choice_id) => {
   router.push(`/home/${props.userid}/admin-quiz-choice/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${props.quiz_id}/${quiz_choice_id}`)
}

const newQuizChoiceTitle = ref('')

const addQuizChoice = async () => {
   await createQuizChoice(props.quiz_id, newQuizChoiceTitle.value)
   await updateChoiceList()
   newQuizChoiceTitle.value = ''
}

const deleteChoice = async (id) => {
   if (window.confirm("Supprimer ?")) {
      await removeQuizChoice(id)
      await updateChoiceList()
   }
}
</script>