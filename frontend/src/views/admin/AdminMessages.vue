<template>

   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <span class="font-semibold">Messagerie</span>
         </p>
      </header>


      <!-- Search input -->
      <label class="input input-bordered flex items-center gap-2 my-2">
         <input v-model="searchTerms" type="text" class="grow" placeholder="Rechercher un utilisateur..." />
         <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-6 w-6 opacity-70">
            <path
               fill-rule="evenodd"
               d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
               clip-rule="evenodd" />
         </svg>
      </label>


      <main class="flex flex-col gap-6 pb-4">

         <div class="flex flex-col gap-3">

            <template v-for="user in userList">
               <div class="flex gap-3 items-center border-b-2 justify-between">
                  <div class="flex items-center justify-start gap-3">
                     <!-- circle red/white -->
                     <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path :fill="unreadMessagesCountOfStudent(user.id) > 0 ? 'red' : 'white'"
                           d="M12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709"/>
                     </svg>

                     <div>
                        <div class="">{{ user.name }}</div>
                        <div class="text-sm text-blue-300">{{ 'abonné' }}</div>
                     </div>
                  </div>
                  <img class="h-4 cursor-pointer" src="/src/assets/thick-arrow-right.svg" @click="select(user)">
               </div>

            </template>

         </div>
      </main>
   </main>

</template>

<script setup>
import { computed, ref } from 'vue'

import { listOfUser } from '/src/use/useUser'
import { unreadMessagesCountOfUser2ByUser1 } from '/src/use/useMessage'
import router from "/src/router"

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const searchTerms = ref('')

const userList = computed(() => {
   const unfilteredList = listOfUser.value
   if (searchTerms.value.trim().length <= 2) return unfilteredList
   const terms = searchTerms.value.trim().toLowerCase()
   return unfilteredList.filter(user => {
      return (user.name.toLowerCase().includes(terms))
   })
})

const select = (user) => {
   router.push(`/home/${props.userid}/admin-messages-student/${user.id}`)
}

const unreadMessagesCountOfStudent = computed(() => (studentId) => unreadMessagesCountOfUser2ByUser1.value(props.userid, studentId))
</script>
