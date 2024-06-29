<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <span>DOCUMENTS</span>
         </p>
      </header>

      <!-- Main content -> document list -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
            <div class="progress-list">
               <template v-for="document in listOfDocument">
                  <div v-if="!document.hidden" class="progress-item cursor-pointer" @click="selectDocument(document)">
                     <p>
                        {{ document?.title }}
                     </p>
                  </div>
               </template>
            </div>
         </div>

      </main>


   </main>
</template>

<script setup>
import { listOfDocument } from '/src/use/useDocument'
import router from "/src/router"

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const selectDocument = (document) => {
   router.push(`/home/${props.userid}/document/${document.id}`)
}
</script>
