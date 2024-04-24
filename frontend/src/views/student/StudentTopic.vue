<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/student-ue`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/student-sub-ue/${ue?.id}/${subUE?.id}`">{{ subUE?.name }}</router-link>
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

      <!-- Main content -> courses list -->
      <main class="flex flex-col gap-6 pb-6">
         
         <!-- <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
            <div class="progress-list">
               <template v-for="topic in topicList">
                  <div class="progress-item cursor-pointer" @click="">
                     <img src="/src/assets/progress-bar-0.svg">
                     <p>
                        {{ topic?.name }}
                     </p>
                  </div>
               </template>
            </div>
         </div> -->

      </main>

   </main>
</template>

<script setup>
import { ref, onMounted, createApp } from 'vue'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopic } from '/src/use/useTopic'
import { getTheUserTopic, updateUserTopic } from '/src/use/useUserTopic'

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

const done = ref(true)

onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topic.value = await getTopic(props.topic_id)
   userTopic.value = await getTheUserTopic(props.userid, props.topic_id)
   done.value = userTopic.value.done
})

const onDoneClick = async () => {
   done.value = !done.value
   const updatedUserTopic = await updateUserTopic(userTopic.value.id, { done: done.value })
   console.log('updatedUserTopic', updatedUserTopic)
}
</script>