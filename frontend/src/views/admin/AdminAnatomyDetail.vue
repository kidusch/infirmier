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
            <button class="primary-btn px-8" @click="open">Charger un modèle FBX...</button>
            <!-- <button class="primary-btn px-8" @click="loadFBX('/src/3D/angiology.fbx')">Load FBX...</button> -->
         </div>

         <!-- <vue3dLoader
            v-if="url"
            :height="500"
            :filePath="url"
            crossOrigin="anonymous"
            :backgroundColor="0xff00ff"
         ></vue3dLoader> -->

         <!-- <vue3dLoader
            height="200"
            filePath="url || '/src/3D/chair.dae'"
         ></vue3dLoader> -->

         <!-- <vue3dLoader
            width="200"
            height="200"
            :scale="{x: 0.9, y: 0.9, z: 0.9}"
            fffilePath="/src/3D/chair.dae"
            filePath="https://ftp.jcbuisson.dev/3d-models/helmet.fbx"
            backgroundColor="#eee"
         ></vue3dLoader> -->

         <div ref="target"></div>

      </main>
   </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { useFileDialog } from '@vueuse/core'
import { get, set } from 'idb-keyval'

import { readFileAsyncAsArrayBuffer } from '/src/lib/utilities.mjs'
import { anatomyOfId, getAnatomy, updateAnatomy } from '/src/use/useAnatomy'
import { appState } from '/src/use/useAppState'
import { timeout } from '/src/lib/utilities'
import { loadFBXFromArrayBuffer } from '/src/lib/3D'

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

onChange(async (files) => {
   const file = files[0]
   console.log('file', file)
   const filePath = file.name
   const arrayBuffer = await readFileAsyncAsArrayBuffer(file)
   let transmittedCount = 0
   const CHUNKSIZE = 32768
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

      // store in Indexedb under the key `filePath` (they need to be all different)
      await set(filePath, arrayBuffer)

      const group = await loadFBXFromArrayBuffer(arrayBuffer)
      scene.add(group)

      group.scale.set(0.1, 0.1, 0.1); // Adjust scale
      group.position.set(0, 0, 0);    // Adjust position

      await updateAnatomy(props.anatomy_id, { content: filePath })

   } catch(err) {
      console.log('err', err)
   } finally {
      appState.value.spinnerWaitingText = null
   }
})

const target = ref();

const WIDTH = 600
const HEIGHT = 800
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);

// Create an instance of OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// Set some properties for OrbitControls (optional)
controls.enableDamping = true; // Enable inertia
controls.dampingFactor = 0.25; // Damping inertia
controls.screenSpacePanning = true; // Disable pan
controls.maxPolarAngle = Math.PI / 2; // Limit vertical angle

camera.position.set(0, 4, 8);

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

const gridHelper = new THREE.GridHelper(2000, 100);
scene.add(gridHelper);



function animate() {
   requestAnimationFrame(animate);

   controls.update()

   renderer.render(scene, camera);
}

onMounted(async () => {
   target.value.appendChild(renderer.domElement)

   const anatomy = await getAnatomy(props.anatomy_id)
   if (anatomy.content) {
      const arrayBuffer = await get(anatomy.content)
      console.log('idb', arrayBuffer)
      if (arrayBuffer) {
         appState.value.spinnerWaitingText = [ "Chargement..." ]
         const group = await loadFBXFromArrayBuffer(arrayBuffer)
         appState.value.spinnerWaitingText = null
         scene.add(group)

         group.scale.set(0.1, 0.1, 0.1); // Adjust scale
         group.position.set(0, 0, 0);    // Adjust position
      }
   }

   animate()
});
</script>
