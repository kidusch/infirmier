<template>
   <div class="px-7 py-3 rounded-2xl m-2 text-lg"
         :id="message.id"
         :class="{'bg-green-100': message.from_id == reader_id, 'bg-white': message.from_id != reader_id}">
      <div v-html="messageContent"></div>
      <div class="text-sm text-blue-700 text-right">
         <!-- {{ formattedDate(message.created_at) }}
         <span v-if="message.from_id == reader_id && message.read_on"> ✓✓</span>
         <span v-if="message.from_id == reader_id && !message.read_on"> ✓</span> -->
         <div>Envoyé le {{ formattedDate(message.created_at) }}</div>
         <div v-if="message.from_id == reader_id && message.read_on">Lu le {{ formattedDate(message.read_on) }}</div>
      </div>
   </div>
</template>

<script>
import { onMounted, onUnmounted, computed } from "vue"
import { format } from 'date-fns'

import { app } from '/src/client-app.js'


export default {

   props: {
      message: {
         type: Object,
         required: true
      },
      reader_id: {
         type: [Number, String],
         required: true
      },
   },

   setup(props) {
      let observer

      onMounted(() => {
         observer = new IntersectionObserver(entries => {
            const firstEntry = entries[0]
            // console.log(props.message.content, firstEntry.isIntersecting)
            if (firstEntry.isIntersecting && props.message.from_id != props.reader_id && !props.message.read_on) {
               app.service('message').update({
                  where: { id: props.message.id },
                  data: {
                     read_on: new Date()
                  }
               })
            }
         })
         const target = document.getElementById(props.message.id)
         observer.observe(target);
      })

      onUnmounted(() => {
         observer.disconnect()
      })

      const formattedDate = (date) => format(new Date(date), 'dd/MM HH:mm')

      const messageContent = computed(() => props.message.content.replace(/(?:\r\n|\r|\n)/g, '<br>'))

      return {
         formattedDate,
         messageContent,
      }
   }
}
</script>