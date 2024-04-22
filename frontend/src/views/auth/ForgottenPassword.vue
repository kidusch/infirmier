<template>
   <!-- <h1>Mot de passe oublié ?</h1>

   <p>Entrez votre email ; si vous avez un compte associé, un email de modification de mot de passe vous sera envoyé</p>

   <label class="input input-bordered flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
      <input type="text" v-model="email" name="email" class="grow" placeholder="Email" />
   </label>
   <p class="text-red-600">{{ errorMessage }}</p>

   <button class="block btn btn-primary" @click="validate">Valider</button> -->

   <div class="container max-w-lg py-4 flex flex-col h-screen">

      <header class="w-full flex justify-center">
         <img class="w-80 h-80" src="/src/assets/logo.png" alt="logo">
      </header>

      <section class="flex-1 flex flex-col justify-between">

         <section class="h-1/4 lg:h-auto flex flex-col">
            <h1 class="text-primary">
               Mot de passe oublié
            </h1>
         </section>

         <div class="flex flex-col my-8 lg:my-4 h-1/4 lg:h-2/4 gap-16 lg:gap-">

            <p>
               Entrez votre email ; si vous avez un compte associé, un email de modification de mot de passe vous sera envoyé.
            </p>

            <div class="flex flex-col gap-6">
               <div class="flex flex-col">
                  <label for="emailInput">
                     Email
                  </label>
                  <input v-model="email" class="standard-input" placeholder="Entrer email" type="email">
               </div>
            </div>


            <div class="justify-center flex">
               <button class="primary-btn" @click="validate">
                  Valider
               </button>
            </div>

         </div>
      </section>
   </div>
</template>

<script setup>
import { ref } from 'vue'

import router from '/src/router'
import { appState } from '/src/use/useAppState'
import app from '/src/client-app.js'
import { testEmail } from '/src/lib/utilities.mjs'


const email = ref()


const validate = async () => {
   if (!testEmail(email.value)) {
      alert("L'email est incorrect")
      return
   }
   try {
      appState.value.isWaiting = true
      await app.service('auth', { timeout: 60000 }).forgottenPassword(email.value)
      alert("Merci. Un email de confirmation vient de vous être envoyé.")
      // go home
      router.push(`/`)
   } catch(err) {
      console.log('err', err)
      appState.value.unexpectedError = true
   } finally {
      appState.value.isWaiting = false
   }
}
</script>
