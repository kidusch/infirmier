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
            <span class="font-semibold">Étude de cas : {{ caseStudy?.title }}</span>
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
      <main class="py-4 w-full">

         <!-- Case study desciption -->
         <!-- <TextParts :userid="userid" :case_study_id="case_study_id" :parts="parts"></TextParts> -->
         <div v-html="caseStudy?.content"></div>

         <!-- Student's answer -->
         <div class="py-4">
            <div class="flex justify-between">
               <label for="title">Ma réponse</label>
               <div class="flex gap-2">
                  <img class="cursor-pointer h-5 mb-1" src="/src/assets/edit.svg" @click="disabledText = !disabledText">
               </div>
            </div>

            <div class="standard-input-container">
               <textarea placeholder="Écrivez votre réponse ici..." type="text" rows="50"
                  :value="userCaseStudy?.answer"
                  @input="debouncedInputText"
                  :disabled="disabledText"
               ></textarea>
            </div>
         </div>

      </main>

      <footer class="flex-1 flex flex-col justify-end pb-8">
         <button class="primary-btn px-4" @click="submitResponse" :disabled="userCaseStudy?.answer?.length === 0">
            Soumettre ma réponse
         </button>
      </footer>

   </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { ueOfId } from '/src/use/useUE'
import { subUEOfId } from '/src/use/useSubUE'
import { topicOfId } from '/src/use/useTopic'
import { caseStudyOfId } from '/src/use/useCaseStudy'
import { theUserCaseStudy, updateUserCaseStudy } from '/src/use/useUserCaseStudy'
import router from "/src/router"

// import parser from '/src/lib/grammar.js'
// import TextParts from '/src/components/TextParts.vue'


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

const ue = computed(() => ueOfId.value(props.ue_id))
const subUE = computed(() => subUEOfId.value(props.sub_ue_id))
const topic = computed(() => topicOfId.value(props.topic_id))
const caseStudy = computed(() => caseStudyOfId.value(props.case_study_id))
const userCaseStudy = computed(() => theUserCaseStudy.value(props.userid, props.case_study_id))

// const parts = ref([])

const disabledText = ref(true)

onMounted(async () => {
   // try {
   //    parts.value = parser.parse(caseStudy.value.content)
   //    console.log('parts', parts.value)
   // } catch(err) {
   //    parts.value = ''
   // }
})

const onDoneClick = async (done) => {
   await updateUserCaseStudy(userCaseStudy.value.id, { done })
}

const gotoStudy = () => {
   router.push(`/home/${props.userid}/study-topic/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}`)
}

const onInputText = async (ev) => {
   userCaseStudy.value = await updateUserCaseStudy(userCaseStudy.value.id, { answer: ev.target.value })
}
const debouncedInputText = useDebounceFn(onInputText, 500)

const submitResponse = () => {
   alert('La réponse a été envoyée et une correction personnalisée vous sera transmise rapidement.')
}
</script>