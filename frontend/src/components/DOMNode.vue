<template>
   <template v-for="child in node?.children">

      <template v-if="child?.type === 'Text'">
         <span v-bind="attrs(child?.attributes)" @click="onClick">
            {{ child?.value }}
         </span>
      </template>

      <template v-if="child?.type === 'Element' && child?.name === 'h3'">
         <h3 v-bind="attrs(child?.attributes)">
            <DOMNode :uuid="uuid" :node="child" :highlight="highlight"></DOMNode>
         </h3>
      </template>

      <template v-else>
         <DOMNode :uuid="uuid" :node="child" :highlight="highlight"></DOMNode>
      </template>

   </template>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

import { getOrCreateHighlightedPart, updateHighlightedPart } from '/src/use/useHighlightedPart.js'


const props = defineProps({
   uuid: {
      type: String,
      required: true
   },
   node: {
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
   highlightedPart.value = await getOrCreateHighlightedPart(props.uuid, props.part.text, 'black')
})

const attrs = (list) => {
   if (!list) return []
   const res = {}
   for (const item of list) {
      res[item.name] = item.value
   }
   return res
}


async function onClick() {
   console.log('click')
   const color = highlightedPart.value.color === props.highlight ? 'none' : props.highlight
   highlightedPart.value = await updateHighlightedPart(highlightedPart.value.hash, { color })
}
</script>
