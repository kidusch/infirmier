<template>
   <h1 class="text-xl font-semibold">{{ topic && topic.name }}</h1>

   <div class="link m-2" @click="back">back</div>

   <h1 class="text-xl font-semibold">Cours</h1>
   <div>
      <textarea placeholder="Contenu du cours"
         :value="topic ? topic.course_content : ''"
         @input="debouncedInput" class="textarea textarea-bordered"
         :disabled="disabled"
      ></textarea>
      <span class="link m-2" @click="disabled = false">edit</span>
      <span class="link m-2" @click="preview">preview</span>
   </div>
   
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { getTopic, updateTopic } from '/src/use/useTopic'
import router from '/src/router'

const props = defineProps({
   topic_id: {
      type: Number,
      required: true
   },
})

const topic = ref()

onMounted(async () => {
   topic.value = await getTopic(props.topic_id)
})

const onInput = async (ev) => {
   await updateTopic(props.topic_id, { course_content: ev.target.value })
}
const debouncedInput = useDebounceFn(onInput, 500)

const disabled = ref(true)

const preview = () => {
   console.log('preview')
}

const back = () => {
   router.back()
}
</script>