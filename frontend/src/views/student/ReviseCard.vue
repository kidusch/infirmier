<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-ue`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-sub-ue/${ue_id}/${sub_ue_id}`">{{ subUE?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-topic/${ue_id}/${sub_ue_id}/${topic_id}`">{{ topic?.name }}</router-link>
            /
            <span class="font-semibold">{{ topic?.name }}</span>
         </p>
      </header>

      <!-- Header -->
      <header class="py-2">
         <h3 class="lg:opacity-50">
            {{ card?.title }}
         </h3>
      </header>

      <!-- Settings -->
      <section class="w-full flex justify-end gap-6">

         <label class="inline-flex gap-3 items-center cursor-pointer">
            <p class="font-semibold text-black">Acquis</p>

            <input type="checkbox" value="" class="sr-only peer" checked>
            <div
               class="relative w-11 h-6 bg-gray-200 rounded-full peer   peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#76EE59]">
            </div>

         </label>

         <button>
            <img class="h-5" src="./assets/courses.svg" alt="course">
         </button>

      </section>


      <!-- Revision Card -->
      <main class="my-6 relative flex justify-center">

         <div class="bg-accent-darker py-4 px-6 rounded-3xl lg:w-full max-lg:max-w-xl z-30 relative">
            <h2 class="py-2 text-center">Fiche de révision</h2>
            <h4 class="py-2">
               Type des cellules
            </h4>
            <p>
               Cellules Eucaryotes:
            </p>
            <ul class="pb-2">
               <li class="flex">
                     <div class="h-1 w-1 rounded-full bg-black lg:mt-2 mt-1.5 mr-1.5">
                     </div>
                     <p class="w-11/12">
                        Présence d'un noyau délimité par une membrane nucléaire.
                     </p>
               </li>
               <li class="flex">
                     <div class="h-1 w-1 rounded-full bg-black lg:mt-2 mt-1.5 mr-1.5">

                     </div>
                     <p class="w-11/12">
                        Possèdent des organites membranaires comme les mitochondries, le réticulum endoplasmique,
                        l'appareil de Golgi, etc.
                     </p>
               </li>
               <li class="flex">
                     <div class="h-1 w-1 rounded-full bg-black lg:mt-2 mt-1.5 mr-1.5">

                     </div>
                     <p class="w-11/12">
                        Plus complexes et plus grandes que les cellules procaryotes.
                     </p>
               </li>
            </ul>

            <p>
               Cellules Eucaryotes:
            </p>
            <ul>
               <li class="flex">
                     <div class="h-1 w-1 rounded-full bg-black lg:mt-2 mt-1.5 mr-1.5">

                     </div>
                     <p class="w-11/12">
                        Présence d'un noyau délimité par une membrane nucléaire.
                     </p>
               </li>
               <li class="flex">
                     <div class="h-1 w-1 rounded-full bg-black lg:mt-2 mt-1.5 mr-1.5">

                     </div>
                     <p class="w-11/12">
                        Possèdent des organites membranaires comme les mitochondries, le réticulum endoplasmique,
                        l'appareil de Golgi, etc.
                     </p>
               </li>
               <li class="flex">
                     <div class="h-1 w-1 rounded-full bg-black lg:mt-2 mt-1.5 mr-1.5">

                     </div>
                     <p class="w-11/12">
                        Plus complexes et plus grandes que les cellules procaryotes.
                     </p>
               </li>
            </ul>
         </div>

         <div
            class="bg-accent-darker/50 absolute -bottom-5 left-0 right-0 mr-auto ml-auto w-full scale-90 h-20  rounded-3xl max-lg:max-w-xl z-20">
         </div>

         <div
            class="bg-accent-darker/30 absolute -bottom-10 left-0 right-0 mr-auto ml-auto w-full scale-75 h-20  rounded-3xl max-lg:max-w-xl z-10">
         </div>

         </main>

         <section class="py-6 w-full flex flex-col justify-end flex-1 items-center">
            <button class="primary-btn px-12">
               continuer...
            </button>
         </section>

      </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopic } from '/src/use/useTopic'
import { getCard } from '/src/use/useCard'
import router from "/src/router"


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   ue_id: {
      type: Number,
      required: true
   },
   sub_ue_id: {
      type: Number,
      required: true
   },
   topic_id: {
      type: Number,
      required: true
   },
   card_id: {
      type: Number,
      required: true
   },
})

const ue = ref()
const subUE = ref()
const topic = ref([])
const card = ref([])


onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topic.value = await getTopic(props.topic_id)
   card.value = await getCard(props.card_id)
})
</script>