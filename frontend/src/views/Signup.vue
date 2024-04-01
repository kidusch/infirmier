<template>
   
   <h1>S'inscrire au Journal de Bord Infirmier</h1>

   <div>
      <button class="btn btn-wide" @click="goGoogle">
         <img src="/src/assets/google_logo.svg" class="w-6"/>
         Continuer avec Google
      </button>
   </div>

   <div>
      <button class="btn btn-wide" @click="goGoogle">
         Continuer avec un email @
      </button>
   </div>

   <div>
      Vous avez déjà un compte ? <a class="link" href="#" router-link="/signin">Connexion</a>
   </div>

</template>

<script setup>
const goGoogle = () => window.location.href = "/auth/google"
</script>