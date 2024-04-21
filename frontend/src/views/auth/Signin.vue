<template>
   <div class="container max-w-lg py-4 flex flex-col h-screen">

      <header class="w-full flex justify-center">
         <img class="w-80 h-80" src="/src/assets/logo.png" alt="logo">
      </header>

      <section class="flex-1 flex flex-col justify-between">

         <section class="h-1/4 lg:h-auto flex flex-col">
            <h1>
               Connexion au
            </h1>
            <h1 class="text-primary">
               Journal de bord Infirmier
            </h1>
         </section>

         <div class="flex flex-col my-8 lg:my-4 h-1/4 lg:h-2/4 gap-16 lg:gap-">

            <div class="flex flex-col gap-6">
               <div class="flex flex-col">
                  <label for="emailInput">
                     Email
                  </label>
                  <input v-model="email" class="standard-input" placeholder="Entrer email" type="email">
               </div>

               <div class="flex flex-col">
                  <label for="nameInput">
                     Mot de passe
                  </label>
                  <input v-model="password" class="standard-input" placeholder="Entrer mot de passe" type="password">

                  <RouterLink to="/forgotten-password" class="link">Mot de passe oublié</RouterLink>
               </div>
            </div>

            <div class="justify-center flex">
               <button class="primary-btn" @click="validate">
                  Connexion
               </button>
            </div>

         </div>
         <button class="secondary-btn" @click="goGoogle">
            <img src="/src/assets/google.svg" alt="google">
            <span>
               Continuer avec Google
            </span>
         </button>

         <footer class="flex-1 flex flex-col justify-end h-full py-2">
            <h4 class="text-center">
               Vous n'avez pas de compte ? <button class="text-primary" @click="goSignup">Inscrivez-vous</button>
            </h4>
         </footer>
      </section>

   </div>
</template>

<script setup>
import { ref } from 'vue'

import router from '/src/router'
import { appState } from '/src/use/useAppState'
import { localSignin } from '/src/use/useAuthentication'


const email = ref()
const password = ref()
const errorMessage = ref('')

const validate = async () => {
   errorMessage.value = ''
   try {
      const user = await localSignin(email.value, password.value)
      // go home
      router.push(`/home/${user.id}`)
   } catch(err) {
      console.log('login error', err)
      if (err.code === 'wrong-credentials') {
         errorMessage.value = "wrong credentials"
      } else {
         appState.value.unexpectedError = true
      }
   }
}

const goGoogle = () => {
   window.location.href = `/auth/google?cnxid=${sessionStorage.cnxid}`
}

const goSignup = () => {
   router.push('/signup')
}
</script>
