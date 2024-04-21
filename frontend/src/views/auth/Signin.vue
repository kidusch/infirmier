<template>
   <!-- <h1>Local login</h1>

   <label class="input input-bordered flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
      <input type="text" v-model="email" name="email" class="grow" placeholder="Email" />
   </label>

   <label class="input input-bordered flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
      <input type="password" v-model="password" class="grow" placeholder="Mot de passe" />
   </label>
   <p class="text-red-600">{{ errorMessage }}</p>

   <div>
      <RouterLink to="/forgotten-password" class="link">Mot de passe oublié</RouterLink>
   </div>

   <button class="block btn btn-primary" @click="validate">Connexion</button>

   <hr>

   <div>
      <button class="btn btn-wide" @click="goGoogle">
         <img src="/src/assets/google_logo.svg" class="w-6"/>
         Continuer avec Google
      </button>
   </div>

   <div>
      Vous n'avez pas de compte ? <RouterLink to="/signup" class="link">Inscrivez-vous</RouterLink>
   </div> -->

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
