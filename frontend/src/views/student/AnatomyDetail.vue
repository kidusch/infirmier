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
      
      <vue3dLoader
         height="500"
         :filePath="filePath"
         @process="onProcess"
         @load="onLoad"
      ></vue3dLoader>

   </main>
</template>

<script setup>
import { computed } from 'vue'

import { anatomyOfId } from '/src/use/useAnatomy'
import { appState } from '/src/use/useAppState'


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

const filePath = computed(() => `${import.meta.env.VITE_SERVER || ''}/static/uploads/${anatomy.value?.content}`)

const onProcess = (e, index) => {
   const perc = Math.round((e.loaded * 100.) / e.total)
   appState.value.spinnerWaitingText = [ "Chargement...", `${perc} %`]
}

const onLoad = () => {
   console.log('load')
   appState.value.spinnerWaitingText = null
}
</script>
