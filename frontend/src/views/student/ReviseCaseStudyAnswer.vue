<template>
    <main class="container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card mb-2">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/student/revise-ue`">RÉVISIONS</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/student/revise-ue`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/student/revise-sub-ue/${ue_id}/${sub_ue_id}`">{{ subUE?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/student/revise-topic/${ue_id}/${sub_ue_id}/${topic_id}`">{{ topic?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/student/revise-topic/${ue_id}/${sub_ue_id}/${topic_id}`">{{ caseStudy?.title }}</router-link>
            /
            <span class="font-semibold">Correction standard</span>
         </p>
      </header>

      <!-- Header -->
      <section class="w-full flex justify-between">
         <h3 class="opacity-50">
            Correction de l'étude de cas
         </h3>

         <div class="flex gap-6">
            <label class="inline-flex gap-3 items-center cursor-pointer">
               <p class="font-semibold text-black">Acquis</p>

               <input type="checkbox" class="sr-only peer" :checked="userCaseStudy?.done" @input="ev => onDoneClick(ev.target.checked)">
               <div
                  class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#76EE59]">
               </div>

            </label>

            <div class="cursor-pointer link hover:text-red-600 text-blue-600" @click="gotoStudy">
               cours
            </div>

         </div>
      </section>


      <!-- Main content -->
      <main class="pt-4 w-full">

         <!-- standard correction -->
         <label for="title">Correction standard</label>
         <div v-html="caseStudy?.standard_correction"></div>

         <!-- custom correction -->
         <div class="mt-4" v-if="userCaseStudy?.custom_correction_status === 'corrected'">
            <label for="title">Correction personnalisée</label>
            <div v-html="userCaseStudy?.custom_correction"></div>
         </div>

      </main>

      <footer class="flex-1 flex flex-col justify-end pb-8">
         <button class="primary-btn px-4 mt-3" v-if="userCaseStudy?.custom_correction_status === 'idle'" @click="getCustomCorrection">
            Obtenir une correction personnalisée
         </button>
         <button class="primary-btn px-4 mt-3" @click="goOn">
            Continuer
         </button>
      </footer>

   </main>

   <!-- ASK PREMIUM SUBSCRIPTION MODAL -->
   <PremiumDialog ref="premiumModal" @cancel="premiumModal?.close" @subscribe="gotoSubscribe" />

   <!-- TRANSMIT MODAL -->
   <CaseStudyAnswerDialog ref="transmitModal" @closed="goOn" />

</template>

<script setup>
import { ref, computed } from 'vue'

import { userOfId, hasPremiumSubscription } from '/src/use/useUser'
import { ueOfId } from '/src/use/useUE'
import { subUEOfId } from '/src/use/useSubUE'
import { topicOfId } from '/src/use/useTopic'
import { caseStudyOfId } from '/src/use/useCaseStudy'
import { theUserCaseStudy, updateUserCaseStudy } from '/src/use/useUserCaseStudy'

import router from "/src/router"
import { app } from '/src/client-app.js'


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
   case_study_id: {
      type: Number,
      required: true
   },
})

const user = computed(() => userOfId.value(props.userid))
const ue = computed(() => ueOfId.value(props.ue_id))
const subUE = computed(() => subUEOfId.value(props.sub_ue_id))
const topic = computed(() => topicOfId.value(props.topic_id))
const caseStudy = computed(() => caseStudyOfId.value(props.case_study_id))
const userCaseStudy = computed(() => theUserCaseStudy.value(props.userid, props.case_study_id))

const onDoneClick = async (done) => {
   await updateUserCaseStudy(userCaseStudy.value.id, { done })
}

const gotoStudy = () => {
   router.push(`/student/study-topic/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}`)
}

const goOn = () => {
   router.push(`/student/revise-topic/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}`)
}

const premiumModal = ref()
const transmitModal = ref(false)

const getCustomCorrection = async () => {
   if (hasPremiumSubscription.value(user.value.id)) {
      await updateUserCaseStudy(userCaseStudy.value.id, { custom_correction_status: 'waiting-for-correction' })
      transmitModal.value.showModal()
   } else {
      premiumModal.value.showModal()
   }
}

const gotoSubscribe = () => {
   router.push(`/student/subscribe`)
}
</script>
