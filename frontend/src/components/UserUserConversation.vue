<template>
   <div class="bg-gray-100 relative">

      <div class="space-y-6 grid grid-cols-1">
         <template v-for="message in messageListOfConversation(userid, userId)" :key="message.id">
            <div :class="{'place-self-start': message.from_id != userid, 'place-self-end': message.from_id == userid}"
                  :id="message.id">
               <MessageBubble :message="message" :reader_id="userid"></MessageBubble>
            </div>
         </template>
      </div>

   </div>
</template>

<script setup>
import { messageListOfConversation } from "/src/use/useMessage"

import MessageBubble from "@/components/MessageBubble.vue"


const props = defineProps({
   // logged in user
   userid: {
      type: [Number, String],
      required: true
   },
   // the other
   userId: {
      type: [Number, String],
      required: true
   },
})

</script>
