<template>

   <div class="absolute top-2 right-2">
      <p class="text-sm text-white p-1">{{ VERSION }}</p>
   </div>

   <button class="block btn btn-primary" @click="timeLeft">Time left</button>
   <button class="block btn btn-primary" @click="chie">Chie</button>

   <router-view></router-view>

   <ReloadPWA></ReloadPWA>

</template>

<script setup>
import ReloadPWA from '/src/ReloadPWA.vue'
import { VERSION } from '/src/version'

import app from '/src/client-app.js'

async function timeLeft() {
   const left = await app.service('auth').getTimeLeftBeforeExpiration()
   console.log('left', left)
}

async function chie() {
   await app.service('caca').chie()
}
</script>
