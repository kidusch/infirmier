
<template>
   <div class="modal" :class="{'modal-open': needRefresh}">
      <div class="modal-box max-w-xl">
         <div class="text-large mt-2 mb-4 font-semibold">
            Une version améliorée est disponible
         </div>

         <div class="modal-action">
            <button class="btn btn-primary" @click="updateServiceWorker">
               Installer
            </button>
         </div>
      </div>
   </div>


</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

// replaced dynamicaly

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
   immediate: true,
   onRegistered(r) {
      console.log(`SW onRegistered: ${r}`)
      r && setInterval(async() => {
         console.log('Checking for sw update')
         await r.update()
         console.log('needRefresh', needRefresh.value)
      }, 20000 /* check every 20s */)
   },
})
</script>
