<template>
   <template v-if="part?.type === 'Text'">
      <span @click="onClick">
         {{ part?.value }}
      </span>
   </template>

   <template v-if="part?.type === 'Element' && part?.name === 'h3'">
      <h3>
         <template v-for="child in part.children">
            <TextPart :uuid="uuid" :part="child" :highlight="highlight"></TextPart>
         </template>
      </h3>
   </template>


   <!-- <template v-else>
      <template v-if="part?.name === 'div'">
         <div>
            <template v-for="child in part.children">
               <TextPart :uuid="uuid" :part="child" :highlight="highlight"></TextPart>
            </template>
         </div>
      </template>
      <template v-if="part?.name === 'h1'">
         <h1>
            <template v-for="child in part.children">
               <TextPart :uuid="uuid" :part="child" :highlight="highlight"></TextPart>
            </template>
         </h1>
      </template>
      <template v-if="part?.name === 'h2'">
         <h2>
            <template v-for="child in part.children">
               <TextPart :uuid="uuid" :part="child" :highlight="highlight"></TextPart>
            </template>
         </h2>
      </template>
      <template v-if="part?.name === 'h3'">
         <h3>
            <template v-for="child in part.children">
               <TextPart :uuid="uuid" :part="child" :highlight="highlight"></TextPart>
            </template>
         </h3>
      </template>
   </template> -->


   <template v-for="child in part.children">
      <TextPart :uuid="uuid" :part="child" :highlight="highlight"></TextPart>
   </template>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

import { getOrCreateHighlightedPart, updateHighlightedPart } from '/src/use/useHighlightedPart.js'
import TextParts from '/src/components/TextParts.vue'


const props = defineProps({
   uuid: {
      type: String,
      required: true
   },
   part: {
      type: Object,
      required: true
   },
   highlight: {
      type: String,
      default: 'yellow'
   },
})

const highlightedPart = ref()

onMounted(async () => {
   // highlightedPart.value = await getOrCreateHighlightedPart(props.uuid, props.part.text, 'black')
})


async function onClick() {
   console.log('click')
   return
   const color = highlightedPart.value.color === props.highlight ? 'none' : props.highlight
   highlightedPart.value = await updateHighlightedPart(highlightedPart.value.hash, { color })
}
</script>
