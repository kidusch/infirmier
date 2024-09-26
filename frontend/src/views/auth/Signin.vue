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
               Journal de bord Infirmier
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
            <!-- previous Google auth with secure Authorization Code Grant flow -->
            <!-- <a class="secondary-btn" :href="`/auth/google?cnxid=${cnxid}`" @click="spinner">
               <img src="/src/assets/google.svg" alt="google">
               <span>
                  Continuer avec Google
               </span>
            </a> -->
            <a class="secondary-btn" href="#" @click="googleLogin">
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
import { ref, onMounted } from 'vue'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'

import router from '/src/router'
// import { appState } from '/src/use/useAppState'
import { localSignin, googleSignin } from '/src/use/useAuthentication'


const email = ref()
const password = ref()

const validate = async () => {
   // errorMessage.value = ''
   try {
      const user = await localSignin(email.value.toLowerCase(), password.value)
      // go home
      router.push(`/home/${user.id}`)
   } catch(err) {
      if (err.message === 'wrong-credentials') {
         alert('Email ou mot de passe incorrect')
      } else {
         alert("Une erreur inconnue s'est produite")
      }
   }
}

const goSignup = () => {
   router.push('/signup')
}

// const spinner = () => {
//    appState.value.spinnerWaitingText = [ "Chargement..." ]
// }


onMounted(() => {
   try {
      // see: https://github.com/CodetrixStudio/CapacitorGoogleAuth
      GoogleAuth.initialize({
         clientId: import.meta.env.VITE_GOOGLE_APP_CLIENT_ID,
         scopes: ['profile', 'email'],
         // grantOfflineAccess: true,
      })
   } catch(err) {
      console.log('init err', err)
   }
})

const googleLogin = async () => {
   let googleUser
   try {
      googleUser = await GoogleAuth.signIn()
      console.log('gSignin', googleUser)
      const user = await googleSignin(googleUser)
      // go home
      router.push(`/home/${user.id}`)
   } catch(err) {
      console.log('googleSignin err', err)
   }
}
</script>
