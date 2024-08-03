<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-ue`">RÉVISIONS</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-ue`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-sub-ue/${ue_id}/${sub_ue_id}`">{{ subUE?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-topic/${ue_id}/${sub_ue_id}/${topic_id}`">{{ topic?.name }}</router-link>
            /
            <span class="font-semibold">{{ caseStudy?.title }}</span>
         </p>
      </header>

      <!-- Header -->
      <section class="w-full flex justify-between">
         <h3 class="opacity-50">
            Étude de cas
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

         <!-- Case study description -->
         <div v-html="caseStudy?.content"></div>

         <!-- Student's answer -->
         <div class="py-4">
            <div class="flex justify-between">
               <label for="title">Ma réponse</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isAnswerDisabled" @click="isAnswerDisabled = !isAnswerDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isAnswerDisabled" @click="isAnswerDisabled = !isAnswerDisabled">
               </div>
            </div>

            <div class="standard-input-container">
               <textarea placeholder="Écrivez votre réponse ici..." type="text"
                  :value="answer"
                  @input="onAnswerInputDebounced"
                  v-position="answerPosition"
                  :disabled="isAnswerDisabled"
               ></textarea>
            </div>
         </div>

      </main>

      <footer class="flex-1 flex flex-col justify-end pb-8">
         <button class="primary-btn px-4" @click="getStandardCorrection">
            {{ userCaseStudy?.custom_correction_status === 'corrected' ? "Voir les corrections standard et personnalisée" : "Voir la correction standard" }}
         </button>
         <button class="primary-btn px-4 mt-3" v-if="userCaseStudy?.custom_correction_status === 'idle'" @click="getCustomCorrection">
            Obtenir une correction personnalisée
         </button>
      </footer>

   </main>

   <!-- ASK PREMIUM SUBSCRIPTION MODAL -->
   <PremiumDialog ref="premiumModal" @cancel="premiumModal?.close" @subscribe="subscribe" />

   <!-- TRANSMIT MODAL -->
   <CaseStudyAnswerDialog ref="transmitModal" @closed="onClosed" />

</template>

<script setup>
import { ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { userOfId } from '/src/use/useUser'
import { ueOfId } from '/src/use/useUE'
import { subUEOfId } from '/src/use/useSubUE'
import { topicOfId } from '/src/use/useTopic'
import { caseStudyOfId } from '/src/use/useCaseStudy'
import { theUserCaseStudy, updateUserCaseStudy } from '/src/use/useUserCaseStudy'

import router from "/src/router"
import { app } from '/src/client-app.js'

import PremiumDialog from '/src/components/PremiumDialog.vue'
import CaseStudyAnswerDialog from '/src/components/CaseStudyAnswerDialog.vue'


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

// handle answer editing
const localAnswer = ref()
const answer = computed(() => localAnswer.value || userCaseStudy.value.answer)
app.service('user_case_study').on('update', userCaseStudy => {
   localAnswer.value = userCaseStudy.answer
})
const answerPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onAnswerInput = async (ev) => {
   localAnswer.value = ev.target.value
   answerPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateUserCaseStudy(userCaseStudy.value.id, { answer: ev.target.value })
}
const onAnswerInputDebounced = useDebounceFn(onAnswerInput, 500)
const isAnswerDisabled = ref(true)

// custom directive (v-position on <input> or <textarea>) which restores cursor position
   const vPosition = {
   updated: (el, binding) => {
      // binding.value is the directive argument, here the cursor position ref { start, end }
      el.selectionStart, el.selectionEnd = binding.value.start, binding.value.end
   }
}

const onDoneClick = async (done) => {
   await updateUserCaseStudy(userCaseStudy.value.id, { done })
}

const gotoStudy = () => {
   router.push(`/home/${props.userid}/study-topic/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}`)
}

const getStandardCorrection = () => {
   router.push(`/home/${props.userid}/revise-case-study-answer/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${caseStudy.value.id}`)
}

const premiumModal = ref()
const transmitModal = ref(false)

const getCustomCorrection = async () => {
   if (user.value.premium) {
      await updateUserCaseStudy(userCaseStudy.value.id, {
         custom_correction_status: 'waiting-for-correction',
         custom_correction_date: new Date(),
      })
      transmitModal.value.showModal()
   } else {
      premiumModal.value.showModal()
   }
}

const subscribe = async () => {
   const session = await app.service('stripe').createSession(props.userid)
   console.log('session', session)
   window.location.href = session.url
}

const onClosed = () => {
   router.push(`/home/${props.userid}/revise-topic/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}`)
}
</script>