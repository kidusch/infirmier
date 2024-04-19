<template>
   <h1>Mot de passe oublié ?</h1>

   <p>Entrez votre email ; si vous avez un compte associé, un email de modification de mot de passe vous sera envoyé</p>

   <label class="input input-bordered flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
      <input type="text" v-model="email" name="email" class="grow" placeholder="Email" />
   </label>
   <p class="text-red-600">{{ errorMessage }}</p>

   <button class="block btn btn-primary" @click="validate">Valider</button>
</template>

<script setup>
import { ref } from 'vue'

import router from '/src/router'
import { appState } from '/src/use/useAppState'
import app from '/src/client-app.js'
import { testEmail } from '/src/lib/utilities.mjs'


const email = ref()
const errorMessage = ref('')


const validate = async () => {
   errorMessage.value = ''
   try {
      appState.value.isWaiting = true
      await app.service('auth').forgottenPassword(email.value)
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
