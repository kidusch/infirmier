<template>
   <div class="flex gap-3 items-center">
      <div class="flex gap-1.5 w-16">
         <img class="h-8 cursor-pointer" src="/src/assets/sort_up_light.svg" v-if="!isFirst" @click="up">
         <img class="h-8 cursor-pointer" src="/src/assets/sort_down_light.svg" v-if="!isLast" @click="down">
      </div>
      <input class="standard-input flex-1" placeholder="Nom" type="text" :value="element.dataset.name" @input="debouncedInput" :disabled="disabled">
      <div class="flex gap-1.5">
         <img class="h-4 cursor-pointer" src="/src/assets/preview.svg" @click="select">
         <img class="h-4 cursor-pointer" src="/src/assets/edit.svg" v-if="!disabled" @click="disabled = !disabled">
         <img class="h-4 cursor-pointer" src="/src/assets/edit-off.svg" v-if="disabled" @click="disabled = !disabled">
         <img class="h-4 cursor-pointer" src="/src/assets/delete.svg" @click="remove">
      </div>
   </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps({
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
const disabled = ref(true)

const up = () => {
   const prev = props.list[props.index - 1]
   const prevRank = prev.dataset.rank
   prev.dataset.rank = element.value.dataset.rank
   element.value.dataset.rank = prevRank
   emit('update')
}

const down = () => {
   const next = props.list[props.index + 1]
   const nextRank = next.dataset.rank
   next.dataset.rank = element.value.dataset.rank
   element.value.dataset.rank = nextRank
   emit('update')
}

const remove = () => emit('remove')
const select = () => emit('select')

const onInput = async (ev) => {
   emit('edit', ev.target.value)
}
const debouncedInput = useDebounceFn(onInput, 500)

</script>