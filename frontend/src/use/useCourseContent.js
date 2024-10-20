import { computed } from 'vue'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   courseContentCache: {},
   courseContentContentStatus: {},
})

export const { data: courseContentState } = useIDBKeyval('course-content-state', initialState(), { mergeDefaults: true })

export const resetUseCourse = () => {
   courseContentState.value = initialState()
}


app.service('course_content').on('create', courseContent => {
   if (!courseContentState.value) return
   console.log('COURSE CONTENT EVENT created', courseContent)
   courseContentState.value.courseContentCache[courseContent.id] = courseContent
   courseContentState.value.courseContentStatus[courseContent.id] = 'ready'
})

app.service('course_content').on('update', courseContent => {
   if (!courseContentState.value) return
   console.log('COURSE CONTENT EVENT update', courseContent)
   courseContentState.value.courseContentCache[courseContent.id] = courseContent
   courseContentState.value.courseContentStatus[courseContent.id] = 'ready'
})

app.service('course_content').on('delete', courseContent => {
   if (!courseContentState.value) return
   console.log('COURSE CONTENT EVENT delete', courseContent)
   delete courseContentState.value.courseContentCache[courseContent.id]
   delete courseContentState.value.courseContentStatus[courseContent.id]
})


// export const courseContentStatus = (courseContent_id) => courseContentState.value.courseContentStatus[courseContent_id]

export const getCourseContent = async (id) => {
   if (!courseContentState.value) return
   let courseContent = courseContentState.value.courseContentCache[id]
   if (courseContent) return courseContent
   courseContent = await app.service('course_content').findUnique({ where: { id }})
   courseContentState.value.courseContentCache[id] = courseContent
   courseContentState.value.courseContentStatus[id] = 'ready'
   return courseContent
}

export const courseContentOfId = computed(() => (id) => {
   if (!courseContentState.value) return
   const status = courseContentState.value.courseContentStatus[id]
   if (status === 'ready') return courseContentState.value.courseContentCache[id]
   if (status === 'ongoing') return undefined // ongoing request
   courseContentState.value.courseContentStatus[id] = 'ongoing'
   app.service('course_content').findUnique({ where: { id }})
   .then(courseContent => {
      courseContentState.value.courseContentCache[id] = courseContent
      courseContentState.value.courseContentStatus[id] = 'ready'
   })
   .catch(err => {
      console.log('courseContentOfId err', id, err)
      delete courseContentState.value.courseContentStatus[id]
   })
})

export const createCourseContent = async (content) => {
   const courseContent = await app.service('course_content').create({
      data: {
         content,
      }
   })
   // update cache
   courseContentState.value.courseContentCache[courseContent.id] = courseContent
   courseContentState.value.courseContentStatus[courseContent.id] = 'ready'
   return courseContent
}

export const updateCourseContent = async (id, data) => {
   const courseContent = await app.service('course_content').update({
      where: { id },
      data,
   })
   // update cache
   courseContentState.value.courseContentCache[id] = courseContent
   courseContentState.value.courseContentStatus[id] = 'ready'
   return courseContent
}

// export const removeCourseContent = async (id) => {
//    await app.service('course_content').delete({ where: { id }})
//    delete courseContentState.value.courseContentCache[id]
// }
