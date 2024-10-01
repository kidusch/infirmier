<template>
   <div class="overflow-y-auto bg-gray-100" :style="style" ref="scrollElement">
      <UserUserConversation
         :userid="userid"
         :userId="userId"
      ></UserUserConversation>
   </div>

   <div class="mt-2">
      <div class="flex">
         <textarea class="bg-gray-100" v-model="messageText" placeholder="Tapez votre message..."></textarea>
         <button class="px-6 md:px-20 py-2.5 bg-primary text-white flex items-center justify-center gap-4 font-medium max-h-14 rounded-3xl rounded-l-none"
            :disabled="!messageText" @click="sendMessage">
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
   try {
      // send notification
      await app.service('notification').pushNotification(props.userId, { title: "Devenir Infirmier", text: "Vous avez un nouveau message" })
   } catch(err) {
      console.log('err', err)
   }

}
</script>
