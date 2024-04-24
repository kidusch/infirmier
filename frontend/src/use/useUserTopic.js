import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   userTopicCache: {},
   theUserTopicReady: {},
})
 
const userTopicState = useSessionStorage('user-topic-state', initialState())

export const resetUseUserTopic = () => {
   userTopicState.value = initialState()
}


app.service('user_topic').on('create', (userTopic) => {
   console.log('USER_TOPIC EVENT created', userTopic)
   userTopicState.value.userTopicCache[userTopic.id] = userTopic
})

// get or create the unique user_topic associated to (user_id, topic_id)
export const getTheUserTopic = async (user_id, topic_id) => {
   const isReady = userTopicState.value.theUserTopicReady[user_id + ':' + topic_id]
   if (isReady) return Object.values(userTopicState.value.userTopicCache).find(userTopic => userTopic.user_id === user_id && userTopic.topic_id === topic_id)
   let [userTopic] = await app.service('user_topic').findMany({
      where: { user_id, topic_id },
   })
   if (!userTopic) {
      userTopic = await app.service('user_topic').create({
         data: { user_id, topic_id },
      })
   }
   userTopicState.value.userTopicCache[userTopic.id] = userTopic
   userTopicState.value.theUserTopicReady[user_id + ':' + topic_id] = true
   return userTopic
}

export const updateUserTopic = async (id, data) => {
   const userTopic = await app.service('user_topic').update({
      where: { id },
      data,
   })
   // update cache
   userTopicState.value.userTopicCache[userTopic.id] = userTopic
   return userTopic
}
