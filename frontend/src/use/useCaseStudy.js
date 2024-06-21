import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   caseStudyCache: {},
   caseStudyStatus: {},
   caseStudyListStatus: {},
})

const key = 'case-study-state'
const caseStudyState = useSessionStorage(key, initialState(), { mergeDefaults: true })

export const resetUseCaseStudy = () => {
   caseStudyState.value = null
}


app.service('case_study').on('create', caseStudy => {
   console.log('CASE_STUDY EVENT created', caseStudy)
   caseStudyState.value.caseStudyCache[caseStudy.id] = caseStudy
})

app.service('case_study').on('update', caseStudy => {
   console.log('CASE_STUDY EVENT update', caseStudy)
   caseStudyState.value.caseStudyCache[caseStudy.id] = caseStudy
})

app.service('case_study').on('delete', caseStudy => {
   console.log('CASE_STUDY EVENT delete', caseStudy)
   delete caseStudyState.value.caseStudyCache[caseStudy.id]
})


export const getCaseStudy = async (id) => {
   let caseStudy = caseStudyState.value.caseStudyCache[id]
   if (caseStudy) return caseStudy
   caseStudy = await app.service('case_study').findUnique({ where: { id }})
   caseStudyState.value.caseStudyCache[id] = caseStudy
   caseStudyState.value.caseStudyStatus[id] = 'ready'
   return caseStudy
}

export const caseStudyOfId = computed(() => id => {
   const status = caseStudyState.value.caseStudyStatus[id]
   if (status === 'ready') return caseStudyState.value.caseStudyCache[id]
   if (status === 'ongoing') return undefined // ongoing request
   caseStudyState.value.caseStudyStatus[id] = 'ongoing'
   app.service('case_study').findUnique({ where: { id }})
   .then(caseStudy => {
      caseStudyState.value.caseStudyCache[id] = caseStudy
      caseStudyState.value.caseStudyStatus[id] = 'ready'
   })
   .catch(err => {
      console.log('caseStudyOfId err', id, err)
      caseStudyState.value.caseStudyStatus[id] = undefined
   })
})

export const createCaseStudy = async (topic_id, title = '', content = '') => {
   // get highest rank
   const result = await app.service('case_study').aggregate({
      where: { topic_id },
      _max: { rank: true }
   })
   const highestRank = result._max.rank
   const rank = highestRank ? highestRank + 1 : 1
   // create caseStudy with this rank
   const caseStudy = await app.service('case_study').create({
      data: {
         rank,
         topic_id,
         title,
         content,
      }
   })
   // update cache
   caseStudyState.value.caseStudyCache[caseStudy.id] = caseStudy
   caseStudyState.value.caseStudyStatus[caseStudy.id] = 'ready'
   return caseStudy
}

export const updateCaseStudy = async (id, data) => {
   const caseStudy = await app.service('case_study').update({
      where: { id },
      data,
   })
   // update cache
   caseStudyState.value.caseStudyCache[id] = caseStudy
   caseStudyState.value.caseStudyStatus[id] = 'ready'
   return caseStudy
}

export const removeCaseStudy = async (id) => {
   await app.service('case_study').delete({ where: { id }})
   delete caseStudyState.value.caseStudyCache[id]
}

export const getCaseStudyList = async (topic_id) => {
   if (caseStudyState.value.caseStudyListStatus[topic_id] !== 'ready') {
      caseStudyState.value.caseStudyListStatus[topic_id] = 'ongoing'
      const list = await app.service('case_study').findMany({
         where: { topic_id }
      })
      for (const caseStudy of list) {
         caseStudyState.value.caseStudyCache[caseStudy.id] = caseStudy
         caseStudyState.value.caseStudyStatus[caseStudy.id] = 'ready'
      }
      caseStudyState.value.caseStudyListStatus[topic_id] = 'ready'
   }
   return Object.values(caseStudyState.value.caseStudyCache).filter(caseStudy => caseStudy.topic_id === topic_id).sort((e1, e2) => e1.rank - e2.rank)
}

export const listOfCaseStudy = computed(() => (topic_id) => {
   if (caseStudyState.value.caseStudyListStatus[topic_id] === 'ready') {
      return Object.values(caseStudyState.value.caseStudyCache).filter(caseStudy => caseStudy.topic_id === topic_id).sort((e1, e2) => e1.rank - e2.rank)
   }
   if (caseStudyState.value.caseStudyListStatus[topic_id] !== 'ongoing') {
      caseStudyState.value.caseStudyListStatus[topic_id] = 'ongoing'
      app.service('case_study').findMany({
         where: { topic_id }
      }).then((list) => {
         for (const caseStudy of list) {
            caseStudyState.value.caseStudyCache[caseStudy.id] = caseStudy
            caseStudyState.value.caseStudyStatus[caseStudy.id] = 'ready'
         }
         caseStudyState.value.caseStudyListStatus[topic_id] = 'ready'
      })
   }
   return []
})

export const getAllCaseStudy = async () => {
   const caseStudyList = await app.service('case_study').findMany({})
   for (const caseStudy of caseStudyList) {
      caseStudyState.value.caseStudyCache[caseStudy.id] = caseStudy
      caseStudyState.value.caseStudyStatus[caseStudy.id] = 'ready'
      caseStudyState.value.caseStudyListStatus[caseStudy.topic_id] = 'ready'
   }
}
