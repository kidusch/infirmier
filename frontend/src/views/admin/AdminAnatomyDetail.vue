<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/admin/admin-anatomy`">Anatomie</router-link>
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
            <button class="primary-btn px-8" @click="open">Charger un modèle 3D...</button>
         </div>

         <vue3dLoader
            v-if="url"
            :height="500"
            :filePath="url"
            crossOrigin="anonymous"
            :backgroundColor="0xff00ff"
         ></vue3dLoader>

      </main>
   </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFileDialog } from '@vueuse/core'
import { get, set } from 'idb-keyval'

import { readFileAsyncAsArrayBuffer } from '/src/lib/utilities.mjs'
import { anatomyOfId, updateAnatomy } from '/src/use/useAnatomy'

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
   accept: '*',
//    accept: 'application/x-fbx, model/vnd.collada+xml, model/gltf+json, model/gltf-binary, model/stl, application/sla, application/x-tgif, text/plain, application/x-obj',
   directory: false,
})

const fileProgress = ref(0)
const fileUploading = ref(0)
const url = ref()

onChange(async (files) => {
   const file = files[0]
   console.log('file', file)
   const arrayBuffer = await readFileAsyncAsArrayBuffer(file)
   let transmittedCount = 0
   fileProgress.value = 0
   fileUploading.value = true
   // const CHUNKSIZE = 1048576 // 1M
   const CHUNKSIZE = 2048
   try {
      for (let offset = 0; offset < arrayBuffer.byteLength; offset += CHUNKSIZE) {
         // the last slice is usually smaller than `CHUNKSIZE`
         const arrayBufferSlice = arrayBuffer.slice(offset, offset + CHUNKSIZE)
         const {error} = await app.service('file-upload').appendToFile({
            dirKey: 'UPLOADS_DIR',
            filePath: file.name,
            arrayBuffer: arrayBufferSlice,
         })
         if (error) throw(error)

         transmittedCount += arrayBufferSlice.byteLength
         fileProgress.value = Math.round(transmittedCount * 100 / arrayBuffer.byteLength)
      }

      // store in Indexedb
      // await set(anatomy.value.id, arrayBuffer)

      const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' })
      // Create a URL pointing to the Blob
      url.value = URL.createObjectURL(blob)
      console.log('url', url.value)

   } catch(err) {
      console.log('err', err)
   } finally {
      fileProgress.value = undefined
      fileUploading.value = false
   }

})

</script>
