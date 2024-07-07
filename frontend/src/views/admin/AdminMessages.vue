<template>

   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <span class="font-semibold">Messagerie</span>
         </p>
      </header>


      <main class="flex flex-col gap-6 pb-4">

         <div class="flex flex-col gap-3">

            <template v-for="user in listOfUser">
               <div class="flex gap-3 items-center border-b-2 justify-between">
                  <div class="flex items-center justify-start gap-3">
                     <img class="h-4" src="/src/assets/circle.svg">
                     <div>
                        <div class="">{{ user.name }}</div>
                        <div class="text-sm">{{ 'abonné' }}</div>
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
import { listOfUser } from '/src/use/useUser'

const select = (user) => {

}

</script>
