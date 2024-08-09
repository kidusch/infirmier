<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/admin/admin-agenda`">Agendas</router-link>
            /
            <span class="font-semibold">{{ student?.name }}</span>
         </p>
      </header>

      <main class="flex flex-col gap-3">

         <FullCalendar :options="calendarOptions" />

      </main>
   </main>
</template>

<script setup>
import { ref, computed } from 'vue'

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
// import interactionPlugin from '@fullcalendar/interaction'

import { userOfId } from '/src/use/useUser'
import { userListOfAgenda } from '/src/use/useAgenda'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   studentId: {
      type: Number,
      required: true
   },
})

const student = computed(() => userOfId.value(props.studentId))

const events = computed(() => {
   const agendaList = userListOfAgenda.value(props.studentId)
   return agendaList.map(agenda => {
      return {
         title: agenda.title,
         start: new Date(agenda.start),
         allDay: true,

         // agendaId: agenda.id, // will be stored in event.extendedProps
      }
   })
})

const calendarOptions = ref({
   // plugins: [ dayGridPlugin, interactionPlugin ],
   plugins: [ dayGridPlugin ],
   initialView: 'dayGridMonth',
   locale: 'fr',
   editable: true,
   selectable: true,
   // select: handleDateSelect,
   // eventClick: handleEventClick,
   // longPressDelay: 10, // on touch devices, touching a date square for 10ms triggers a 'select' event

   events, // calendar events, reactive
})

</script>
