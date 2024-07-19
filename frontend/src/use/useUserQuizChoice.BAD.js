import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   userQuizChoiceCache: {},
   theUserQuizChoiceStatus: {},
})

const userQuizChoiceState = useSessionStorage('user-quiz-choice-state', initialState(), { mergeDefaults: true })

export const resetUseUserQuizChoice = () => {
   userQuizChoiceState.value = null
}


app.service('user_quiz_choice').on('create', (userQuizChoice) => {
   console.log('USER_QUIZ_CHOICE EVENT created', userQuizChoice)
   const key = userQuizChoice.user_id + ':' + userQuizChoice.quiz_choice_id
   userQuizChoiceState.value.userQuizChoiceCache[key] = userQuizChoice
   userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ready'
})

app.service('user_quiz_choice').on('update', (userQuizChoice) => {
   console.log('USER_QUIZ_CHOICE EVENT update', userQuizChoice)
   const key = userQuizChoice.user_id + ':' + userQuizChoice.quiz_choice_id
   userQuizChoiceState.value.userQuizChoiceCache[key] = userQuizChoice
   userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ready'
})

app.service('user_quiz_choice').on('delete', (userQuizChoice) => {
   console.log('USER_QUIZ_CHOICE EVENT delete', userQuizChoice)
   const key = userQuizChoice.user_id + ':' + userQuizChoice.quiz_choice_id
   delete userQuizChoiceState.value.userQuizChoiceCache[key]
   delete userQuizChoiceState.value.theUserQuizChoiceStatus[key]
})

// get or create the unique user_quiz_choice associated to (user_id, quiz_choice_id)
export const getTheUserQuizChoice = async (user_id, quiz_choice_id) => {
   const key = user_id + ':' + quiz_choice_id
   const status = userQuizChoiceState.value.theUserQuizChoiceStatus[key]
   if (status === 'ready') return userQuizChoiceState.value.userQuizChoiceCache[key]
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
   userQuizChoiceState.value.userQuizChoiceCache[key] = userQuizChoice
   userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ready'
   return userQuizChoice
}

export const theUserQuizChoice = computed(() => (user_id, quiz_choice_id) => {
   const key = user_id + ':' + quiz_choice_id
   const status = userQuizChoiceState.value.theUserQuizChoiceStatus[key]
   if (status === 'ready') return userQuizChoiceState.value.userQuizChoiceCache[key]
   if (status === 'ongoing') return undefined // ongoing request
   userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ongoing'
   app.service('user_quiz_choice').findMany({
      where: { user_id, quiz_choice_id },
   }).then((userQuizChoices) => {
      if (userQuizChoices.length > 0) {
         const userQuizChoice = userQuizChoices[0]
         userQuizChoiceState.value.theUserCourseCache[key] = userQuizChoice
         userQuizChoiceState.value.theUserCourseStatus[key] = 'ready'
      } else {
         app.service('user_quiz_choice').create({
            data: { user_id, quiz_choice_id },
         }).then(userQuizChoice => {
            userQuizChoiceState.value.theUserCourseCache[key] = userQuizChoice
            userQuizChoiceState.value.theUserCourseStatus[key] = 'ready'
         })
      }
   })
})


export const updateUserQuizChoice = async (id, data) => {
   const userQuizChoice = await app.service('user_quiz_choice').update({
      where: { id },
      data,
   })
   // update cache
   const key = userQuizChoice.user_id + ':' + userQuizChoice.quiz_choice_id
   userQuizChoiceState.value.userQuizChoiceCache[key] = userQuizChoice
   return userQuizChoice
}
