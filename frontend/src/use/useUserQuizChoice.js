import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   userQuizChoiceCache: {},
   // theUserQuizChoiceReady: {},
   theUserQuizChoiceStatus: {},
})

const key = 'user-quiz-choice-state'
const userQuizChoiceState = useSessionStorage(key, initialState(), { mergeDefaults: true })

export const resetUseUserQuizChoice = () => {
   userQuizChoiceState.value = null
}


app.service('user_quiz_choice').on('create', (userQuizChoice) => {
   console.log('USER_QUIZ_CHOICE EVENT created', userQuizChoice)
   userQuizChoiceState.value.userQuizChoiceCache[userQuizChoice.id] = userQuizChoice
})

app.service('user_quiz_choice').on('update', (userQuizChoice) => {
   console.log('USER_QUIZ_CHOICE EVENT update', userQuizChoice)
   userQuizChoiceState.value.userQuizChoiceCache[userQuizChoice.id] = userQuizChoice
})

app.service('user_quiz_choice').on('delete', (userQuizChoice) => {
   console.log('USER_QUIZ_CHOICE EVENT delete', userQuizChoice)
   delete userQuizChoiceState.value.userQuizChoiceCache[userQuizChoice.id]
})

// // get or create the unique user_quiz_choice associated to (user_id, quiz_choice_id)
// export const getTheUserQuizChoice = async (user_id, quiz_choice_id) => {
//    const isReady = userQuizChoiceState.value.theUserQuizChoiceReady[user_id + ':' + quiz_choice_id]
//    if (isReady) return Object.values(userQuizChoiceState.value.userQuizChoiceCache).find(userQuizChoice => userQuizChoice.user_id === user_id && userQuizChoice.quiz_choice_id === quiz_choice_id)
//    let [userQuizChoice] = await app.service('user_quiz_choice').findMany({
//       where: { user_id, quiz_choice_id },
//    })
//    if (!userQuizChoice) {
//       userQuizChoice = await app.service('user_quiz_choice').create({
//          data: { user_id, quiz_choice_id },
//       })
//    }
//    userQuizChoiceState.value.userQuizChoiceCache[userQuizChoice.id] = userQuizChoice
//    userQuizChoiceState.value.theUserQuizChoiceReady[user_id + ':' + quiz_choice_id] = true
//    return userQuizChoice
// }


// get or create the unique user_quiz_choice associated to (user_id, quiz_choice_id)
export const getTheUserQuizChoice = async (user_id, quiz_choice_id) => {
   const key = user_id + ':' + quiz_choice_id
   const status = userQuizChoiceState.value.theUserQuizChoiceStatus[key]
   if (status === 'ready') {
      return Object.values(userQuizChoiceState.value.userQuizChoiceCache).find(userQuizChoice => userQuizChoice.user_id === user_id && userQuizChoice.quiz_choice_id === quiz_choice_id)
   }
   if (status === 'ongoing') return undefined // ongoing request
   userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ongoing'
   let [userQuizChoice] = await app.service('user_quiz_choice').findMany({
      where: { user_id, quiz_choice_id },
   })
   if (!userQuizChoice) {
      userQuizChoice = await app.service('user_quiz_choice').create({
         data: { user_id, quiz_choice_id },
      })
   }
   userQuizChoiceState.value.userQuizChoiceCache[userQuizChoice.id] = userQuizChoice
   userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ready'
   return userQuizChoice
}

export const theUserQuizChoice = computed(() => (user_id, quiz_choice_id) => {
   const key = user_id + ':' + quiz_choice_id
   const status = userQuizChoiceState.value.theUserQuizChoiceStatus[key]
   if (status === 'ready') {
      return Object.values(userQuizChoiceState.value.userQuizChoiceCache).find(userQuizChoice => userQuizChoice.user_id === user_id && userQuizChoice.quiz_choice_id === quiz_choice_id)
   }
   if (status === 'ongoing') return undefined // ongoing request
   userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ongoing'
   app.service('user_quiz_choice').findMany({
      where: { user_id, quiz_choice_id },
   }).then((userQuizChoices) => {
      if (userQuizChoices.length === 0) {
         app.service('user_quiz_choice').create({
            data: { user_id, quiz_choice_id },
         }).then(userQuizChoice => {
            userQuizChoiceState.value.userQuizChoiceCache[userQuizChoice.id] = userQuizChoice
            userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ready'
         })
      } else {
         userQuizChoiceState.value.userQuizChoiceCache[userQuizChoices[0].id] = userQuizChoices[0]
         userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ready'
      }
   })
})


export const updateUserQuizChoice = async (id, data) => {
   const userQuizChoice = await app.service('user_quiz_choice').update({
      where: { id },
      data,
   })
   // update cache
   userQuizChoiceState.value.userQuizChoiceCache[userQuizChoice.id] = userQuizChoice
   return userQuizChoice
}
