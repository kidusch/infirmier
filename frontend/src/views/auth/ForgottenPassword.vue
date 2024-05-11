<template>
   <div class="container max-w-lg py-4 flex flex-col">

      <header class="w-full flex justify-center">
         <img class="w-80 h-80" src="/src/assets/logo.png" alt="logo">
      </header>

      <section class="flex-1 flex flex-col">

         <section class="flex flex-col">
            <h1 class="text-primary">
               Mot de passe oublié
            </h1>
         </section>

         <div class="flex flex-col my-8">

            <p>
               Entrez votre email ; si vous avez un compte associé, un email de modification de mot de passe vous sera envoyé.
            </p>

            <div class="flex flex-col my-4">
               <label for="emailInput">
                  Email
               </label>
               <input v-model="email" class="standard-input" placeholder="Entrer email" type="email">
            </div>

            <div class="flex flex-col justify-center">
               <button class="primary-btn" @click="validate">
                  Valider
               </button>
               <RouterLink to="/" class="link mt-3">Retour</RouterLink>
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
      alert("Une erreur s'est produite lors de l'envoi de l'email de confirmation")
   } finally {
      appState.value.isWaiting = false
   }
}
</script>
