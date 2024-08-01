<template>
    <main class="flex-1 container max-w-7xl mt-14">

      <!-- Settings -->
      <section class="w-full flex justify-end">
         <div class="link hover:text-red-600 text-blue-600" @click="back">
            Retour
         </div>
      </section>

      <main class="mt-4">
         <div v-html="card?.content"></div>
      </main>

   </main>
</template>

<script setup>
import { computed } from 'vue'

import { cardOfId } from '/src/use/useCard'

import router from "/src/router"


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   ue_id: {
      type: Number,
      required: true
   },
   sub_ue_id: {
      type: Number,
      required: true
   },
   topic_id: {
      type: Number,
      required: true
   },
   card_id: {
      type: Number,
      required: true
   },
})

const card = computed(() => cardOfId.value(props.card_id))

const back = () => {
   router.back()
}
</script>
