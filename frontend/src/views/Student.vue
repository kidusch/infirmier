<template>
   <button class="block btn btn-primary" @click="signout">Logout</button>
   <h1>Student</h1>
</template>

<script setup>
import { onMounted } from 'vue'

import { useAuthentication } from '/src/use/useAuthentication'
import { useUser } from '/src/use/useUser'

import router from '/src/router'

const { setAuthenticatedUser, logout } = useAuthentication()
const { getUser } = useUser()

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
