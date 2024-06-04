import { computed } from 'vue'
import { theUserCourse } from '/src/use/useUserCourse'
import { listOfCourses } from '/src/use/useCourse'
import { listOfTopics } from '/src/use/useTopic'
import { listOfSubUEs } from '/src/use/useSubUE'


export const courseProgress = computed(() => (user_id, course_id) => {
   const userCourse = theUserCourse.value(user_id, course_id)
   return userCourse?.done ? 100 : 0
})

export const topicProgress = computed(() => (user_id, topic_id) => {
   let count = 0
   let sum = 0
   const courseList = listOfCourses.value(topic_id)
   for (const course of courseList) {
      if (course.hidden) continue
      sum += courseProgress.value(user_id, course.id)
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
      sum += topicProgress.value(user_id, topic.id)
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
      sum += subUEProgress.value(user_id, subUE.id)
      count += 1
   }
   return (count === 0 ? 0 : Math.round(sum / count))
})
