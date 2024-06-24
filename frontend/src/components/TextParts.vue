<template>
   <template v-for="part in parts">
      <TextPart :uuid="uuid" :part="part" :highlight="highlight"></TextPart>
   </template>
</template>

<script setup>
import TextPart from '/src/components/TextPart.vue'

const props = defineProps({
   uuid: {
      type: String,
      required: true
   },
   parts: {
      type: Array,
      required: true
   },
   highlight: {
      type: String,
      default: 'yellow'
   },
})
</script>