import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   caseStudyCache: {},
   caseStudyListStatus: {},
})

const key = 'case-study-state'
const caseStudyState = useSessionStorage(key, initialState())

export const resetUseCaseStudy = () => {
   // caseStudyState.value = initialState()
   sessionStorage.removeItem(key)
}


app.service('caseStudy').on('create', caseStudy => {
   console.log('CARD EVENT created', caseStudy)
   caseStudyState.value.caseStudyCache[caseStudy.id] = caseStudy
})


export const getCaseStudy = async (id) => {
   let caseStudy = caseStudyState.value.caseStudyCache[id]
   if (caseStudy) return caseStudy
   caseStudy = await app.service('case_study').findUnique({ where: { id }})
   caseStudyState.value.caseStudyCache[id] = caseStudy
   return caseStudy
}

export const createCaseStudy = async (topic_id, title = '', content = '') => {
   // get highest rank
   const result = await app.service('case_study').aggregate({
      where: { topic_id},
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
   return caseStudy
}

export const updateCaseStudy = async (id, data) => {
   const caseStudy = await app.service('case_study').update({
      where: { id },
      data,
   })
   // update cache
   caseStudyState.value.caseStudyCache[caseStudy.id] = caseStudy
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
      for (const case_study of list) {
         caseStudyState.value.caseStudyCache[case_study.id] = case_study
      }
      caseStudyState.value.caseStudyListStatus[topic_id] = 'ready'
   }
   return Object.values(caseStudyState.value.caseStudyCache).filter(case_study => case_study.topic_id === topic_id).sort((e1, e2) => e1.rank - e2.rank)
}

export const listOfCaseStudies = computed(() => (topic_id) => {
   if (caseStudyState.value.caseStudyListStatus[topic_id] === 'ready') {
      return Object.values(caseStudyState.value.caseStudyCache).filter(case_study => case_study.topic_id === topic_id).sort((e1, e2) => e1.rank - e2.rank)
   }
   if (caseStudyState.value.caseStudyListStatus[topic_id] !== 'ongoing') {
      caseStudyState.value.caseStudyListStatus[topic_id] = 'ongoing'
      app.service('case_study').findMany({
         where: { topic_id }
      }).then((list) => {
         for (const case_study of list) {
            caseStudyState.value.caseStudyCache[case_study.id] = case_study
         }
         caseStudyState.value.caseStudyListStatus[topic_id] = 'ready'
      })
   }
   return []
})
