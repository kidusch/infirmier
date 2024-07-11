
import { computed } from "vue"
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// global state backed in SessionStorage

const initialState = () => ({
   // Linus Borg dictionaries
   messages: {},
   // indexes
   userMessagesListReady: {},
})

const stateMessages = useSessionStorage('state-messages', initialState())

export const resetUseMessage = () => {
   stateMessages.value = null
}


app.service('message').on('create', async message => {
   console.log('MESSAGE EVENT create', message)
   stateMessages.value.messages[message.id] = message
})

app.service('message').on('update', message => {
   console.log('MESSAGE EVENT update', message)
   stateMessages.value.messages[message.id] = message
})

app.service('message').on('delete', message => {
   console.log('MESSAGE EVENT delete', message)
   delete stateMessages.value.messages[message.id]
})

export const messageListOfConversation = computed(() => (user1Id, user2Id) => {
   if (!stateMessages.value.userMessagesListReady[user1Id]) {
      app.service('message').findMany({ where: {
         OR: [
            { from_id: parseInt(user1Id), },
            { to_id: parseInt(user1Id), },
         ]
      }}).then(messagesList => {
         messagesList.forEach(message => { stateMessages.value.messages[message.id] = message })
         stateMessages.value.userMessagesListReady[user1Id] = true
      })
      return []
   }
   if (!stateMessages.value.userMessagesListReady[user2Id]) {
      app.service('message').findMany({ where: {
         OR: [
            { from_id: parseInt(user2Id), },
            { to_id: parseInt(user2Id), },
         ]
      }}).then(messagesList => {
         messagesList.forEach(message => { stateMessages.value.messages[message.id] = message })
         stateMessages.value.userMessagesListReady[user2Id] = true
      })
      return []
   }
   return Object.values(stateMessages.value.messages)
      .filter(message => message.from_id == user1Id && message.to_id == user2Id || message.to_id == user1Id && message.from_id == user2Id)
})

export const unreadMessagesCountOfUser2ByUser1 = computed(() => (user1Id, user2Id) => {
   const messageList = messageListOfConversation.value(user1Id, user2Id)
   // console.log('messageList', user1Id, user2Id, messageList)
   return messageList.reduce((accu, message) => {
      return message.from_id == user2Id && !message.read_on ? accu + 1 : accu
   }, 0)
})
