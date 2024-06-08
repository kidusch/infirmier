import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   userCourseCache: {},
   theUserCourseStatus: {},
})

const key = 'user-course-state'
const userCourseState = useSessionStorage(key, initialState(), { mergeDefaults: true })

export const resetUseUserCourse = () => {
   userCourseState.value = null
}

app.service('user_course').on('create', (userCourse) => {
   console.log('USER_COURSE EVENT created', userCourse)
   userCourseState.value.userCourseCache[userCourse.id] = userCourse
})

app.service('user_course').on('update', (userCourse) => {
   console.log('USER_COURSE EVENT update', userCourse)
   userCourseState.value.userCourseCache[userCourse.id] = userCourse
})

app.service('user_course').on('delete', (userCourse) => {
   console.log('USER_COURSE EVENT delete', userCourse)
   delete userCourseState.value.userCourseCache[userCourse.id]
})

// get or create the unique user_course associated to (user_id, course_id)
export const getTheUserCourse = async (user_id, course_id) => {
   const key = user_id + ':' + course_id
   if (userCourseState.value.theUserCourseStatus[key] === 'ready') {
      return Object.values(userCourseState.value.userCourseCache).find(userCourse => userCourse.user_id === user_id && userCourse.course_id === course_id)
   }
   userCourseState.value.theUserCourseStatus[key] = 'ongoing'
   let [userCourse] = await app.service('user_course').findMany({
      where: { user_id, course_id },
   })
   if (!userCourse) {
      userCourse = await app.service('user_course').create({
         data: { user_id, course_id },
      })
   }
   userCourseState.value.userCourseCache[userCourse.id] = userCourse
   userCourseState.value.theUserCourseStatus[key] = 'ready'
   return userCourse
}

export const theUserCourse = computed(() => (user_id, course_id) => {
   const key = user_id + ':' + course_id
   if (userCourseState.value.theUserCourseStatus[key] === 'ready') {
      return Object.values(userCourseState.value.userCourseCache).find(userCourse => userCourse.user_id === user_id && userCourse.course_id === course_id)
   }
   if (userCourseState.value.theUserCourseStatus[key] !== 'ongoing') {
      userCourseState.value.theUserCourseStatus[key] = 'ongoing'
      app.service('user_course').findMany({
         where: { user_id, course_id },
      }).then((userCourses) => {
         if (userCourses.length === 0) {
            app.service('user_course').create({
               data: { user_id, course_id },
            }).then(userCourse => {
               userCourseState.value.userCourseCache[userCourse.id] = userCourse
               userCourseState.value.theUserCourseStatus[key] = 'ready'
            })
         } else {
            userCourseState.value.userCourseCache[userCourses[0].id] = userCourses[0]
            userCourseState.value.theUserCourseStatus[key] = 'ready'
         }
      })
   }
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
