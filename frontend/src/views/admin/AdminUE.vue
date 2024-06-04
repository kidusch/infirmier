<template>

   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <span class="font-semibold">Unités d'enseignement</span>
         </p>
      </header>

      <!-- Header -->
      <header class="py-4">
         <div class="flex sm:items-center items-start gap-1.5">
            <h3 class="lg:opacity-50">
               Unités d'enseignement
            </h3>
         </div>
      </header>

      <main class="flex flex-col gap-6 pb-4">

         <div class="flex flex-col gap-3">

            <div v-for="ue, index in ueList">
               <EditableListItem
                  field="name" :index="index" :list="ueList"
                  @update="(ue1, ue2) => update(ue1, ue2)"
                  @edit="(text) => edit(ue.id, text)"
                  @remove="remove(ue.id)"
                  @select="select(ue.id)"
                  @show="updateHidden(ue.id, false)"
                  @hide="updateHidden(ue.id, true)"
               ></EditableListItem>

            </div>

            <div>
               <div class="flex gap-3 items-center">
                  <input v-model="title" class="standard-input flex-1" placeholder="Titre nouvelle UE" type="text">
                  <div class="flex gap-1.5" @click="addUE">
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

import { createUE, updateUE, removeUE, getUEList } from '/src/use/useUE'
import router from "/src/router"

import EditableListItem from '/src/components/EditableListItem.vue'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

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

async function updateHidden(id, hidden) {
   await updateUE(id, { hidden })
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
   if (window.confirm("Supprimer ?")) {
      await removeUE(id)
      await updateList()
   }
}

const select = (id) => {
   router.push(`/home/${props.userid}/admin-sub-ue/${id}`)
}
</script>
