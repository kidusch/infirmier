<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-lexicon`">Lexique</router-link>
            /
            <span class="font-semibold">{{ lexicon?.french_word }}</span>
         </p>
      </header>

      <main class="flex flex-col gap-3">
         
         <div>
            <div class="flex justify-between">
               <label for="title">Terme français</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isFrenchTermDisabled" @click="isFrenchTermDisabled = !isFrenchTermDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isFrenchTermDisabled" @click="isFrenchTermDisabled = !isFrenchTermDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <input placeholder="Terme français..." type="text"
                  :value="lexicon?.french_word"
                  @input="onFrenchTermInputDebounced"
                  v-position="frenchTermPosition"
                  :disabled="isFrenchTermDisabled"
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
                  :value="lexicon?.french_desc"
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
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isEnglishTermDisabled" @click="isEnglishTermDisabled = !isEnglishTermDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isEnglishTermDisabled" @click="isEnglishTermDisabled = !isEnglishTermDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <input placeholder="Terme anglais..." type="text"
                  :value="lexicon?.english_word"
                  @input="onEnglishTermInputDebounced"
                  v-position="englishTermPosition"
                  :disabled="isEnglishTermDisabled"
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
const frenchTermPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onFrenchTermInput = async (ev) => {
   frenchTermPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateLexicon(props.lexicon_id, { french_word: ev.target.value })
}
const onFrenchTermInputDebounced = useDebounceFn(onFrenchTermInput, 500)
const isFrenchTermDisabled = ref(true)

// handle french description editing
const frenchDescriptionPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onFrenchDescriptionInput = async (ev) => {
   frenchDescriptionPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateLexicon(props.lexicon_id, { french_desc: ev.target.value })
}
const onFrenchDescriptionInputDebounced = useDebounceFn(onFrenchDescriptionInput, 500)
const isFrenchDescriptionDisabled = ref(true)

// handle english term editing
const englishTermPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onEnglishTermInput = async (ev) => {
   englishTermPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateLexicon(props.lexicon_id, { english_word: ev.target.value })
}
const onEnglishTermInputDebounced = useDebounceFn(onEnglishTermInput, 500)
const isEnglishTermDisabled = ref(true)

// custom directive (v-position on <input> or <textarea>) which restores cursor position
const vPosition = {
   updated: (el, binding) => {
      // binding.value is the directive argument, here the cursor position ref { start, end }
      el.selectionStart, el.selectionEnd = binding.value.start, binding.value.end
   }
}
</script>
