<template>
   <div class="container max-w-lg py-4 flex flex-col">

      <header class="w-full flex justify-center">
         <img class="w-64 h-64" src="/src/assets/logo.png" alt="logo">
      </header>

      <section class="flex-1 flex flex-col">

         <section class="flex flex-col">
            <h1>
               Connexion au
            </h1>
            <h1 class="text-primary">
               Journal de bord Infirmier - {{ cnxid }}
            </h1>
         </section>

         <div class="flex flex-col mt-2">

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

            <div class="justify-center flex my-8">
               <button class="primary-btn" @click="validate">
                  Connexion
               </button>
            </div>

         </div>
         
         <div class="flex flex-col">
            <a class="secondary-btn" :href="`/auth/google?cnxid=${cnxid}`" @click="spinner">
               <img src="/src/assets/google.svg" alt="google">
               <span>
                  Continuer avec Google
               </span>
            </a>
         </div>

         <footer>
            <h4 class="text-center my-3">
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

const cnxid = ref(sessionStorage.cnxid)
const email = ref()
const password = ref()
// const errorMessage = ref('')

const validate = async () => {
   // errorMessage.value = ''
   try {
      const user = await localSignin(email.value, password.value)
      // go home
      router.push(`/home/${user.id}`)
   } catch(err) {
      if (err.code === 'wrong-credentials') {
         // errorMessage.value = "wrong credentials"
         alert('Email ou mot de passe incorrect')
      } else {
         alert("Une erreur inconnue s'est produite")
      }
   }
}

const goSignup = () => {
   router.push('/signup')
}

const spinner = () => {
   appState.value.isWaiting = true
}
</script>
