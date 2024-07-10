<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <span>LEXIQUE</span>
         </p>
      </header>

      <header class="w-16">
         <div class="form-control w-36">
            <label class="label cursor-pointer">
               <span class="label-text"><img class="h-6 cursor-pointer" src="/src/assets/flag_fr.svg"></span>
               <input type="checkbox" class="toggle toggle-primary" :checked="lang === 'en'" @change="ev => ev.target.checked ? lang = 'en' : lang = 'fr'" />
               <span class="label-text"><img class="h-6 cursor-pointer" src="/src/assets/flag_en.svg"></span>
            </label>
         </div>
      </header>

      <!-- Search input -->
      <label class="input input-bordered flex items-center gap-2 my-2">
         <input v-model="searchTerms" type="text" class="grow" placeholder="Rechercher..." />
         <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-6 w-6 opacity-70">
            <path
               fill-rule="evenodd"
               d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
               clip-rule="evenodd" />
         </svg>
      </label>

      <!-- Main content -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">

            <template v-for="lexicon in lexiconList(lang)">
               <div class="collapse" @click="checkedId = lexicon.id">
                  <input type="radio" :checked="lexicon?.id === checkedId" />
                  <div class="collapse-title text-xl font-medium">{{ lexiconWord(lexicon, lang) }}</div>
                  <div class="collapse-content">
                     <p>{{ lexiconDesc(lexicon, lang) }}</p>
                  </div>
               </div>
            </template>
         </div>

      </main>

   </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { listOfLexicon } from '/src/use/useLexicon'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const checkedId = ref()
const lang = ref('fr')
const searchTerms = ref('')

const lexiconList = computed(() => (lang) => {
   const unfilteredList = lang === 'fr' ?
      listOfLexicon.value.sort((l1, l2) => l1.french_word > l2.french_word ? 1 : l1.french_word < l2.french_word ? -1 : 0) :
      listOfLexicon.value.sort((l1, l2) => l1.english_word > l2.english_word ? 1 : l1.english_word < l2.english_word ? -1 : 0)

   if (searchTerms.value.trim().length <= 2) return unfilteredList
   
   const terms = searchTerms.value.trim().toLowerCase().split(' ')
   return unfilteredList.filter(lexicon => {
      if (lang === 'fr') {
         if (terms.some(term => lexicon.french_word.toLowerCase().includes(term))) return true
         if (terms.some(term => lexicon.french_desc.toLowerCase().includes(term))) return true
      } else {
         if (terms.some(term => lexicon.english_word.toLowerCase().includes(term))) return true
         if (terms.some(term => lexicon.english_desc.toLowerCase().includes(term))) return true
      }
      return false
   })
})

const lexiconWord = computed(() => (lexicon, lang) => lang === 'fr' ? lexicon.french_word : lexicon.english_word)
const lexiconDesc = computed(() => (lexicon, lang) => lang === 'fr' ? lexicon.french_desc : lexicon.english_desc)
</script>
