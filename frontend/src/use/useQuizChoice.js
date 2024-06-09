import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   quizChoiceCache: {},
   quizChoiceStatus: {},
   quizChoiceListStatus: {},
})

const key = 'quiz-choice-state'
const quizChoiceState = useSessionStorage(key, initialState(), { mergeDefaults: true })

export const resetUseQuizChoice = () => {
   quizChoiceState.value = null
}


app.service('quiz_choice').on('create', (quizChoice) => {
   console.log('QUIZ_CHOICE EVENT created', quizChoice)
   quizChoiceState.value.quizChoiceCache[quizChoice.id] = quizChoice
})

app.service('quiz_choice').on('update', (quizChoice) => {
   console.log('QUIZ_CHOICE EVENT update', quizChoice)
   quizChoiceState.value.quizChoiceCache[quizChoice.id] = quizChoice
})

app.service('quiz_choice').on('delete', (quizChoice) => {
   console.log('QUIZ_CHOICE EVENT delete', quizChoice)
   delete quizChoiceState.value.quizChoiceCache[quizChoice.id]
})


export const getQuizChoice = async (id) => {
   let quizChoice = quizChoiceState.value.quizChoiceCache[id]
   if (quizChoice) return quizChoice
   quizChoice = await app.service('quiz_choice').findUnique({ where: { id }})
   quizChoiceState.value.quizChoiceCache[id] = quizChoice
   quizChoiceState.value.quizChoiceStatus[id] = 'ready'
   return quizChoice
}

export const quizChoiceOfId = computed(() => (id) => {
   const status = quizChoiceState.value.quizChoiceStatus[id]
   if (status === 'ready') return quizChoiceState.value.quizChoiceCache[id]
   if (status === 'ongoing') return undefined // ongoing request
   quizChoiceState.value.quizChoiceStatus[id] = 'ongoing'
   app.service('quiz_choice').findUnique({ where: { id }})
   .then(quizChoice => {
      quizChoiceState.value.quizChoiceCache[id] = quizChoice
      quizChoiceState.value.quizChoiceStatus[id] = 'ready'
   })
   .catch(err => {
      console.log('quizChoiceOfId err', id, err)
      quizChoiceState.value.quizChoiceStatus[id] = undefined
   })
})

export const createQuizChoice = async (quiz_id, text='') => {
   // get highest rank
   const result = await app.service('quiz_choice').aggregate({
      where: { quiz_id},
      _max: { rank: true }
   })
   const highestRank = result._max.rank
   const rank = highestRank ? highestRank + 1 : 1
   // create quizChoice with this rank
   const quizChoice = await app.service('quiz_choice').create({
      data: {
         rank,
         quiz_id,
         text,
         answer: false,
         comment: '',
         positive_points: 0,
         negative_points: 0,
      }
   })
   // update cache
   quizChoiceState.value.quizChoiceCache[quizChoice.id] = quizChoice
   return quizChoice
}

export const updateQuizChoice = async (id, data) => {
   const quizChoice = await app.service('quiz_choice').update({
      where: { id },
      data,
   })
   // update cache
   quizChoiceState.value.quizChoiceCache[quizChoice.id] = quizChoice
   return quizChoice
}

export const removeQuizChoice = async (id) => {
   await app.service('quiz_choice').delete({ where: { id }})
   delete quizChoiceState.value.quizChoiceCache[id]
}

export const getQuizChoiceList = async (quiz_id) => {
   if (quizChoiceState.value.quizChoiceListStatus[quiz_id] !== 'ready') {
      const list = await app.service('quiz_choice').findMany({
         where: { quiz_id }
      })
      for (const quizChoice of list) {
         quizChoiceState.value.quizChoiceCache[quizChoice.id] = quizChoice
         quizChoiceState.value.quizChoiceStatus[quizChoice.id] = 'ready'
      }
      quizChoiceState.value.quizChoiceListStatus[quiz_id] = 'ready'
   }
   return Object.values(quizChoiceState.value.quizChoiceCache).filter(quizChoice => quizChoice.quiz_id === quiz_id).sort((e1, e2) => e1.rank - e2.rank)
}

export const listOfQuizChoices = computed(() => (quiz_id) => {
   if (quizChoiceState.value.quizChoiceListStatus[quiz_id] === 'ready') {
      return Object.values(quizChoiceState.value.quizChoiceCache).filter(quiz => quiz.quiz_id === quiz_id).sort((e1, e2) => e1.rank - e2.rank)
   }
   if (quizChoiceState.value.quizChoiceListStatus[quiz_id] !== 'ongoing') {
      quizChoiceState.value.quizChoiceListStatus[quiz_id] = 'ongoing'
      app.service('quiz_choice').findMany({
         where: { quiz_id }
      }).then((list) => {
         for (const quiz of list) {
            quizChoiceState.value.quizChoiceCache[quiz.id] = quiz
            quizChoiceState.value.quizChoiceStatus[quiz.id] = 'ready'
         }
         quizChoiceState.value.quizChoiceListStatus[quiz_id] = 'ready'
      })
   }
   return []
})
