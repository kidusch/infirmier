<template>
   <template v-for="part of parts">
      <div
         :class="{
            'font-bold': isTitle || isBoldSpan,
            'text-4xl': isTitle1, 'text-3xl': isTitle2, 'text-2xl': isTitle3, 'text-xl': isTitle4,

            'text-red-600': isLexicon, underline: isLexicon,
            'hover:cursor-pointer': isLexicon,

            'bg-yellow-200': part.highlight === 'yellow', 'bg-orange-200': part.highlight === 'orange', 'bg-purple-200': part.highlight === 'purple',

            'inline': isSpan || isBoldSpan
         }"
         @mouseup="onMouseUp(part)" @mousedown="onMouseDown(part)" v-html="part.text"
         @touchend="onMouseUp(part)" @touchstart="onMouseDown(part)"
      ></div>
   </template>

   <slot></slot>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import stringHash from 'string-hash'


const props = defineProps({
   content: {
      type: Object,
      required: true
   },
})

const type = computed(() => props.content.type)
const titleCat = computed(() => props.content.cat)

console.log('props.content.text', props.content.text, props.content)
const hashValue = stringHash(props.content.text)

const parts = useLocalStorage(`part${hashValue}`, [
   {
      text: props.content.text,
      start: 0,
      end: props.content.text.length,
   }
])

const isBlock = computed(() => type.value === 'block')
const isSpan = computed(() => type.value === 'span')
const isTitle = computed(() => type.value === 'title')
const isTitle1 = computed(() => isTitle.value && props.content.cat === 1)
const isTitle2 = computed(() => isTitle.value && props.content.cat === 2)
const isTitle3 = computed(() => isTitle.value && props.content.cat === 3)
const isTitle4 = computed(() => isTitle.value && props.content.cat === 4)
const isBoldSpan = computed(() => type.value === 'bold-span')
const isLexicon = computed(() => type.value === 'lexicon')

// document.addEventListener('selectionchange', (e) => {
//    console.log('selectionchange')
// })

let selectedPart

function onMouseUp(part) {
   if (!props.highlight) return
   if (selectedPart !== part) { console.log('outside', part); return; }

   const selection = window.getSelection()
   // selection must not be empty
   if (!selection || selection.rangeCount === 0) return
   const range = selection.getRangeAt(0)
   if (range.startOffset === range.endOffset) return

   console.log('part', part)
   console.log('range', range)
   const partIndex = parts.value.indexOf(part)
   if (range.startOffset === part.start) {
      // replace part by 2 sub-parts, the left one being highlighted
      parts.value.splice(partIndex, 1, ...[
         {
            text: part.text.substring(range.startOffset, range.endOffset),
            start: part.start + range.startOffset,
            end: part.start + range.endOffset,
            highlight: props.highlight,
         },
         {
            text: part.text.substring(range.endOffset, part.end),
            start: part.start + range.endOffset,
            end: part.end,
         },
      ])
   } else if (range.endOffset === part.end) {
      // replace part by 2 sub-parts, the right one being highlighted
      parts.value.splice(partIndex, 1, ...[
         {
            text: part.text.substring(0, range.startOffset),
            start: 0,
            end: part.start + range.startOffset,
         },
         {
            text: part.text.substring(range.startOffset, range.endOffset),
            start: part.start + range.startOffset,
            end: part.end,
            highlight: props.highlight,
         },
      ])
   } else {
      // replace part by 3 sub-parts, the middle one being highlighted
      parts.value.splice(partIndex, 1, ...[
         {
            text: part.text.substring(0, range.startOffset),
            start: part.start,
            end: part.start + range.startOffset,
         },
         {
            text: part.text.substring(range.startOffset, range.endOffset),
            start: part.start + range.startOffset,
            end: part.start + range.endOffset,
            highlight: props.highlight,
         },
         {
            text: part.text.substring(range.endOffset, part.end),
            start: part.start + range.endOffset,
            end: part.end,
         },
      ])
   }
}

function onMouseDown(part) {
   selectedPart = part

   if (props.highlight === 'eraser' && part.highlight) {
      console.log('erase', part)
      selectedPart = null
      const partIndex = parts.value.indexOf(part)
      if (partIndex === 0) {
         const after = parts.value[partIndex + 1]
         parts.value.splice(partIndex, 2, {
            text: part.text + after.text,
            start: part.start,
            end: after.end,
         })
      } else if (partIndex === parts.value.length - 1) {
         const before = parts.value[partIndex - 1]
         parts.value.splice(partIndex - 1, 2, {
            text: before.text + part.text,
            start: before.start,
            end: part.end,
         })
      } else {
         const before = parts.value[partIndex - 1]
         const after = parts.value[partIndex + 1]
         parts.value.splice(partIndex - 1, 3, {
            text: before.text + part.text + after.text,
            start: before.start,
            end: after.end,
         })
      }
   }
}
</script>
