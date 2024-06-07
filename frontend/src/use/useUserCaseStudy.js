import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   userCaseStudyCache: {},
   theUserCaseStudyStatus: {},
})

const key = 'user-case-study-state'
const userCaseStudyState = useSessionStorage(key, initialState())

export const resetUseUserCaseStudy = () => {
   // userCaseStudyState.value = initialState()
   sessionStorage.removeItem(key)
}


app.service('user_case_study').on('create', (userCaseStudy) => {
   console.log('USER_CASE_STUDY EVENT created', userCaseStudy)
   userCaseStudyState.value.userCaseStudyCache[userCaseStudy.id] = userCaseStudy
})


// get or create the unique user_case_study associated to (user_id, case_study_id)
export const getTheUserCaseStudy = async (user_id, case_study_id) => {
   const key = user_id + ':' + case_study_id
   const status = userCaseStudyState.value.theUserCaseStudyStatus[key]
   if (status === 'ready') return Object.values(userCaseStudyState.value.userCaseStudyCache).find(userCaseStudy => userCaseStudy.user_id === user_id && userCaseStudy.case_study_id === case_study_id)
   userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ongoing'
   let [userCaseStudy] = await app.service('user_case_study').findMany({
      where: { user_id, case_study_id },
   })
   if (!userCaseStudy) {
      userCaseStudy = await app.service('user_case_study').create({
         data: { user_id, case_study_id },
      })
   }
   userCaseStudyState.value.userCaseStudyCache[userCaseStudy.id] = userCaseStudy
   userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
   return userCaseStudy
}

export const theUserCaseStudy = computed(() => (user_id, case_study_id) => {
   const key = user_id + ':' + case_study_id
   const status = userCaseStudyState.value.theUserCaseStudyStatus[key]
   if (status === 'ready') return Object.values(userCaseStudyState.value.userCaseStudyCache).find(userCaseStudy => userCaseStudy.user_id === user_id && userCaseStudy.case_study_id === case_study_id)
   if (status !== 'ongoing') {
      userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ongoing'
      app.service('user_case_study').findMany({
         where: { user_id, case_study_id },
      }).then(userCaseStudys => {
         if (userCaseStudys.length > 0) {
            const userCaseStudy = userCaseStudys[0]
            userCaseStudyState.value.userCaseStudyCache[userCaseStudy.id] = userCaseStudy
            userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
         } else {
            app.service('user_case_study').create({
               data: { user_id, case_study_id },
            }).then(userCaseStudy => {
               userCaseStudyState.value.userCaseStudyCache[userCaseStudy.id] = userCaseStudy
               userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
            })
         }
      })
   }
})


export const updateUserCaseStudy = async (id, data) => {
   const userCaseStudy = await app.service('user_case_study').update({
      where: { id },
      data,
   })
   // update cache
   userCaseStudyState.value.userCaseStudyCache[userCaseStudy.id] = userCaseStudy
   return userCaseStudy
}
