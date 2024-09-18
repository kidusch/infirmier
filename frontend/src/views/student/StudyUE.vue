<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <span>COURS</span>
         </p>
      </header>

      <!-- Main content -> courses list -->
      <main class="flex flex-col gap-6 pb-6">
         <template v-for="ue in listOfUE">
            <div v-if="!ue.hidden" class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
               <h3 class="font-semibold flex items-center gap-2.5">
                  <div class="ml-2 mt-3 w-14">
                     <jcb-radial class="w-14" :value="ueStudyProgress(userid, ue?.id)"></jcb-radial>
                  </div>
                  {{ ue?.name }}
               </h3>

               <div class="progress-list">
                  <template v-for="subUE in listOfSubUE(ue.id)">
                     <div v-if="!subUE.hidden" class="progress-item cursor-pointer" @click="select(ue, subUE)">
                        <div class="w-12">
                           <jcb-radial class="w-12" :value="subUEStudyProgress(userid, subUE.id)"></jcb-radial>
                        </div>
                        <p>
                           {{ subUE.name }}
                        </p>
                     </div>
                  </template>
               </div>
            </div>
         </template>

      </main>

   </main>

   <!-- PROPOSE SUBSCRIPTION MODAL -->
   <SubscribeDialog ref="subscribeModal" @cancel="subscribeModal?.close" @subscribe="gotoSubscribe" />

</template>

<script setup>
import { ref } from 'vue'

import { listOfUE } from '/src/use/useUE'
import { listOfSubUE } from '/src/use/useSubUE'
import { subUEStudyProgress, ueStudyProgress } from '/src/use/useProgress'
import router from "/src/router"

import SubscribeDialog from '/src/components/SubscribeDialog.vue'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const subscribeModal = ref()

const select = (ue, subUE) => {
   if (false) {
      subscribeModal.value.showModal()
   } else {
      // router.push(`/student/study-sub-ue/${ue.id}/${subUE.id}`)
      router.push(`/student/study-sub-ue/${ue.id}/${subUE.id}`)
   }
}

const gotoSubscribe = () => {
   router.push(`/student/subscribe`)
}
</script>