import { computed } from 'vue'
// import { useSessionStorage } from '@vueuse/core'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   courseCache: {},
   courseStatus: {},
   courseListStatus: {},
})

// export const courseState = useSessionStorage('course-state', initialState(), { mergeDefaults: true })
export const { data: courseState } = useIDBKeyval('course-state', initialState(), { mergeDefaults: true })

export const resetUseCourse = () => {
   courseState.value = initialState()
}


app.service('course').on('create', course => {
   console.log('COURSE EVENT created', course)
   courseState.value.courseCache[course.id] = course
   courseState.value.courseStatus[course.id] = 'ready'
})

app.service('course').on('update', course => {
   console.log('COURSE EVENT update', course)
   courseState.value.courseCache[course.id] = course
   courseState.value.courseStatus[course.id] = 'ready'
})

app.service('course').on('delete', course => {
   console.log('COURSE EVENT delete', course)
   delete courseState.value.courseCache[course.id]
   delete courseState.value.courseStatus[course.id]
})


// export const courseStatus = (course_id) => courseState.value.courseStatus[course_id]

export const getCourse = async (id) => {
   let course = courseState.value.courseCache[id]
   if (course) return course
   course = await app.service('course').findUnique({ where: { id }})
   courseState.value.courseCache[id] = course
   courseState.value.courseStatus[id] = 'ready'
   return course
}

export const courseOfId = computed(() => (id) => {
   const status = courseState.value.courseStatus[id]
   if (status === 'ready') return courseState.value.courseCache[id]
   if (status === 'ongoing') return undefined // ongoing request
   courseState.value.courseStatus[id] = 'ongoing'
   app.service('course').findUnique({ where: { id }})
   .then(course => {
      courseState.value.courseCache[id] = course
      courseState.value.courseStatus[id] = 'ready'
   })
   .catch(err => {
      console.log('courseOfId err', id, err)
      delete courseState.value.courseStatus[id]
   })
})

export const createCourse = async (topic_id, title = '', content = '') => {
   // get highest rank
   const result = await app.service('course').aggregate({
      where: { topic_id },
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
   courseState.value.courseStatus[course.id] = 'ready'
   return course
}

export const updateCourse = async (id, data) => {
   const course = await app.service('course').update({
      where: { id },
      data,
   })
   // update cache
   courseState.value.courseCache[id] = course
   courseState.value.courseStatus[id] = 'ready'
   return course
}

export const removeCourse = async (id) => {
   await app.service('course').delete({ where: { id }})
   delete courseState.value.courseCache[id]
}

export const getCourseList = async (topic_id) => {
   if (courseState.value.courseListStatus[topic_id] !== 'ready') {
      courseState.value.courseListStatus[topic_id] = 'ongoing'
      const list = await app.service('course').findMany({
         where: { topic_id }
      })
      for (const course of list) {
         courseState.value.courseCache[course.id] = course
         courseState.value.courseStatus[course.id] = 'ready'
      }
      courseState.value.courseListStatus[topic_id] = 'ready'
   }
   return Object.values(courseState.value.courseCache).filter(course => course.topic_id === topic_id).sort((e1, e2) => e1.rank - e2.rank)
}

export const listOfCourse = computed(() => (topic_id) => {
   if (courseState.value.courseListStatus[topic_id] === 'ready') {
      return Object.values(courseState.value.courseCache).filter(course => course.topic_id === topic_id).sort((e1, e2) => e1.rank - e2.rank)
   }
   if (courseState.value.courseListStatus[topic_id] !== 'ongoing') {
      courseState.value.courseListStatus[topic_id] = 'ongoing'
      app.service('course').findMany({
         where: { topic_id }
      }).then((list) => {
         for (const course of list) {
            courseState.value.courseCache[course.id] = course
            courseState.value.courseStatus[course.id] = 'ready'
         }
         courseState.value.courseListStatus[topic_id] = 'ready'
      })
   }
   return []
})
