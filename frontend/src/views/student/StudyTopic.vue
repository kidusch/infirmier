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
      <!-- <header class="py-2">
         <h3 class="lg:opacity-50">
            {{ topic?.name }}
         </h3>
      </header> -->

      <!-- Settings -->
      <section class="w-full flex justify-end gap-6">

         <label class="inline-flex gap-3 items-center cursor-pointer">
            <p class="font-semibold text-black">Acquis</p>

            <input type="checkbox" class="sr-only peer" :checked="done" @input="onDoneClick">
            <div
               class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#76EE59]">
            </div>

         </label>

         <!-- <button @click="gotoRevise">
            <svg class="w-5 h-5">
               <path :d="revisionIconPath"></path>
            </svg>
         </button> -->
         <div class="cursor-pointer link hover:text-red-600 text-blue-600" @click="gotoRevise">
            révisions
         </div>

      </section>

      <!-- Course content -->
      <main class="mt-4">
         <TextParts :userid="userid" :topic_id="topic_id" :card_id="undefined" :parts="parts" :highlight="highlight"></TextParts>
      </main>

      <!-- Highlighting pens -->
      <!-- <div class="bg-[#F0F0F0] fixed bottom-0 right-0 flex py-3 px-1.5 rounded-xl mb-8 mr-4">
         <button>
            <img class="px-2 h-7 bg-gray-300" src="/src/assets/highlighter-yellow.svg" alt="highlighter-yellow">
         </button>

         <button>
            <img class="px-2 h-7" src="/src/assets/highlighter-orange.svg" alt="highlighter-orange">
         </button>
         <button>
            <img class="px-2 h-7" src="/src/assets/highlighter-purple.svg" alt="highlighter-purple">
         </button>
         <button>
            <img class="px-2 h-7" src="/src/assets/eraser.svg" alt="eraser">
         </button>
      </div> -->

      <ul class="menu menu-horizontal bg-slate-50 rounded-box fixed right-0 bottom-0">
         <li>
            <a :class="{ active: highlight === 'yellow' }" @click="highlight = 'yellow'">
               <img class="h-6 w-6" src="/src/assets/highlighter-yellow.svg">
            </a>
         </li>
         <li>
            <a :class="{ active: highlight === 'orange' }" @click="highlight = 'orange'">
               <img class="h-6 w-6" src="/src/assets/highlighter-orange.svg">
            </a>
         </li>
         <li>
            <a :class="{ active: highlight === 'purple' }" @click="highlight = 'purple'">
               <img class="h-6 w-6" src="/src/assets/highlighter-purple.svg">
            </a>
         </li>
         <li>
            <a :class="{ active: highlight === 'none' }" @click="highlight = 'none'">
               <img class="h-6 w-6" src="/src/assets/eraser.svg">
            </a>
         </li>
      </ul>


      <!-- Note button -->
      <button ref="openNoteBtn" class="p-2 bg-primary rounded-full shadow-primary shadow-md fixed bottom-16 ttttop-[30%] right-2"
         @click="openNoteModal">
         <img class="h-6 w-6" alt="note" src="/src/assets/note.svg">
      </button>

      <!-- Note dark overlay -->
      <div ref="darkOverlay" class="hidden fixed h-[100vh] bg-black/50 w-full top-0 right-0 transition-all"
         @click="closeNoteModal">
      </div>

      <!-- Note Area -->
      <div ref="noteBox"
         class="fixed bottom-0 -right-full transition-all duration-300 bg-white w-1/2 sm:w-52 lg:w-72 z-[1] rounded-ss-2xl max-h-[65vh] h-[65vh] flex-col">
         <div class="flex items-center justify-between p-4 pb-2">
            <h3>Note</h3>
            <!-- close icon -->
            <button @click="closeNoteModal">
               <img class="h-4 w-4" alt="close" src="/src/assets/close.svg">
            </button>
         </div>
         <textarea class="min-h-[65vh] h-[65vh] px-4 text-black/70 font-normal text-base"
            placeholder="Écrivez vos notes ici"
            :value="userTopic?.note"
            @input="debouncedInputText"
         ></textarea>
      </div>

   </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopic } from '/src/use/useTopic'
import { getTheUserTopic, updateUserTopic } from '/src/use/useUserTopic'

import parser from '/src/lib/grammar.js'
import TextParts from '/src/components/TextParts.vue'

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
const parts = ref([])
const done = ref(true)
const highlight = ref('yellow')

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

const darkOverlay = ref(null)
const openNoteBtn = ref(null)
const noteBox = ref(null)

function openNoteModal() {
   openNoteBtn.value.classList.add("hidden")
   darkOverlay.value.classList.remove("hidden")
   noteBox.value.style.right = 0
}

function closeNoteModal() {
   openNoteBtn.value.classList.remove("hidden")
   darkOverlay.value.classList.add("hidden")
   noteBox.value.style.right = "-100%"
}

const onInputText = async (ev) => {
   userTopic.value = await updateUserTopic(userTopic.value.id, { note: ev.target.value })
}
const debouncedInputText = useDebounceFn(onInputText, 500)
</script>
