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
         ffilePath="/src/3D/splanchnology.fbx"
         filePath="https://ftp.jcbuisson.dev/3d-models/helmet.fbx"
      ></vue3dLoader>

      <div ref="target"></div>

   </main>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { get, set } from 'idb-keyval'

import { anatomyOfId, getAnatomy } from '/src/use/useAnatomy'
import { appState } from '/src/use/useAppState'
import { loadFBXFromArrayBuffer } from '/src/lib/3D'
import { readURIAsArrayBuffer } from '/src/lib/utilities'


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

// onMounted(async () => {
//    target.value.appendChild(renderer.domElement)

//    try {
//       appState.value.spinnerWaitingText = [ "Chargement..." ]
//       const anatomy = await getAnatomy(props.anatomy_id)
//       const filePath = anatomy.content
//       if (filePath) {
//          // try to load fbx model from Indexedb under the key `filePath`
//          let arrayBuffer = await get(filePath)
//          console.log('idb', arrayBuffer)
//          if (!arrayBuffer) {
//             // load fbx model from network
//             const uri = `/static/uploads/${filePath}`
//             arrayBuffer = await readURIAsArrayBuffer(uri)
//             console.log('arrayBuffer', arrayBuffer)
//             // cache arrayBuffer in IndexedDB 
//             set(filePath, arrayBuffer)
//          }
//          // load fbx model from array buffer
//          const group = await loadFBXFromArrayBuffer(arrayBuffer)
//          scene.add(group)
//          group.scale.set(0.1, 0.1, 0.1); // Adjust scale
//          group.position.set(0, 0, 0);    // Adjust position
//       }
//    } catch(err) {
//       console.log(err)
//    } finally {
//       appState.value.spinnerWaitingText = null
//    }

//    animate()
// })
</script>
