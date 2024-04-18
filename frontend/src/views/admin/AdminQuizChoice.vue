<template>
   <h1 class="text-xl font-semibold">{{ quiz && quiz.title }}</h1>

   <h1 class="text-xl font-semibold">QUIZ CHOICE</h1>

   <div class="link m-2" @click="back">back</div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { getQuizChoice } from '/src/use/useQuizChoice'
import router from '/src/router'

const props = defineProps({
   quiz_choice_id: {
      type: Number,
      required: true
   },
})

const quizChoice = ref()

onMounted(async () => {
   quizChoice.value = await getQuizChoice(props.quiz_choice_id)
})

const back = () => {
   router.back()
}
</script>