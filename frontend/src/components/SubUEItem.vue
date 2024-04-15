<template>
   <li class="flex">
      <textarea v-model="ue.name" class="textarea textarea-bordered" placeholder="Titre" :disabled="disabled"></textarea>
      <span class="link m-2" @click="disabled = false">edit</span>
      <span class="link m-2" @click="remove">delete</span>
      <span class="link m-2" @click="up" v-if="!isFirst">up</span>
      <span class="link m-2" @click="down" v-if="!isLast">down</span>
      <span class="link m-2" @click="select">select</span>
   </li>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
   index: {
      type: Number,
      required: true
   },
   ueList: {
      type: Array,
      required: true
   },
})

const emit = defineEmits(['update', 'remove', 'select'])

const ue = computed(() => props.ueList[props.index])
const isFirst = computed(() => (props.index === 0))
const isLast = computed(() => (props.index === (props.ueList.length - 1)))

const disabled = ref(true)

const up = () => {
   const prevUE = props.ueList[props.index - 1]
   const prevRank = prevUE.rank
   prevUE.rank = ue.value.rank
   ue.value.rank = prevRank
   emit('update')
}

const down = () => {
   const nextUE = props.ueList[props.index + 1]
   const nextRank = nextUE.rank
   nextUE.rank = ue.value.rank
   ue.value.rank = nextRank
   emit('update')
}

const remove = () => emit('remove')

const select = () => emit('select')
</script>