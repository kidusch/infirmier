<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-care`">Messagerie</router-link>
            /
            <span class="font-semibold">{{ student?.name }}</span>
         </p>
      </header>

   </main>
</template>

<script setup>
import { computed } from 'vue'

import { userOfId } from '/src/use/useUser'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   studentId: {
      type: Number,
      required: true
   },
})

const student = computed(() => userOfId.value(props.studentId))
</script>
