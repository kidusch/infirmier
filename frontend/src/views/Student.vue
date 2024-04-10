<template>
   <button class="block btn btn-primary" @click="signout">Logout</button>
   <h1>Student</h1>
</template>

<script setup>
import { useAuthentication } from '/src/use/useAuthentication'
import router from '/src/router'

const { logout } = useAuthentication()

const signout = async () => {
   await logout()
   router.push(`/`)
}
</script>
