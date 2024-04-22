import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   topicCache: {},
   isListReady: {},
})
 
const topicState = useSessionStorage('topic-state', initialState())

export const resetUseTopic = () => {
   topicState.value = initialState()
}


app.service('topic').on('create', topic => {
   console.log('TOPIC EVENT created', topic)
   topicState.value.topicCache[topic.id] = topic
})


export const getTopic = async (id) => {
   const topic = topicState.value.topicCache[id]
   if (topic) return topic
   const promise = app.service('topic').findUnique({ where: { id }})
   promise.then(topic => {
      topicState.value.topicCache[id] = topic
   })
   return promise
}

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
   return topic
}

export const updateTopic = async (id, data) => {
   const topic = await app.service('topic').update({
      where: { id },
      data,
   })
   // update cache
   topicState.value.topicCache[topic.id] = topic
   return topic
}

export const removeTopic = async (id) => {
   await app.service('topic').delete({ where: { id }})
   delete topicState.value.topicCache[id]
}

export const getTopicList = async (sub_ue_id) => {
   if (!topicState.value.isListReady[sub_ue_id]) {
      const list = await app.service('topic').findMany({
         where: { sub_ue_id }
      })
      for (const topic of list) {
         topicState.value.topicCache[topic.id] = topic
      }
      topicState.value.isListReady[sub_ue_id] = true
   }
   return Object.values(topicState.value.topicCache).filter(topic => topic.sub_ue_id === sub_ue_id).sort((e1, e2) => e1.rank - e2.rank)
}
