<template>
   <button class="block link" @click="signout">Logout</button>

   <router-view></router-view>

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

   if (user.admin) {
      router.push(`/home/${props.userid}/admin-ue`)
   } else {
      router.push(`/home/${props.userid}/student`)
   }
})

const signout = async () => {
   await logout()
   router.push(`/`)
}
</script>
