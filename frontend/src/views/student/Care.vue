<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <span>SOINS</span>
         </p>
      </header>

      <!-- Main content -> care list -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
            <div class="progress-list2">
               <template v-for="care in listOfCare">
                  <div v-if="!care.hidden" class="progress-item cursor-pointer" @click="selectCare(care)">
                     <p>
                        {{ care?.title }}
                     </p>
                  </div>
               </template>
            </div>
         </div>

      </main>


   </main>
</template>

<script setup>
import { listOfCare } from '/src/use/useCare'
import router from "/src/router"

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const selectCare = (care) => {
   router.push(`/student/care/${care.id}`)
}
</script>
