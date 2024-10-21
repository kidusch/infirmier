<template>
    <main class="container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card mb-2">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/student/study-ue`">COURS</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/student/study-ue`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/student/study-sub-ue/${ue?.id}/${subUE?.id}`">{{ subUE?.name }}</router-link>
            /
            <span class="font-semibold">{{ topic?.name }}</span>
         </p>
      </header>

      <!-- Header -->
      <header>
         <h3 class="opacity-50 flex items-center gap-2.5">
            <div class="ml-2 mt-3 w-12">
               <jcb-radial class="w-12" :value="topicStudyProgress(userid, topic?.id)"></jcb-radial>
            </div>
            {{ topic?.name }}
         </h3>
      </header>


      <!-- Main content -> courses list -->
      <main class="flex flex-col gap-6 pb-6">
         
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
            <div class="progress-list">
               <template v-for="course in courseList">
                  <div v-if="!course.hidden" class="progress-item cursor-pointer" @click="selectCourse(course)">
                     <div class="w-14">
                        <jcb-radial class="w-14" :value="courseStudyProgress(userid, course.id)"></jcb-radial>
                     </div>
                     <p>
                        {{ course?.title }} <span v-if="courseIsLocked(course)">🔒</span>
                     </p>
                  </div>
               </template>
            </div>
         </div>

      </main>
   </main>

   <!-- PROPOSE SUBSCRIPTION MODAL -->
   <SubscribeDialog ref="subscribeModal" @cancel="subscribeModal?.close" @subscribe="gotoSubscribe" />
</template>

<script setup>
import { ref, computed } from 'vue'

import { hasSubscription } from '/src/use/useUser'
import { ueOfId } from '/src/use/useUE'
import { subUEOfId } from '/src/use/useSubUE'
import { topicOfId } from '/src/use/useTopic'
import { listOfCourse } from '/src/use/useCourse'
import { courseStudyProgress, topicStudyProgress } from '/src/use/useProgress'

import router from "/src/router"

import SubscribeDialog from '/src/components/SubscribeDialog.vue'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   ue_id: {
      type: Number,
      required: true
   },
   sub_ue_id: {
      type: Number,
      required: true
   },
   topic_id: {
      type: Number,
      required: true
   },
})

const ue = computed(() => ueOfId.value(props.ue_id))
const subUE = computed(() => subUEOfId.value(props.sub_ue_id))
const topic = computed(() => topicOfId.value(props.topic_id))
const courseList = computed(() => listOfCourse.value(props.topic_id))

const courseIsLocked = computed(() => (course) => {
   return (!course.free && !hasSubscription.value(props.userid))
})

const selectCourse = (course) => {
   if (courseIsLocked.value(course)) {
      subscribeModal.value.showModal()
   } else {
      router.push(`/student/study-course/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${course.id}`)
   }
}

const subscribeModal = ref()

const gotoSubscribe = () => {
   router.push(`/student/subscribe`)
}
</script>
