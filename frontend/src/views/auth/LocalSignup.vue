<template>
   <div class="container max-w-lg py-4 flex flex-col h-screen">

      <!-- Logo -->
      <header class="w-full flex justify-center">
         <img class="w-80 h-80" src="/src/assets/logo.png" alt="logo">
      </header>

      <section class="flex-1 flex flex-col justify-between">

         <!-- Headings -->
         <section class="h-1/4 lg:h-auto flex flex-col">
            <h1>
                  Inscription au
            </h1>
            <h1 class="text-primary">
                  Journal de bord Infirmier
            </h1>
         </section>

         <!-- Login Options -->
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
                     Nom ou pseudo
                  </label>
                  <input v-model="name" class="standard-input" placeholder="Entrer nom ou pseudo" type="text">
               </div>
            </div>


            <div class="justify-center flex">
               <button class="primary-btn" @click="validate" :disabled="false">
                  S’incrire
               </button>
            </div>

         </div>

         <!-- footer -->
         <footer class="flex-1 flex flex-col justify-end h-full py-2">
            <h4 class="text-center">
               Vous avez déjà un compte? <button class="text-primary" @click="login">Connexion</button>
            </h4>
         </footer>

      </section>
   </div>

</template>

<script setup>
import { ref } from 'vue'

import { app } from '/src/client-app.js'
import { testEmail } from '/src/lib/utilities.mjs'
import { appState } from '/src/use/useAppState'
import router from "/src/router"

const email = ref()
const name = ref()


const validate = async () => {
   if (!email.value || !name.value) {
      alert("Il faut saisir un email et un nom")
      return
   }
   if (!testEmail(email.value)) {
      alert("L'email est incorrect")
      return
   }
   try {
      appState.value.spinnerWaitingText = [ "Envoi..." ]
      await app.service('auth', { timeout: 60000 }).localSignup(email.value.toLowerCase(), name.value)
      alert("Merci ! Regardez dans votre boite mail, un message de confirmation vient de vous être envoyé")
   } catch(err) {
      if (err.code === 'email-already-used') {
         alert("Cet email est déjà utilisé")
      } else {
         alert("Une erreur s'est produite lors de l'envoi de l'email de confirmation")
      }
   } finally {
      appState.value.spinnerWaitingText = null
   }
}

const login = () => {
   router.push('/login')
}
</script>
