<template>

   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <span class="font-semibold">Documents</span>
         </p>
      </header>


      <main class="flex flex-col gap-6 pb-4">

         <div class="flex flex-col gap-3">

            <div v-for="document, index in listOfDocument">
               <EditableListItem
                  field="title" :index="index" :list="listOfDocument"
                  @update="(document1, document2) => update(document1, document2)"
                  @edit="(text) => edit(document.id, text)"
                  @remove="remove(document)"
                  @select="select(document.id)"
                  @show="updateHidden(document.id, false)"
                  @hide="updateHidden(document.id, true)"
               ></EditableListItem>

            </div>

            <div>
               <div class="flex gap-3 items-center">
                  <input v-model="title" class="standard-input flex-1" placeholder="Titre nouveau soin" type="text">
                  <div class="flex gap-1.5" @click="addDocument">
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

import { createDocument, updateDocument, removeDocument, listOfDocument } from '/src/use/useDocument'
import router from "/src/router"

import EditableListItem from '/src/components/EditableListItem.vue'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

async function update(document1, document2) {
   await updateDocument(document1.id, { rank: document1.rank })
   await updateDocument(document2.id, { rank: document2.rank })
}

async function updateHidden(id, hidden) {
   await updateDocument(id, { hidden })
}

const title = ref()

const addDocument = async () => {
   await createDocument(title.value)
   title.value = ''
}

const edit = async (document_id, title) => {
   await updateDocument(document_id, { title })
}

const remove = async (document) => {
   if (window.confirm(`Supprimer "${document.title}" ?`)) {
      await removeDocument(document.id)
   }
}

const select = (id) => {
   router.push(`/admin/admin-document/${id}`)
}
</script>
