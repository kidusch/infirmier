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


// export const getUserTopic = async (id) => {
//    const userTopic = userTopicState.value.userTopicCache[id]
//    if (userTopic) return userTopic
//    const promise = app.service('user_topic').findUnique({ where: { id }})
//    promise.then(userTopic => {
//       userTopicState.value.userTopicCache[id] = userTopic
//    })
//    return promise
// }

// 1:1 relationship user : user_topic
export const getTheUserTopic = async (user_id, topic_id) => {
   const isReady = userTopicState.value.theUserTopicReady[user_id]
   if (isReady) return Object.values(userTopicState.value.userTopicCache).find(userTopic => userTopic.user_id === user_id)
   // get or create
   const promise = app.service('user_topic').upsert({
      where: { user_id },
      update: {},
      create: { user_id, topic_id },
   })
   promise.then(userTopic => {
      userTopicState.value.userTopicCache[userTopic.id] = userTopic
      userTopicState.value.theUserTopicReady[user_id] = true
   })
   return promise
}

// export const createUserTopic = async (user_id, topic_id) => {
//    const userTopic = await app.service('user_topic').create({
//       data: {
//          user_id,
//          topic_id,
//       }
//    })
//    // update cache
//    userTopicState.value.userTopicCache[userTopic.id] = userTopic
//    return userTopic
// }

export const updateUserTopic = async (id, data) => {
   const userTopic = await app.service('user_topic').update({
      where: { id },
      data,
   })
   // update cache
   userTopicState.value.userTopicCache[userTopic.id] = userTopic
   return userTopic
}

// export const removeUserTopic = async (id) => {
//    await app.service('user_topic').delete({ where: { id }})
//    delete userTopicState.value.userTopicCache[id]
// }
