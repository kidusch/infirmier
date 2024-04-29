<template>
   <div class="my-2" v-if="type === 'block'">
      <template v-for="part of parts">
         <span :class="{ 'bg-yellow-200': part.highlight === 'yellow', 'bg-orange-200': part.highlight === 'orange', 'bg-purple-200': part.highlight === 'purple' }"
            @mouseup="onMouseUp(part)" @mousedown="onMouseDown(part)" v-html="part.text"
            @touchend="onMouseUp(part)" @touchstart="onMouseDown(part)"
         ></span>
      </template>
   </div>

   <div class="my-4" v-if="type === 'title-block'">
      <template v-for="part of parts">
         <span class="font-bold text-4xl" :class="{ 'bg-yellow-200': part.highlight === 'yellow', 'bg-orange-200': part.highlight === 'orange', 'bg-purple-200': part.highlight === 'purple' }"
            @mouseup="onMouseUp(part)" @mousedown="onMouseDown(part)" v-html="part.text"
            @touchend="onMouseUp(part)" @touchstart="onMouseDown(part)"
         ></span>
      </template>
   </div>

   <template v-if="type === 'bold-span'">
      <template v-for="part of parts">
         <span class="font-bold" :class="{ 'bg-yellow-200': part.highlight === 'yellow', 'bg-orange-200': part.highlight === 'orange', 'bg-purple-200': part.highlight === 'purple' }"
            @mouseup="onMouseUp(part)" @mousedown="onMouseDown(part)" v-html="part.text"
            @touchend="onMouseUp(part)" @touchstart="onMouseDown(part)"
         ></span>
      </template>
   </template>

   <template v-if="type === 'span'">
      <template v-for="part of parts">
         <span :class="{ 'bg-yellow-200': part.highlight === 'yellow', 'bg-orange-200': part.highlight === 'orange', 'bg-purple-200': part.highlight === 'purple' }"
            @mouseup="onMouseUp(part)" @mousedown="onMouseDown(part)" v-html="part.text"
            @touchend="onMouseUp(part)" @touchstart="onMouseDown(part)"
         ></span>
      </template>
   </template>

   <template v-if="type === 'lexicon'">
      <template v-for="part of parts">
         <div class="tooltip" data-tip="À suivre...">
            <span class="font-medium text-red-600 underline hover:cursor-pointer" :class="{ 'bg-yellow-200': part.highlight === 'yellow', 'bg-orange-200': part.highlight === 'orange', 'bg-purple-200': part.highlight === 'purple' }"
               @mouseup="onMouseUp(part)" @mousedown="onMouseDown(part)" v-html="part.text"
               @touchend="onMouseUp(part)" @touchstart="onMouseDown(part)"
            ></span>
         </div>
      </template>
   </template>

   <slot></slot>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import stringHash from 'string-hash'


const props = defineProps({
   text: {
      type: String,
      required: true
   },
   type: {
      type: String,
      default: 'block'
   },
   highlight: {
      type: String,
      default: 'yellow'
   },
})

const hashValue = stringHash(props.text)

const parts = useLocalStorage(`part${hashValue}`, [
{
      text: props.text,
      start: 0,
      end: props.text.length,
   }
])

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
