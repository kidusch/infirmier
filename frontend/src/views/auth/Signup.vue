<template>
   
   <div class="container max-w-lg py-4 flex flex-col">

      <!-- Logo -->
      <header class="w-full flex justify-center">
         <img class="w-64 h-64" src="/src/assets/logo.png" alt="logo">
      </header>

      <section class="flex-1 flex flex-col">

         <!-- Headings -->
         <section class="flex flex-col">
            <h1>
               Inscription au
            </h1>
            <h1 class="text-primary">
               Journal de bord Infirmier
            </h1>
         </section>

         <!-- Login Options -->
         <main class="flex flex-col gap-2 my-8">

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

            <div class="flex gap-2 items-center justify-center">
               <span class="h-px w-1/4 bg-black/20"></span>
               <p>ou</p>
               <span class="h-px w-1/4 bg-black/20"></span>
            </div>

            <button class="secondary-btn bg-secondary" @click="localSignup">
               <img src="/src/assets/email.svg" alt="email">
               <span>
                  Continuer avec un Email
               </span>
            </button>
         </main>

         <!-- footer -->
         <footer>
            <h4 class="text-center mb-3">
               Vous avez déjà un compte? <button class="text-primary" @click="login">Connexion</button>
            </h4>
         </footer>

      </section>
   </div>
</template>

<script setup>
import { onMounted } from 'vue'
// import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
import { GoogleAuth } from 'jcb-capacitor-googleauth'

import { googleSignin } from '/src/use/useAuthentication'

import router from "/src/router"


const localSignup = () => {
   router.push('/local-signup')
}

const login = () => {
   router.push('/login')
}

onMounted(() => {
   try {
      // see: https://github.com/CodetrixStudio/CapacitorGoogleAuth
      GoogleAuth.initialize({
         clientId: import.meta.env.VITE_GOOGLE_APP_CLIENT_ID,
         scopes: ['profile', 'email'],
         grantOfflineAccess: true,
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

// const spinner = () => {
//    appState.value.spinnerWaitingText = [ "Chargement..." ]
// }
</script>