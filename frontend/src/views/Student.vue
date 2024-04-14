<template>
   <button class="block link" @click="signout">Logout</button>

   <h1 class="text-xl font-semibold">Student</h1>
</template>

<script setup>
import { onMounted } from 'vue'

import { setAuthenticatedUser, logout } from '/src/use/useAuthentication'
import { getUser } from '/src/use/useUser'

import router from '/src/router'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

onMounted(async () => {
   const user = await getUser(props.userid)
   setAuthenticatedUser(user)
})

const signout = async () => {
   await logout()
   router.push(`/`)
}
</script>
