<template>
   
   <!-- <h1>Se connecter au Journal de Bord Infirmier</h1>

   <div>
      <button class="btn btn-wide" @click="goGoogle">
         <img src="/src/assets/google_logo.svg" class="w-6"/>
         Continuer avec Google
      </button>
   </div>

   <div>
      <button class="btn btn-wide" @click="localSignin">
         Continuer avec un email @
      </button>
   </div>

   <div>
      Pas encore de compte ? <RouterLink to="/signup" class="link">S'inscrire</RouterLink>
   </div> -->

   <div class="container max-w-lg py-4 flex flex-col h-screen">

      <!-- Logo -->
      <header class="w-full flex justify-center">
         <img class="w-80 h-80" src="/src/assets/logo.png" alt="logo">
      </header>

      <section class="flex-1 flex flex-col justify-between">

         <!-- Headings -->
         <section class="h-1/4 lg:h-auto flex flex-col">
            <h1>
               Connexion au
            </h1>
            <h1 class="text-primary">
               Journal de bord Infirmier
            </h1>
         </section>

         <!-- Login Options -->
         <form class="flex flex-col my-8 lg:my-4 h-1/4 lg:h-2/4 gap-16 lg:gap-">

            <div class="flex flex-col gap-6">
               <div class="flex flex-col">
                  <label for="emailInput">
                     Email
                  </label>
                  <input class="standard-input" placeholder="Entrer Email" type="email">
               </div>

               <div class="flex flex-col">
                  <label for="nameInput">
                     Nom ou pseudo
                  </label>
                  <input class="standard-input" placeholder="Entrer nom ou pseudo" type="text">
               </div>
            </div>


            <div class="justify-center flex">
               <button type="submit" class="primary-btn">
                  S’incrire
               </button>
            </div>


         </form>

         <!-- footer -->
         <footer class="flex-1 flex flex-col justify-end h-full py-2">
            <h4 class="text-center">
               Vous avez déjà un compte? <button class="text-primary">Connexion</button>
            </h4>
         </footer>
      </section>

   </div>


</template>

<script setup>
import router from "/src/router"

const goGoogle = () => {
   window.location.href = `/auth/google?cnxid=${sessionStorage.cnxid}`
}

const localSignin = () => {
   router.push('/local-signin')
}
</script>