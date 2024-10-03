<template>
   <main class="container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card mb-2">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/student/messages`">Messagerie</router-link>
         </p>
      </header>

      <UserUserMessagesWithScroll v-if="adminId"
         :userid="userid" :userId="adminId"
         :offset="250">
      </UserUserMessagesWithScroll>

   </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { app } from '/src/client-app.js'
import UserUserMessagesWithScroll from '/src/components/UserUserMessagesWithScroll.vue'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const adminId = ref()

onMounted(async () => {
   const adminList = await app.service('user').findMany({ where: { admin: true }})
   if (adminList?.length > 0) adminId.value = adminList[0].id
})
</script>
