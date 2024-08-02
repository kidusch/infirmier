<template>
    <main class="flex-1 container max-w-7xl mt-16">

      <!-- Settings -->
      <section class="w-full flex justify-end">
         <div class="link hover:text-red-600 text-blue-600" @click="back">
            Retour
         </div>
      </section>

      <!-- Document content -->
      <main class="mt-4">
         <div v-html="document?.content"></div>
      </main>

   </main>
</template>

<script setup>
import { computed } from 'vue'

import { documentOfId } from '/src/use/useDocument'

import router from "/src/router"


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

const back = () => {
   router.back()
}
</script>
