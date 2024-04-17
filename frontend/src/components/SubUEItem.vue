<template>
   <li class="flex">
      <textarea :value="subUE.name" @input="debouncedInput" class="textarea textarea-bordered" placeholder="Titre" :disabled="disabled"></textarea>
      <span class="link m-2" @click="disabled = false">edit</span>
      <span class="link m-2" @click="remove">delete</span>
      <span class="link m-2" @click="up" v-if="!isFirst">up</span>
      <span class="link m-2" @click="down" v-if="!isLast">down</span>
      <span class="link m-2" @click="select">select</span>
   </li>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps({
   index: {
      type: Number,
      required: true
   },
   subUEList: {
      type: Array,
      required: true
   },
})

const emit = defineEmits(['update', 'remove', 'select'])

const subUE = computed(() => props.subUEList[props.index])
const isFirst = computed(() => (props.index === 0))
const isLast = computed(() => (props.index === (props.subUEList.length - 1)))

const disabled = ref(true)

const up = () => {
   const prevUE = props.subUEList[props.index - 1]
   const prevRank = prevUE.rank
   prevUE.rank = subUE.value.rank
   subUE.value.rank = prevRank
   emit('update')
}

const down = () => {
   const nextUE = props.subUEList[props.index + 1]
   const nextRank = nextUE.rank
   nextUE.rank = subUE.value.rank
   subUE.value.rank = nextRank
   emit('update')
}

const remove = () => emit('remove')

const select = () => emit('select')

const onInput = (ev) => {
   emit('edit', ev.target.value)
}
const debouncedInput = useDebounceFn(onInput, 500)
</script>