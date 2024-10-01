<template>
   <main class="container max-w-7xl">

     <!-- Header -->
     <section class="w-full flex justify-between">
        <h3 class="opacity-50">
           La transaction a échoué
        </h3>
     </section>

     <footer class="flex-1 flex flex-col justify-end pb-8">
         <router-link class="primary-btn px-4" :to="`/student`">
            Continuer
         </router-link>
      </footer>

  </main>
</template>

<script setup>
const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})
</script>
