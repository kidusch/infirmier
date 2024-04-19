<template>
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

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { getTopic } from '/src/use/useTopic'
import { getQuiz } from '/src/use/useQuiz'
import { getQuizChoice, updateQuizChoice } from '/src/use/useQuizChoice'
import router from '/src/router'

const props = defineProps({
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

const topic = ref()
const quiz = ref()
const quizChoice = ref()

onMounted(async () => {
   topic.value = await getTopic(props.topic_id)
   quiz.value = await getQuiz(props.quiz_id)
   quizChoice.value = await getQuizChoice(props.quiz_choice_id)
})

const onInputText = async (ev) => {
   await updateQuizChoice(props.quiz_choice_id, { text: ev.target.value })
}
const debouncedInputText = useDebounceFn(onInputText, 500)

const disabledText = ref(true)


const back = () => {
   router.back()
}
</script>