import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   theUserQuizCache: {},
   theUserQuizStatus: {},
   uncorrectedUserQuizListStatus: undefined,
})

const userQuizState = useSessionStorage('user-quiz-state', initialState(), { mergeDefaults: true })

export const resetUseUserQuiz = () => {
   userQuizState.value = null
}


app.service('user_quiz').on('create', (userQuiz) => {
   console.log('USER_QUIZ EVENT created', userQuiz)
   const key = userQuiz.user_id + ':' + userQuiz.quiz_id
   userQuizState.value.theUserQuizCache[key] = userQuiz
   userQuizState.value.theUserQuizStatus[key] = 'ready'
})

app.service('user_quiz').on('update', (userQuiz) => {
   console.log('USER_QUIZ EVENT update', userQuiz)
   const key = userQuiz.user_id + ':' + userQuiz.quiz_id
   userQuizState.value.theUserQuizCache[key] = userQuiz
   userQuizState.value.theUserQuizStatus[key] = 'ready'
})

app.service('user_quiz').on('delete', (userQuiz) => {
   console.log('USER_QUIZ EVENT delete', userQuiz)
   const key = userQuiz.user_id + ':' + userQuiz.quiz_id
   delete userQuizState.value.theUserQuizCache[key]
   delete userQuizState.value.theUserQuizStatus[key]
})

// get or create the unique user_quiz associated to (user_id, quiz_id)
export const getTheUserQuiz = async (user_id, quiz_id) => {
   const key = user_id + ':' + quiz_id
   const status = userQuizState.value.theUserQuizStatus[key]
   if (status === 'ready') return userQuizState.value.theUserQuizCache[key]
   userQuizState.value.theUserQuizStatus[key] = 'ongoing'
   let [userQuiz] = await app.service('user_quiz').findMany({
      where: { user_id, quiz_id },
   })
   if (!userQuiz) {
      userQuiz = await app.service('user_quiz').create({
         data: { user_id, quiz_id },
      })
   }
   userQuizState.value.theUserQuizCache[key] = userQuiz
   userQuizState.value.theUserQuizStatus[key] = 'ready'
   return userQuiz
}

export const theUserQuiz = computed(() => (user_id, quiz_id) => {
   const key = user_id + ':' + quiz_id
   const status = userQuizState.value.theUserQuizStatus[key]
   if (status === 'ready') return userQuizState.value.theUserQuizCache[key]
   if (status === 'ongoing') return undefined // ongoing request
   userQuizState.value.theUserQuizStatus[key] = 'ongoing'
   app.service('user_quiz').findMany({
      where: { user_id, quiz_id },
   }).then(userQuizs => {
      if (userQuizs.length > 0) {
         const userQuiz = userQuizs[0]
         userQuizState.value.theUserQuizCache[key] = userQuiz
         userQuizState.value.theUserQuizStatus[key] = 'ready'
      } else {
         app.service('user_quiz').create({
            data: { user_id, quiz_id },
         }).then(userQuiz => {
            userQuizState.value.theUserQuizCache[key] = userQuiz
            userQuizState.value.theUserQuizStatus[key] = 'ready'
         })
      }
   })
})

export const updateUserQuiz = async (id, data) => {
   const userQuiz = await app.service('user_quiz').update({
      where: { id },
      data,
   })
   // update cache
   const key = userQuiz.user_id + ':' + userQuiz.quiz_id
   userQuizState.value.theUserQuizCache[key] = userQuiz
   return userQuiz
}

// used in WelcomeStudent/preload
export const getUserQuizList = async (user_id) => {
   const userQuizList = await app.service('user_quiz').findMany({
      where: { user_id }
   })
   for (const userQuiz of userQuizList) {
      const key = user_id + ':' + userQuiz.quiz_id
      userQuizState.value.theUserQuizCache[key] = userQuiz
      userQuizState.value.theUserQuizStatus[key] = 'ready'
   }
}

export const listOfUncorrectedUserQuiz = computed(() => {
   if (userQuizState.value.uncorrectedUserQuizListStatus === 'ready') {
      return Object.values(userQuizState.value.theUserQuizCache).filter(userQuiz => (userQuiz.correction_status === 'waiting-for-correction'))
   }
   if (userQuizState.value.uncorrectedUserQuizListStatus !== 'ongoing') {
      userQuizState.value.uncorrectedUserQuizListStatus = 'ongoing'
      app.service('user_quiz').findMany({
         where: {
            correction_status: 'waiting-for-correction'
         }
      }).then(list => {
         for (const userQuiz of list) {
            const key = userQuiz.user_id + ':' + userQuiz.case_study_id
            userQuizState.value.theUserQuizCache[key] = userQuiz
            userQuizState.value.theUserCaseStudyStatus[key] = 'ready'
         }
         userQuizState.value.uncorrectedUserQuizListStatus = 'ready'
      }).catch(err => {
         console.log('listOfUserCaseStudy err', err)
         userQuizState.value.uncorrectedUserQuizListStatus = undefined
      })
   }
   return []
})
