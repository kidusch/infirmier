<template>

   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <span class="font-semibold">Agendas partagés</span>
         </p>
      </header>

      <main class="flex flex-col gap-6 pb-4">
         <div class="flex flex-col gap-3">

            <div v-for="user in listOfUserSharingAgenda">
               <div class="flex gap-3 items-center">
                  <input class="standard-input flex-1" placeholder="Titre" type="text" :value="user.name" disabled>
                  <div class="flex gap-1.5">
                     <img class="h-4 cursor-pointer" src="/src/assets/thick-arrow-right.svg" @click="select(user)">
                  </div>
               </div>
            </div>

         </div>
      </main>
   </main>
</template>

<script setup>
import { computed } from 'vue'

import { listOfUser } from '/src/use/useUser'

import router from "/src/router"

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const listOfUserSharingAgenda = computed(() => listOfUser.value.filter(user => user.shared_agenda))


const select = (user) => {
   router.push(`/admin/admin-agenda/${user.id}`)
}
</script>
