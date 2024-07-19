import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   theUserQuizChoiceCache: {},
   theUserQuizChoiceStatus: {},
   userQuizChoiceListStatus: {},
   uncorrectedUserQuizChoiceListStatus: undefined,
})

const userQuizChoiceState = useSessionStorage('user-quiz-choice-state', initialState(), { mergeDefaults: true })

export const resetUseUserQuizChoice = () => {
   userQuizChoiceState.value = null
}


app.service('user_quiz_choice').on('create', (userQuizChoice) => {
   console.log('USER_QUIZ_CHOICE EVENT created', userQuizChoice)
   const key = userQuizChoice.user_id + ':' + userQuizChoice.quiz_choice_id
   userQuizChoiceState.value.theUserQuizChoiceCache[key] = userQuizChoice
   userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ready'
})

app.service('user_quiz_choice').on('update', (userQuizChoice) => {
   console.log('USER_QUIZ_CHOICE EVENT update', userQuizChoice)
   const key = userQuizChoice.user_id + ':' + userQuizChoice.quiz_choice_id
   userQuizChoiceState.value.theUserQuizChoiceCache[key] = userQuizChoice
   userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ready'
})

app.service('user_quiz_choice').on('delete', (userQuizChoice) => {
   console.log('USER_QUIZ_CHOICE EVENT delete', userQuizChoice)
   const key = userQuizChoice.user_id + ':' + userQuizChoice.quiz_choice_id
   delete userQuizChoiceState.value.theUserQuizChoiceCache[key]
   delete userQuizChoiceState.value.theUserQuizChoiceStatus[key]
})


// get or create the unique user_quiz_choice associated to (user_id, quiz_choice_id)
export const getTheUserQuizChoice = async (user_id, quiz_choice_id) => {
   const key = user_id + ':' + quiz_choice_id
   const status = userQuizChoiceState.value.theUserQuizChoiceStatus[key]
   if (status === 'ready') return userQuizChoiceState.value.theUserQuizChoiceCache[key]
   userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ongoing'
   let [userQuizChoice] = await app.service('user_quiz_choice').findMany({
      where: { user_id, quiz_choice_id },
   })
   if (!userQuizChoice) {
      userQuizChoice = await app.service('user_quiz_choice').create({
         data: { user_id, quiz_choice_id },
      })
   }
   userQuizChoiceState.value.theUserQuizChoiceCache[key] = userQuizChoice
   userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ready'
   return userQuizChoice
}

export const theUserQuizChoice = computed(() => (user_id, quiz_choice_id) => {
   const key = user_id + ':' + quiz_choice_id
   const status = userQuizChoiceState.value.theUserQuizChoiceStatus[key]
   if (status === 'ready') return userQuizChoiceState.value.theUserQuizChoiceCache[key]
   if (status === 'ongoing') return undefined // ongoing request
   userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ongoing'
   app.service('user_quiz_choice').findMany({
      where: { user_id, quiz_choice_id },
   }).then(userCaseStudies => {
      if (userCaseStudies.length > 0) {
         const userQuizChoice = userCaseStudies[0]
         userQuizChoiceState.value.theUserQuizChoiceCache[key] = userQuizChoice
         userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ready'
      } else {
         app.service('user_quiz_choice').create({
            data: { user_id, quiz_choice_id },
         }).then(userQuizChoice => {
            userQuizChoiceState.value.theUserQuizChoiceCache[key] = userQuizChoice
            userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ready'
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
   userQuizChoiceState.value.theUserQuizChoiceCache[key] = userQuizChoice
   return userQuizChoice
}

// used to evaluate progress - prevent lots of single requests
export const getUserQuizChoiceList = async (user_id) => {
   const userQuizChoiceList = await app.service('user_quiz_choice').findMany({
      where: { user_id }
   })
   for (const userQuizChoice of userQuizChoiceList) {
      const key = user_id + ':' + userQuizChoice.quiz_choice_id
      userQuizChoiceState.value.theUserQuizChoiceCache[key] = userQuizChoice
      userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ready'
   }
}

// export const listOfUserQuizChoice = computed(() => (user_id) => {
//    if (userQuizChoiceState.value.userQuizChoiceListStatus[user_id] === 'ready') {
//       return Object.values(userQuizChoiceState.value.theUserQuizChoiceCache).filter(userQuizChoice => userQuizChoice.user_id === user_id)
//    }
//    if (userQuizChoiceState.value.userQuizChoiceListStatus[user_id] !== 'ongoing') {
//       userQuizChoiceState.value.userQuizChoiceListStatus[user_id] = 'ongoing'
//       app.service('user_quiz_choice').findMany({
//          where: { user_id }
//       }).then(list => {
//          for (const userQuizChoice of list) {
//             const key = user_id + ':' + userQuizChoice.quiz_choice_id
//             userQuizChoiceState.value.theUserQuizChoiceCache[key] = userQuizChoice
//             userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ready'
//          }
//          userQuizChoiceState.value.userQuizChoiceListStatus[user_id] = 'ready'
//       }).catch(err => {
//          console.log('listOfUserQuizChoice err', err)
//          userQuizChoiceState.value.userQuizChoiceListStatus[user_id] = undefined
//       })
//    }
//    return []
// })

export const listOfUncorrectedUserQuizChoice = computed(() => {
   if (userQuizChoiceState.value.uncorrectedUserQuizChoiceListStatus === 'ready') {
      return Object.values(userQuizChoiceState.value.theUserQuizChoiceCache).filter(userQuizChoice => (userQuizChoice.correction_status === 'waiting-for-correction'))
   }
   if (userQuizChoiceState.value.uncorrectedUserQuizChoiceListStatus !== 'ongoing') {
      userQuizChoiceState.value.uncorrectedUserQuizChoiceListStatus = 'ongoing'
      app.service('user_quiz_choice').findMany({
         where: {
            correction_status: 'waiting-for-correction',
         }
      }).then(list => {
         for (const userQuizChoice of list) {
            const key = userQuizChoice.user_id + ':' + userQuizChoice.quiz_choice_id
            userQuizChoiceState.value.theUserQuizChoiceCache[key] = userQuizChoice
            userQuizChoiceState.value.theUserQuizChoiceStatus[key] = 'ready'
         }
         userQuizChoiceState.value.uncorrectedUserQuizChoiceListStatus = 'ready'
      }).catch(err => {
         console.log('listOfUserQuizChoice err', err)
         userQuizChoiceState.value.uncorrectedUserQuizChoiceListStatus = undefined
      })
   }
   return []
})
