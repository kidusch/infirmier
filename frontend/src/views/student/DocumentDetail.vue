<template>
    <main class="container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card mb-2">
         <p>
            <router-link class="cursor-pointer hover:underline" :to="`/student/document`">DOCUMENTS</router-link>
            /
            <span class="font-semibold">{{ document?.title }}</span>
         </p>
      </header>

      <div v-html="document?.content"></div>

   </main>
</template>

<script setup>
import { computed } from 'vue'

import { documentOfId } from '/src/use/useDocument'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   document_id: {
      type: Number,
      required: true
   },
})

const document = computed(() => documentOfId.value(props.document_id))
</script>
