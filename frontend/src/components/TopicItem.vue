<template>
   <li class="flex">
      <textarea :value="topic.name" @input="debouncedInput" class="textarea textarea-bordered" placeholder="Titre" :disabled="disabled"></textarea>
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
   topicList: {
      type: Array,
      required: true
   },
})

const emit = defineEmits(['update', 'remove', 'select'])

const topic = computed(() => props.topicList[props.index])
const isFirst = computed(() => (props.index === 0))
const isLast = computed(() => (props.index === (props.topicList.length - 1)))

const disabled = ref(true)

const up = () => {
   const prevUE = props.topicList[props.index - 1]
   const prevRank = prevUE.rank
   prevUE.rank = topic.value.rank
   topic.value.rank = prevRank
   emit('update')
}

const down = () => {
   const nextUE = props.topicList[props.index + 1]
   const nextRank = nextUE.rank
   nextUE.rank = topic.value.rank
   topic.value.rank = nextRank
   emit('update')
}

const remove = () => emit('remove')

const select = () => emit('select')

const onInput = (ev) => {
   emit('edit', ev.target.value)
}
const debouncedInput = useDebounceFn(onInput, 500)
</script>