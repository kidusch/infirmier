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
            <router-link class="cursor-pointer hover:underline" :to="`/student/study-topic/${ue?.id}/${subUE?.id}/${topic?.id}`">{{ topic?.name }}</router-link>
            /
            <span class="font-semibold">{{ course?.title }}</span>
         </p>
      </header>

      <!-- Settings -->
      <section class="w-full flex justify-end gap-6">

         <label class="inline-flex gap-3 items-center cursor-pointer">
            <p class="font-semibold text-black">Acquis</p>

            <input type="checkbox" class="sr-only peer" :checked="userCourse?.done" @input="onDoneClick(userCourse?.done)">
            <div
               class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#76EE59]">
            </div>

         </label>

         <div class="cursor-pointer link hover:text-red-600 text-blue-600" @click="gotoRevise">
            révisions
         </div>

      </section>

      <!-- Course content -->
      <main class="mt-4">
         <div v-html="contentOfCourse" ref="doc" @click="onClick"></div>
      </main>

      <!-- Highlight pens -->
      <ul class="menu menu-horizontal bg-slate-50 rounded-box fixed right-0 bottom-16">
         <li>
            <button :class="{ active: highlightColor === '#FFFF66' }" @click="highlightColor = '#FFFF66'">
               <img class="h-6 w-6" src="/src/assets/highlighter-yellow.svg">
            </button>
         </li>
         <li>
            <button :class="{ active: highlightColor === '#FFCC66' }" @click="highlightColor = '#FFCC66'">
               <img class="h-6 w-6" src="/src/assets/highlighter-orange.svg">
            </button>
         </li>
         <li>
            <button :class="{ active: highlightColor === '#FF99CC' }" @click="highlightColor = '#FF99CC'">
               <img class="h-6 w-6" src="/src/assets/highlighter-purple.svg">
            </button>
         </li>
         <li>
            <button :class="{ active: highlightColor === null }" @click="highlightColor = null">
               <img class="h-6 w-6" src="/src/assets/eraser.svg">
            </button>
         </li>
      </ul>


      <!-- Note button -->
      <button ref="openNoteBtn" class="p-2 bg-primary rounded-full shadow-primary shadow-md fixed bottom-32 right-2"
         @click="openNoteModal">
         <img class="h-6 w-6" alt="note" src="/src/assets/note.svg">
      </button>

      <!-- Note dark overlay -->
      <div ref="darkOverlay" class="hidden fixed h-[100vh] bg-black/50 w-full top-0 right-0 transition-all"
         @click="closeNoteModal">
      </div>

      <!-- Note Area -->
      <div ref="noteBox"
         class="fixed bottom-0 -right-full transition-all duration-300 bg-white w-1/2 sm:w-52 lg:w-72 z-[1] rounded-ss-2xl max-h-[65vh] h-[65vh] flex-col">
         <div class="flex items-center justify-between p-4 pb-2">
            <h3>Note</h3>
            <button @click="closeNoteModal">
               <img class="h-4 w-4" alt="close" src="/src/assets/close.svg">
            </button>
         </div>
         <textarea class="min-h-[65vh] h-[65vh] px-4 text-black/70 font-normal text-base"
            placeholder="Écrivez vos notes ici"
            :value="note"
            @input="onNoteInputDebounced"
            v-position="notePosition"
         ></textarea>
      </div>

   </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { ueOfId } from '/src/use/useUE'
import { subUEOfId } from '/src/use/useSubUE'
import { topicOfId } from '/src/use/useTopic'
import { courseOfId } from '/src/use/useCourse'
import { courseContentOfCourseId } from '/src/use/useCourseContent'
import { theUserCourse, createUserCourse, updateUserCourse } from '/src/use/useUserCourse'

import { app } from '/src/client-app.js'

import router from "/src/router"

const doc = ref(null)


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
   course_id: {
      type: Number,
      required: true
   },
})

const ue = computed(() => ueOfId.value(props.ue_id))
const subUE = computed(() => subUEOfId.value(props.sub_ue_id))
const topic = computed(() => topicOfId.value(props.topic_id))
const course = computed(() => courseOfId.value(props.course_id))
const courseContent = computed(() => courseContentOfCourseId.value(props.course_id))

const userCourse = computed(() => {
   let userCourse = theUserCourse.value(props.userid, props.course_id)
   if (userCourse === null) {
      // null value indicates there is no (user_id, course_id) in database
      createUserCourse(props.userid, props.course_id)
      return undefined
   }
   return userCourse
})

// annotations are lost when more recent course content is available
const contentOfCourse = computed(() => {
   if (!courseContent.value?.content) return undefined
   if (!userCourse.value?.highlighted_content || !userCourse.value?.highlighted_content_time) return courseContent.value.content
   if (userCourse.value.highlighted_content_time <= course.value.last_modified_at) return courseContent.value.content
   return userCourse.value.highlighted_content
})

const highlightColor = ref() // undefined: nothing, null: eraser, other: hightlight color

const onDoneClick = async (prevValue) => {
   await updateUserCourse(userCourse.value.id, { done: !prevValue })
}

const gotoRevise = () => {
   router.push(`/student/revise-topic/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}`)
}

const darkOverlay = ref(null)
const openNoteBtn = ref(null)
const noteBox = ref(null)

function openNoteModal() {
   openNoteBtn.value.classList.add("hidden")
   darkOverlay.value.classList.remove("hidden")
   noteBox.value.style.right = 0
}

function closeNoteModal() {
   openNoteBtn.value.classList.remove("hidden")
   darkOverlay.value.classList.add("hidden")
   noteBox.value.style.right = "-100%"
}

// handle note editing
const localNote = ref()
const note = computed(() => localNote.value || userCourse.value?.note)
app.service('user_course').on('update', userCourse => {
   localNote.value = userCourse.note
})
const notePosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onNoteInput = async (ev) => {
   localNote.value = ev.target.value
   notePosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateUserCourse(userCourse.value.id, { note: ev.target.value })
}
const onNoteInputDebounced = useDebounceFn(onNoteInput, 500)

// custom directive (v-position on <input> or <textarea>) which restores cursor position
const vPosition = {
   updated: (el, binding) => {
      // binding.value is the directive argument, here the cursor position ref { start, end }
      el.selectionStart, el.selectionEnd = binding.value.start, binding.value.end
   }
}

const onClick = async (event) => {
   console.log('highlightColor.value', highlightColor.value) // NÉCESSAIRE ???
   if (highlightColor.value === undefined) return
   if (!event.target.getAttribute('data-background-color')) {
      event.target.setAttribute('data-background-color', event.target.style.backgroundColor || 'none')
   }
   if (highlightColor.value) {
      // pen color
      event.target.style.backgroundColor = highlightColor.value
   } else {
      // eraser
      event.target.style.backgroundColor = event.target.getAttribute('data-background-color') === 'none' ? null : event.target.getAttribute('data-background-color')
   }
   await updateUserCourse(userCourse.value.id, {
      highlighted_content: doc.value.outerHTML,
      highlighted_content_time: new Date(),
   })
}
</script>
