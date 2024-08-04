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

      <!-- <vue3dLoader
         height="500"
         filePath="/src/3D/splanchnology.fbx"
         ffilePath="https://ftp.jcbuisson.dev/3d-models/chair.dae"
      ></vue3dLoader> -->

      <div ref="target"></div>

   </main>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import * as THREE from 'three'

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




const target = ref();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 500);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

onMounted(() => {
  target.value.appendChild(renderer.domElement);
  animate();
})
</script>
