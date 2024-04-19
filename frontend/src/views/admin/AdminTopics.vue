<template>
   <h1 class="text-xl font-semibold">Matières</h1>

   <div class="link m-2" @click="back">back</div>

   <h1 class="text-xl font-semibold">{{ sub_ue && sub_ue.name }}</h1>

   <ul v-for="topic, index in topicList">
      <EditableListItem
         field="name" :index="index" :list="topicList"
         @update="(ue1, ue2) => update(ue1, ue2)"
         @edit="(text) => edit(topic.id, text)"
         @remove="remove(topic.id)"
         @select="select(topic.id)"
      ></EditableListItem>
   </ul>

   <div class="flex">
      <textarea v-model="title" class="textarea textarea-bordered" placeholder="Titre nouvelle matière"></textarea>
      <button class="btn btn-circle" @click="addTopic">
         <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="mdiPlus" /></svg>
      </button>
   </div>
   
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { mdiPlus } from '@mdi/js'

import { getSubUE } from '/src/use/useSubUE'
import { createTopic, updateTopic, removeTopic, getTopicList } from '/src/use/useTopic'
import { getAuthenticatedUser } from '/src/use/useAuthentication'
import router from '/src/router'

import EditableListItem from '/src/components/EditableListItem.vue'

const props = defineProps({
   sub_ue_id: {
      type: Number,
      required: true
   },
})

const sub_ue = ref()
const topicList = ref([])

onMounted(async () => {
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

const title = ref()

const addTopic = async () => {
   await createTopic(props.sub_ue_id, title.value)
   await updateList()
   title.value = ''
}

const edit = async (topic_id, name) => {
   await updateTopic(topic_id, { name })
}

const remove = async (id) => {
   await removeTopic(id)
   await updateList()
}
const select = (id) => {
   router.push(`/home/${getAuthenticatedUser().id}/admin-topic/${id}`)
}

const back = () => {
   router.back()
}
</script>
