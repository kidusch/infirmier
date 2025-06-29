import { computed } from 'vue'
// import { useSessionStorage } from '@vueuse/core'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   theUserCaseStudyCache: {},
   theUserCaseStudyStatus: {},
   userCaseStudyListStatus: {},
   uncorrectedUserCaseStudyListStatus: undefined,
})

// const userCaseStudyState = useSessionStorage('user-case-study-state', initialState(), { mergeDefaults: true })
export const { data: userCaseStudyState } = useIDBKeyval('user-case-study-state', initialState(), { mergeDefaults: true })

export const resetUseUserCaseStudy = () => {
   userCaseStudyState.value = initialState()
}


app.service('user_case_study').on('create', (userCaseStudy) => {
   if (!userCaseStudyState.value) return
   console.log('USER_CASE_STUDY EVENT created', userCaseStudy)
   const key = userCaseStudy.user_id + ':' + userCaseStudy.case_study_id
   userCaseStudyState.value.theUserCaseStudyCache[key] = userCaseStudy
   userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
})

app.service('user_case_study').on('update', (userCaseStudy) => {
   if (!userCaseStudyState.value) return
   console.log('USER_CASE_STUDY EVENT update', userCaseStudy)
   const key = userCaseStudy.user_id + ':' + userCaseStudy.case_study_id
   userCaseStudyState.value.theUserCaseStudyCache[key] = userCaseStudy
   userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
})

app.service('user_case_study').on('delete', (userCaseStudy) => {
   if (!userCaseStudyState.value) return
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
   if (!userCaseStudyState.value) return
   const key = user_id + ':' + case_study_id
   const status = userCaseStudyState.value.theUserCaseStudyStatus[key]
   if (status === 'ready') return userCaseStudyState.value.theUserCaseStudyCache[key]
   if (status === 'ongoing') return undefined // ongoing request
   userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ongoing'
   app.service('user_case_study').findMany({
      where: { user_id, case_study_id },
   }).then(userCaseStudies => {
      if (userCaseStudies.length > 0) {
         const userCaseStudy = userCaseStudies[0]
         userCaseStudyState.value.theUserCaseStudyCache[key] = userCaseStudy
         userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
      } else {
         // app.service('user_case_study').create({
         //    data: { user_id, case_study_id },
         // }).then(userCaseStudy => {
         //    userCaseStudyState.value.theUserCaseStudyCache[key] = userCaseStudy
         //    userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
         // })
         // null value indicates there is no (user_id, case_study_id) in database
         userCaseStudyState.value.theUserCaseStudyCache[key] = null
         userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
      }
   })
})

export const createUserCaseStudy = async (user_id, case_study_id) => {
   const userCaseStudy = await app.service('user_case_study').create({
      data: { user_id, case_study_id },
   })
   // update cache
   const key = user_id + ':' + case_study_id
   userCaseStudyState.value.theUserCaseStudyCache[key] = userCaseStudy
   userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
   return userCaseStudy
}

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

// export const listOfUserCaseStudy = computed(() => (user_id) => {
//    if (userCaseStudyState.value.userCaseStudyListStatus[user_id] === 'ready') {
//       return Object.values(userCaseStudyState.value.theUserCaseStudyCache).filter(userCaseStudy => userCaseStudy.user_id === user_id)
//    }
//    if (userCaseStudyState.value.userCaseStudyListStatus[user_id] !== 'ongoing') {
//       userCaseStudyState.value.userCaseStudyListStatus[user_id] = 'ongoing'
//       app.service('user_case_study').findMany({
//          where: { user_id }
//       }).then(list => {
//          for (const userCaseStudy of list) {
//             const key = user_id + ':' + userCaseStudy.case_study_id
//             userCaseStudyState.value.theUserCaseStudyCache[key] = userCaseStudy
//             userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
//          }
//          userCaseStudyState.value.userCaseStudyListStatus[user_id] = 'ready'
//       }).catch(err => {
//          console.log('listOfUserCaseStudy err', err)
//          userCaseStudyState.value.userCaseStudyListStatus[user_id] = undefined
//       })
//    }
//    return []
// })

export const listOfUncorrectedUserCaseStudy = computed(() => {
   if (!userCaseStudyState.value) return []
   if (userCaseStudyState.value.uncorrectedUserCaseStudyListStatus === 'ready') {
      return Object.values(userCaseStudyState.value.theUserCaseStudyCache).filter(userCaseStudy => (userCaseStudy?.custom_correction_status === 'waiting-for-correction'))
   }
   if (userCaseStudyState.value.uncorrectedUserCaseStudyListStatus !== 'ongoing') {
      userCaseStudyState.value.uncorrectedUserCaseStudyListStatus = 'ongoing'
      app.service('user_case_study').findMany({
         where: {
            custom_correction_status: 'waiting-for-correction',
         }
      }).then(list => {
         for (const userCaseStudy of list) {
            const key = userCaseStudy.user_id + ':' + userCaseStudy.case_study_id
            userCaseStudyState.value.theUserCaseStudyCache[key] = userCaseStudy
            userCaseStudyState.value.theUserCaseStudyStatus[key] = 'ready'
         }
         userCaseStudyState.value.uncorrectedUserCaseStudyListStatus = 'ready'
      }).catch(err => {
         console.log('listOfUserCaseStudy err', err)
         userCaseStudyState.value.uncorrectedUserCaseStudyListStatus = undefined
      })
   }
   return []
})
