<template>
   
   <!-- <h1>S'inscrire au Journal de Bord Infirmier</h1>

   <div>
      <button class="btn btn-wide" @click="goGoogle">
         <img src="/src/assets/google_logo.svg" class="w-6"/>
         Continuer avec Google
      </button>
   </div>

   <div>
      <button class="btn btn-wide" @click="localSignup">
         Continuer avec un email @
      </button>
   </div>

   <div>
      Vous avez déjà un compte ? <RouterLink to="/login" class="link">Connexion</RouterLink>
   </div>
 -->
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
               Pas encore de compte? <button class="text-primary">S’inscrire</button>
            </h4>
         </footer>

      </section>

   </div>

</template>

<script setup>
import router from "@/router"

const goGoogle = () => {
   window.location.href = `/auth/google?cnxid=${sessionStorage.cnxid}`
}

const localSignup = () => {
   router.push('/local-signup')
}
</script>