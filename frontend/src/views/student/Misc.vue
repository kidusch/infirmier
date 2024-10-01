<template>
   <main class="container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card mb-2">
         <p>
            <span>Divers</span>
         </p>
      </header>

      <!-- Main content -->
      <main class="flex flex-col gap-6 pb-6">

         <button class="primary-btn px-10" @click="onNotification">
            Notifications
         </button>

      </main>

   </main>
</template>

<script setup>
import { ref } from 'vue'

import { getWebPushSubscription } from '/src/lib/utilities.mjs'
import { app } from '/src/client-app.js'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const onNotification = async () => {
   try {
         const subscription = await getWebPushSubscription()
         console.log('sub', subscription)
         if (subscription) await app.service('notification').addSubscription(props.userid, subscription)
      } catch(err) {
         console.log('err subscription', err)
      }
}
</script>
