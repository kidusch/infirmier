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

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const calendarOptions = ref({
   plugins: [ dayGridPlugin, interactionPlugin ],
   initialView: 'dayGridMonth',
   locale: 'fr',
})
</script>
