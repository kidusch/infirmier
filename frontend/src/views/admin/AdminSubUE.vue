<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-ue`">Unités d'enseignement</router-link>
            /
            <span class="font-semibold">{{ ue?.name }}</span>
         </p>
      </header>

      <!-- Header -->
      <header class="py-4">
         <div class="flex sm:items-center items-start gap-1.5">
            <h3 class="">
               {{ ue?.name }}
            </h3>
         </div>
      </header>

      <!-- Header -->
      <header class="py-4">
         <div class="flex sm:items-center items-start gap-1.5">
            <h3 class="opacity-50">
               Sous-unités d'enseignement
            </h3>
         </div>
      </header>

      <main class="flex flex-col gap-6 pb-4">

         <div class="flex flex-col gap-3">
            <div v-for="subUE, index in subUEList">
               <EditableListItem
                  field="name" :index="index" :list="subUEList"
                  @update="(ue1, ue2) => update(ue1, ue2)"
                  @edit="(text) => edit(subUE.id, text)"
                  @remove="remove(subUE.id)"
                  @select="select(subUE.id)"
               ></EditableListItem>
            </div>

            <div>
               <div class="flex gap-3 items-center">
                  <input v-model="title" class="standard-input flex-1" placeholder="Titre nouvelle Sous-UE" type="text">
                  <div class="flex gap-1.5" @click="addSubUE">
                     <img class="h-4 cursor-pointer" src="/src/assets/add.svg" alt="delete">
                  </div>
               </div>
            </div>

         </div>
      </main>
   </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { getUE } from '/src/use/useUE'
import { createSubUE, updateSubUE, removeSubUE, getSubUEList } from '/src/use/useSubUE'
import router from "/src/router"

import EditableListItem from '/src/components/EditableListItem.vue'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
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

const edit = async (subUEId, name) => {
   await updateSubUE(subUEId, { name })
}

const remove = async (subUEId) => {
   await removeSubUE(subUEId)
   await updateList()
}

const select = (subUEId) => {
   router.push(`/home/${props.userid}/admin-topics/${props.ue_id}/${subUEId}`)
}

const back = () => {
   router.back()
}
</script>
