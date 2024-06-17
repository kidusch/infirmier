import { computed } from 'vue'
import { theUserCourse } from '/src/use/useUserCourse'
import { theUserCard } from '/src/use/useUserCard'
import { theUserQuiz } from '/src/use/useUserQuiz'
import { theUserCaseStudy } from '/src/use/useUserCaseStudy'
import { listOfCourses } from '/src/use/useCourse'
import { listOfCards } from '/src/use/useCard'
import { listOfQuizs } from '/src/use/useQuiz'
import { listOfCaseStudies } from '/src/use/useCaseStudy'
import { listOfTopics } from '/src/use/useTopic'
import { listOfSubUEs } from '/src/use/useSubUE'


export const courseStudyProgress = computed(() => (user_id, course_id) => {
   const userCourse = theUserCourse.value(user_id, course_id)
   if (userCourse === undefined) return -1
   return userCourse?.done ? 100 : 0
})

export const topicStudyProgress = computed(() => (user_id, topic_id) => {
   let count = 0
   let sum = 0
   const courseList = listOfCourses.value(topic_id)
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
   const topicList = listOfTopics.value(subue_id)
   for (const topic of topicList) {
      if (topic.hidden) continue
      const progress = topicStudyProgress.value(user_id, topic.id)
      if (progress === -1) return -1
      sum += progress
      count += 1
   }
   // console.log('subUEStudyProgress', subue_id, count, sum, topicList.length)
   return (count === 0 ? 0 : Math.round(sum / count))
})

export const ueStudyProgress = computed(() => (user_id, ue_id) => {
   let count = 0
   let sum = 0
   const subUEList = listOfSubUEs.value(ue_id)
   for (const subUE of subUEList) {
      if (subUE.hidden) continue
      const progress = subUEStudyProgress.value(user_id, subUE.id)
      if (progress === -1) return -1
      sum += progress
      count += 1
   }
   // console.log('ueStudyProgress', ue_id, count, sum, subUEList.length)
   return (count === 0 ? 0 : Math.round(sum / count))
})


export const topicReviseProgress = computed(() => (user_id, topic_id) => {
   let count = 0
   let sum = 0
   const courseList = listOfCourses.value(topic_id)
   for (const course of courseList) {
      const userCourse = theUserCourse.value(user_id, course.id)
      if (userCourse === undefined) return -1
      count += 1
      sum += (userCourse.done ? 100 : 0)
   }
   const cardList = listOfCards.value(topic_id)
   for (const card of cardList) {
      const userCard = theUserCard.value(user_id, card.id)
      if (userCard === undefined) return -1
      count += 1
      sum += (userCard.done ? 100 : 0)
   }
   const quizList = listOfQuizs.value(topic_id)
   for (const quiz of quizList) {
      const userQuiz = theUserQuiz.value(user_id, quiz.id)
      if (userQuiz === undefined) return -1
      count += 1
      sum += (userQuiz.done ? 100 : 0)
   }
   const caseStudyList = listOfCaseStudies.value(topic_id)
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
   const topicList = listOfTopics.value(subue_id)
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
   const subUEList = listOfSubUEs.value(ue_id)
   for (const subUE of subUEList) {
      if (subUE.hidden) continue
      const progress = subUEReviseProgress.value(user_id, subUE.id)
      if (progress === -1) return -1
      sum += progress
      count += 1
   }
   // console.log('ueReviseProgress', ue_id, count, sum)
   return (count === 0 ? 0 : Math.round(sum / count))
})
