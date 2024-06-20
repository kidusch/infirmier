import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   topicCache: {},
   topicStatus: {},
   topicListStatus: {},
})

const key = 'topic-state'
const topicState = useSessionStorage(key, initialState(), { mergeDefaults: true })

export const resetUseTopic = () => {
   topicState.value = null
}


app.service('topic').on('create', topic => {
   console.log('TOPIC EVENT created', topic)
   topicState.value.topicCache[topic.id] = topic
})

app.service('topic').on('update', topic => {
   console.log('TOPIC EVENT update', topic)
   topicState.value.topicCache[topic.id] = topic
})

app.service('topic').on('delete', topic => {
   console.log('TOPIC EVENT delete', topic)
   delete topicState.value.topicCache[topic.id]
})


export const getTopic = async (id) => {
   let topic = topicState.value.topicCache[id]
   if (topic) return topic
   topic = await app.service('topic').findUnique({ where: { id }})
   topicState.value.topicCache[id] = topic
   topicState.value.topicStatus[id] = 'ready'
   return topic
}

export const topicOfId = computed(() => (id) => {
   const status = topicState.value.topicStatus[id]
   if (status === 'ready') return topicState.value.topicCache[id]
   if (status === 'ongoing') return undefined // ongoing request
   topicState.value.topicStatus[id] = 'ongoing'
   app.service('topic').findUnique({ where: { id }})
   .then(topic => {
      topicState.value.topicCache[id] = topic
      topicState.value.topicStatus[id] = 'ready'
   })
   .catch(err => {
      console.log('topicOfId err', id, err)
      topicState.value.topicStatus[id] = undefined
   })
})

export const createTopic = async (sub_ue_id, name) => {
   // get highest rank
   const result = await app.service('topic').aggregate({
      where: { sub_ue_id},
      _max: { rank: true }
   })
   const highestRank = result._max.rank
   const rank = highestRank ? highestRank + 1 : 1
   // create topic with this rank
   const topic = await app.service('topic').create({
      data: {
         name,
         rank,
         sub_ue_id,
      }
   })
   // update cache
   topicState.value.topicCache[topic.id] = topic
   topicState.value.topicStatus[topic.id] = 'ready'
   return topic
}

export const updateTopic = async (id, data) => {
   const topic = await app.service('topic').update({
      where: { id },
      data,
   })
   // update cache
   topicState.value.topicCache[id] = topic
   topicState.value.topicStatus[id] = 'ready'
   return topic
}

export const removeTopic = async (id) => {
   await app.service('topic').delete({ where: { id }})
   delete topicState.value.topicCache[id]
}

export const getTopicList = async (sub_ue_id) => {
   if (topicState.value.topicListStatus[sub_ue_id] !== 'ready') {
      topicState.value.topicListStatus[sub_ue_id] = 'ongoing'
      const list = await app.service('topic').findMany({
         where: { sub_ue_id }
      })
      for (const topic of list) {
         topicState.value.topicCache[topic.id] = topic
         topicState.value.topicStatus[topic.id] = 'ready'
      }
      topicState.value.topicListStatus[sub_ue_id] = 'ready'
   }
   return Object.values(topicState.value.topicCache).filter(topic => topic.sub_ue_id === sub_ue_id).sort((e1, e2) => e1.rank - e2.rank)
}

export const listOfTopic = computed(() => (sub_ue_id) => {
   if (topicState.value.topicListStatus[sub_ue_id] === 'ready') {
      return Object.values(topicState.value.topicCache).filter(topic => topic.sub_ue_id === sub_ue_id).sort((e1, e2) => e1.rank - e2.rank)
   }
   if (topicState.value.topicListStatus[sub_ue_id] !== 'ongoing') {
      topicState.value.topicListStatus[sub_ue_id] = 'ongoing'
      app.service('topic').findMany({
         where: { sub_ue_id }
      }).then((topicList) => {
         for (const topic of topicList) {
            topicState.value.topicCache[topic.id] = topic
            topicState.value.topicStatus[topic.id] = 'ready'
         }
         topicState.value.topicListStatus[sub_ue_id] = 'ready'
      })
   }
   return []
})
