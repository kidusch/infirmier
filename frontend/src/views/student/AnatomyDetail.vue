<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/anatomy`">ANATOMIE</router-link>
            /
            <span class="font-semibold">{{ anatomy?.name }}</span>
         </p>
      </header>

      <vue3dLoader
         height="200"
         ffilePath="/src/3D/model.dae"
         filePath="https://ftp.jcbuisson.dev/3d-models/chair.dae"
      ></vue3dLoader>

   </main>
</template>

<script setup>
import { computed } from 'vue'

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

</script>
