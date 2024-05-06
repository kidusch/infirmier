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
      <header class="py-2">
         <h3 class="opacity-50">
            Étude de cas
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

         <button @click="gotoStudy">
            <img class="h-5" src="/src/assets/courses.svg" alt="course">
         </button>

      </section>


      <!-- Main content -->
      <main class="py-4 w-full">
         <h4 class="py-2 font-semibold">
            {{ caseStudy?.title }}
         </h4>

         <p>{{ caseStudy?.content }}</p>

         <div class="py-4">
            <div class="standard-input-container">
               <textarea placeholder="Écrivez votre réponse ici..." type="text" rows="50"
                  :value="userCaseStudy?.answer"
                  @input="debouncedInputText"
               ></textarea>
               <img src="/src/assets/edit.svg" alt="edit">
               <div class="img-placeholder"></div>
            </div>
         </div>

      </main>

      <footer class="flex-1 flex flex-col justify-end pb-8">
         <button class="primary-btn px-4" @click="submitResponse">
            Soumettre ma réponse
         </button>
      </footer>

   </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopic } from '/src/use/useTopic'
import { getCaseStudy } from '/src/use/useCaseStudy'
import { getTheUserCaseStudy, updateUserCaseStudy } from '/src/use/useUserCaseStudy'

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
   case_study_id: {
      type: Number,
      required: true
   },
})

const ue = ref()
const subUE = ref()
const topic = ref([])
const caseStudy = ref([])
const userCaseStudy = ref([])

const done = ref(true)


onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topic.value = await getTopic(props.topic_id)
   caseStudy.value = await getCaseStudy(props.case_study_id)

   userCaseStudy.value = await getTheUserCaseStudy(props.userid, props.case_study_id)
   done.value = userCaseStudy.value.done
})

const onDoneClick = async () => {
   done.value = !done.value
   userCaseStudy.value = await updateUserCaseStudy(userCaseStudy.value.id, { done: done.value })
}

const gotoStudy = () => {
   router.push(`/home/${props.userid}/study-topic/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}`)
}

const onInputText = async (ev) => {
   userCaseStudy.value = await updateUserCaseStudy(userCaseStudy.value.id, { answer: ev.target.value })
}
const debouncedInputText = useDebounceFn(onInputText, 500)

const submitResponse = () => {
}
</script>