<template>
   <div class="container max-w-lg py-4 flex flex-col">

      <header class="w-full flex justify-center">
         <img class="w-64 h-64" src="/src/assets/logo.png" alt="logo">
      </header>

      <section class="flex-1 flex flex-col">

         <section class="flex flex-col">
            <h1>
               Bienvenue dans le
               <span class="text-primary">
                  Journal de bord Infirmier
               </span>
            </h1>
         </section>

         <div class="flex flex-col mt-2">

            <div class="justify-center flex my-8">
               <button class="primary-btn" @click="onClick">
                  Continuer
               </button>
            </div>

         </div>
      </section>
   </div>
</template>

<script setup>
import router from '/src/router'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const onClick = () => {
   router.push(`/home/${props.userid}/study-ue`)
}
</script>
