<template>
   <main class="container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card mb-2">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/admin/admin-lexicon`">Lexique</router-link>
            /
            <span class="font-semibold">{{ lexicon?.french_word }}</span>
         </p>
      </header>

      <main class="flex flex-col gap-3">
         
         <div>
            <div class="flex justify-between">
               <label for="title">Terme français</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isFrenchWordDisabled" @click="isFrenchWordDisabled = !isFrenchWordDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isFrenchWordDisabled" @click="isFrenchWordDisabled = !isFrenchWordDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <input placeholder="Terme français..." type="text"
                  :value="frenchWord"
                  @input="onFrenchWordInputDebounced"
                  v-position="frenchTermPosition"
                  :disabled="isFrenchWordDisabled"
               />
            </div>
         </div>
         
         <div>
            <div class="flex justify-between">
               <label for="title">Explication en français</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isFrenchDescriptionDisabled" @click="isFrenchDescriptionDisabled = !isFrenchDescriptionDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isFrenchDescriptionDisabled" @click="isFrenchDescriptionDisabled = !isFrenchDescriptionDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <textarea placeholder="Contenu..." type="text"
                  :value="frenchDesc"
                  @input="onFrenchDescriptionInputDebounced"
                  v-position="frenchDescriptionPosition"
                  :disabled="isFrenchDescriptionDisabled"
               ></textarea>
            </div>
         </div>
         
         <div>
            <div class="flex justify-between">
               <label for="title">Terme anglais</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isEnglishWordDisabled" @click="isEnglishWordDisabled = !isEnglishWordDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isEnglishWordDisabled" @click="isEnglishWordDisabled = !isEnglishWordDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <input placeholder="Terme anglais..." type="text"
                  :value="englishWord"
                  @input="onEnglishWordInputDebounced"
                  v-position="englishTermPosition"
                  :disabled="isEnglishWordDisabled"
               />
            </div>
         </div>
         
         <!-- <div>
            <div class="flex justify-between">
               <label for="title">Explication en anglais</label>
               <div class="flex gap-2">
                  <img class="h-5 mb-1" src="/src/assets/save.svg" @click="saveEnglishDesc">
                  <img class="h-5 mb-1" src="/src/assets/edit.svg" @click="disabledEnglishDesc = !disabledEnglishDesc">
               </div>
            </div>
            <div class="standard-input-container">
               <textarea placeholder="Explication en anglais..." type="text"
                  v-model="englishDesc"
                  :disabled="disabledEnglishDesc"
               ></textarea>
            </div>
         </div> -->
      </main>
   </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { lexiconOfId, getLexicon, updateLexicon } from '/src/use/useLexicon'

import { app } from '/src/client-app.js'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   lexicon_id: {
      type: Number,
      required: true
   },
})

const lexicon = computed(() => lexiconOfId.value(props.lexicon_id))

// handle french term editing
const localFrenchWord = ref()
const frenchWord = computed(() => localFrenchWord.value || lexicon.value.french_word)
app.service('lexicon').on('update', lexicon => {
   localFrenchWord.value = lexicon.french_word
})
const frenchTermPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onFrenchWordInput = async (ev) => {
   localFrenchWord.value = ev.target.value
   frenchTermPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateLexicon(props.lexicon_id, { french_word: ev.target.value })
}
const onFrenchWordInputDebounced = useDebounceFn(onFrenchWordInput, 500)
const isFrenchWordDisabled = ref(true)

// handle french description editing
const localFrenchDesc = ref()
const frenchDesc = computed(() => localFrenchDesc.value || lexicon.value.french_desc)
app.service('lexicon').on('update', lexicon => {
   localFrenchDesc.value = lexicon.french_desc
})
const frenchDescriptionPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onFrenchDescriptionInput = async (ev) => {
   localFrenchDesc.value = ev.target.value
   frenchDescriptionPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateLexicon(props.lexicon_id, { french_desc: ev.target.value })
}
const onFrenchDescriptionInputDebounced = useDebounceFn(onFrenchDescriptionInput, 500)
const isFrenchDescriptionDisabled = ref(true)

// handle english term editing
const localEnglishWord = ref()
const englishWord = computed(() => localEnglishWord.value || lexicon.value.english_word)
app.service('lexicon').on('update', lexicon => {
   localEnglishWord.value = lexicon.english_word
})
const englishTermPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onEnglishWordInput = async (ev) => {
   localEnglishWord.value = ev.target.value
   englishTermPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateLexicon(props.lexicon_id, { english_word: ev.target.value })
}
const onEnglishWordInputDebounced = useDebounceFn(onEnglishWordInput, 500)
const isEnglishWordDisabled = ref(true)

// custom directive (v-position on <input> or <textarea>) which restores cursor position
const vPosition = {
   updated: (el, binding) => {
      // binding.value is the directive argument, here the cursor position ref { start, end }
      el.selectionStart, el.selectionEnd = binding.value.start, binding.value.end
   }
}
</script>
