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
               <img class="h-5 mb-1" src="/src/assets/edit.svg"  @click="disabledFrenchWord = !disabledFrenchWord">
            </div>
            <div class="standard-input-container">
               <input placeholder="Terme français..." type="text"
                  :value="lexicon?.french_word"
                  @input="debouncedInputFrenchWord"
                  :disabled="disabledFrenchWord"
               />
            </div>
         </div>
         
         <div>
            <div class="flex justify-between">
               <label for="title">Explication en français</label>
               <div class="flex gap-2">
                  <img class="h-5 mb-1" src="/src/assets/save.svg" @click="saveFrenchDesc">
                  <img class="h-5 mb-1" src="/src/assets/edit.svg" @click="disabledFrenchDesc = !disabledFrenchDesc">
               </div>
            </div>
            <div class="standard-input-container">
               <textarea placeholder="Explication en français..." type="text"
                  v-model="frenchDesc"
                  :disabled="disabledFrenchDesc"
               ></textarea>
            </div>
         </div>
         
         <div>
            <div class="flex justify-between">
               <label for="title">Terme anglais</label>
               <img class="h-5 mb-1" src="/src/assets/edit.svg"  @click="disabledEnglishWord = !disabledEnglishWord">
            </div>
            <div class="standard-input-container">
               <input placeholder="Terme anglais..." type="text"
                  :value="lexicon?.english_word"
                  @input="debouncedInputEnglishWord"
                  :disabled="disabledEnglishWord"
               />
            </div>
         </div>
         
         <div>
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
         </div>
      </main>
   </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { lexiconOfId, getLexicon, updateLexicon } from '/src/use/useLexicon'
import router from '/src/router'


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

const frenchDesc = ref('')
const englishDesc = ref('')
onMounted(async () => {
   const lexicon = await getLexicon(props.lexicon_id)
   frenchDesc.value = lexicon.french_desc
   englishDesc.value = lexicon.english_desc
})

const saveFrenchDesc = async () => {
   await updateLexicon(props.lexicon_id, { french_desc: frenchDesc.value })
}
const saveEnglishDesc = async () => {
   await updateLexicon(props.lexicon_id, { english_desc: englishDesc.value })
}

const onInputFrenchWord = async (ev) => {
   await updateLexicon(props.lexicon_id, { french_word: ev.target.value })
}
const debouncedInputFrenchWord = useDebounceFn(onInputFrenchWord, 500)

const onInputEnglishWord = async (ev) => {
   await updateLexicon(props.lexicon_id, { english_word: ev.target.value })
}
const debouncedInputEnglishWord = useDebounceFn(onInputEnglishWord, 500)

const disabledFrenchWord = ref(true)
const disabledFrenchDesc = ref(true)
const disabledEnglishWord = ref(true)
const disabledEnglishDesc = ref(true)
</script>
