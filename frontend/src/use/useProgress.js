import { computed } from 'vue'
import { theUserCourse } from '/src/use/useUserCourse'
import { listOfCourses } from '/src/use/useCourse'
import { listOfTopics } from '/src/use/useTopic'
import { listOfSubUEs } from '/src/use/useSubUE'


export const courseProgress = computed(() => (user_id, course_id) => {
   const userCourse = theUserCourse.value(user_id, course_id)
   if (userCourse === undefined) return -1
   return userCourse?.done ? 100 : 0
})

export const topicProgress = computed(() => (user_id, topic_id) => {
   let count = 0
   let sum = 0
   const courseList = listOfCourses.value(topic_id)
   for (const course of courseList) {
      if (course.hidden) continue
      const progress = courseProgress.value(user_id, course.id)
      if (progress === -1) return -1
      sum += progress
      count += 1
   }
   return count === 0 ? 0 : Math.round(sum / count)
})

export const subUEProgress = computed(() => (user_id, subue_id) => {
   let count = 0
   let sum = 0
   const topicList = listOfTopics.value(subue_id)
   for (const topic of topicList) {
      if (topic.hidden) continue
      const progress = topicProgress.value(user_id, topic.id)
      if (progress === -1) return -1
      sum += progress
      count += 1
   }
   return (count === 0 ? 0 : Math.round(sum / count))
})

export const ueProgress = computed(() => (user_id, ue_id) => {
   let count = 0
   let sum = 0
   const subUEList = listOfSubUEs.value(ue_id)
   for (const subUE of subUEList) {
      if (subUE.hidden) continue
      const progress = subUEProgress.value(user_id, subUE.id)
      if (progress === -1) return -1
      sum += progress
      count += 1
   }
   return (count === 0 ? 0 : Math.round(sum / count))
})
