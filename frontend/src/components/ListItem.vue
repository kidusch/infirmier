<template>
   <div class="flex gap-3 items-center">
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

const emit = defineEmits(['remove', 'select'])

const element = computed(() => props.list[props.index])

const remove = () => emit('remove')

const select = () => emit('select')
</script>