<template>
   <h1 class="text-xl font-semibold">Unités d'enseignement</h1>

   <ul v-for="ue, index in ueList">
      <EditableListItem
         field="name" :index="index" :list="ueList"
         @update="(ue1, ue2) => update(ue1, ue2)"
         @edit="(text) => edit(ue.id, text)"
         @remove="remove(ue.id)"
         @select="select(ue.id)"
      ></EditableListItem>
   </ul>

   <div class="flex">
      <textarea v-model="title" class="textarea textarea-bordered" placeholder="Titre nouvelle UE"></textarea>
      <button class="btn btn-circle" @click="addUE">
         <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="mdiPlus" /></svg>
      </button>
   </div>
   
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { mdiPlus } from '@mdi/js'

import { createUE, updateUE, removeUE, getUEList } from '/src/use/useUE'
import { getAuthenticatedUser } from '/src/use/useAuthentication'
import router from "/src/router"

import EditableListItem from '/src/components/EditableListItem.vue'


const ueList = ref([])

onMounted(async () => {
   await updateList()
})

async function updateList() {
   const unorderedList = await getUEList()
   ueList.value = unorderedList.sort((e1, e2) => e1.rank - e2.rank)
}

async function update(e1, e2) {
   await updateUE(e1.id, { rank: e1.rank })
   await updateUE(e2.id, { rank: e2.rank })
   updateList()
}

const title = ref()

const addUE = async () => {
   await createUE(title.value)
   await updateList()
   title.value = ''
}

const edit = async (ue_id, name) => {
   console.log(ue_id, name)
   await updateUE(ue_id, { name })
}

const remove = async (id) => {
   await removeUE(id)
   await updateList()
}

const select = (id) => {
   router.push(`/home/${getAuthenticatedUser().id}/admin-sub-ue/${id}`)
}
</script>
