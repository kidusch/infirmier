<template>
   
   <!-- <h1>Choisissez votre mot de passe</h1>

   <label class="input input-bordered flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
      <input type="password" v-model="password" class="grow" placeholder="Mot de passe" />
   </label>

   <label class="input input-bordered flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
      <input type="password" v-model="passwordConfirm" class="grow" placeholder="Mot de passe" />
   </label>

   <button class="block btn btn-primary" @click="validate">Valider</button> -->


   <div class="container max-w-lg py-4 flex flex-col h-screen">

      <header class="w-full flex justify-center">
         <img class="w-80 h-80" src="/src/assets/logo.png" alt="logo">
      </header>

      <section class="flex-1 flex flex-col justify-between">

         <section class="h-1/4 lg:h-auto flex flex-col">
            <h1 class="text-primary">
               Choisissez votre mot de passe
            </h1>
         </section>

         <div class="flex flex-col my-8 lg:my-4 h-1/4 lg:h-2/4 gap-16 lg:gap-">

            <div class="flex flex-col gap-6">
               <div class="flex flex-col">
                  <label for="nameInput">
                     Mot de passe
                  </label>
                  <input v-model="password" class="standard-input" placeholder="Entrez mot de passe" type="password">
               </div>

               <div class="flex flex-col">
                  <label for="nameInput">
                     Mot de passe (confirmation)
                  </label>
                  <input v-model="passwordConfirm" class="standard-input" placeholder="Entrer mot de passe" type="password">
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
   if (!password.value || !passwordConfirm.value) {
      alert("Il faut saisir un mot de passe, et le resaisir pour confirmation")
      return
   }
   if (password.value !== passwordConfirm.value) {
      alert("Les deux mots de passe ne sont pas identiques")
      return
   }
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