import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   courseCache: {},
   isListReady: {},
})
 
const courseState = useSessionStorage('course-state', initialState())

export const resetUseCourse = () => {
   courseState.value = initialState()
}


app.service('course').on('create', course => {
   console.log('COURSE EVENT created', course)
   courseState.value.courseCache[course.id] = course
})


export const getCourse = async (id) => {
   let course = courseState.value.courseCache[id]
   if (course) return course
   course = await app.service('course').findUnique({ where: { id }})
   courseState.value.courseCache[id] = course
   return course
}

export const createCourse = async (topic_id, title = '', content = '') => {
   // get highest rank
   const result = await app.service('course').aggregate({
      where: { topic_id},
      _max: { rank: true }
   })
   const highestRank = result._max.rank
   const rank = highestRank ? highestRank + 1 : 1
   // create course with this rank
   const course = await app.service('course').create({
      data: {
         rank,
         topic_id,
         title,
         content,
      }
   })
   // update cache
   courseState.value.courseCache[course.id] = course
   return course
}

export const updateCourse = async (id, data) => {
   const course = await app.service('course').update({
      where: { id },
      data,
   })
   // update cache
   courseState.value.courseCache[course.id] = course
   return course
}

export const removeCourse = async (id) => {
   await app.service('course').delete({ where: { id }})
   delete courseState.value.courseCache[id]
}

export const getCourseList = async (topic_id) => {
   if (!courseState.value.isListReady[topic_id]) {
      const list = await app.service('course').findMany({
         where: { topic_id }
      })
      for (const course of list) {
         courseState.value.courseCache[course.id] = course
      }
      courseState.value.isListReady[topic_id] = true
   }
   return Object.values(courseState.value.courseCache).filter(course => course.topic_id === topic_id).sort((e1, e2) => e1.rank - e2.rank)
}
