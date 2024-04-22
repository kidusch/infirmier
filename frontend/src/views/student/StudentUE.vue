<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="py-4">
         <h3 class="lg:opacity-50">
            Bilan des cours
         </h3>
      </header>

      <!-- Main content -> courses list -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl" v-for="ue in ueList">
            <h2 class="font-semibold">
               {{ ue.name }}
            </h2>
            <div class="progress-list">
               <div class="progress-item" v-for="subUE in subUEList[ue.id]">
                  <img src="/src/assets/progress-bar-0.svg">
                  <p>
                     {{ subUE.name }}
                  </p>
               </div>
            </div>
         </div>

      </main>

   </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { getUEList } from '/src/use/useUE'
import { getSubUEList } from '/src/use/useSubUE'


const ueList = ref([])
const subUEList = ref({})

onMounted(async () => {
   ueList.value = await getUEList()
   for (const ue of ueList.value) {
      subUEList.value[ue.id] = await getSubUEList(ue.id)
   }
})
</script>