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
            Fiche de révision
         </h3>
      </header>

      <!-- Settings -->
      <section class="w-full flex justify-end gap-6">

         <label class="inline-flex gap-3 items-center cursor-pointer">
            <p class="font-semibold text-black">Acquis</p>

            <input type="checkbox" class="sr-only peer" :checked="done" @input="onDoneClick">
            <div
               class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#76EE59]">
            </div>

         </label>

         <button>
            <img class="h-5" src="/src/assets/courses.svg" alt="course">
         </button>

      </section>


      <!-- Revision Card -->
      <main class="my-6 relative flex justify-center">

         <div class="bg-accent-darker py-4 px-6 rounded-3xl lg:w-full max-lg:max-w-xl z-30 relative">
            <h4 class="py-2">
               {{ card?.title }}
            </h4>

            <template v-for="part in parts">
               <template v-if="part.type === 'title'">
                  <AnnotatedBlock type="title-block" :text="part.text"></AnnotatedBlock>
               </template>
               <template v-if="part.type === 'break'">
                  <br/>
               </template>
               <template v-if="part.type === 'plain_text'">
                  <AnnotatedBlock type="span" :text="part.text"></AnnotatedBlock>
               </template>
               <template v-if="part.type === 'emphasized_text'">
                  <AnnotatedBlock type="bold-span" :text="part.text"></AnnotatedBlock>
               </template>
            </template>

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
               Retour
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
import { getTheUserCard, updateUserCard } from '/src/use/useUserCard'
import router from "/src/router"

import parser from '/src/lib/grammar.js'
import AnnotatedBlock from '/src/components/AnnotatedBlock.vue'


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
const userCard = ref([])

const parts = ref('')
const done = ref(true)


onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topic.value = await getTopic(props.topic_id)
   card.value = await getCard(props.card_id)

   parts.value = parser.parse(card.value.content)
   console.log('parts', parts.value)

   userCard.value = await getTheUserCard(props.userid, props.card_id)
   done.value = userCard.value.done
})

const onDoneClick = async () => {
   done.value = !done.value
   const updatedUserTopic = await updateUserCard(userCard.value.id, { done: done.value })
   console.log('updatedUserTopic', updatedUserTopic)
}
</script>