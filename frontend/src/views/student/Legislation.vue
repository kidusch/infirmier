<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <span>LÉGISLATION</span>
         </p>
      </header>

      <!-- Main content -> legislation list -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
            <div class="progress-list">
               <template v-for="legislation in legislationList">
                  <div v-if="!legislation.hidden" class="progress-item cursor-pointer" @click="selectLegislation(legislation)">
                     <p>
                        {{ legislation?.title }}
                     </p>
                  </div>
               </template>
            </div>
         </div>

      </main>


   </main>
</template>

<script setup>
import { computed } from 'vue'

import { listOfLegislation } from '/src/use/useLegislation'
import router from "/src/router"

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const legislationList = computed(() => listOfLegislation.value)

const selectLegislation = (legislation) => {
   router.push(`/home/${props.userid}/legislation/${legislation.id}`)
}
</script>
