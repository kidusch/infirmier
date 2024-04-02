<template>
   <h1>Journal de bord infirmier</h1>
   <button class="block btn btn-primary" @click="signin">Se connecter</button>
   <button class="block btn btn-primary" @click="signup">S'inscrire</button>
</template>

<script setup>
import router from "/src/router"

function signin() {
   router.push('/signin')
}

function signup() {
   router.push('/signup')
}
</script>