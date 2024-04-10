<template>
   <h1>Local signup</h1>

   <label class="form-control w-full max-w-xs">
      <div class="label">
         <span class="label-text">Email</span>
      </div>
      <input type="text" v-model="email" name="email" placeholder="email" class="input input-bordered w-full max-w-xs" />
      <div class="label">
         <span class="label-text-alt">email incorrect</span>
      </div>
   </label>

   <label class="form-control w-full max-w-xs">
      <div class="label">
         <span class="label-text">Nom ou pseudo</span>
      </div>
      <input type="text" v-model="name" name="fullname" placeholder="email" class="input input-bordered w-full max-w-xs" />
   </label>

   <button class="block btn btn-primary" @click="validate" :disabled="false">Valider</button>

   <div>
      Vous avez déjà un compte ? <RouterLink to="/login" class="link">connexion</RouterLink>
   </div>

   <Spinner v-if="isWaiting"></Spinner>

</template>

<script setup>
import { ref } from 'vue'

import app from '/src/client-app.js'
import { testEmail } from '/src/lib/utilities.mjs'
import { useAppState } from '/src/use/useAppState'

import Spinner from '/src/components/Spinner.vue'

const { appState } = useAppState()

const email = ref()
const name = ref()

const isWaiting = ref(false)


const validate = async () => {
   try {
      isWaiting.value = true
      await app.service('auth', { timeout: 60000 }).localSignup(email.value, name.value)
   } catch(err) {
      if (err.code === 'email-already-used') {
         alert("Cet email est déjà utilisé")
      } else {
         appState.value.unexpectedError = true
      }
      console.log('signup error', err)
   } finally {
      isWaiting.value = false
   }
}
</script>
