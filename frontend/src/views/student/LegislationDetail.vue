<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <router-link class="cursor-pointer hover:underline" :to="`/student/legislation`">LÉGISLATION</router-link>
            /
            <span class="font-semibold">{{ legislation?.title }}</span>
         </p>
      </header>

      <div v-html="legislation?.content"></div>

   </main>
</template>

<script setup>
import { computed } from 'vue'

import { legislationOfId } from '/src/use/useLegislation'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   legislation_id: {
      type: Number,
      required: true
   },
})

const legislation = computed(() => legislationOfId.value(props.legislation_id))
</script>
