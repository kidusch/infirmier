<template>
   <div class="py-4 flex flex-col h-screen">

      <!-- navbar -->
      <nav class="border-b pb-2 fixed top-0 w-full bg-white">

         <main class="flex w-full items-center justify-between container max-w-7xl">
            <button @click="toggleSideMenu">
               <img class="w-6" src="/src/assets/menu.svg" alt="menu">
            </button>

            <router-link class="flex items-center gap-4 lg:flex-1 lg:px-12" :to="`/home/${userid}/study-ue`">
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

               <!-- there are unread answers -->
               <!-- <div v-if="unreadAnswersCount > 0" @click="goToAnswers">
                  <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path fill-rule="evenodd" clip-rule="evenodd" d="M8.98299 0.0563955C8.84764 0.0842416 8.58662 0.180226 8.40294 0.269672C8.124 0.405492 8.01917 0.482104 7.76655 0.734723C7.51376 0.987589 7.43751 1.09198 7.30174 1.37121C7.04129 1.90697 7.03194 1.99473 7.03194 3.90268C7.03194 5.80979 7.04132 5.89804 7.30139 6.43415C7.43797 6.71567 7.51133 6.81573 7.76817 7.07088C8.02047 7.32153 8.12997 7.40148 8.40488 7.53576C8.97385 7.81362 8.84785 7.80536 12.516 7.80536C16.1828 7.80536 16.0565 7.81362 16.629 7.53586C16.9105 7.39927 17.0105 7.32589 17.2656 7.06902C17.5162 6.81668 17.5962 6.70716 17.7304 6.43221C17.9906 5.89937 18 5.81109 18 3.90268C18 1.99473 17.9907 1.90697 17.7302 1.37121C17.5944 1.09198 17.5182 0.987589 17.2654 0.734723C17.0126 0.481893 16.9082 0.405633 16.629 0.269847C16.1461 0.0350186 15.9226 0 14.9064 0C14.2886 0 13.9866 0.0145208 13.7888 0.0537234C13.4444 0.122003 12.9336 0.369313 12.6964 0.582589L12.516 0.744849L12.3355 0.582589C12.0983 0.369313 11.5875 0.122003 11.2431 0.0537234C10.8757 -0.0191266 9.34103 -0.0172984 8.98299 0.0563955ZM3.60442 1.02345C3.04121 1.1046 2.26786 1.41488 1.79542 1.74921C1.47194 1.97813 1.08204 2.35982 0.834733 2.68968C0.444242 3.21053 0.128418 3.97701 0.0388101 4.62112C-0.0129367 4.99336 -0.0129367 11.1799 0.0388101 11.5521C0.229732 12.925 1.11969 14.1451 2.37402 14.7536C2.80044 14.9604 3.22331 15.0935 3.63725 15.1511C3.82002 15.1765 5.57093 15.1888 9.01188 15.1887C14.5613 15.1885 14.4125 15.1933 15.0531 14.9918C16.5571 14.5186 17.6925 13.1984 17.9474 11.6262C17.9841 11.4001 17.9995 11.0355 17.9991 10.4071C17.9985 9.61321 17.9911 9.4943 17.9339 9.3685C17.7014 8.85662 16.9435 8.83363 16.6717 9.33018C16.6205 9.42377 16.6081 9.59039 16.5893 10.4423C16.5657 11.5081 16.55 11.6189 16.3583 12.0772C16.1521 12.5701 15.678 13.1076 15.2006 13.3896C14.9179 13.5566 14.5265 13.6942 14.1836 13.747C14.0167 13.7727 12.3369 13.7814 8.85995 13.7746L3.78019 13.7645L3.5069 13.6868C3.35661 13.644 3.08769 13.534 2.90928 13.4422C2.6497 13.3085 2.52111 13.2118 2.26505 12.9575C1.80368 12.4993 1.56748 12.055 1.46121 11.4455C1.38085 10.9846 1.38085 5.18866 1.46121 4.72776C1.5659 4.12728 1.80281 3.67675 2.24789 3.23156C2.87356 2.60583 3.47276 2.39164 4.60212 2.39006C5.05867 2.38942 5.17513 2.37842 5.29325 2.32473C5.82432 2.08347 5.82432 1.29182 5.29325 1.05056C5.17035 0.994691 5.06113 0.986464 4.48327 0.989522C4.11591 0.991456 3.72042 1.00672 3.60442 1.02345ZM11.1201 1.47697C11.3759 1.57271 11.5779 1.75462 11.6965 1.9962L11.7953 2.19745L11.8129 3.48077C11.8289 4.64753 11.8365 4.77625 11.8969 4.8979C11.9813 5.06772 12.1376 5.18726 12.3496 5.24397C12.6537 5.32529 12.9981 5.17355 13.135 4.8979C13.1955 4.77611 13.2031 4.64721 13.2191 3.46319L13.2366 2.1623L13.341 1.97388C13.4709 1.73919 13.6669 1.56867 13.9119 1.47697C14.0806 1.41382 14.1855 1.40637 14.9064 1.40637C15.6442 1.40637 15.7294 1.41273 15.9137 1.48172C16.1816 1.58196 16.4183 1.81868 16.5185 2.0866C16.5915 2.28173 16.5938 2.33809 16.5938 3.90268C16.5938 5.46727 16.5915 5.52363 16.5185 5.71876C16.4183 5.98667 16.1816 6.2234 15.9137 6.32364C15.7133 6.39864 15.6975 6.39899 12.516 6.39899C9.33446 6.39899 9.31864 6.39864 9.11822 6.32364C8.84884 6.22284 8.61373 5.98685 8.51217 5.71535C8.4368 5.51389 8.43571 5.48295 8.44562 3.8364L8.45568 2.1623L8.56001 1.97388C8.68769 1.74337 8.88438 1.56972 9.12093 1.47869C9.27888 1.4179 9.39306 1.40982 10.1154 1.4082C10.8491 1.40655 10.9504 1.41347 11.1201 1.47697ZM5.32696 16.6616C4.79143 16.9088 4.79051 17.6924 5.32552 17.9354C5.46034 17.9967 5.64799 18 9.00056 18C12.3531 18 12.5408 17.9967 12.6756 17.9354C13.2067 17.6942 13.2067 16.9025 12.6756 16.6613C12.5408 16.6 12.3531 16.5967 9.00056 16.5967C5.63994 16.5967 5.46073 16.5999 5.32696 16.6616Z" fill="black"/>
                     <circle cx="24.1667" cy="7.25" r="3.625" fill="#FF0000"/>
                  </svg>
               </div> -->
               
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

import { logout, clearSessionStorage } from '/src/use/useAuthentication'
import { userOfId, getUser, listOfUser } from '/src/use/useUser'
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

   if (user.value?.admin) {
      items.push({
         label: "Contenu",
         path: `/home/${props.userid}/admin-ue`,
         iconPath: courseIconPath,
      })
      items.push({
         label: "Soins",
         path: `/home/${props.userid}/admin-care`,
         iconPath: revisionIconPath,
      })
      items.push({
         label: "Documents",
         path: `/home/${props.userid}/admin-document`,
         iconPath: revisionIconPath,
      })
      items.push({
         label: "Législation",
         path: `/home/${props.userid}/admin-legislation`,
         iconPath: revisionIconPath,
      })
      items.push({
         label: "Lexique",
         path: `/home/${props.userid}/admin-lexicon`,
         iconPath: revisionIconPath,
      })
      items.push({
         label: "Divers",
         path: `/home/${props.userid}/admin-misc`,
         iconPath: revisionIconPath,
      })

      items.push({
         label: "Messagerie",
         path: `/home/${props.userid}/admin-messages`,
         iconPath: revisionIconPath,
      })

      items.push({
         label: "Corrections",
         path: `/home/${props.userid}/admin-corrections`,
         iconPath: revisionIconPath,
      })

   } else {
      items.push({
         label: "Cours",
         path: `/home/${props.userid}/study-ue`,
         iconPath: courseIconPath,
      })
      items.push({
         label: "Révisions",
         path: `/home/${props.userid}/revise-ue`,
         iconPath: revisionIconPath,
      })
      if (isCareTabVisible.value) items.push({
         label: "Soins",
         path: `/home/${props.userid}/care`,
         iconPath: revisionIconPath,
      })
      if (isDocumentTabVisible.value) items.push({
         label: "Documents",
         path: `/home/${props.userid}/document`,
         iconPath: revisionIconPath,
      })
      if (isLegislationTabVisible.value) items.push({
         label: "Législation",
         path: `/home/${props.userid}/legislation`,
         iconPath: revisionIconPath,
      })

      items.push({
         label: "Lexique",
         path: `/home/${props.userid}/lexicon`,
         iconPath: revisionIconPath,
      })

      items.push({
         label: "Messagerie",
         path: `/home/${props.userid}/messages`,
         iconPath: revisionIconPath,
      })
   }
   return items
})


onMounted(async () => {
   const user_ = await getUser(props.userid)
         
   // subscribe to notifications
   if ('Notification' in window) {
      try {
         const subscription = await getWebPushSubscription()
         if (subscription) await app.service('notification').addSubscription(props.userid, subscription)
      } catch(err) {
         console.log('err subscription', err)
      }
   }

   if (user_.admin) {
      // go to UE admin page
      router.push(`/home/${props.userid}/admin-ue`)
   } else {
      // prevent copy for student
      // document.addEventListener('copy', (event) => {
      //    event.preventDefault()
      // })
      
      // go to student welcome page
      router.push(`/home/${props.userid}/welcome-student`)
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
   clearSessionStorage()
}

const unreadMessagesCount = computed(() => {
   if (!user.value) return 0
   const userList = user.value.admin ? listOfUser.value : listOfUser.value.filter(user => user.admin)
   console.log('userList', userList)
   return userList.reduce((accu, user) => {
      return accu + unreadMessagesCountOfUser2ByUser1.value(props.userid, user.id)
   }, 0)
})

const goToMessages = () => router.push(user.value.admin ? `/home/${props.userid}/admin-messages` : `/home/${props.userid}/messages`)
</script>
