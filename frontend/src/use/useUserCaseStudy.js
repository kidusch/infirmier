import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   theUserCaseStudyCache: {},
   theUserCaseStudyStatus: {},
})

const key = 'user-case-study-state'
const userCaseStudyState = useSessionStorage(key, initialState(), { mergeDefaults: true })

export const resetUseUserCaseStudy = () => {
   userCaseStudyState.value = null
}


app.service('user_case_study').on('create', (userCaseStudy) => {
   console.log('USER_CASE_STUDY EVENT created', userCaseStudy)
   const key = userCaseStudy.user_id + ':' + userCaseStudy.case_study_id
   userCaseStudyState.value.theUserCaseStudyCache[key] = userCaseStudy
   userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
})

app.service('user_case_study').on('update', (userCaseStudy) => {
   console.log('USER_CASE_STUDY EVENT update', userCaseStudy)
   const key = userCaseStudy.user_id + ':' + userCaseStudy.case_study_id
   userCaseStudyState.value.theUserCaseStudyCache[key] = userCaseStudy
   userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
})

app.service('user_case_study').on('delete', (userCaseStudy) => {
   console.log('USER_CASE_STUDY EVENT delete', userCaseStudy)
   const key = userCaseStudy.user_id + ':' + userCaseStudy.case_study_id
   delete userCaseStudyState.value.theUserCaseStudyCache[key]
   delete userCaseStudyState.value.theUserCaseStudyStatus[key]
})


// // get or create the unique user_case_study associated to (user_id, case_study_id)
// export const getTheUserCaseStudy = async (user_id, case_study_id) => {
//    const key = user_id + ':' + case_study_id
//    const status = userCaseStudyState.value.theUserCaseStudyStatus[key]
//    if (status === 'ready') return userCaseStudyState.value.theUserCaseStudyCache[key]
//    userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ongoing'
//    let [userCaseStudy] = await app.service('user_case_study').findMany({
//       where: { user_id, case_study_id },
//    })
//    if (!userCaseStudy) {
//       userCaseStudy = await app.service('user_case_study').create({
//          data: { user_id, case_study_id },
//       })
//    }
//    userCaseStudyState.value.theUserCaseStudyCache[key] = userCaseStudy
//    userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
//    return userCaseStudy
// }

export const theUserCaseStudy = computed(() => (user_id, case_study_id) => {
   const key = user_id + ':' + case_study_id
   const status = userCaseStudyState.value.theUserCaseStudyStatus[key]
   if (status === 'ready') return userCaseStudyState.value.theUserCaseStudyCache[key]
   if (status === 'ongoing') return undefined // ongoing request
   userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ongoing'
   app.service('user_case_study').findMany({
      where: { user_id, case_study_id },
   }).then(userCaseStudys => {
      if (userCaseStudys.length > 0) {
         const userCaseStudy = userCaseStudys[0]
         userCaseStudyState.value.theUserCaseStudyCache[key] = userCaseStudy
         userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
      } else {
         app.service('user_case_study').create({
            data: { user_id, case_study_id },
         }).then(userCaseStudy => {
            userCaseStudyState.value.theUserCaseStudyCache[key] = userCaseStudy
            userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
         })
      }
   })
})


export const updateUserCaseStudy = async (id, data) => {
   const userCaseStudy = await app.service('user_case_study').update({
      where: { id },
      data,
   })
   // update cache
   const key = userCaseStudy.user_id + ':' + userCaseStudy.case_study_id
   userCaseStudyState.value.theUserCaseStudyCache[key] = userCaseStudy
   return userCaseStudy
}

// used to evaluate progress - prevent lots of single requests
export const getUserCaseStudyList = async (user_id) => {
   const userCaseStudyList = await app.service('user_case_study').findMany({
      where: { user_id }
   })
   for (const userCaseStudy of userCaseStudyList) {
      const key = user_id + ':' + userCaseStudy.case_study_id
      userCaseStudyState.value.theUserCaseStudyCache[key] = userCaseStudy
      userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
   }
}
