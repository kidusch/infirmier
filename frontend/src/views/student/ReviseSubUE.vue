<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/study-ue`">{{ ue?.name }}</router-link>
            /
            <span class="font-semibold">{{ subUE?.name }}</span>
         </p>
      </header>

      <!-- Header -->
      <header class="py-2">
         <h3 class="lg:opacity-50">
            {{ subUE?.name }}
         </h3>
      </header>

      <!-- Main content -> courses list -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
            <div class="progress-list">
               <template v-for="topic in topicList">
                  <div class="progress-item cursor-pointer" @click="selectTopic(topic)">
                     <!-- <img src="/src/assets/progress-bar-0.svg"> -->
                     <div class="w-14">
                        <jcb-radial :value="topicProgressDict[topic.id]"></jcb-radial>
                     </div>
                     <p>
                        {{ topic?.name }}
                     </p>
                  </div>
               </template>
            </div>
         </div>

      </main>

   </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopicList } from '/src/use/useTopic'
import { getTheUserTopic } from '/src/use/useUserTopic'
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
})

const ue = ref()
const subUE = ref()
const topicList = ref([])
const topicProgressDict = ref({})

onMounted(async () => {
   console.log('onMounted StudentSubUE', props.userid)
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topicList.value = await getTopicList(props.sub_ue_id)
   for (const topic of topicList.value) {
      const user_topic = await getTheUserTopic(props.userid, topic.id)
      topicProgressDict.value[topic.id] = user_topic.done ? 100 : 0
   }
})

const selectTopic = (topic) => {
   router.push(`/home/${props.userid}/study-topic/${ue.value.id}/${subUE.value.id}/${topic.id}`)
}
</script>