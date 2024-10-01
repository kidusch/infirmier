<template>
   <main class="container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card mb-2">
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
            <button class="primary-btn px-8" @click="open">Charger un modèle FBX...</button>
         </div>

         <!-- <vue3dLoader
            width="200"
            height="200"
            :scale="{x: 0.9, y: 0.9, z: 0.9}"
            filePath="https://ftp.jcbuisson.dev/3d-models/helmet.fbx"
            backgroundColor="#eee"
         ></vue3dLoader> -->

         <vue3dLoader
            height="500"
            :filePath="`/static/uploads/${anatomy?.content}`"
            @process="onProcess"
            @load="onLoad"
         ></vue3dLoader>

      </main>
   </main>
</template>

<script setup>
import { computed } from 'vue'

import { useFileDialog } from '@vueuse/core'

import { readFileAsyncAsArrayBuffer } from '/src/lib/utilities.mjs'
import { anatomyOfId, updateAnatomy } from '/src/use/useAnatomy'
import { appState } from '/src/use/useAppState'

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

const onProcess = (e) => {
   const perc = Math.round((e.loaded * 100.) / e.total)
   appState.value.spinnerWaitingText = [ "Chargement...", `${perc} %`]
}

const onLoad = () => {
   appState.value.spinnerWaitingText = null
}

const { open, onChange } = useFileDialog({
   accept: '*',
   directory: false,
})

onChange(async (files) => {
   const file = files[0]
   console.log('file', file)
   const filePath = file.name
   const arrayBuffer = await readFileAsyncAsArrayBuffer(file)
   let transmittedCount = 0
   const CHUNKSIZE = 32768
   await app.service('file-upload').resetFile({
      dirKey: 'UPLOADS_DIR',
      filePath,
   })
   try {
      for (let offset = 0; offset < arrayBuffer.byteLength; offset += CHUNKSIZE) {
         // the last slice is usually smaller than `CHUNKSIZE`
         const arrayBufferSlice = arrayBuffer.slice(offset, offset + CHUNKSIZE)
         const {error} = await app.service('file-upload').appendToFile({
            dirKey: 'UPLOADS_DIR',
            filePath,
            arrayBuffer: arrayBufferSlice,
         })
         if (error) throw(error)

         transmittedCount += arrayBufferSlice.byteLength
         // await timeout(10) // ??? nécessaire pour que le spinner soit visible
         appState.value.spinnerWaitingText = [ "Uploading...", Math.round(transmittedCount * 100 / arrayBuffer.byteLength) + " %" ]
      }

      await updateAnatomy(props.anatomy_id, { content: filePath })

   } catch(err) {
      console.log('err', err)
   } finally {
      appState.value.spinnerWaitingText = null
   }
})
</script>
