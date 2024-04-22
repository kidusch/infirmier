<template>
   <h1 class="text-xl font-semibold">Sous-unités d'enseignement</h1>

   <div class="link m-2" @click="back">back</div>

   <h1 class="text-xl font-semibold">{{ ue && ue.name }}</h1>

   <ul v-for="subUE, index in subUEList">
      <EditableListItem
         field="name" :index="index" :list="subUEList"
         @update="(ue1, ue2) => update(ue1, ue2)"
         @edit="(text) => edit(subUE.id, text)"
         @remove="remove(subUE.id)"
         @select="select(subUE.id)"
      ></EditableListItem>
   </ul>

   <div class="flex">
      <textarea v-model="title" class="textarea textarea-bordered" placeholder="Titre nouvelle sous-UE"></textarea>
      <button class="btn btn-circle" @click="addSubUE">
         <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="mdiPlus" /></svg>
      </button>
   </div>
   
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { mdiPlus } from '@mdi/js'

import { getUE } from '/src/use/useUE'
import { createSubUE, updateSubUE, removeSubUE, getSubUEList } from '/src/use/useSubUE'
import { getAuthenticatedUser } from '/src/use/useAuthentication'
import router from "/src/router"

import EditableListItem from '/src/components/EditableListItem.vue'

const props = defineProps({
   ue_id: {
      type: Number,
      required: true
   },
})

const ue = ref()
const subUEList = ref([])

onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   await updateList()
})

async function updateList() {
   subUEList.value = await getSubUEList(props.ue_id)
}

async function update(e1, e2) {
   await updateSubUE(e1.id, { rank: e1.rank })
   await updateSubUE(e2.id, { rank: e2.rank })
   updateList()
}

const title = ref()

const addSubUE = async () => {
   await createSubUE(props.ue_id, title.value)
   await updateList()
   title.value = ''
}

const edit = async (sub_ue_id, name) => {
   await updateSubUE(sub_ue_id, { name })
}

const remove = async (id) => {
   await removeSubUE(id)
   await updateList()
}

const select = (id) => {
   router.push(`/home/${getAuthenticatedUser().id}/admin-topics/${id}`)
}

const back = () => {
   router.back()
}
</script>
