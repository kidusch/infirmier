<template>
   <!-- <li class="flex">
      <span>{{ element[field] }}</span>
      <span class="link m-2" @click="remove">delete</span>
      <span class="link m-2" @click="up" v-if="!isFirst">up</span>
      <span class="link m-2" @click="down" v-if="!isLast">down</span>
      <span class="link m-2" @click="select">select</span>
   </li> -->

   <div class="flex gap-3 items-center">
      <div class="flex gap-1.5 w-16">
         <img class="h-8 cursor-pointer" src="/src/assets/sort_up_light.svg" v-if="!isFirst" @click="up">
         <img class="h-8 cursor-pointer" src="/src/assets/sort_down_light.svg" v-if="!isLast" @click="down">
      </div>
      <input class="standard-input flex-1" placeholder="Titre" type="text" :value="element[field]" @input="debouncedInput" disabled>
      <div class="flex gap-1.5">
         <img class="h-4 cursor-pointer" src="/src/assets/delete.svg" @click="remove">
         <img class="h-4 cursor-pointer" src="/src/assets/thick-arrow-right.svg" @click="select">
      </div>
   </div>

</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
   field: {
      type: String,
      default: 'title'
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