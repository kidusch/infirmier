<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/study-ue`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/study-sub-ue/${ue?.id}/${subUE?.id}`">{{ subUE?.name }}</router-link>
            /
            <span class="font-semibold">{{ topic?.name }}</span>
         </p>
      </header>

      <!-- Header -->
      <header class="py-2">
         <h3 class="lg:opacity-50">
            {{ topic?.name }}
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

         <router-link to="/">
            <img class="h-5" src="/src/assets/courses.svg" alt="course">
         </router-link>

      </section>

      <!-- Course content -->
      <main class="">
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
      </main>

      <!-- <main class="flex flex-col gap-6 pb-6">
         
         <h3 class="pb-2">
               Généralités sur la cellule
         </h3>

         <p class="text-black/70">
               Les cellules sont les plus petites unités structurelles et fonctionnelles de l'organisme. Elles mesurent
               de 1 à 100 microns de diamètre.
               <br class="py-1">
               C'est la plus petite unité capable de:
            <ul class="text-black/70 py-1">
               <li class="flex">
                  <div class="h-1 w-1 rounded-full bg-black lg:mt-2 mt-1.5 mr-1.5">

                  </div>
                  <p class="w-11/12">
                     Synthétiser l’ensemble de ses constituants en utilisant des éléments du milieu extérieur
                  </p>
               </li>
               <li class="flex">
                  <div class="h-1 w-1 rounded-full bg-black lg:mt-2 mt-1.5 mr-1.5">

                  </div>
                  <p class="w-11/12">
                     Croître
                  </p>
               </li>
               <li class="flex">
                  <div class="h-1 w-1 rounded-full bg-black lg:mt-2 mt-1.5 mr-1.5">

                  </div>
                  <p class="w-11/12">
                     Se multiplier
                  </p>
               </li>
            </ul>
         </p>

         <div class="w-full flex justify-center">
               <img class="sm:max-w-md" src="/src/assets/anatomy-diagram.png" alt="anatomy-diagram">
         </div>

         <p class="text-black/70">
               On distingue:
            <ul class="text-black/70 py-1">
               <li class="flex">
                  <div class="h-1 w-1 rounded-full bg-black lg:mt-2 mt-1.5 mr-1.5">

                  </div>
                  <p class="w-11/12">
                     Cellule procaryote = dépourvue de noyau, limitée par une membrane pl unicellulaire (ex:
                     bactéries)
                  </p>
               </li>
               <li class="flex">
                  <div class="h-1 w-1 rounded-full bg-black lg:mt-2 mt-1.5 mr-1.5">

                  </div>
                  <p class="w-11/12">
                     Cellule eucaryote = véritable novαι
                  </p>
               </li>
            </ul>
         </p>

      </main> -->

   </main>
</template>

<script setup>
import { ref, onMounted, createApp } from 'vue'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopic } from '/src/use/useTopic'
import { getTheUserTopic, updateUserTopic } from '/src/use/useUserTopic'

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
})

const ue = ref()
const subUE = ref()
const topic = ref([])
const userTopic = ref()
const parts = ref('')

const done = ref(true)

onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topic.value = await getTopic(props.topic_id)
   userTopic.value = await getTheUserTopic(props.userid, props.topic_id)
   done.value = userTopic.value.done

   parts.value = parser.parse(topic.value.course_content)
   console.log('parts', parts.value)
})

const onDoneClick = async () => {
   done.value = !done.value
   const updatedUserTopic = await updateUserTopic(userTopic.value.id, { done: done.value })
   console.log('updatedUserTopic', updatedUserTopic)
}

const text = `
# Généralités sur la cellule

Le système nerveux est constitué de deux parties : le [système nerveux central](lexique: systeme-nerveux-central) et le
[système nerveux périphérique](lexique: systeme-nerveux-peripherique)

[](image: cns/cellule.png)
- ***Axone*** : fibre nerveuse longue et mince
- ***Dendrites*** : branches des [cellules](lexique: cellules) nerveuses
`
</script>