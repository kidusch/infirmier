<template>

   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <span class="font-semibold">Lexique</span>
         </p>
      </header>


      <main class="flex flex-col gap-6 pb-4">

         <div class="flex flex-col gap-3">

            <div v-for="lexicon, index in listOfLexicon">
               <ListItem
                  field="french_word" :index="index" :list="listOfLexicon"
                  @edit="(text) => edit(lexicon.id, text)"
                  @remove="remove(lexicon)"
                  @select="select(lexicon.id)"
               ></ListItem>

            </div>

            <div>
               <div class="flex gap-3 items-center">
                  <input v-model="newFrenchTerm" class="standard-input flex-1" placeholder="Titre nouveau soin" type="text">
                  <div class="flex gap-1.5" @click="addLexicon">
                     <img class="h-4 cursor-pointer" src="/src/assets/add.svg" alt="delete">
                  </div>
               </div>
            </div>

         </div>
      </main>
   </main>
</template>

<script setup>
import { ref } from 'vue'

import { createLexicon, updateLexicon, removeLexicon, listOfLexicon } from '/src/use/useLexicon'
import router from "/src/router"

import ListItem from '/src/components/ListItem.vue'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

async function update(lexicon1, lexicon2) {
   await updateLexicon(lexicon1.id, { rank: lexicon1.rank })
   await updateLexicon(lexicon2.id, { rank: lexicon2.rank })
}

const newFrenchTerm = ref()

const addLexicon = async () => {
   await createLexicon(newFrenchTerm.value)
   newFrenchTerm.value = ''
}

const edit = async (lexicon_id, french_word) => {
   await updateLexicon(lexicon_id, { french_word })
}

const remove = async (lexicon) => {
   if (window.confirm(`Supprimer "${lexicon.french_word}" ?`)) {
      await removeLexicon(lexicon.id)
   }
}

const select = (id) => {
   router.push(`/home/${props.userid}/admin-lexicon/${id}`)
}
</script>
