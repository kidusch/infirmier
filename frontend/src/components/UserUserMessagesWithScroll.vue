<template>
   <div class="overflow-y-auto bg-gray-100" :style="style" ref="scrollElement">
      <UserUserConversation
         :userid="userid"
         :userId="userId"
      ></UserUserConversation>
   </div>

   <div class="form-control">
      <div class="relative">
         <textarea class="h-20 textarea-bordered w-full pr-16 leading-5" v-model="messageText" placeholder="Tapez votre message..."></textarea> 
         <button class="absolute top-0 right-0 rounded-l-none btn btn-primary h-20" :disabled="!messageText"
               @click="sendMessage">
            Envoyer
         </button>
      </div>
   </div> 
</template>

<script setup>
import { ref, computed, onMounted } from "vue"

import { app } from '/src/client-app.js'
import { useWindowSize } from '/src/use/useWindowSize'

import UserUserConversation from "@/components/UserUserConversation.vue"

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
   offset: {
      type: [Number, String],
      required: true
   },
})

onMounted(() => {
   scrollToEnd()
})

const { screenHeight } = useWindowSize()
const style = computed(() => {
   return {
      'height': `${screenHeight.value - props.offset}px`,
   }
})

const scrollElement = ref(null)

function scrollToEnd() {
   scrollElement.value.scrollTop = scrollElement.value.scrollHeight
}

const messageText = ref('')

const sendMessage = async () => {
   await app.service('message').create({
      data: {
         from_id: parseInt(props.userid),
         to_id: parseInt(props.userId),
         content: messageText.value,
      }
   })
   messageText.value = ''
   scrollToEnd()
}
</script>
