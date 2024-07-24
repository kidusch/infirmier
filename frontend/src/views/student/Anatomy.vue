<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <span>ANATOMIE</span>
         </p>
      </header>

      <!-- Main content -> anatomy map list -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
            <div class="progress-list">
               <template v-for="anatomy in listOfAnatomy">
                  <div class="progress-item cursor-pointer" @click="selectAnatomy(anatomy)">
                     <p>
                        {{ anatomy?.name }}
                     </p>
                  </div>
               </template>
            </div>
         </div>

      </main>

   </main>
</template>

<script setup>
import { listOfAnatomy } from '/src/use/useAnatomy'
import router from "/src/router"

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const selectAnatomy = (anatomy) => {
   router.push(`/home/${props.userid}/anatomy/${anatomy.id}`)
}
</script>
