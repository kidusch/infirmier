<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <span>LEXIQUE</span>
         </p>
      </header>

      <header class="w-16">
         <div class="form-control">
            <label class="label cursor-pointer">
               <span class="label-text"><img class="h-6 cursor-pointer" src="/src/assets/flag_fr.svg"></span>
               <input type="radio" name="radio-10" class="radio checked:bg-blue-400" :checked="lang === 'fr'" @change="lang = 'fr'" />
            </label>
         </div>
         <div class="form-control">
            <label class="label cursor-pointer">
               <span class="label-text"><img class="h-6 cursor-pointer" src="/src/assets/flag_en.svg"></span>
               <input type="radio" name="radio-10" class="radio checked:bg-blue-400" :checked="lang === 'en'" @change="lang = 'en'" />
            </label>
         </div>
      </header>

      <!-- Main content -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">

            <template v-for="lexicon in lexiconList">
               <div class="collapse" @click="checkedId = lexicon.id">
                  <input type="radio" :checked="lexicon?.id === checkedId" />
                  <div class="collapse-title text-xl font-medium">{{ lexiconWord(lexicon) }}</div>
                  <div class="collapse-content">
                     <p>{{ lexiconDesc(lexicon) }}</p>
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
const lang = ref('en')

const lexiconList = computed(() => {
   if (lang.value === 'fr') {
      return listOfLexicon.value.sort((l1, l2) => l1.french_word > l2.french_word ? 1 : l1.french_word < l2.french_word ? -1 : 0)
   } else {
      return listOfLexicon.value.sort((l1, l2) => l1.english_word > l2.english_word ? 1 : l1.english_word < l2.english_word ? -1 : 0)
   }
})

const lexiconWord = computed(() => (lexicon) => lang.value === 'fr' ? lexicon.french_word : lexicon.english_word)
const lexiconDesc = computed(() => (lexicon) => lang.value === 'fr' ? lexicon.french_desc : lexicon.english_desc)
</script>
