<template>
   <h1 class="text-xl font-semibold">Unités d'enseignement</h1>

   <div class="flex">
      <textarea v-model="newTitle" class="textarea textarea-bordered" placeholder="Titre"></textarea>
      <button class="btn btn-circle" @click="createUE">
         <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="mdiPlus" /></svg>
      </button>
   </div>
   
</template>

<script setup>
import { ref } from 'vue'
import { mdiPlus } from '@mdi/js'

import app from '/src/client-app.js'

const newTitle = ref()

const createUE = async () => {
   const result = await app.service('ue').aggregate({
      _max: { rank: true }
   })
   const highestRank = result._max.rank
   const rank = highestRank ? highestRank + 1 : 1
   app.service('ue').create({
      data: {
         name: newTitle.value,
         rank,
      }
   })
}
</script>