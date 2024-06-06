import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   userQuizCache: {},
   theUserQuizStatus: {},
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
   const key = user_id + ':' + quiz_id
   const status = userQuizState.value.theUserQuizStatus[key]
   if (status === 'ready') return Object.values(userQuizState.value.userQuizCache).find(userQuiz => userQuiz.user_id === user_id && userQuiz.quiz_id === quiz_id)
   userQuizState.value.theUserQuizStatus[key] = 'ongoing'
   let [userQuiz] = await app.service('user_quiz').findMany({
      where: { user_id, quiz_id },
   })
   if (!userQuiz) {
      userQuiz = await app.service('user_quiz').create({
         data: { user_id, quiz_id },
      })
   }
   userQuizState.value.userQuizCache[userQuiz.id] = userQuiz
   userQuizState.value.theUserQuizStatus[key] = 'ready'
   return userQuiz
}

export const theUserQuiz = computed(() => (user_id, quiz_id) => {
   const key = user_id + ':' + quiz_id
   const status = userQuizState.value.theUserQuizStatus[key]
   if (status === 'ready') return Object.values(userQuizState.value.userQuizCache).find(userQuiz => userQuiz.user_id === user_id && userQuiz.quiz_id === quiz_id)
   if (status !== 'ongoing') {
      userQuizState.value.theUserQuizStatus[key] = 'ongoing'
      app.service('user_quiz').findMany({
         where: { user_id, quiz_id },
      }).then(userQuizs => {
         if (userQuizs.length > 0) {
            const userQuiz = userQuizs[0]
            userQuizState.value.userQuizCache[userQuiz.id] = userQuiz
            userQuizState.value.theUserQuizStatus[key] = 'ready'
         } else {
            app.service('user_quiz').create({
               data: { user_id, quiz_id },
            }).then(userQuiz => {
               userQuizState.value.userQuizCache[userQuiz.id] = userQuiz
               userQuizState.value.theUserQuizStatus[key] = 'ready'
            })
         }
      })
   }
})

export const updateUserQuiz = async (id, data) => {
   const userQuiz = await app.service('user_quiz').update({
      where: { id },
      data,
   })
   // update cache
   userQuizState.value.userQuizCache[userQuiz.id] = userQuiz
   return userQuiz
}
