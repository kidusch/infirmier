<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <section class="w-full flex justify-between">
         <h3 class="opacity-50">
            La transaction a réussie
         </h3>
      </section>

      <footer class="flex-1 flex flex-col justify-end pb-8">
         <router-link class="primary-btn px-4" :to="`/home/${userid}/study-ue`">
            Continuer
         </router-link>
      </footer>

   </main>
</template>

<script setup>
import { onMounted } from 'vue'

import { app } from '/src/client-app.js'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

onMounted(() => {
   app.service('user').update({
      where: { id: props.userid },
      data: { premium: true },
   })
})
</script>
