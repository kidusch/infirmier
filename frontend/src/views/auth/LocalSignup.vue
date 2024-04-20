<template>
   <!-- <h1>Local signup</h1>

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
   </div> -->

   <div class="container max-w-lg py-4 flex flex-col h-svh">

      <!-- Logo -->
      <header class="w-full flex justify-center">
         <img class="w-60 h-60 lg:w-80 lg:h-80" src="/src/assets/logo.png" alt="logo">
      </header>

      <section class="flex-1 flex flex-col justify-between">

         <!-- Headings -->
         <section class="h-1/4 flex flex-col">
            <h1>
               Inscription au
            </h1>
            <h1 class="text-primary">
               Journal de bord Infirmier
            </h1>
         </section>

         <!-- Login Options -->
         <main class="flex flex-col gap-2 my-8 h-1/4">

            <button class="secondary-btn" @click="goGoogle">
               <img src="/src/assets/google.svg" alt="google">
               <span>
                  Continuer avec Google
               </span>
            </button>

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
         <footer class="flex-1 flex flex-col justify-end h-full py-2">
            <h4 class="text-center">
               Pas encore de compte? <button class="text-primary" @click="localSignin">S’inscrire</button>
            </h4>
         </footer>

      </section>

   </div>

   <Spinner v-if="isWaiting"></Spinner>

</template>

<script setup>
import { ref } from 'vue'

import app from '/src/client-app.js'
import { testEmail } from '/src/lib/utilities.mjs'
import { appState } from '/src/use/useAppState'

import Spinner from '/src/components/Spinner.vue'

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
