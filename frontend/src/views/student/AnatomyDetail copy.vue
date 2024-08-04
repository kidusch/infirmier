<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <router-link class="cursor-pointer hover:underline" :to="`/student/anatomy`">ANATOMIE</router-link>
            /
            <span class="font-semibold">{{ anatomy?.name }}</span>
         </p>
      </header>

      <div v-for="path, index in featuredPaths">
         <div class="flex items-center pb-1.5">
            <input type="checkbox" :checked="path.style.opacity === 0.33" @click="ev => path.style.opacity = ev.target.checked ? 0.33 : 1." class="checkbox checkbox-primary" />

            <label for="default-radio-1" class="font-normal ml-2 w-full">
               <p class="text-black">
                  {{ path.dataset.name }}
               </p>
            </label>

         </div>
      </div>

      <div v-html="anatomy?.content" ref="svg"></div>

   </main>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

import { anatomyOfId } from '/src/use/useAnatomy'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   anatomy_id: {
      type: Number,
      required: true
   },
})

const anatomy = computed(() => anatomyOfId.value(props.anatomy_id))

const svg = ref(null)
const featuredPaths = ref([])
const selectedPaths = ref([])

function updateSelectedPaths() {
   const result = []
   for (const path of svg.value.querySelectorAll('path')) {
      if (!path.dataset.rank) continue
      result.push(path)
   }
   featuredPaths.value = result.sort((path1, path2) => path1.dataset.rank - path2.dataset.rank)
}

onMounted(() => {
   updateSelectedPaths()
})
</script>
