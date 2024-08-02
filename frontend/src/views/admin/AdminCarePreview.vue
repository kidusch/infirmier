<template>
    <main class="flex-1 container max-w-7xl mt-16">

      <!-- Settings -->
      <section class="w-full flex justify-end">
         <div class="link hover:text-red-600 text-blue-600" @click="back">
            Retour
         </div>
      </section>

      <!-- Course content -->
      <main class="mt-4">
         <div v-html="care?.content"></div>
      </main>

   </main>
</template>

<script setup>
import { computed } from 'vue'

import { careOfId } from '/src/use/useCare'

import router from "/src/router"


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

const back = () => {
   router.back()
}
</script>
