<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-ue`">Unités d'enseignement</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-sub-ue/${ue_id}`">{{ ue?.name }}</router-link>
            /
            <span class="font-semibold">{{ sub_ue?.name }}</span>
         </p>
      </header>

      <!-- Header -->
      <header class="py-4">
         <div class="flex sm:items-center items-start gap-1.5">
            <h3 class="">
               {{ sub_ue?.name }}
            </h3>
         </div>
      </header>

      <!-- Header -->
      <header class="py-4">
         <div class="flex sm:items-center items-start gap-1.5">
            <h3 class="opacity-50">
               Matières
            </h3>
         </div>
      </header>

      <main class="flex flex-col gap-6 pb-4">

         <div class="flex flex-col gap-3">
            <div v-for="topic, index in topicList">
               <EditableListItem
                  field="name" :index="index" :list="topicList"
                  @update="(ue1, ue2) => update(ue1, ue2)"
                  @edit="(text) => edit(topic.id, text)"
                  @remove="remove(topic.id)"
                  @select="select(topic.id)"
                  @show="updateHidden(topic.id, false)"
                  @hide="updateHidden(topic.id, true)"
               ></EditableListItem>
            </div>

            <div>
               <div class="flex gap-3 items-center">
                  <input v-model="title" class="standard-input flex-1" placeholder="Titre nouvelle matière" type="text">
                  <div class="flex gap-1.5" @click="addTopic">
                     <img class="h-4 cursor-pointer" src="/src/assets/add.svg" alt="delete">
                  </div>
               </div>
            </div>

         </div>
      </main>

   </main>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { mdiPlus } from '@mdi/js'

import { getUE } from '/src/use/useUE'
import { getSubUE } from '/src/use/useSubUE'
import { createTopic, updateTopic, removeTopic, getTopicList } from '/src/use/useTopic'
import router from '/src/router'

import EditableListItem from '/src/components/EditableListItem.vue'

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
const sub_ue = ref()
const topicList = ref([])

onMounted(async () => {
   ue.value = await getUE(props.ue_id)
   sub_ue.value = await getSubUE(props.sub_ue_id)
   await updateList()
})

async function updateList() {
   const unorderedList = await getTopicList(props.sub_ue_id)
   topicList.value = unorderedList.sort((e1, e2) => e1.rank - e2.rank)
}

async function update(e1, e2) {
   await updateTopic(e1.id, { rank: e1.rank })
   await updateTopic(e2.id, { rank: e2.rank })
   updateList()
}

async function updateHidden(id, hidden) {
   await updateTopic(id, { hidden })
   updateList()
}

const title = ref()

const addTopic = async () => {
   await createTopic(props.sub_ue_id, title.value)
   await updateList()
   title.value = ''
}

const edit = async (topic_id, name) => {
   await updateTopic(topic_id, { name })
}

const remove = async (topicId) => {
   if (window.confirm("Supprimer ?")) {
      await removeTopic(topicId)
      await updateList()
   }
}
const select = (topicId) => {
   router.push(`/home/${props.userid}/admin-topic/${props.ue_id}/${props.sub_ue_id}/${topicId}`)
}

const back = () => {
   router.back()
}
</script>
