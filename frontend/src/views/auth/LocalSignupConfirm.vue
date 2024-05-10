<template>
   <div class="container max-w-lg py-4 flex flex-col">

      <!-- Logo -->
      <header class="w-full flex justify-center">
         <img class="w-80 h-80" src="/src/assets/logo.png" alt="logo">
      </header>

      <section class="flex-1 flex flex-col justify-between">

         <section class="h-1/4 lg:h-auto flex flex-col">
            <h1>
               Conditions Générales d'Utilisation
            </h1>
         </section>

         <div class="flex flex-col">

            <!-- CGU text -->
            <div v-html="adminMisc?.cgu"></div>

            <div class="form-control">
               <label class="label cursor-pointer">
                  <span class="label-text">J'accepte ces conditions</span> 
                  <!-- <input type="radio" value="" class="w-4 h-4 " :checked="accept === true" @click="accept = true" /> -->
                  <input type="checkbox" :checked="accept === true" @click="accept = true" class="checkbox checkbox-primary" />
               </label>
               </div>
               <div class="form-control">
               <label class="label cursor-pointer">
                  <span class="label-text">Je refuse ces conditions</span> 
                  <!-- <input type="radio" value="" class="w-4 h-4 " :checked="accept === false" @click="accept = false" /> -->
                  <input type="checkbox" :checked="accept === false" @click="accept = false" class="checkbox checkbox-primary" />

               </label>
            </div>

            <div class="justify-center flex">
               <button class="primary-btn" @click="validate">
                  Valider
               </button>
            </div>

         </div>

      </section>
   </div>
</template>

<script setup>
import { ref, onMounted, createApp } from 'vue'

import router from '/src/router'
import app from '/src/client-app.js'


const props = defineProps({
   token: {
      type: String,
      required: true
   },
})

const adminMisc = ref()

onMounted(async () => {
   adminMisc.value = await app.service('admin_misc').findUnique({ where: { id: 1 }})
})

const accept = ref()

const validate = () => {
   if (accept.value === undefined) {
      alert("Vous devez choisir d'accepter ou de refuser les conditions en cochant les cases correspondantes")
   }
   if (accept.value === true) {
      router.push(`/set-password/${props.token}`)
   } else {
      router.push(`/`)
   }
}
</script>