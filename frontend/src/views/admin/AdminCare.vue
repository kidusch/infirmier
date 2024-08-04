<template>

   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <span class="font-semibold">Soins</span>
         </p>
      </header>


      <main class="flex flex-col gap-6 pb-4">

         <div class="flex flex-col gap-3">

            <div v-for="care, index in listOfCare">
               <EditableListItem
                  field="title" :index="index" :list="listOfCare"
                  @update="(care1, care2) => update(care1, care2)"
                  @edit="(text) => edit(care.id, text)"
                  @remove="remove(care)"
                  @select="select(care.id)"
                  @show="updateHidden(care.id, false)"
                  @hide="updateHidden(care.id, true)"
               ></EditableListItem>

            </div>

            <div>
               <div class="flex gap-3 items-center">
                  <input v-model="title" class="standard-input flex-1" placeholder="Titre nouveau soin" type="text">
                  <div class="flex gap-1.5" @click="addCare">
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

import { createCare, updateCare, removeCare, listOfCare } from '/src/use/useCare'
import router from "/src/router"

import EditableListItem from '/src/components/EditableListItem.vue'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

async function update(care1, care2) {
   await updateCare(care1.id, { rank: care1.rank })
   await updateCare(care2.id, { rank: care2.rank })
}

async function updateHidden(id, hidden) {
   await updateCare(id, { hidden })
}

const title = ref()

const addCare = async () => {
   await createCare(title.value)
   title.value = ''
}

const edit = async (care_id, title) => {
   await updateCare(care_id, { title })
}

const remove = async (care) => {
   if (window.confirm(`Supprimer "${care.title}" ?`)) {
      await removeCare(care.id)
   }
}

const select = (id) => {
   router.push(`/admin/admin-care/${id}`)
}
</script>
