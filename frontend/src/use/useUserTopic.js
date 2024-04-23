import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   userTopicCache: {},
   isListReady: {},
})
 
const userTopicState = useSessionStorage('user-topic-state', initialState())

export const resetUseUserTopic = () => {
   userTopicState.value = initialState()
}


app.service('user_topic').on('create', (userTopic) => {
   console.log('USER_TOPIC EVENT created', quizChoice)
   userTopicState.value.userTopicCache[quizChoice.id] = quizChoice
})


export const getQuizChoice = async (id) => {
   const quizChoice = userTopicState.value.userTopicCache[id]
   if (quizChoice) return quizChoice
   const promise = app.service('user_topic').findUnique({ where: { id }})
   promise.then(quizChoice => {
      userTopicState.value.userTopicCache[id] = quizChoice
   })
   return promise
}

export const createQuizChoice = async (quiz_id) => {
   // get highest rank
   const result = await app.service('user_topic').aggregate({
      where: { quiz_id},
      _max: { rank: true }
   })
   const highestRank = result._max.rank
   const rank = highestRank ? highestRank + 1 : 1
   // create quizChoice with this rank
   const quizChoice = await app.service('user_topic').create({
      data: {
         rank,
         quiz_id,
         text: '',
         answer: false,
         comment: '',
         positive_points: 0,
         negative_points: 0,
      }
   })
   // update cache
   userTopicState.value.userTopicCache[quizChoice.id] = quizChoice
   return quizChoice
}

export const updateQuizChoice = async (id, data) => {
   const quizChoice = await app.service('user_topic').update({
      where: { id },
      data,
   })
   // update cache
   userTopicState.value.userTopicCache[quizChoice.id] = quizChoice
   return quizChoice
}

export const removeQuizChoice = async (id) => {
   await app.service('user_topic').delete({ where: { id }})
   delete userTopicState.value.userTopicCache[id]
}

export const getQuizChoiceList = async (quiz_id) => {
   if (!userTopicState.value.isListReady[quiz_id]) {
      const list = await app.service('user_topic').findMany({
         where: { quiz_id }
      })
      for (const quizChoice of list) {
         userTopicState.value.userTopicCache[quizChoice.id] = quizChoice
      }
      userTopicState.value.isListReady[quiz_id] = true
   }
   return Object.values(userTopicState.value.userTopicCache).filter(quizChoice => quizChoice.quiz_id === quiz_id).sort((e1, e2) => e1.rank - e2.rank)
}
