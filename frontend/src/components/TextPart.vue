<template>
   <div
      :class="{
         'inline': isSpan || isBoldSpan,

         'font-bold': isTitle || isBoldSpan,
         'text-2xl': isTitle1, 'lg:text-4xl': isTitle1,
         'text-xl': isTitle2, 'lg:text-3xl': isTitle2,
         'text-lg': isTitle3, 'lg:text-2xl': isTitle3,
         'text-normal': isTitle4, 'mlg:text-xl': isTitle4,

         'text-red-600': isLexicon, underline: isLexicon,
         'hover:cursor-pointer': isLexicon,

         'bg-yellow-200': highlightedPart?.color === 'yellow',
         'bg-orange-200': highlightedPart?.color === 'orange',
         'bg-purple-200': highlightedPart?.color === 'purple',
      }"
      @selectstart="selectstart"

      v-html="highlightedPart?.text"
   ></div>

   <slot></slot>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

import { getOrCreateHighlightedPart, updateHighlightedPart } from '/src/use/useHighlightedPart.js'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   // topic_id or card_id is undefined
   topic_id: {
      type: Number,
   },
   card_id: {
      type: Number,
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
   highlightedPart.value = await getOrCreateHighlightedPart(props.userid, props.topic_id, props.card_id, props.part.text, 'black')
})

const type = computed(() => props.part.type)

const isSpan = computed(() => type.value === 'span')
const isTitle = computed(() => type.value === 'title')
const isTitle1 = computed(() => isTitle.value && props.part.cat === 1)
const isTitle2 = computed(() => isTitle.value && props.part.cat === 2)
const isTitle3 = computed(() => isTitle.value && props.part.cat === 3)
const isTitle4 = computed(() => isTitle.value && props.part.cat === 4)
const isBoldSpan = computed(() => type.value === 'bold-span')
const isLexicon = computed(() => type.value === 'lexicon')

async function selectstart() {
   // console.log('selectstart')
   const color = highlightedPart.value.color === 'black' ? props.highlight : 'black'
   highlightedPart.value = await updateHighlightedPart(highlightedPart.value.hash, { color })
}
</script>
