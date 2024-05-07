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
            <span class="font-semibold">Fiche de révision</span>
         </p>
      </header>

      <main class="flex flex-col gap-3">
         <div>
            <label for="title">Titre</label>
            <div class="standard-input-container">
               <input placeholder="Titre..." type="text"
                  :value="card ? card.title : ''"
                  @input="debouncedInputTitle"
                  :disabled="disabledTitle"
               />
               <img src="/src/assets/edit.svg"  @click="disabledTitle = !disabledTitle">
               <div class="img-placeholder">
               </div>
            </div>
         </div>
         <div>
            <label for="title">Contenu</label>
            <div class="standard-input-container">
               <textarea placeholder="Contenu..." type="text" rows="50"
                  :value="card ? card.content : ''"
                  @input="debouncedInputContent"
                  :disabled="disabledContent"
               ></textarea>
               <img src="/src/assets/edit.svg"  @click="disabledContent = !disabledContent">
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
import { getTopic } from '/src/use/useTopic'
import { getCard, updateCard } from '/src/use/useCard'
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
   card_id: {
      type: Number,
      required: true
   },
})

const ue = ref()
const subUE = ref()
const topic = ref()
const card = ref()

onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   subUE.value = await getSubUE(props.sub_ue_id)
   topic.value = await getTopic(props.topic_id)
   card.value = await getCard(props.card_id)
})

const onInputTitle = async (ev) => {
   await updateCard(props.card_id, { title: ev.target.value })
}
const onInputContent = async (ev) => {
   await updateCard(props.card_id, { content: ev.target.value })
}
const debouncedInputTitle = useDebounceFn(onInputTitle, 500)
const debouncedInputContent = useDebounceFn(onInputContent, 500)

const disabledTitle = ref(true)
const disabledContent = ref(true)

const back = () => {
   router.back()
}

const preview = () => {
   console.log('preview')
}
</script>