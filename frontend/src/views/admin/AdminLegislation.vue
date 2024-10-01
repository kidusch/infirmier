<template>

   <main class="container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card mb-2">
         <p class="leading-loose">
            <span class="font-semibold">Législation</span>
         </p>
      </header>


      <main class="flex flex-col gap-6 pb-4">

         <div class="flex flex-col gap-3">

            <div v-for="legislation, index in listOfLegislation">
               <EditableListItem
                  field="title" :index="index" :list="listOfLegislation"
                  @update="(legislation1, legislation2) => update(legislation1, legislation2)"
                  @edit="(text) => edit(legislation.id, text)"
                  @remove="remove(legislation)"
                  @select="select(legislation.id)"
                  @show="updateHidden(legislation.id, false)"
                  @hide="updateHidden(legislation.id, true)"
               ></EditableListItem>

            </div>

            <div>
               <div class="flex gap-3 items-center">
                  <input v-model="title" class="standard-input flex-1" placeholder="Titre nouveau soin" type="text">
                  <div class="flex gap-1.5" @click="addLegislation">
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

import { createLegislation, updateLegislation, removeLegislation, listOfLegislation } from '/src/use/useLegislation'
import router from "/src/router"

import EditableListItem from '/src/components/EditableListItem.vue'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

async function update(legislation1, legislation2) {
   await updateLegislation(legislation1.id, { rank: legislation1.rank })
   await updateLegislation(legislation2.id, { rank: legislation2.rank })
}

async function updateHidden(id, hidden) {
   await updateLegislation(id, { hidden })
}

const title = ref()

const addLegislation = async () => {
   await createLegislation(title.value)
   title.value = ''
}

const edit = async (legislation_id, title) => {
   await updateLegislation(legislation_id, { title })
}

const remove = async (legislation) => {
   if (window.confirm(`Supprimer "${legislation.title}" ?`)) {
      await removeLegislation(legislation.id)
   }
}

const select = (id) => {
   router.push(`/admin/admin-legislation/${id}`)
}
</script>
