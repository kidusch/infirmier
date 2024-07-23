<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-anatomy`">Anatomie</router-link>
            /
            <span class="font-semibold">{{ anatomy?.name }}</span>
         </p>
      </header>

      <main class="flex flex-col gap-3">
         <div>
            <div class="flex justify-between">
               <label>Titre</label>
               <img class="h-5 mb-1" src="/src/assets/edit.svg"  @click="disabledName = !disabledName">
            </div>
            <div class="standard-input-container">
               <input placeholder="Nom de la carte anatomique..." type="text"
                  :value="anatomy?.name"
                  @input="debouncedInputName"
                  :disabled="disabledName"
               />
            </div>
         </div>
         
         <div>
            <button class="primary-btn px-8" @click="open">Chargez un fichier SVG...</button>
         </div>

         <div v-html="anatomy.content"></div>
      </main>
   </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFileDialog } from '@vueuse/core'

import { readFileAsyncAsArrayBuffer } from '/src/lib/utilities.mjs'
import { anatomyOfId, getAnatomy, updateAnatomy } from '/src/use/useAnatomy'

import { app } from '/src/client-app.js'


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


const { open, onChange } = useFileDialog({
  accept: 'image/svg+xml',
  directory: false,
})

const svg = ref()

onChange(async (files) => {
   const file = files[0]
   const arrayBuffer = await readFileAsyncAsArrayBuffer(file)
   const decoder = new TextDecoder('utf-8')
   const utf8Svg = decoder.decode(arrayBuffer)

   updateAnatomy(props.anatomy_id, { content: utf8Svg })
})

document.addEventListener('mouseover', function (event) {
   console.log('document mouseover', event.target)
}, false)

</script>
