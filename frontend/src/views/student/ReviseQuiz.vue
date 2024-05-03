<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-ue`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-sub-ue/${ue_id}/${sub_ue_id}`">{{ subUE?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/revise-topic/${ue_id}/${sub_ue_id}/${topic_id}`">{{ topic?.name }}</router-link>
            /
            <span class="font-semibold">{{ quiz?.title }}</span>
         </p>
      </header>

      <!-- Header -->
      <header class="py-2">
         <h3 class="lg:opacity-50">
            QCM
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
            <h4 class="py-2 font-semibold text-center">
                Quelle Caracteristique distingue une cellule
                eucaryote d’une cellule procaryote ?
            </h4>
            <p class="text-center">(selectionnez toutes les reponses correctes)</p>

            <!-- MCQ / QCM -->
            <form>

                <div>
                    <div class="py-5">
                        <div class="flex items-baseline pb-1.5">
                            <label for="default-radio-1" class="font-normal me-2 w-6">
                                <p class="text-sm text-black">
                                    Oui
                                </p>
                            </label>

                            <input id="default-radio-1" type="radio" value="" name="mcq-1" class="w-4 h-4 ">
                            <label for="default-radio-1" class="font-normal ms-2">
                                <p class="text-sm max-sm:text-xs text-black">
                                    A - Presence d’un noyau delimite par une
                                </p>
                            </label>
                        </div>
                        <div class="flex items-baseline">
                            <label for="default-radio-2" class="font-normal me-2 w-6">
                                <p class="text-sm text-black">
                                    non
                                </p>
                            </label>

                            <input checked id="default-radio-2" type="radio" value="" name="mcq-1" class="w-4 h-4  ">
                            <label for="default-radio-2" class="font-normal ms-2">
                                <p class="text-sm max-sm:text-xs text-black">
                                    membrane
                                </p>
                            </label>
                        </div>
                    </div>

                    <div class="">
                        <div class="flex items-baseline pb-1.5">
                            <label for="default-radio-3" class="font-normal me-2 w-6">
                                <p class="text-sm text-black">
                                    Oui
                                </p>
                            </label>

                            <input id="default-radio-3" type="radio" value="" name="mcq-2" class="w-4 h-4 ">
                            <label for="default-radio-3" class="font-normal ms-2">
                                <p class="text-sm max-sm:text-xs text-black">
                                    A - Presence d’un noyau delimite par une
                                </p>
                            </label>
                        </div>
                        <div class="flex items-baseline">
                            <label for="default-radio-4" class="font-normal me-2 w-6">
                                <p class="text-sm text-black">
                                    non
                                </p>
                            </label>

                            <input checked id="default-radio-4" type="radio" value="" name="mcq-2" class="w-4 h-4  ">
                            <label for="default-radio-4" class="font-normal ms-2">
                                <p class="text-sm max-sm:text-xs text-black">
                                    membrane
                                </p>
                            </label>
                        </div>
                    </div>

                    <div class="py-5">
                        <div class="flex items-baseline pb-1.5">
                            <label for="default-radio-1" class="font-normal me-2 w-6">
                                <p class="text-sm text-black">
                                    Oui
                                </p>
                            </label>

                            <input id="default-radio-1" type="radio" value="" name="mcq-3" class="w-4 h-4 ">
                            <label for="default-radio-1" class="font-normal ms-2">
                                <p class="text-sm max-sm:text-xs text-black">
                                    A - Presence d’un noyau delimite par une
                                </p>
                            </label>
                        </div>
                        <div class="flex items-baseline">
                            <label for="default-radio-2" class="font-normal me-2 w-6">
                                <p class="text-sm text-black">
                                    non
                                </p>
                            </label>

                            <input checked id="default-radio-2" type="radio" value="" name="mcq-3" class="w-4 h-4  ">
                            <label for="default-radio-2" class="font-normal ms-2">
                                <p class="text-sm max-sm:text-xs text-black">
                                    membrane
                                </p>
                            </label>
                        </div>
                    </div>

                </div>


            </form>
        </main>

        <footer class="flex-1 flex flex-col justify-end pb-8">
            <button class="primary-btn px-4">
                Verifier mes responses
            </button>
        </footer>

   </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopic } from '/src/use/useTopic'
import { getQuiz } from '/src/use/useQuiz'
import { getTheUserQuiz, updateUserQuiz } from '/src/use/useUserQuiz'
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
   quiz_id: {
      type: Number,
      required: true
   },
})

const ue = ref()
const subUE = ref()
const topic = ref([])
const quiz = ref([])
const userQuiz = ref([])

const done = ref(true)


onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topic.value = await getTopic(props.topic_id)
   quiz.value = await getQuiz(props.quiz_id)

   userQuiz.value = await getTheUserQuiz(props.userid, props.quiz_id)
   done.value = userQuiz.value.done
})

const onDoneClick = async () => {
   done.value = !done.value
   await updateUserQuiz(userQuiz.value.id, { done: done.value })
}

const gotoStudy = () => {
   router.push(`/home/${props.userid}/study-topic/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}`)
}
</script>