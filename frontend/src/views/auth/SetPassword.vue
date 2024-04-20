<template>
   
   <h1>Choisissez votre mot de passe</h1>

   <label class="input input-bordered flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
      <input type="password" v-model="password" class="grow" placeholder="Mot de passe" />
   </label>

   <label class="input input-bordered flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
      <input type="password" v-model="passwordConfirm" class="grow" placeholder="Mot de passe" />
   </label>

   <button class="block btn btn-primary" @click="validate">Valider</button>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import router from '/src/router'
import app from '/src/client-app.js'
import { appState } from '/src/use/useAppState'


const props = defineProps({
   token: {
      type: String,
      required: true
   },
})

onMounted(() => {
   console.log('token', props.token)
})

const password = ref()
const passwordConfirm = ref()

const validate = async () => {
   try {
      const user = await app.service('auth').setPassword(props.token, password.value)
      console.log('user', user)
      router.push('/login')
   } catch(err) {
      console.log('err', err)
      appState.value.unexpectedError = true
   }
}
</script>