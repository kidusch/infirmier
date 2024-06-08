<template>

   <router-view></router-view>

   <Spinner v-if="appState?.isWaiting"></Spinner>

</template>

<script setup>
import { watch } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

import { appState } from '/src/use/useAppState'
import { restartApp } from '/src/use/useAuthentication'

import Spinner from '/src/components/Spinner.vue'


watch(() => appState.value?.unrecoverableError, async (value) => {
   if (value) restartApp()
})

watch(() => appState.value?.isExpired, async (value) => {
   if (value) restartApp()
})


/////////////////      PREVENT COPY EVERYWHERE     ////////////////

// onMounted(() => {
//    document.addEventListener('copy', (event) => {
//       event.preventDefault()
//    })
// })


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
         if (needRefresh.value) {
            // update app
            console.log('updating app..!')
            updateServiceWorker()
         }

      }, 20000 /* check every 20s */)
   },
})

</script>
