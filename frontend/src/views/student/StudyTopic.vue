<template>
    <main class="flex-1 container max-w-7xl" :class="{ 'page-wrapper': move }">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/study-ue`">COURS</router-link>
            /
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

         <button @click="gotoRevise">
            <svg class="w-5 h-5">
               <path :d="revisionIconPath"></path>
            </svg>
         </button>

      </section>

      <!-- Course content -->
      <main class="">
         <template v-for="part in parts">

            <template v-if="part.type === 'break'">
               <br/>
            </template>

            <template v-if="part.type === 'image'">
               <img :src="part.ref" />
            </template>

            <template v-if="part.type === 'audio'">
               <audio controls :src="part.ref" ></audio>
            </template>

            <template v-if="part.type !== 'break' && part.type !== 'image' && part.type !== 'audio'">
               <TextPart :userid="userid" :topic_id="topic_id" :card_id="undefined" :part="part"></TextPart>
            </template>

         </template>
      </main>
   </main>
</template>

<script setup>
import { ref, onMounted, createApp } from 'vue'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopic } from '/src/use/useTopic'
import { getTheUserTopic, updateUserTopic } from '/src/use/useUserTopic'

import parser from '/src/lib/grammar.js'
import TextPart from '/src/components/TextPart.vue'

import router from "/src/router"
import { revisionIconPath } from '/src/lib/icons.mjs'


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

   try {
      parts.value = parser.parse(topic.value.course_content)
      console.log('parts', parts.value)
   } catch(err) {
      parts.value = ''
   }
})

const onDoneClick = async () => {
   done.value = !done.value
   userTopic.value = await updateUserTopic(userTopic.value.id, { done: done.value })
}

const move = ref(false)
const gotoRevise = () => {
   router.push(`/home/${props.userid}/revise-topic/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}`)
}
</script>