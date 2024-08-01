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
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!disabledTitle" @click="disabledTitle = !disabledTitle">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="disabledTitle" @click="disabledTitle = !disabledTitle">
               </div>
            </div>
            <div class="standard-input-container">
               <input placeholder="Titre..." type="text"
                  :value="course ? course.title : ''"
                  @input="debouncedInputTitle"
                  v-position="titlePosition"
                  :disabled="disabledTitle"
               />
            </div>
         </div>
         
         <div>
            <div class="flex justify-between">
               <label for="title">Contenu</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/preview.svg" @click="preview">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!disabledContent" @click="disabledContent = !disabledContent">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="disabledContent" @click="disabledContent = !disabledContent">
               </div>
            </div>

            <div class="standard-input-container">
               <textarea placeholder="Contenu..." type="text"
                  :value="course?.content"
                  @input="handleContentInputDebounced"
                  v-position="contentPosition"
                  :disabled="disabledContent"
               ></textarea>
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
import { courseOfId, getCourse, updateCourse } from '/src/use/useCourse'
import router from '/src/router'


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


const titlePosition = ref({}) // cursor position is saved before a save, and restored after DOM change
const onInputTitle = async (ev) => {
   titlePosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateCourse(props.course_id, { title: ev.target.value })
}
const debouncedInputTitle = useDebounceFn(onInputTitle, 500)
const disabledTitle = ref(true)


const contentPosition = ref({}) // cursor position is saved before a save, and restored after DOM change
const handleContentInput = async (ev) => {
   contentPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateCourse(props.course_id, { content: ev.target.value })
}
const handleContentInputDebounced = useDebounceFn(handleContentInput, 500)
const disabledContent = ref(true)

// custom directive (v-position on <input>) which restores cursor position on <input> and <textarea>
const vPosition = {
   updated: (el, binding) => {
      // binding.value is the directive argument, here the cursor position ref { start, end }
      el.selectionStart, el.selectionEnd = binding.value.start, binding.value.end
   }
}

const preview = () => {
   router.push(`/home/${props.userid}/admin-course-preview/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${props.course_id}`)
}
</script>
