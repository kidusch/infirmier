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
            <label for="title">Titre</label>
            <div class="standard-input-container">
               <input placeholder="Titre..." type="text"
                  :value="quiz ? quiz.title : ''"
                  @input="debouncedInputTitle"
                  :disabled="disabledTitle"
               />
               <img src="/src/assets/edit.svg"  @click="disabledTitle = !disabledTitle">
               <div class="img-placeholder">
               </div>
            </div>
         </div>
         <div>
            <label for="title">Texte de la question</label>
            <div class="standard-input-container">
               <textarea placeholder="Question..." type="text" rows="50"
                  :value="quiz ? quiz.question : ''"
                  @input="debouncedInputQuestion"
                  :disabled="disabledQuestion"
               ></textarea>
               <img src="/src/assets/edit.svg"  @click="disabledQuestion = !disabledQuestion">
               <div class="img-placeholder"></div>
            </div>
         </div>

         <div class="flex flex-col gap-3">
            <label for="title">Choix possibles</label>

            <div class="flex flex-col gap-3">
               <div v-for="choice, index in quizChoiceList">
                  <ListItem
                     field="text"
                     :index="index" :list="quizChoiceList"
                     @update="updateChoiceList"
                     @remove="deleteChoice(choice.id)"
                     @select="selectChoice(choice.id)"
                  ></ListItem>
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
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopic } from '/src/use/useTopic'
import { getQuiz, updateQuiz } from '/src/use/useQuiz'
import { getQuizChoiceList, createQuizChoice, removeQuizChoice } from '/src/use/useQuizChoice'
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
   quiz_id: {
      type: Number,
      required: true
   },
})

const ue = ref()
const subUE = ref()
const topic = ref()
const quiz = ref()
const quizChoiceList = ref([])

onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topic.value = await getTopic(props.topic_id)
   quiz.value = await getQuiz(props.quiz_id)
   quizChoiceList.value = await getQuizChoiceList(props.quiz_id)
})

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
   await removeQuizChoice(id)
   await updateChoiceList()
}

const back = () => {
   router.back()
}

const preview = () => {
   console.log('preview')
}
</script>