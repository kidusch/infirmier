import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   userQuizChoiceCache: {},
   theUserQuizChoiceReady: {},
})

const key = 'user-quiz-choice-state'
const userQuizChoiceState = useSessionStorage(key, initialState())

export const resetUseUserQuizChoice = () => {
   // userQuizChoiceState.value = initialState()
   sessionStorage.removeItem(key)
}


app.service('user_quiz_choice').on('create', (userQuizChoice) => {
   console.log('USER_QUIZ_CHOICE EVENT created', userQuizChoice)
   userQuizChoiceState.value.userQuizChoiceCache[userQuizChoice.id] = userQuizChoice
})

// get or create the unique user_quiz_choice associated to (user_id, quiz_choice_id)
export const getTheUserQuizChoice = async (user_id, quiz_choice_id) => {
   const isReady = userQuizChoiceState.value.theUserQuizChoiceReady[user_id + ':' + quiz_choice_id]
   if (isReady) return Object.values(userQuizChoiceState.value.userQuizChoiceCache).find(userQuizChoice => userQuizChoice.user_id === user_id && userQuizChoice.quiz_choice_id === quiz_choice_id)
   let [userQuizChoice] = await app.service('user_quiz_choice').findMany({
      where: { user_id, quiz_choice_id },
   })
   if (!userQuizChoice) {
      userQuizChoice = await app.service('user_quiz_choice').create({
         data: { user_id, quiz_choice_id },
      })
   }
   userQuizChoiceState.value.userQuizChoiceCache[userQuizChoice.id] = userQuizChoice
   userQuizChoiceState.value.theUserQuizChoiceReady[user_id + ':' + quiz_choice_id] = true
   return userQuizChoice
}

export const updateUserQuizChoice = async (id, data) => {
   const userQuizChoice = await app.service('user_quiz_choice').update({
      where: { id },
      data,
   })
   // update cache
   userQuizChoiceState.value.userQuizChoiceCache[userQuizChoice.id] = userQuizChoice
   return userQuizChoice
}
