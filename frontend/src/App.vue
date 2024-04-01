<template>

   <div class="absolute top-2 right-2">
      <p class="text-sm text-white p-1">{{ VERSION }}</p>
   </div>

   <router-view></router-view>

   <ReloadPWA></ReloadPWA>

</template>

<script setup>
import ReloadPWA from '/src/ReloadPWA.vue'
import { VERSION } from '/src/version'

import app from '/src/client-app.js'

</script>
