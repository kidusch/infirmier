<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-care`">Soins</router-link>
            /
            <span class="font-semibold">{{ care?.title }}</span>
         </p>
      </header>

      <main class="flex flex-col gap-3">
         <div>
            <div class="flex justify-between">
               <label for="title">Titre</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isTitleDisabled" @click="isTitleDisabled = !isTitleDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isTitleDisabled" @click="isTitleDisabled = !isTitleDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <input placeholder="Titre..." type="text"
                  :value="title"
                  @input="onTitleInputDebounced"
                  v-position="titlePosition"
                  :disabled="isTitleDisabled"
               />
            </div>
         </div>
         
         <div>
            <div class="flex justify-between">
               <label for="title">Contenu</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/preview.svg" @click="preview">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isContentDisabled" @click="isContentDisabled = !isContentDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isContentDisabled" @click="isContentDisabled = !isContentDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <textarea placeholder="Contenu..." type="text"
                  :value="content"
                  @input="onContentInputDebounced"
                  v-position="contentPosition"
                  :disabled="isContentDisabled"
               ></textarea>
            </div>
         </div>
      </main>
   </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { careOfId, updateCare } from '/src/use/useCare'

import { app } from '/src/client-app.js'

import router from '/src/router'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   care_id: {
      type: Number,
      required: true
   },
})

const care = computed(() => careOfId.value(props.care_id))

// handle title editing
const localTitle = ref()
const title = computed(() => localTitle.value || care.value.title)
app.service('care').on('update', care => {
   localTitle.value = care.title
})
const titlePosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onTitleInput = async (ev) => {
   localTitle.value = ev.target.value
   titlePosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateCare(props.care_id, { title: ev.target.value })
}
const onTitleInputDebounced = useDebounceFn(onTitleInput, 500)
const isTitleDisabled = ref(true)

// handle content editing
const localContent = ref()
const content = computed(() => localContent.value || care.value.content)
app.service('care').on('update', care => {
   localContent.value = care.content
})
const contentPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onContentInput = async (ev) => {
   localContent.value = ev.target.value
   contentPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateCare(props.care_id, { content: ev.target.value })
}
const onContentInputDebounced = useDebounceFn(onContentInput, 500)
const isContentDisabled = ref(true)

// custom directive (v-position on <input> or <textarea>) which restores cursor position
const vPosition = {
   updated: (el, binding) => {
      // binding.value is the directive argument, here the cursor position ref { start, end }
      el.selectionStart, el.selectionEnd = binding.value.start, binding.value.end
   }
}

const preview = () => {
   router.push(`/home/${props.userid}/admin-care-preview/${props.care_id}`)
}
</script>
