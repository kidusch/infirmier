import { computed } from 'vue'
import { theUserCourse } from '/src/use/useUserCourse'
import { theUserCard } from '/src/use/useUserCard'
import { theUserQuiz } from '/src/use/useUserQuiz'
import { theUserCaseStudy } from '/src/use/useUserCaseStudy'
import { listOfCourse, courseStatus } from '/src/use/useCourse'
import { listOfCard } from '/src/use/useCard'
import { listOfQuiz } from '/src/use/useQuiz'
import { listOfCaseStudy } from '/src/use/useCaseStudy'
import { listOfTopic } from '/src/use/useTopic'
import { listOfSubUE } from '/src/use/useSubUE'
import { listOfUE } from '/src/use/useUE'


export const courseStudyProgress = computed(() => (user_id, course_id) => {
   const userCourse = theUserCourse.value(user_id, course_id)
   if (userCourse === undefined) return -1
   return userCourse?.done ? 100 : 0
})

export const topicStudyProgress = computed(() => (user_id, topic_id) => {
   let count = 0
   let sum = 0
   const courseList = listOfCourse.value(topic_id)
   for (const course of courseList) {
      if (course.hidden) continue
      const progress = courseStudyProgress.value(user_id, course.id)
      if (progress === -1) return -1
      sum += progress
      count += 1
   }
   return count === 0 ? 0 : Math.round(sum / count)
})

export const subUEStudyProgress = computed(() => (user_id, subue_id) => {
   let count = 0
   let sum = 0
   const topicList = listOfTopic.value(subue_id)
   for (const topic of topicList) {
      if (topic.hidden) continue
      const progress = topicStudyProgress.value(user_id, topic.id)
      if (progress === -1) return -1
      sum += progress
      count += 1
   }
   return (count === 0 ? 0 : Math.round(sum / count))
})

export const ueStudyProgress = computed(() => (user_id, ue_id) => {
   let count = 0
   let sum = 0
   const subUEList = listOfSubUE.value(ue_id)
   for (const subUE of subUEList) {
      if (subUE.hidden) continue
      const progress = subUEStudyProgress.value(user_id, subUE.id)
      if (progress === -1) return -1
      sum += progress
      count += 1
   }
   return (count === 0 ? 0 : Math.round(sum / count))
})

export const topicReviseProgress = computed(() => (user_id, topic_id) => {
   let count = 0
   let sum = 0
   const courseList = listOfCourse.value(topic_id)
   for (const course of courseList) {
      const userCourse = theUserCourse.value(user_id, course.id)
      if (userCourse === undefined) return -1
      count += 1
      sum += (userCourse.done ? 100 : 0)
   }
   const cardList = listOfCard.value(topic_id)
   for (const card of cardList) {
      const userCard = theUserCard.value(user_id, card.id)
      if (userCard === undefined) return -1
      count += 1
      sum += (userCard.done ? 100 : 0)
   }
   const quizList = listOfQuiz.value(topic_id)
   for (const quiz of quizList) {
      const userQuiz = theUserQuiz.value(user_id, quiz.id)
      if (userQuiz === undefined) return -1
      count += 1
      sum += (userQuiz.done ? 100 : 0)
   }
   const caseStudyList = listOfCaseStudy.value(topic_id)
   for (const caseStudy of caseStudyList) {
      const userCaseStudy = theUserCaseStudy.value(user_id, caseStudy.id)
      if (userCaseStudy === undefined) return -1
      count += 1
      sum += (userCaseStudy.done ? 100 : 0)
   }
   return count === 0 ? 0 : Math.round(sum / count)
})

export const subUEReviseProgress = computed(() => (user_id, subue_id) => {
   let count = 0
   let sum = 0
   const topicList = listOfTopic.value(subue_id)
   for (const topic of topicList) {
      if (topic.hidden) continue
      const progress = topicReviseProgress.value(user_id, topic.id)
      if (progress === -1) return -1
      sum += progress
      count += 1
   }
   return (count === 0 ? 0 : Math.round(sum / count))
})

export const ueReviseProgress = computed(() => (user_id, ue_id) => {
   let count = 0
   let sum = 0
   const subUEList = listOfSubUE.value(ue_id)
   for (const subUE of subUEList) {
      if (subUE.hidden) continue
      const progress = subUEReviseProgress.value(user_id, subUE.id)
      if (progress === -1) return -1
      sum += progress
      count += 1
   }
   return (count === 0 ? 0 : Math.round(sum / count))
})



export const courseLoadingProgress = computed(() => (course_id) => {
   return courseStatus(course_id) === 'ready' ? 1. : 0.
})

export const topicLoadingProgress = computed(() => (topic_id) => {
   const courseList = listOfCourse.value(topic_id)
   if (courseList.length === 0) return 0
   console.log('courseList', topic_id, courseList)
   const sum = courseList.reduce((accu, course) => accu + courseLoadingProgress.value(course.id), 0)
   return sum / courseList.length
})

export const subUELoadingProgress = computed(() => (sub_ue_id) => {
   const topicList = listOfTopic.value(sub_ue_id)
   if (topicList.length === 0) return 0
   console.log('topicList', sub_ue_id, topicList)
   const sum = topicList.reduce((accu, topic) => accu + topicLoadingProgress.value(topic.id), 0)
   return sum / topicList.length
})

export const ueLoadingProgress = computed(() => (ue_id) => {
   const subUEList = listOfSubUE.value(ue_id)
   if (subUEList.length === 0) return 0
   console.log('subUEList', ue_id, subUEList)
   const sum = subUEList.reduce((accu, subUE) => accu + subUELoadingProgress.value(subUE.id), 0)
   return sum / subUEList.length
})

export const loadingProgress = computed(() => {
   const ueList = listOfUE.value
   if (ueList.length === 0) return 0
   console.log('ueList', ueList)
   const sum = ueList.reduce((accu, ue) => accu + ueLoadingProgress.value(ue.id), 0)
   return sum / ueList.length
})
