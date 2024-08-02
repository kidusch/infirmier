<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-ue`">RÉVISIONS</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-ue`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-sub-ue/${ue_id}/${sub_ue_id}`">{{ subUE?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-topic/${ue_id}/${sub_ue_id}/${topic_id}`">{{ topic?.name }}</router-link>
            /
            <span class="font-semibold">{{ card?.title }}</span>
         </p>
      </header>

      <!-- Header -->
      <section class="w-full flex justify-between">
         <h3 class="opacity-50">
            Fiche de révision
         </h3>

         <div class="flex gap-6">
            <label class="inline-flex gap-3 items-center cursor-pointer">
               <p class="font-semibold text-black">Acquis</p>

               <input type="checkbox" class="sr-only peer" :checked="userCard?.done" @input="onDoneClick(userCard?.done)">
               <div
                  class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#76EE59]">
               </div>

            </label>

            <div class="cursor-pointer link hover:text-red-600 text-blue-600" @click="gotoStudy">
               cours
            </div>

         </div>
      </section>

      <!-- Revision Card -->
      <main class="my-6 relative flex justify-center">

         <!-- contenu -->
         <div class="bg-accent-darker py-4 px-6 rounded-3xl w-full max-lg:max-w-xl z-30 relative">
            <div v-html="card?.content"></div>
         </div>

         <div
            class="bg-accent-darker/50 absolute -bottom-5 left-0 right-0 mr-auto ml-auto w-full scale-90 h-20  rounded-3xl max-lg:max-w-xl z-20">
         </div>

         <div
            class="bg-accent-darker/30 absolute -bottom-10 left-0 right-0 mr-auto ml-auto w-full scale-75 h-20  rounded-3xl max-lg:max-w-xl z-10">
         </div>

      </main>

      <section class="py-6 w-full flex flex-col justify-end flex-1 items-center">
         <button class="primary-btn px-12" @click="back">
            Retour
         </button>
      </section>

   </main>
</template>

<script setup>
import { computed } from 'vue'

import { ueOfId } from '/src/use/useUE'
import { subUEOfId } from '/src/use/useSubUE'
import { topicOfId } from '/src/use/useTopic'
import { cardOfId } from '/src/use/useCard'
import { theUserCard, updateUserCard } from '/src/use/useUserCard'
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

const ue = computed(() => ueOfId.value(props.ue_id))
const subUE = computed(() => subUEOfId.value(props.sub_ue_id))
const topic = computed(() => topicOfId.value(props.topic_id))
const card = computed(() => cardOfId.value(props.card_id))
const userCard = computed(() => theUserCard.value(props.userid, props.card_id))

const onDoneClick = async (prevValue) => {
   await updateUserCard(userCard.value.id, { done: !prevValue })
}

const back = () => router.back()

const gotoStudy = () => {
   router.push(`/home/${props.userid}/study-topic/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}`)
}
</script>