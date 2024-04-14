<template>

   <div class="absolute top-2 right-2">
      <p class="text-sm text-gray-600 p-1">{{ VERSION }}</p>
   </div>

   <button class="block link" @click="getCnxInfo">Infos</button>
   <button class="block link" @click="chie">Chie</button>

   <router-view></router-view>

   <ReloadPWA></ReloadPWA>

   <!-- EXPIRED MODAL -->
   <div class="modal" :class="{'modal-open': appState.isExpired}">
      <div class="modal-box max-w-xl">
         <div class="text-large mt-2 mb-4 font-semibold">
            La session a expiré
         </div>

         <div class="modal-action">
            <button class="btn btn-primary" @click="restartApp">
               OK
            </button>
         </div>
      </div>
   </div>

   <!-- ERROR MODAL -->
   <div class="modal" :class="{'modal-open': appState.unexpectedError}">
      <div class="modal-box max-w-xl">
         <div class="text-large mt-2 mb-4 font-semibold">
            Une erreur est survenue
         </div>

         <div class="modal-action">
            <button class="btn btn-primary" @click="restartApp">
               OK
            </button>
         </div>
      </div>
   </div>

   <Spinner v-if="appState.isWaiting"></Spinner>

</template>

<script setup>
import { useRoute} from 'vue-router'
import { useRegisterSW } from 'virtual:pwa-register/vue'

import app from '/src/client-app.js'
import router from "/src/router"
import { VERSION } from '/src/version'

import { appState } from '/src/use/useAppState'

import Spinner from '/src/components/Spinner.vue'


const route = useRoute()


const restartApp = async () => {
   appState.value.isExpired = false
   appState.value.unexpectedError = false
   await app.service('auth').logout()
   router.push('/')
}

async function getCnxInfo() {
   const time = await app.service('auth').getCnxInfo()
   console.log('expires at', time)
}

async function chie() {
   try {
      await app.service('caca').chie()
   } catch(err) {
      appState.value.unexpectedError = true
   }
}


////////////////////////           PERIODIC PROBE OF AUTHENTICATION            ////////////////////////

const PROBE_PERIOD = import.meta.env.VITE_PROBE_PERIOD

setInterval(async () => {
   if (route.meta.requiresAuth) {
      try {
         // calls a service which needs authentication
         await app.service('auth').ping()
      } catch(err) {
         console.log('err', err.code, err.message)
         if (err.code === 'not-authenticated') {
            appState.value.isExpired = true
         } else {
            appState.value.unexpectedError = true
         }
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
