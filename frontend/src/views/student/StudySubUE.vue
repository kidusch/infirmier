<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <router-link class="cursor-pointer hover:underline" :to="`/student/study-ue`">COURS</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/student/study-ue`">{{ ue?.name }}</router-link>
            /
            <span class="font-semibold">{{ subUE?.name }}</span>
         </p>
      </header>

      <!-- Header -->
      <header>
         <h3 class="opacity-50 flex items-center gap-2.5">
            <div class="ml-2 mt-3 w-14">
               <jcb-radial class="w-14" :value="subUEStudyProgress(userid, sub_ue_id)"></jcb-radial>
            </div>
            {{ subUE?.name }}
         </h3>
      </header>

      <!-- Main content -> topics list -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
            <div class="progress-list">
               <template v-for="topic in topicList">
                  <div v-if="!topic.hidden" class="progress-item cursor-pointer" @click="selectTopic(topic)">
                     <div class="w-12">
                        <jcb-radial class="w-12" :value="topicStudyProgress(userid, topic.id)"></jcb-radial>
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
import { computed } from 'vue'

import { ueOfId } from '/src/use/useUE'
import { subUEOfId } from '/src/use/useSubUE'
import { listOfTopic } from '/src/use/useTopic'
import { topicStudyProgress, subUEStudyProgress } from '/src/use/useProgress'
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

const ue = computed(() => ueOfId.value(props.ue_id))
const subUE = computed(() => subUEOfId.value(props.sub_ue_id))
const topicList = computed(() => listOfTopic.value(props.sub_ue_id))

const selectTopic = (topic) => {
   router.push(`/student/study-topic/${props.ue_id}/${props.sub_ue_id}/${topic.id}`)
}
</script>