<template>

   <router-view></router-view>

   <Spinner v-if="appState.isWaiting"></Spinner>

</template>

<script setup>
import { watch } from 'vue'
import { useRoute} from 'vue-router'
import { useRegisterSW } from 'virtual:pwa-register/vue'

import app from '/src/client-app.js'

import { appState } from '/src/use/useAppState'
import { restartApp } from '/src/use/useAuthentication'

import Spinner from '/src/components/Spinner.vue'

const route = useRoute()


watch(appState.unrecoverableError, async (value) => {
   if (value) restartApp()
})

watch(appState.isExpired, async (value) => {
   if (value) restartApp()
})


////////////////////////           PERIODIC PROBE OF AUTHENTICATION            ////////////////////////

const PROBE_PERIOD = import.meta.env.VITE_PROBE_PERIOD || 10000

setInterval(async () => {
   if (route.meta.requiresAuth) {
      try {
         // calls a service which needs authentication
         await app.service('auth').ping()
      } catch(err) {
         console.log('err', err.code, err.message)
         restartApp()
      }
   }
}, PROBE_PERIOD)


/////////////////      AUTOMATIC VERSION UPDATE     ////////////////

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
