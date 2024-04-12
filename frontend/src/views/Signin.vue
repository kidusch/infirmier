<template>
   
   <h1>Se connecter au Journal de Bord Infirmier</h1>

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
   </div>

</template>

<script setup>
import router from "/src/router"
import { useAppState } from '/src/use/useAppState'

const { appState } = useAppState()

const goGoogle = () => {
   appState.value.inGoogleAuth = true
   window.location.href = `/auth/google?cnxid=${sessionStorage.cnxid}`
}

const localSignin = () => {
   router.push('/local-signin')
}
</script>