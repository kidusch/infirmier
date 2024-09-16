<template>
   <body class="py-4 lg:pt-2 flex flex-col h-screen relative">

      <!-- navbar -->
      <nav class="lg:border-b lg:pb-2 fixed w-full bg-white" :class="{ 'top-10': isIOS, 'top-0': !isIOS }">

         <main class="flex w-full justify-between items-center container max-w-7xl">

            <a class="flex items-center gap-4 lg:flex-1 lg:px-12" href="#">
               <img class="h-12" src="/src/assets/logo.svg" alt="Logo">
               <h3 class="max-lg:hidden">Journal de bord IDE</h3>
            </a>

            <button @click="buy">
               Buy
            </button>

            <button>
               <img class="h-9" src="/src/assets/user.svg" alt="user" @click="login">
            </button>

         </main>

      </nav>

      <!-- main body -->
      <main class=" container max-w-7xl flex-1 flex flex-col">
         
         <header class="mt-12 w-full flex justify-center flex-1">
            <img class="object-contain sm:max-w-2xl" :src="adminMisc?.welcome_img" alt="home_illustration">
         </header>

         <main class="flex-1 flex flex-col items-center justify-evenly text-center">

            <div class="flex flex-col gap-4">
               <h1>
                  Journal de bord IDE
               </h1>
               <p v-html="adminMisc?.welcome_text"></p>
            </div>
            <button class="primary-btn px-10" @click="signup">
               S’incrire
            </button>
         </main>
      </main>

   </body>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Capacitor } from '@capacitor/core'
// import "cordova-plugin-purchase"
import { InAppPurchase } from 'jcb-capacitor-inapp'

import router from "/src/router"
import { app } from '/src/client-app.js'

const isIOS = ref(Capacitor.getPlatform() === 'ios')

const adminMisc = ref({})

onMounted(async () => {
   // the only row of table 'admin_misc' is supposed to have id=1
   adminMisc.value = await app.service('admin_misc').findUnique({ where: { id: 1 }})

   const x = await InAppPurchase.echo({ value: "Hello, Capacitor!" })
   console.log('x', x)

   initializeStore()
})


const productId = '6683299457'

function initializeStore() {
   // Ensure Cordova is loaded before initializing the store
   document.addEventListener('deviceready', () => {      
      console.log('Device is ready, initializing store...')
      // console.log('CdvPurchase', CdvPurchase)

      return

      const {store, ProductType, Platform} = CdvPurchase
      
      // Initialize the store
      store.verbosity = store.DEBUG; // Optional, for debugging
      store.register({
         id: productId,
         type: store.NON_CONSUMABLE, // or store.CONSUMABLE for consumable products
         platform: Platform.TEST,
      })
      
      // When the product is successfully purchased
      store.when(productId).approved((order) => {
         console.log('Purchase Approved!')
         order.finish()
      })

      // Handle failed purchases
      store.error((error) => {
         console.log('Purchase Failed', error.message)
      });

      // Finish initialization and request product details
      store.refresh()
   })
}

function login() {
   router.push('/login')
}

function signup() {
   router.push('/signup')
}

function buy() {

}
</script>