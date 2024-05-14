<template>
   <template v-for="part of parts">
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

            'bg-yellow-200': part.highlight === 'yellow',
            'bg-orange-200': part.highlight === 'orange',
            'bg-purple-200': part.highlight === 'purple',
         }"
         @selectstart="selectstart(part)"

         v-html="part.text"
      ></div>
   </template>

   <slot></slot>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import stringHash from 'string-hash'

import { createHighlightedPart, getHighlightedPart} from '/src/use/useHighlightedPart.js'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   topic_id: {
      type: Number,
      required: true
   },
   content: {
      type: Object,
      required: true
   },
   highlight: {
      type: String,
      default: 'yellow'
   },
})

const type = computed(() => props.content.type)

// hash includes text & user_id & topic_id
const hashValue = stringHash(`${props.content.text},${props.userid},${props.topic_id}`)

const parts = useLocalStorage(`part${hashValue}`, [
   {
      text: props.content.text,
      start: 0,
      end: props.content.text.length,
   }
])

const isSpan = computed(() => type.value === 'span')
const isTitle = computed(() => type.value === 'title')
const isTitle1 = computed(() => isTitle.value && props.content.cat === 1)
const isTitle2 = computed(() => isTitle.value && props.content.cat === 2)
const isTitle3 = computed(() => isTitle.value && props.content.cat === 3)
const isTitle4 = computed(() => isTitle.value && props.content.cat === 4)
const isBoldSpan = computed(() => type.value === 'bold-span')
const isLexicon = computed(() => type.value === 'lexicon')

function selectstart(part) {
   // console.log('selectstart')
   part.highlight = part.highlight ? undefined : props.highlight
}
</script>
