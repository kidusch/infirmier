import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   caseStudyCache: {},
   isListReady: {},
})
 
const caseStudyState = useSessionStorage('case-study-state', initialState())

export const resetUseCaseStudy = () => {
   caseStudyState.value = initialState()
}


app.service('caseStudy').on('create', caseStudy => {
   console.log('CARD EVENT created', caseStudy)
   caseStudyState.value.caseStudyCache[caseStudy.id] = caseStudy
})


export const getCaseStudy = async (id) => {
   const caseStudy = caseStudyState.value.caseStudyCache[id]
   if (caseStudy) return caseStudy
   const promise = app.service('case-study').findUnique({ where: { id }})
   promise.then(caseStudy => {
      caseStudyState.value.caseStudyCache[id] = caseStudy
   })
   return promise
}

export const createCaseStudy = async (topic_id) => {
   // get highest rank
   const result = await app.service('case-study').aggregate({
      where: { topic_id},
      _max: { rank: true }
   })
   const highestRank = result._max.rank
   const rank = highestRank ? highestRank + 1 : 1
   // create caseStudy with this rank
   const caseStudy = await app.service('case-study').create({
      data: {
         rank,
         topic_id,
         title: '',
         content: '',
      }
   })
   // update cache
   caseStudyState.value.caseStudyCache[caseStudy.id] = caseStudy
   return caseStudy
}

export const updateCaseStudy = async (id, data) => {
   const caseStudy = await app.service('case-study').update({
      where: { id },
      data,
   })
   // update cache
   caseStudyState.value.caseStudyCache[caseStudy.id] = caseStudy
   return caseStudy
}

export const removeCaseStudy = async (id) => {
   await app.service('case-study').delete({ where: { id }})
   delete caseStudyState.value.caseStudyCache[id]
}

export const getCaseStudyList = async (topic_id) => {
   if (!caseStudyState.value.isListReady[topic_id]) {
      const list = await app.service('case-study').findMany({
         where: { topic_id }
      })
      for (const caseStudy of list) {
         caseStudyState.value.caseStudyCache[caseStudy.id] = caseStudy
      }
      caseStudyState.value.isListReady[topic_id] = true
   }
   return Object.values(caseStudyState.value.caseStudyCache).filter(caseStudy => caseStudy.topic_id === topic_id).sort((e1, e2) => e1.rank - e2.rank)
}
