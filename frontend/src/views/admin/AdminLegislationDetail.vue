<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-course my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-legislation`">Législation</router-link>
            /
            <span class="font-semibold">{{ legislation?.title }}</span>
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
                  :value="legislation?.title"
                  @input="debouncedInputTitle"
                  :disabled="disabledTitle"
               />
            </div>
         </div>
         
         <div>
            <div class="flex justify-between">
               <label for="title">Contenu</label>
               <div class="flex gap-2">
                  <img class="h-5 mb-1" src="/src/assets/save.svg" @click="saveContent">
                  <img class="h-5 mb-1" src="/src/assets/preview.svg" @click="preview">
                  <img class="h-5 mb-1" src="/src/assets/edit.svg" @click="disabledContent = !disabledContent">
               </div>
            </div>
            <div class="standard-input-container">
               <textarea placeholder="Contenu..." type="text"
                  v-model="content"
                  :disabled="disabledContent"
               ></textarea>
               <!-- <textarea placeholder="Contenu..." type="text"
                  :value="course ? course.content : ''"
                  @input="debouncedInputContent"
                  :disabled="disabledContent"
               ></textarea> -->
            </div>
         </div>
         <!-- <div>
            <p class="text-red-600">{{ errorMessage }}</p>
         </div> -->
      </main>
   </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { legislationOfId, getLegislation, updateLegislation } from '/src/use/useLegislation'
import router from '/src/router'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   legislation_id: {
      type: Number,
      required: true
   },
})

const legislation = computed(() => legislationOfId.value(props.legislation_id))

// Continuous saving of the course content is disabled because of a random bug affecting the cursor position
// To save the course content, the save icon must be clicked
const content = ref('')
onMounted(async () => {
   const legislation = await getLegislation(props.legislation_id)
   content.value = legislation.content
})
const saveContent = async () => {
   await updateLegislation(props.legislation_id, { content: content.value })
}

// const errorMessage = ref('')

// watch(() => course.value?.content, async (content) => {
//    if (content) {
//       try {
//          const parts = parser.parse(content)
//          console.log('parts', parts)
//          errorMessage.value = ''
//       } catch(err) {
//          console.log('err', err)
//          errorMessage.value = err.toString()
//       }
//    }
// }, { immediate: true })

const onInputTitle = async (ev) => {
   await updateLegislation(props.legislation_id, { title: ev.target.value })
}
// const onInputContent = async (ev) => {
//    await updateCourse(props.course_id, { content: ev.target.value })
// }
const debouncedInputTitle = useDebounceFn(onInputTitle, 500)
// const debouncedInputContent = useDebounceFn(onInputContent, 500)

const disabledTitle = ref(true)
const disabledContent = ref(true)

const preview = () => {
   router.push(`/home/${props.userid}/admin-course-preview/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${props.course_id}`)
}
</script>
