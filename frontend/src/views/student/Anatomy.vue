<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <span>ANATOMIE</span>
         </p>
      </header>

      <!-- Main content -->
      <main class="flex flex-col gap-6 pb-6">

         <svg id="mySvg" width="200" height="200">
            <path id="path1" d="M10 10 H 90 V 90 H 10 Z" fill="red"/>
            <path id="path2" d="M110 10 H 190 V 90 H 110 Z" fill="blue"/>
         </svg>

         <div v-html="svg4"></div>
         
      </main>

   </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const svg4 = ref()

onMounted(async () => {

   const rep = await fetch('/src/assets/france.svg')
   svg4.value = await rep.text()

   // const paths = document.querySelectorAll('path')
   // for (const path of paths) {
   //    console.log('path', path)
   //    path.addEventListener('mouseover', (event) => {
   //       console.log('path listener', event.target)
   //    })
   // }

   document.addEventListener('click', function (event) {
      console.log('document click', event.target)
   }, false);

   document.addEventListener('mouseover', function (event) {
      console.log('document mouseover', event.target)
   }, false);
})
</script>
