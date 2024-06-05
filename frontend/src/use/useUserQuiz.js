import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   userQuizCache: {},
   theUserQuizReady: {},
})
 
const userQuizState = useSessionStorage('user-quiz-state', initialState())

export const resetUseUserQuiz = () => {
   userQuizState.value = initialState()
}


app.service('user_quiz').on('create', (userQuiz) => {
   console.log('USER_QUIZ EVENT created', userQuiz)
   userQuizState.value.userQuizCache[userQuiz.id] = userQuiz
})

// get or create the unique user_quiz associated to (user_id, quiz_id)
export const getTheUserQuiz = async (user_id, quiz_id) => {
   const isReady = userQuizState.value.theUserQuizReady[user_id + ':' + quiz_id]
   if (isReady) return Object.values(userQuizState.value.userQuizCache).find(userQuiz => userQuiz.user_id === user_id && userQuiz.quiz_id === quiz_id)
   let [userQuiz] = await app.service('user_quiz').findMany({
      where: { user_id, quiz_id },
   })
   if (!userQuiz) {
      userQuiz = await app.service('user_quiz').create({
         data: { user_id, quiz_id },
      })
   }
   userQuizState.value.userQuizCache[userQuiz.id] = userQuiz
   userQuizState.value.theUserQuizReady[user_id + ':' + quiz_id] = true
   return userQuiz
}

export const updateUserQuiz = async (id, data) => {
   const userQuiz = await app.service('user_quiz').update({
      where: { id },
      data,
   })
   // update cache
   userQuizState.value.userQuizCache[userQuiz.id] = userQuiz
   return userQuiz
}
