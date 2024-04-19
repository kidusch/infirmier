<template>
   <li class="flex">
      <textarea :value="element[field]" @input="debouncedInput" class="textarea textarea-bordered" placeholder="Titre" :disabled="disabled"></textarea>
      <span class="link m-2" @click="disabled = false">edit</span>
      <span class="link m-2" @click="remove">delete</span>
      <span class="link m-2" @click="up" v-if="!isFirst">up</span>
      <span class="link m-2" @click="down" v-if="!isLast">down</span>
      <span class="link m-2" @click="select">select</span>
   </li>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
   field: {
      type: String,
      required: true
   },
   index: {
      type: Number,
      required: true
   },
   list: {
      type: Array,
      required: true
   },
})

const emit = defineEmits(['update', 'remove', 'select'])

const element = computed(() => props.list[props.index])
const isFirst = computed(() => (props.index === 0))
const isLast = computed(() => (props.index === (props.list.length - 1)))

const up = () => {
   const prev = props.list[props.index - 1]
   const prevRank = prev.rank
   prev.rank = element.value.rank
   element.value.rank = prevRank
   emit('update', element.value, prev)
}

const down = () => {
   const next = props.list[props.index + 1]
   const nextRank = next.rank
   next.rank = element.value.rank
   element.value.rank = nextRank
   emit('update', element.value, next)
}

const remove = () => emit('remove')

const select = () => emit('select')
</script>