<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p>
            <span>Agenda</span>
         </p>
      </header>

      <!-- Main content -->
      <main class="flex flex-col gap-6 pb-6">

         <FullCalendar :options="calendarOptions" />

      </main>

   </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

import { createAgenda, deleteAgenda, userListOfAgenda } from '/src/use/useAgenda'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const events = computed(() => {
   const agendaList = userListOfAgenda.value(props.userid)
   console.log('agendaList', agendaList)
   return agendaList.map(agenda => {
      return {
         title: agenda.title,
         start: new Date(agenda.start),
         allDay: true,

         agendaId: agenda.id, // will be stored in event.extendedProps
      }
   })
})

const calendarOptions = ref({
   plugins: [ dayGridPlugin, interactionPlugin ],
   initialView: 'dayGridMonth',
   locale: 'fr',
   editable: true,
   selectable: true,
   select: handleDateSelect,
   eventClick: handleEventClick,
   longPressDelay: 10, // on touch devices, touching a date square for 10ms triggers a 'select' event

   events, // calendar events, reactive
})

let idNo = 1

async function handleDateSelect(selectInfo) {
   const title = prompt("Entrez un titre pour votre événement")
   const calendarApi = selectInfo.view.calendar
   calendarApi.unselect() // clear date selection

   if (title) {
      await createAgenda(props.userid, title, selectInfo.startStr, selectInfo.endStr)
   }
}

async function handleEventClick(clickInfo) {
   console.log('clickInfo.event', clickInfo)
   if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      await deleteAgenda(clickInfo.event.extendedProps.agendaId)
   }
}
</script>
