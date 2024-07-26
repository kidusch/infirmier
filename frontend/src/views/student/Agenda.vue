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
   return agendaList.map(agenda => ({
      title: agenda.title,
      start: new Date(agenda.start),
      // end: new Date(agenda.end),
   }))
})

const calendarOptions = ref({
   plugins: [ dayGridPlugin, interactionPlugin ],
   initialView: 'dayGridMonth',
   locale: 'fr',
   editable: true,
   selectable: true,
   select: handleDateSelect,
   eventClick: handleEventClick,

   events,
})

let idNo = 1

async function handleDateSelect(selectInfo) {
   const title = prompt("Entrez un titre pour votre événement")
   const calendarApi = selectInfo.view.calendar

   calendarApi.unselect() // clear date selection

   if (title) {
      calendarApi.addEvent({
         id: idNo++ + "",
         title,
         start: selectInfo.startStr,
         end: selectInfo.endStr,
         allDay: selectInfo.allDay
      })
      await createAgenda(props.userid, title, selectInfo.startStr, selectInfo.endStr)
   }
}

async function handleEventClick(clickInfo) {
   if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
      await deleteAgenda(clickInfo.event.agendaId)
   }
}
</script>
