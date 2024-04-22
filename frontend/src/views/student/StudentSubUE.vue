<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="py-4">
         <h3 class="lg:opacity-50">
            SUBUE
         </h3>
      </header>

      <!-- Main content -> courses list -->
      <main class="flex flex-col gap-6 pb-6">
         
         <!-- <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl" v-for="ue in ueList">
            <h2 class="font-semibold">
               {{ ue.name }}
            </h2>
            <div class="progress-list">
               <template v-for="subUE in subUEList[ue.id]">
                  <div class="progress-item cursor-pointer" @click="select(subUE)">
                     <img src="/src/assets/progress-bar-0.svg">
                     <p>
                        {{ subUE.name }}
                     </p>
                  </div>
               </template>
            </div>
         </div> -->

      </main>

   </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

onMounted(async () => {
})

// const select = (subUE) => {
//    router.push(`/home/${getAuthenticatedUser().id}/student-sub-ue/${subUE.id}`)
// }
</script>