<template>
    <main class="flex-1 container max-w-7xl mt-12">

      <!-- Settings -->
      <section class="w-full flex justify-end">
         <div class="link hover:text-red-600 text-blue-600" @click="back">
            Retour
         </div>
      </section>

      <!-- Course content -->
      <!-- <main class="mt-4">
         <TextParts :userid="userid" :topic_id="topic_id" :card_id="undefined" :parts="parts" highlight="none"></TextParts>
      </main> -->
      <main class="mt-4">
         <div v-html="card?.content"></div>
      </main>

   </main>
</template>

<script setup>
import { onMounted, computed } from 'vue'

import { cardOfId } from '/src/use/useCard'

// import parser from '/src/lib/grammar.js'
// import TextParts from '/src/components/TextParts.vue'

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

// const parts = ref([])

const card = computed(() => cardOfId.value(props.card_id))

onMounted(async () => {
   // try {
   //    parts.value = parser.parse(course.value.content)
   //    console.log('parts', parts.value)
   // } catch(err) {
   //    parts.value = ''
   // }
})

const back = () => {
   router.back()
}
</script>
