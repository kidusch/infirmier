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
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-quiz/${ue_id}/${sub_ue_id}/${topic_id}/${quiz_id}`">QCM : {{ quiz?.title }}</router-link>
            /
            <span class="font-semibold">Choix</span>
         </p>
      </header>

      <!-- Header -->
      <header class="py-2">
         <div class="flex sm:items-center items-start gap-1.5">
            <h3 class="text-lg opacity-50">
               {{ quiz?.title }}
            </h3>
         </div>
      </header>

      <!-- Header -->
      <header class="py-2">
         <div class="flex sm:items-center items-start gap-1.5">
            <h3 class="">
               {{ quiz?.question }}
            </h3>
         </div>
      </header>


      <main class="flex flex-col gap-3">
         <div>
            <div class="flex justify-between">
               <label for="title">Texte du choix</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isTextDisabled" @click="isTextDisabled = !isTextDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isTextDisabled" @click="isTextDisabled = !isTextDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <input placeholder="Texte du choix..." type="text"
                  :value="quizChoice?.text"
                  @input="onTextInputDebounced"
                  v-position="textPosition"
                  :disabled="isTextDisabled"
               />
            </div>
         </div>

         <div>
            <label for="title">Bonne réponse</label>
            <div>
               <div class="flex items-center pb-1.5">
                  <label for="default-radio-1" class="font-normal me-2 w-6">
                     <p class="text-sm text-black">
                        oui
                     </p>
                  </label>

                  <input type="checkbox" :checked="quizChoice && quizChoice.answer === true" @click="answerIs(true)" class="checkbox checkbox-primary" />
               </div>

               <div class="flex items-center">
                  <label for="default-radio-2" class="font-normal me-2 w-6">
                     <p class="text-sm text-black">
                        non
                     </p>
                  </label>

                  <input type="checkbox" :checked="quizChoice && quizChoice.answer === false" @click="answerIs(false)" class="checkbox checkbox-primary" />
               </div>
            </div>
         </div>

         <div>
            <div class="flex justify-between">
               <label for="title">Commentaire en cas d'erreur</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isCommentDisabled" @click="isCommentDisabled = !isCommentDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isCommentDisabled" @click="isCommentDisabled = !isCommentDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <input placeholder="Commentaire..." type="text"
                  :value="quizChoice?.comment"
                  @input="onCommentInputDebounced"
                  v-position="commentPosition"
                  :disabled="isCommentDisabled"
               />
            </div>
         </div>

         <div class="flex w-full gap-4 pb-4">
            <div>
               <label for="title">Points positifs</label>
               <div class="standard-input-container w-full">
                  <input type="number" :value="quizChoice && quizChoice.positive_points" @change="updatePositivePoints" class="input input-bordered w-full max-w-xs" />
               </div>
            </div>
            <div>
               <label for="title">Points négatifs</label>
               <div class="standard-input-container w-full">
                  <input type="number" :value="quizChoice && quizChoice.negative_points" @change="updateNegativePoints" class="input input-bordered w-full max-w-xs" />
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
import { quizChoiceOfId, updateQuizChoice } from '/src/use/useQuizChoice'
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

const ue = computed(() => ueOfId.value(props.ue_id))
const subUE = computed(() => subUEOfId.value(props.sub_ue_id))
const topic = computed(() => topicOfId.value(props.topic_id))
const quiz = computed(() => quizOfId.value(props.quiz_id))
const quizChoice = computed(() => quizChoiceOfId.value(props.quiz_choice_id))

// handle text editing
const textPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onTextInput = async (ev) => {
   textPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateQuizChoice(props.quiz_choice_id, { text: ev.target.value })
}
const onTextInputDebounced = useDebounceFn(onTextInput, 500)
const isTextDisabled = ref(true)

// handle comment editing
const commentPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onCommentInput = async (ev) => {
   commentPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateQuizChoice(props.quiz_choice_id, { comment: ev.target.value })
}
const onCommentInputDebounced = useDebounceFn(onCommentInput, 500)
const isCommentDisabled = ref(true)

// custom directive (v-position on <input> or <textarea>) which restores cursor position
   const vPosition = {
   updated: (el, binding) => {
      // binding.value is the directive argument, here the cursor position ref { start, end }
      el.selectionStart, el.selectionEnd = binding.value.start, binding.value.end
   }
}

const answerIs = async (answer) => {
   await updateQuizChoice(props.quiz_choice_id, { answer })
}

const updatePositivePoints = async (ev) => {
   const positive_points = parseInt(ev.target.value)
   await updateQuizChoice(props.quiz_choice_id, { positive_points })
}

const updateNegativePoints = async (ev) => {
   const negative_points = parseInt(ev.target.value)
   await updateQuizChoice(props.quiz_choice_id, { negative_points })
}
</script>