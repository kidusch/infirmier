<template>

   <div class="absolute top-2 right-2">
      <p class="text-sm text-white p-1">{{ VERSION }}</p>
   </div>
   {{  route.path }} - {{  }}

   <button class="block btn btn-primary" @click="getCnxInfo">Infos</button>
   <button class="block btn btn-primary" @click="chie">Chie</button>

   <router-view></router-view>

   <ReloadPWA></ReloadPWA>

   <!-- EXPIRED MODAL -->
   <div class="modal" :class="{'modal-open': showExpiredModal}">
      <div class="modal-box max-w-xl">
         <div class="text-large mt-2 mb-4 font-semibold">
            La session a expiré
         </div>

         <div class="modal-action">
            <button class="btn btn-primary" @click="showExpiredModal = false">
               OK
            </button>
         </div>
      </div>
   </div>

   <!-- ERROR MODAL -->
   <div class="modal" :class="{'modal-open': showUnknowErrorModal}">
      <div class="modal-box max-w-xl">
         <div class="text-large mt-2 mb-4 font-semibold">
            Une erreur inconnue est survenue
         </div>

         <div class="modal-action">
            <button class="btn btn-primary" @click="showUnknowErrorModal = false">
               OK
            </button>
         </div>
      </div>
   </div>

</template>

<script setup>
import { ref } from 'vue'
import { useRoute} from 'vue-router'

import app from '/src/client-app.js'
import router from "/src/router"
import { VERSION } from '/src/version'

import ReloadPWA from '/src/ReloadPWA.vue'

const route = useRoute()

const showExpiredModal = ref(false)
const showUnknowErrorModal = ref(false)


async function getCnxInfo() {
   const time = await app.service('auth').getCnxInfo()
   console.log('expires at', time)
}

async function chie() {
   await app.service('caca').chie()
}


////////////////////////           PERIODIC PROBE OF AUTHENTICATION            ////////////////////////

const PROBE_PERIOD = import.meta.env.VITE_PROBE_PERIOD

// setInterval(async () => {
//    if (route.meta.requiresAuth) {
//       try {
//          // calls a service which needs authentication
//          await app.service('auth').checkAuthentication()
//       } catch(err) {
//          console.log('err', err.code, err.message)
//          if (err.code === 'not-authenticated') {
//             showExpiredModal.value = true
//             // restart application
//             await app.service('auth').signout()
//             router.push('/')
//          } else {
//             showUnknowErrorModal.value = true
//             // restart application
//             await app.service('auth').signout()
//             router.push('/')
//          }
//       }
//    }
// }, PROBE_PERIOD)

</script>
