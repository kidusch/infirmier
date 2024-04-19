<template>
   <div class="link m-2" @click="back">back</div>

   <h1 class="text-xl font-semibold">{{ topic && topic.name }}</h1>

   <h1 class="text-gray-500">QCM</h1>

   <h1 class="text-lg">{{ quiz && quiz.title }}</h1>

   <h1 class="font-semibold">{{ quiz && quiz.question }}</h1>

   <h1 class="text-lg font-semibold">{{ quizChoice && quizChoice.title }}</h1>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { getTopic } from '/src/use/useTopic'
import { getQuiz } from '/src/use/useQuiz'
import { getQuizChoice } from '/src/use/useQuizChoice'
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

const back = () => {
   router.back()
}
</script>