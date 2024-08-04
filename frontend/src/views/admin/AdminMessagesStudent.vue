<template>
   <main class="ffflex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card mt-6 mb-2">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/admin/admin-messages`">Messagerie</router-link>
            /
            <span class="font-semibold">{{ student?.name }}</span>
         </p>
      </header>

      <UserUserMessagesWithScroll
         :userid="userid" :userId="studentId"
         :offset="205">
      </UserUserMessagesWithScroll>

   </main>
</template>

<script setup>
import { computed } from 'vue'

import { userOfId } from '/src/use/useUser'
import UserUserMessagesWithScroll from '/src/components/UserUserMessagesWithScroll.vue'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   studentId: {
      type: Number,
      required: true
   },
})

const student = computed(() => userOfId.value(props.studentId))
</script>
