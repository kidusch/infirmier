<template>
   <h1 class="text-xl font-semibold">Unités d'enseignement</h1>

   <ul v-for="ue, index in ueList">
      <UEItem :index="index" :ueList="ueList" @update="updateList"></UEItem>
   </ul>

   <div class="flex">
      <textarea v-model="newTitle" class="textarea textarea-bordered" placeholder="Titre"></textarea>
      <button class="btn btn-circle" @click="addUE">
         <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="mdiPlus" /></svg>
      </button>
   </div>
   
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { mdiPlus } from '@mdi/js'

import { createUE, getUEList } from '/src/use/useUE'
import UEItem from '/src/components/UEItem.vue'

const ueList = ref([])

onMounted(async () => {
   await updateList()
})

async function updateList() {
   const unorderedList = await getUEList()
   ueList.value = unorderedList.sort((ue1, ue2) => ue1.rank - ue2.rank)
}

const newTitle = ref()

const addUE = async () => {
   await createUE(newTitle.value)
   await updateList()
}
</script>