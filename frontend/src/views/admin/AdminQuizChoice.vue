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

   </main>



   <div class="link m-2" @click="back">back</div>

   <h1 class="text-xl font-semibold">{{ topic && topic.name }}</h1>

   <h1 class="text-gray-500">QCM</h1>

   <h1 class="text-lg">{{ quiz && quiz.title }}</h1>

   <h1 class="font-semibold">{{ quiz && quiz.question }}</h1>

   <h1 class="text-lg font-semibold">{{ quizChoice && quizChoice.title }}</h1>

   <div>
      <h1 class="text-xl font-semibold">Texte du choix</h1>
      <textarea placeholder="Texte"
         :value="quizChoice ? quizChoice.text : ''"
         @input="debouncedInputText" class="textarea textarea-bordered"
         :disabled="disabledText"
      ></textarea>
      <span class="link m-2" @click="disabledText = !disabledText">edit</span>
   </div>

   <div>
      <h1 class="text-xl font-semibold">Bonne réponse</h1>
      <label class="label cursor-pointer w-32">
         <span class="label-text">Oui</span> 
         <input type="checkbox" :checked="quizChoice && quizChoice.answer === true" @click="answerIs(true)" class="checkbox checkbox-primary" />
      </label>
      <label class="label cursor-pointer w-32">
         <span class="label-text">Non</span> 
         <input type="checkbox" :checked="quizChoice && quizChoice.answer === false" @click="answerIs(false)" class="checkbox checkbox-primary" />
      </label>
   </div>

   <div>
      <h1 class="text-xl font-semibold">Commentaire en cas d'erreur</h1>
      <textarea placeholder="Texte"
         :value="quizChoice ? quizChoice.comment : ''"
         @input="debouncedInputComment" class="textarea textarea-bordered"
         :disabled="disabledComment"
      ></textarea>
      <span class="link m-2" @click="disabledComment = !disabledComment">edit</span>
   </div>

   <label class="form-control w-full max-w-xs">
      <div class="label">
         <span class="label-text">Points positifs</span>
      </div>
      <input type="number" :value="quizChoice && quizChoice.positive_points" @change="updatePositivePoints" class="input input-bordered w-full max-w-xs" />
   </label>

   <label class="form-control w-full max-w-xs">
      <div class="label">
         <span class="label-text">Points négatifs</span>
      </div>
      <input type="number" :value="quizChoice && quizChoice.negative_points" @change="updateNegativePoints" class="input input-bordered w-full max-w-xs" />
   </label>
   
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopic } from '/src/use/useTopic'
import { getQuiz } from '/src/use/useQuiz'
import { getQuizChoice, updateQuizChoice } from '/src/use/useQuizChoice'
import router from '/src/router'

const props = defineProps({
   topic_id: {
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
   quiz_choice_id: {
      type: Number,
      required: true
   },
})

const ue = ref()
const subUE = ref()
const topic = ref()
const quiz = ref()
const quizChoice = ref()

onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topic.value = await getTopic(props.topic_id)
   quiz.value = await getQuiz(props.quiz_id)
   quizChoice.value = await getQuizChoice(props.quiz_choice_id)
})

const onInputText = async (ev) => {
   quizChoice.value = await updateQuizChoice(props.quiz_choice_id, { text: ev.target.value })
}
const debouncedInputText = useDebounceFn(onInputText, 500)

const disabledText = ref(true)

const answerIs = async (answer) => {
   console.log('answer', answer)
   quizChoice.value = await updateQuizChoice(props.quiz_choice_id, { answer })
}

const onInputComment = async (ev) => {
   quizChoice.value = await updateQuizChoice(props.quiz_choice_id, { comment: ev.target.value })
}
const debouncedInputComment = useDebounceFn(onInputComment, 500)

const disabledComment = ref(true)

const updatePositivePoints = async (ev) => {
   const positive_points = parseInt(ev.target.value)
   quizChoice.value = await updateQuizChoice(props.quiz_choice_id, { positive_points })
}

const updateNegativePoints = async (ev) => {
   const negative_points = parseInt(ev.target.value)
   quizChoice.value = await updateQuizChoice(props.quiz_choice_id, { negative_points })
}

const back = () => {
   router.back()
}
</script>