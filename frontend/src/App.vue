<template>

   <div class="absolute top-2 right-2">
      <p class="text-sm text-white p-1">{{ VERSION }}</p>
   </div>

   <button class="block btn btn-primary" @click="getExpirationTime">Expires at</button>
   <button class="block btn btn-primary" @click="chie">Chie</button>

   <router-view></router-view>

   <ReloadPWA></ReloadPWA>

</template>

<script setup>
import ReloadPWA from '/src/ReloadPWA.vue'
import { VERSION } from '/src/version'

import app from '/src/client-app.js'

async function getExpirationTime() {
   const time = await app.service('auth').getExpirationTime()
   console.log('expires at', time)
}

async function chie() {
   await app.service('caca').chie()
}
</script>
