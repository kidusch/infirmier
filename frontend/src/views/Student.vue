<template>
   <div class="py-4 flex flex-col h-screen">

      <!-- navbar -->
      <nav class="border-b pb-2 fixed top-0 w-full bg-white">

         <main class="flex w-full items-center justify-between container max-w-7xl">
            <button @click="toggleSideMenu">
               <img class="w-6" src="/src/assets/menu.svg" alt="menu">
            </button>

            <router-link class="flex items-center gap-4 lg:flex-1 lg:px-12" :to="`/student`">
               <img class="h-12" src="/src/assets/logo.svg" alt="Logo">
               <h3 class="max-lg:hidden">Journal de bord IDE</h3>
            </router-link>

            <div class="flex gap-8">

               <!-- there are unread messages -->
               <div v-if="unreadMessagesCount > 0" @click="goToMessages">
                  <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <rect x="4.83334" y="7.25" width="19.3333" height="14.5" rx="2" stroke="#33363F" stroke-width="2"/>
                     <path d="M4.83334 10.875L13.6056 15.2611C14.1686 15.5426 14.8314 15.5426 15.3944 15.2611L24.1667 10.875" stroke="#33363F" stroke-width="2"/>
                     <circle cx="24.1667" cy="7.25" r="3.625" fill="#FF0000"/>
                  </svg>
               </div>
               
               <!-- signout -->
               <div class="cursor-pointer link hover:text-red-600 text-blue-600" @click="signout">
                  Sortie
               </div>
            </div>

         </main>
      </nav>

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

               <template v-for="item, index in menuItems">
                  <div @click="selectItem(index)" class="cursor-pointer flex gap-4 items-center w-full p-3 rounded-lg"
                        :class="{'bg-primary': isCurrentItem(item), 'opacity-50': !isCurrentItem(item)}">
                     <svg class="w-5 h-5" :stroke="isCurrentItem(item) ? 'white' : 'black'">
                        <path fill="white" :d="item.iconPath"></path>
                     </svg>

                     <p class="font-medium" :class="{ 'text-white': isCurrentItem(item)}">
                        {{ item.label }}
                     </p>
                  </div>
               </template>
            </div>


            <div class="mx-4">
               <p class="p-3 opacity-50">Version {{ VERSION }}</p>
               <button class="flex gap-4 items-center w-full p-3 rounded-lg opacity-50" @click="signout">
                  <img class="w-5" src="/src/assets/logout.svg" alt="logout">
                  <p class="font-medium">
                     Déconnexion
                  </p>
               </button>
            </div>

         </main>

         <div id="sidebarMenuSpace" @click="toggleSideMenu"
            class="fixed h-screen top-0 right-0 w-4/5 max-lg:w-2/3 max-sm:w-1/3">
         </div>

      </aside>

      <router-view class="mt-6"></router-view>

   </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'

import { logout, clearCaches } from '/src/use/useAuthentication'
import { userOfId, listOfUser } from '/src/use/useUser'
import { unreadMessagesCountOfUser2ByUser1 } from '/src/use/useMessage'
import { isCareTabVisible } from '/src/use/useCare'
import { isDocumentTabVisible } from '/src/use/useDocument'
import { isLegislationTabVisible } from '/src/use/useLegislation'

import { courseIconPath, revisionIconPath } from '/src/lib/icons.mjs'
import { getWebPushSubscription } from '/src/lib/utilities.mjs'
import router from '/src/router'
import { VERSION } from '/src/version'

import { app } from '/src/client-app.js'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const user = computed(() => userOfId.value(props.userid))

const menuItems = computed(() => {
   const items = []
   items.push({
      label: "Cours",
      path: `/student/study-ue`,
      iconPath: courseIconPath,
   })
   items.push({
      label: "Révisions",
      path: `/student/revise-ue`,
      iconPath: revisionIconPath,
   })
   if (isCareTabVisible.value) items.push({
      label: "Soins",
      path: `/student/care`,
      iconPath: revisionIconPath,
   })
   if (isDocumentTabVisible.value) items.push({
      label: "Documents",
      path: `/student/document`,
      iconPath: revisionIconPath,
   })
   if (isLegislationTabVisible.value) items.push({
      label: "Législation",
      path: `/student/legislation`,
      iconPath: revisionIconPath,
   })

   items.push({
      label: "Lexique",
      path: `/student/lexicon`,
      iconPath: revisionIconPath,
   })

   items.push({
      label: "Messagerie",
      path: `/student/messages`,
      iconPath: revisionIconPath,
   })

   items.push({
      label: "Anatomie",
      path: `/student/anatomy`,
      iconPath: revisionIconPath,
   })

   items.push({
      label: "Agenda",
      path: `/student/agenda`,
      iconPath: revisionIconPath,
   })
   return items
})


onMounted(async () => {
   // subscribe to notifications
   if ('Notification' in window) {
      try {
         const subscription = await getWebPushSubscription()
         if (subscription) await app.service('notification').addSubscription(props.userid, subscription)
      } catch(err) {
         console.log('err subscription', err)
      }
   }
})

const selectItem = (index) => {
   currentItemIndex.value = index
   toggleSideMenu()
   const item = menuItems.value[index]
   router.push(item.path)
}

const currentItemIndex = ref(0)
const isCurrentItem = computed(() => (item) => {
   return item === menuItems.value[currentItemIndex.value]
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
   // change to a page (front page) which calls no service
   await router.push(`/`)
   console.log('on front page')
   // ...then unauthenticate
   // await logout(props.userid)
   clearCaches()
}

const unreadMessagesCount = computed(() => {
   if (!user.value) return 0
   const userList = listOfUser.value.filter(user => user.admin)
   return userList.reduce((accu, user) => {
      return accu + unreadMessagesCountOfUser2ByUser1.value(props.userid, user.id)
   }, 0)
})

const goToMessages = () => router.push(`/student/messages`)
</script>
