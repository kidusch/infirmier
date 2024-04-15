<template>
   <h1 class="text-xl font-semibold">Sous-unités d'enseignement</h1>

   <ul v-for="subUE, index in subUEList">
      <SubUEItem :index="index" :ueList="subUEList" @update="updateList" @remove="remove(subUE.id)" @select="select(subUE.id)"></SubUEItem>
   </ul>

   <div class="flex">
      <textarea v-model="newTitle" class="textarea textarea-bordered" placeholder="Titre"></textarea>
      <button class="btn btn-circle" @click="addSubUE">
         <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="mdiPlus" /></svg>
      </button>
   </div>
   
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { mdiPlus } from '@mdi/js'

import { createSubUE, removeSubUE, getSubUEList } from '/src/use/useSubUE'
import SubUEItem from '/src/components/SubUEItem.vue'

const props = defineProps({
   ueid: {
      type: Number,
      required: true
   },
})

const subUEList = ref([])

onMounted(async () => {
   await updateList()
})

async function updateList() {
   const unorderedList = await getSubUEList(props.ueid)
   subUEList.value = unorderedList.sort((e1, e2) => e1.rank - e2.rank)
}

const newTitle = ref()

const addSubUE = async () => {
   await createSubUE(props.ueid, newTitle.value)
   await updateList()
   newTitle.value = ''
}

const remove = async (id) => {
   await removeSubUE(id)
   await updateList()
}
</script>