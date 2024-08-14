<template>
   <div class="container max-w-lg py-4 flex flex-col">

      <header class="w-full flex justify-center">
         <img class="w-80 h-80" src="/src/assets/logo.png" alt="logo">
      </header>

      <section class="flex-1 flex flex-col">

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
import { app } from '/src/client-app.js'


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
      const user = await app.service('auth').setPasswordWithToken(props.token, password.value)
      console.log('user', user)
      router.push('/login')
   } catch(err) {
      console.log('err', err)
      alert("Une erreur inconnue s'est produite")
   }
}
</script>