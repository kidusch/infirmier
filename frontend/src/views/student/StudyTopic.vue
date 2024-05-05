<template>
    <main class="flex-1 container max-w-7xl">

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
            <img class="h-5" src="/src/assets/courses.svg" alt="course">
         </button>

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
   const updatedUserTopic = await updateUserTopic(userTopic.value.id, { done: done.value })
   console.log('updatedUserTopic', updatedUserTopic)
}

const gotoRevise = () => {
   router.push(`/home/${props.userid}/revise-topic/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}`)
}
</script>