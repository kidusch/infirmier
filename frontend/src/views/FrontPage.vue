<template>
   <!-- <h1>Journal de bord infirmier</h1>
   <button class="block btn btn-primary" @click="login">Se connecter</button>
   <button class="block btn btn-primary" @click="signup">S'inscrire</button> -->

   <body class="py-4 lg:pt-2 flex flex-col h-screen relative">

      <!-- navbar -->
      <nav class="lg:border-b lg:pb-2">

         <main class="flex w-full justify-between items-center container max-w-7xl">
            <!-- <button onclick="toggleSideMenu()">
               <img class="w-6" src="/src/assets/menu.svg" alt="menu">
            </button>
 -->
            <a class="flex items-center gap-4 lg:flex-1 lg:px-12" href="#">
               <img class="h-12" src="/src/assets/logo.svg" alt="Logo">
               <h3 class="max-lg:hidden">Journal de bord infirmier</h3>
            </a>

            <button>
               <img class="h-9" src="/src/assets/user.svg" alt="user" @click="login">
            </button>

         </main>

         <!-- side menu -->
         <aside id="sidebarMenu" class="hidden fixed bg-black/70 h-svh w-screen top-0 left-0 transition-all z-50">

            <main id="sidebarMenuArea"
                  class="fixed  h-screen h-svh  top-0 -left-full w-1/5 max-lg:w-1/3 max-sm:w-2/3 bg-white p-5 flex flex-col transition-all">

               <div class="w-full flex justify-end">
                  <button onclick="toggleSideMenu()">
                     <img src="/src/assets/cancel.svg" alt="cancel">
                  </button>
               </div>

               <div class="flex justify-center">
                  <img class="w-36" src="/src/assets/logo.svg" alt="logo">
               </div>

               <div class="py-8 mx-4 flex-1 flex flex-col gap-2">
                  <a href="courses.html" class="flex gap-4 items-center w-full p-3 rounded-lg opacity-50 ">
                     <img class="w-5" src="/src/assets/courses.svg" alt="courses">
                     <p class="font-medium">
                        Cours
                     </p>
                  </a>

                  <a href="revisions.html" class="flex gap-4 items-center w-full p-3 rounded-lg opacity-50 ">
                     <img class="w-5" src="/src/assets/revisions.svg" alt="revisions">
                     <p class="font-medium">
                        Révisions
                     </p>
                  </a>

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

            <div id="sidebarMenuSpace" onclick="toggleSideMenu()"
                  class="fixed  h-screen h-svh  top-0 right-0 w-4/5 max-lg:w-2/3 max-sm:w-1/3">
            </div>

         </aside>

      </nav>

      <!-- main body -->
      <main class=" container max-w-7xl flex-1 flex flex-col">
         
         <header class="mt-10 w-full flex justify-center flex-1">
            <img class="object-contain sm:max-w-2xl" src="/src/assets/home_illustration.png" alt="home_illustration">
         </header>

         <main class="flex-1 flex flex-col items-center justify-evenly text-center">

            <div class="flex flex-col gap-4">
                  <h1>
                     Journal de bord infirmier
                  </h1>
                  <p>
                     Des cours complets que vous pouvez personnaliser
                     <br>
                     Des quizs pour réviser
                  </p>
            </div>
            <button-karan class="primary-btn px-10" @click="signup">
               S’incrire
            </button-karan>
         </main>
      </main>

   </body>

</template>

<script setup>
import router from "/src/router"

function login() {
   router.push('/login')
}

function signup() {
   router.push('/signup')
}
</script>