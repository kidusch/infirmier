<template>
   
   <h1>S'inscrire au Journal de Bord Infirmier</h1>

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