<template>

   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <span class="font-semibold">Anatomy</span>
         </p>
      </header>

      <main class="flex flex-col gap-6 pb-4">

         <div class="flex flex-col gap-3">

            <div v-for="anatomy, index in listOfAnatomy">
               <EditableListItem
                  field="name" :index="index" :list="listOfAnatomy"
                  @update="(anatomy1, anatomy2) => update(anatomy1, anatomy2)"
                  @edit="(text) => edit(anatomy.id, text)"
                  @remove="remove(anatomy)"
                  @select="select(anatomy.id)"
                  @show="updateHidden(anatomy.id, false)"
                  @hide="updateHidden(anatomy.id, true)"
               ></EditableListItem>

            </div>

            <div>
               <div class="flex gap-3 items-center">
                  <input v-model="title" class="standard-input flex-1" placeholder="Titre nouvelle planche anatomique" type="text">
                  <div class="flex gap-1.5" @click="addAnatomy">
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

import { createAnatomy, updateAnatomy, removeAnatomy, listOfAnatomy } from '/src/use/useAnatomy'
import router from "/src/router"

import EditableListItem from '/src/components/EditableListItem.vue'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

async function update(e1, e2) {
   await updateAnatomy(e1.id, { rank: e1.rank })
   await updateAnatomy(e2.id, { rank: e2.rank })
}

async function updateHidden(id, hidden) {
   await updateAnatomy(id, { hidden })
}

const title = ref()

const addAnatomy = async () => {
   await createAnatomy(title.value)
   title.value = ''
}

const edit = async (anatomy_id, name) => {
   await updateAnatomy(anatomy_id, { name })
}

const remove = async (anatomy) => {
   if (window.confirm(`Supprimer "${anatomy.name}" ?`)) {
      await removeAnatomy(anatomy.id)
   }
}

const select = (id) => {
   router.push(`/admin/admin-anatomy/${id}`)
}
</script>
