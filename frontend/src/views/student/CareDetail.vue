<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <router-link class="cursor-pointer hover:underline" :to="`/student/care`">SOINS</router-link>
            /
            <span class="font-semibold">{{ care?.title }}</span>
         </p>
      </header>

      <div v-html="care?.content"></div>

   </main>
</template>

<script setup>
import { computed } from 'vue'

import { careOfId } from '/src/use/useCare'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   care_id: {
      type: Number,
      required: true
   },
})

const care = computed(() => careOfId.value(props.care_id))
</script>
