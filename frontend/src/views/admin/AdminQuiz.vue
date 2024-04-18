<template>
   <h1 class="text-xl font-semibold">{{ quiz && quiz.title }}</h1>

   <h1 class="text-xl font-semibold">QCM</h1>

   <div class="link m-2" @click="back">back</div>
   <div class="link m-2" @click="preview">preview</div>

   <div>
      <textarea placeholder="Titre"
         :value="quiz ? quiz.title : ''"
         @input="debouncedInputTitle" class="textarea textarea-bordered"
         :disabled="disabledTitle"
      ></textarea>
      <span class="link m-2" @click="disabledTitle = !disabledTitle">edit</span>
   </div>
      
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { getQuiz, updateQuiz } from '/src/use/useQuiz'
import router from '/src/router'

const props = defineProps({
   quiz_id: {
      type: Number,
      required: true
   },
})

const quiz = ref()

onMounted(async () => {
   quiz.value = await getQuiz(props.quiz_id)
})

const onInputTitle = async (ev) => {
   await updateQuiz(props.quiz_id, { title: ev.target.value })
}
const debouncedInputTitle = useDebounceFn(onInputTitle, 500)

const disabledTitle = ref(true)

const back = () => {
   router.back()
}

const preview = () => {
   console.log('preview')
}
</script>