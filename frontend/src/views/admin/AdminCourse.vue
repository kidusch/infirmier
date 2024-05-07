<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-ue`">Unités d'enseignement</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-sub-ue/${ue_id}`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-topics/${ue_id}/${sub_ue_id}`">{{ subUE?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-topic/${ue_id}/${sub_ue_id}/${topic_id}`">{{ topic?.name }}</router-link>
            /
            <span class="font-semibold">Cours</span>
         </p>
      </header>

      <main class="flex flex-col gap-3">
         <div>
               <label for="title">Contenu</label>
               <div class="standard-input-container">
                  <textarea placeholder="Écrire le contenu ici..." type="text" rows="50"
                     :value="topic ? topic.course_content : ''"
                     @input="debouncedInput"
                     :disabled="disabled"
                  ></textarea>
                  <img src="/src/assets/edit.svg" @click="disabled = !disabled">
                  <div class="img-placeholder"></div>
               </div>
         </div>
      </main>

   </main>
   
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { getTopic, updateTopic } from '/src/use/useTopic'
import router from '/src/router'

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
const topic = ref()
const disabled = ref(true)

onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topic.value = await getTopic(props.topic_id)
})

const onInput = async (ev) => {
   await updateTopic(props.topic_id, { course_content: ev.target.value })
}
const debouncedInput = useDebounceFn(onInput, 500)

const preview = () => {
   console.log('preview')
}

const back = () => {
   router.back()
}
</script>