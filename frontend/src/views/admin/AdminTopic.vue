<template>
   <h1 class="text-xl font-semibold">{{ topic && topic.name }}</h1>

   <div>
      <p class="inline">Cours</p>
      <span class="link m-2" @click="select">select</span>
   </div>

   <hr/>

   <!-- <ul v-for="topic, index in topicList">
      <TopicItem :index="index" :topicList="topicList" @update="updateList" @edit="(text) => edit(topic.id, text)" @remove="remove(topic.id)" @select="select(topic.id)"></TopicItem>
   </ul>

   <div class="flex">
      <textarea v-model="title" class="textarea textarea-bordered" placeholder="Titre"></textarea>
      <button class="btn btn-circle" @click="addTopic">
         <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="mdiPlus" /></svg>
      </button>
   </div> -->
   
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { mdiPlus } from '@mdi/js'

import { getTopic } from '/src/use/useTopic'
import { getAuthenticatedUser } from '/src/use/useAuthentication'
import router from "/src/router"

const props = defineProps({
   topic_id: {
      type: Number,
      required: true
   },
})

const topic = ref()
// const topicList = ref([])

onMounted(async () => {
   topic.value = await getTopic(props.topic_id)
   // await updateList()
})

// async function updateList() {
//    const unorderedList = await getTopicList(props.sub_ue_id)
//    topicList.value = unorderedList.sort((e1, e2) => e1.rank - e2.rank)
// }

// const title = ref()

// const addTopic = async () => {
//    await createTopic(props.sub_ue_id, title.value)
//    await updateList()
//    title.value = ''
// }

// const edit = async (topic_id, name) => {
//    await updateTopic(topic_id, { name })
// }

// const remove = async (id) => {
//    await removeTopic(id)
//    await updateList()
// }

const select = (id) => {
   router.push(`/home/${getAuthenticatedUser().id}/admin-course/${props.topic_id}`)
}
</script>