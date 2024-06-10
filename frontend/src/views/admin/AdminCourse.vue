<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-course my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-ue`">Unités d'enseignement</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-sub-ue/${ue_id}`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-topics/${ue_id}/${sub_ue_id}`">{{ subUE?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-topic/${ue_id}/${sub_ue_id}/${topic_id}`">{{ topic?.name }}</router-link>
            /
            <span class="font-semibold">Cours</span>
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
                  :value="course ? course.title : ''"
                  @input="debouncedInputTitle"
                  :disabled="disabledTitle"
               />
            </div>
         </div>
         
         <div>
            <div class="flex justify-between">
               <label for="title">Contenu</label>
               <div class="flex gap-2">
                  <img class="h-5 mb-1" src="/src/assets/preview.svg" @click="preview">
                  <img class="h-5 mb-1" src="/src/assets/edit.svg" @click="disabledContent = !disabledContent">
               </div>
            </div>
            <div class="standard-input-container">
               <textarea placeholder="Contenu..." type="text" rows="50"
                  :value="course ? course.content : ''"
                  @input="debouncedInputContent"
                  :disabled="disabledContent"
               ></textarea>
            </div>
         </div>
         <!-- <div>
            <p class="text-red-600">{{ errorMessage }}</p>
         </div> -->
      </main>
   </main>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { ueOfId } from '/src/use/useUE'
import { subUEOfId } from '/src/use/useSubUE'
import { topicOfId } from '/src/use/useTopic'
import { courseOfId, updateCourse } from '/src/use/useCourse'
import router from '/src/router'
// import parser from '/src/lib/grammar.js'


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
   course_id: {
      type: Number,
      required: true
   },
})

const ue = computed(() => ueOfId.value(props.ue_id))
const subUE = computed(() => subUEOfId.value(props.sub_ue_id))
const topic = computed(() => topicOfId.value(props.topic_id))
const course = computed(() => courseOfId.value(props.course_id))

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
   await updateCourse(props.course_id, { title: ev.target.value })
}
const onInputContent = async (ev) => {
   await updateCourse(props.course_id, { content: ev.target.value })
}
const debouncedInputTitle = useDebounceFn(onInputTitle, 500)
const debouncedInputContent = useDebounceFn(onInputContent, 500)

const disabledTitle = ref(true)
const disabledContent = ref(true)

const preview = () => {
   router.push(`/home/${props.userid}/admin-course-preview/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${props.course_id}`)
}
</script>
