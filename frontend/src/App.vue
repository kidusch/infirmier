<template>

   <div v-if="needRefresh" class="fixed bottom-0 right-0 m-4 p-4 bg-green-100 border-solid rounded z-50">
      Une nouvelle version est disponible <a href="#" class="text-blue-400 hover:underline ml-2" @click="updateServiceWorker">installer</a>
   </div>

   <router-view></router-view>

   <Spinner v-if="appState?.spinnerWaitingText" class="z-40">
      <div>
         <template v-for="line in appState.spinnerWaitingText">
            <div class="text-center font-bold text-white text-2xl">{{ line }}</div>
         </template>
      </div>
   </Spinner>

</template>

<script setup>
import { watch, onMounted } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { App } from '@capacitor/app';

import { appState, resetUseAppState } from '/src/use/useAppState'
import { restartApp } from '/src/use/useAuthentication'

import Spinner from '/src/components/Spinner.vue'


// test, works for iOS, see: https://capacitorjs.com/docs/guides/deep-links
App.addListener('appUrlOpen', (data) => {
   alert(`Deep link! ${data?.url}`)
})

watch(() => appState.value?.unrecoverableError, async (value) => {
   if (value) restartApp()
})

watch(() => appState.value?.isNotAuthenticated, async (value) => {
   if (value) restartApp()
})

// watchdog de 100s sur le spinner
watch(() => appState.value?.spinnerWaitingText, async (value) => {
   if (value) {
      setTimeout(() => {
         appState.value.spinnerWaitingText = null
      }, 100000)
   }
})


/////////////////      PREVENT COPY EVERYWHERE     ////////////////

onMounted(() => {
   document.addEventListener('copy', (event) => {
      event.preventDefault()
   })

   // allows page reload to unlock spinner (?? MARCHE PAS ??)
   resetUseAppState()
})


/////////////////      AUTOMATIC VERSION UPDATE     ////////////////

// POSSIBLE DE SIMPLIFIER AVEC registerType: 'autoUpdate'
// VOIR : https://vite-pwa-org.netlify.app/guide/auto-update.html

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
   immediate: true,
   onRegistered(r) {
      console.log(`SW onRegistered: ${r}`)
      r && setInterval(async() => {
         console.log('Checking for sw update')
         await r.update()
         console.log('needRefresh', needRefresh.value)
         // if (needRefresh.value) {
         //    // update app
         //    console.log('updating app..!')
         //    updateServiceWorker()
         // }
      }, 20000 /* check every 20s */)
   },
})

</script>
