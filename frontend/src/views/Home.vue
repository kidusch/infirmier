<template>

   <div class="py-4 flex flex-col h-screen">

      <!-- navbar -->
      <nav class="lg:border-b lg:pb-2">

         <main class="flex w-full justify-between items-center container max-w-7xl">
            <button @click="toggleSideMenu">
               <img class="w-6" src="/src/assets/menu.svg" alt="menu">
            </button>

            <router-link class="flex items-center gap-4 lg:flex-1 lg:px-12" :to="`/home/${userid}/study-ue`">
               <img class="h-12" src="/src/assets/logo.svg" alt="Logo">
               <h3 class="max-lg:hidden">Journal de bord infirmier</h3>
            </router-link>

            <button @click="signout">
               <img class="w-6" src="/src/assets/logout.svg" alt="logout.svg">
            </button>

         </main>

         <!-- side menu -->
         <aside ref="sidebarMenu"
            class="hidden fixed bg-black/70 h-screen w-screen top-0 left-0 transition-all z-50">

            <main ref="sidebarMenuArea"
                  class="fixed h-screen top-0 -left-full w-1/5 max-lg:w-1/3 max-sm:w-2/3 bg-white p-5 flex flex-col transition-all">

               <div class="w-full flex justify-end">
                  <button @click="toggleSideMenu()">
                     <img src="/src/assets/cancel.svg" alt="cancel">
                  </button>
               </div>

               <div class="flex justify-center">
                  <img class="w-36" src="/src/assets/logo.svg" alt="logo">
               </div>

               <div class="py-8 mx-4 flex-1 flex flex-col gap-2">

                  <router-link :to="`/home/${user?.id}/study-ue`" class="flex gap-4 items-center w-full p-3 rounded-lg bg-primary">
                     <img class="w-5" src="/src/assets/courses-activate.svg" alt="courses">
                     <p class="font-medium text-white">
                        Cours
                     </p>
                  </router-link>

                  <router-link :to="`/home/${user?.id}/revise-ue`" class="flex gap-4 items-center w-full p-3 rounded-lg opacity-50 ">
                     <img class="w-5" src="/src/assets/revisions.svg" alt="revisions">
                     <p class="font-medium">
                        Révisions
                     </p>
                  </router-link>

                  <a href="anatomy.html" class="flex gap-4 items-center w-full p-3 rounded-lg opacity-50 ">
                     <img class="w-5" src="/src/assets/anatomy.svg" alt="anatomy">
                     <p class="font-medium">
                        Anatomie
                     </p>
                  </a>

               </div>


               <div class="mx-4 ">
                  <button class="flex gap-4 items-center w-full p-3 rounded-lg opacity-50 ">
                     <img class="w-5" src="/src/assets/logout.svg" alt="logout">
                     <p class="font-medium">
                        Log out
                     </p>
                  </button>
               </div>

            </main>

            <div id="sidebarMenuSpace" @click="toggleSideMenu"
               class="fixed h-screen top-0 right-0 w-4/5 max-lg:w-2/3 max-sm:w-1/3">
            </div>

         </aside>

      </nav>

      <router-view></router-view>

   </div>

</template>

<script setup>
import { onMounted, ref } from 'vue'

import { setAuthenticatedUser, logout } from '/src/use/useAuthentication'
import { getUser } from '/src/use/useUser'

import router from '/src/router'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const user = ref()

onMounted(async () => {
   user.value = await getUser(props.userid)
   setAuthenticatedUser(user.value)

   if (user.value.admin) {
      router.push(`/home/${user.value.id}/admin-ue`)
   } else {
      router.push(`/home/${user.value.id}/study-ue`)
   }
})

const sidebarMenu = ref(null)
const sidebarMenuArea = ref(null)

let sidebarMenuOpen = false

function toggleSideMenu() {
   if (sidebarMenuOpen) {
      sidebarMenuArea.value.style.left = '-100%'
      setTimeout(() => {
         sidebarMenu.value.style.display = 'none'
      }, 100)
      sidebarMenuOpen = false
   } else {
      sidebarMenu.value.style.display = 'flex'
      setTimeout(() => {
         sidebarMenuArea.value.style.left = 0
      }, 100)
      sidebarMenuOpen = true
   }
}

const signout = async () => {
   await logout()
   router.push(`/`)
}
</script>
