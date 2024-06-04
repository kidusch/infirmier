import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   userCourseCache: {},
   theUserCourseReady: {},
})
 
const userCourseState = useSessionStorage('user-course-state', initialState())

export const resetUseUserCourse = () => {
   userCourseState.value = initialState()
}

app.service('user_course').on('create', (userCourse) => {
   console.log('USER_COURSE EVENT created', userCourse)
   userCourseState.value.userCourseCache[userCourse.id] = userCourse
})

// get or create the unique user_course associated to (user_id, course_id)
export const getTheUserCourse = async (user_id, course_id) => {
   const isReady = userCourseState.value.theUserCourseReady[user_id + ':' + course_id]
   if (isReady) return Object.values(userCourseState.value.userCourseCache).find(userCourse => userCourse.user_id === user_id && userCourse.course_id === course_id)
   let [userCourse] = await app.service('user_course').findMany({
      where: { user_id, course_id },
   })
   if (!userCourse) {
      userCourse = await app.service('user_course').create({
         data: { user_id, course_id },
      })
   }
   userCourseState.value.userCourseCache[userCourse.id] = userCourse
   userCourseState.value.theUserCourseReady[user_id + ':' + course_id] = true
   return userCourse
}

export const theUserCourse = computed(() => (user_id, course_id) => {
   const isReady = userCourseState.value.theUserCourseReady[user_id + ':' + course_id]
   if (isReady) return Object.values(userCourseState.value.userCourseCache).find(userCourse => userCourse.user_id === user_id && userCourse.course_id === course_id)
   app.service('user_course').findMany({
      where: { user_id, course_id },
   }).then((userCourses) => {
      if (userCourses.length === 0) {
         app.service('user_course').create({
            data: { user_id, course_id },
         }).then(userCourse => {
            userCourseState.value.userCourseCache[userCourse.id] = userCourse
            userCourseState.value.theUserCourseReady[user_id + ':' + course_id] = true
         })
      } else {
         userCourseState.value.userCourseCache[userCourses[0].id] = userCourses[0]
         userCourseState.value.theUserCourseReady[user_id + ':' + course_id] = true
      }
   })
})

export const updateUserCourse = async (id, data) => {
   const userCourse = await app.service('user_course').update({
      where: { id },
      data,
   })
   // update cache
   userCourseState.value.userCourseCache[userCourse.id] = userCourse
   return userCourse
}
