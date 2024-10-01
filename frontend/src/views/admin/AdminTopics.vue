<template>
   <main class="container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card mb-2">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/admin/admin-ue`">Unités d'enseignement</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/admin/admin-sub-ue/${ue_id}`">{{ ue?.name }}</router-link>
            /
            <span class="font-semibold">{{ subUE?.name }}</span>
         </p>
      </header>

      <!-- Header -->
      <header class="py-4">
         <div class="flex sm:items-center items-start gap-1.5">
            <h3 class="">
               {{ subUE?.name }}
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
            <div v-for="topic, index in listOfTopic(sub_ue_id)">
               <EditableListItem
                  field="name" :index="index" :list="listOfTopic(sub_ue_id)"
                  @update="(ue1, ue2) => update(ue1, ue2)"
                  @edit="(text) => edit(topic.id, text)"
                  @remove="remove(topic)"
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
import { ref, computed } from 'vue'

import { ueOfId } from '/src/use/useUE'
import { subUEOfId } from '/src/use/useSubUE'
import { createTopic, updateTopic, removeTopic, listOfTopic } from '/src/use/useTopic'
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

const ue = computed(() => ueOfId.value(props.ue_id))
const subUE = computed(() => subUEOfId.value(props.sub_ue_id))

async function update(e1, e2) {
   await updateTopic(e1.id, { rank: e1.rank })
   await updateTopic(e2.id, { rank: e2.rank })
}

async function updateHidden(id, hidden) {
   await updateTopic(id, { hidden })
}

const title = ref()

const addTopic = async () => {
   await createTopic(props.sub_ue_id, title.value)
   title.value = ''
}

const edit = async (topic_id, name) => {
   await updateTopic(topic_id, { name })
}

const remove = async (topic) => {
   if (window.confirm(`Supprimer "${topic.name}" ?`)) {
      await removeTopic(topic.id)
   }
}
const select = (topicId) => {
   router.push(`/admin/admin-topic/${props.ue_id}/${props.sub_ue_id}/${topicId}`)
}
</script>
