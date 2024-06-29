<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <span>LEXIQUE</span>
         </p>
      </header>

      <!-- Main content -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
            <!-- <div ccclass="progress-list">
               <template v-for="lexicon in listOfLexicon">
                  <div class="progress-item cursor-pointer" @click="selectLexicon(lexicon)">
                     <p>
                        {{ lexicon?.french_word }}
                     </p>
                  </div>
               </template>
            </div> -->

            <template v-for="lexicon in listOfLexicon">
               <div class="collapse" @click="checkedId = lexicon.id">
                  <input type="radio" :checked="lexicon?.id === checkedId" />
                  <div class="collapse-title text-xl font-medium">{{ lexicon?.french_word }}</div>
                  <div class="collapse-content">
                     <p>{{ lexicon?.french_desc }}</p>
                  </div>
               </div>
            </template>
         </div>

      </main>

   </main>
</template>

<script setup>
import { ref } from 'vue'
import { listOfLexicon } from '/src/use/useLexicon'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const checkedId = ref()

const selectLexicon = (lexicon) => {
   checkedId.value = lexicon.id
}
</script>
