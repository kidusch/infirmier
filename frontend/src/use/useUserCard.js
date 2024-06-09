import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   userCardCache: {},
   theUserCardStatus: {},
})

const key = 'user-card-state'
const userCardState = useSessionStorage(key, initialState(), { mergeDefaults: true })

export const resetUseUserCard = () => {
   userCardState.value = null
}


app.service('user_card').on('create', (userCard) => {
   console.log('USER_CARD EVENT created', userCard)
   userCardState.value.userCardCache[userCard.id] = userCard
})

app.service('user_card').on('update', (userCard) => {
   console.log('USER_CARD EVENT update', userCard)
   userCardState.value.userCardCache[userCard.id] = userCard
})

app.service('user_card').on('delete', (userCard) => {
   console.log('USER_CARD EVENT delete', userCard)
   delete userCardState.value.userCardCache[userCard.id]
})

// get or create the unique user_card associated to (user_id, card_id)
export const getTheUserCard = async (user_id, card_id) => {
   const key = user_id + ':' + card_id
   const status = userCardState.value.theUserCardStatus[key]
   if (status === 'ready') return Object.values(userCardState.value.userCardCache).find(userCard => userCard.user_id === user_id && userCard.card_id === card_id)
   userCardState.value.theUserCardStatus[key] = 'ongoing'
   let [userCard] = await app.service('user_card').findMany({
      where: { user_id, card_id },
   })
   if (!userCard) {
      userCard = await app.service('user_card').create({
         data: { user_id, card_id },
      })
   }
   userCardState.value.userCardCache[userCard.id] = userCard
   userCardState.value.theUserCardStatus[key] = 'ready'
   return userCard
}

export const theUserCard = computed(() => (user_id, card_id) => {
   const key = user_id + ':' + card_id
   const status = userCardState.value.theUserCardStatus[key]
   if (status === 'ready') return Object.values(userCardState.value.userCardCache).find(userCard => userCard.user_id === user_id && userCard.card_id === card_id)
   if (status === 'ongoing') return undefined // ongoing request
   userCardState.value.theUserCardStatus[key] = 'ongoing'
   app.service('user_card').findMany({
      where: { user_id, card_id },
   }).then(userCards => {
      if (userCards.length > 0) {
         const userCard = userCards[0]
         userCardState.value.userCardCache[userCard.id] = userCard
         userCardState.value.theUserCardStatus[key] = 'ready'
      } else {
         app.service('user_card').create({
            data: { user_id, card_id },
         }).then(userCard => {
            userCardState.value.userCardCache[userCard.id] = userCard
            userCardState.value.theUserCardStatus[key] = 'ready'
         })
      }
   })
})

export const updateUserCard = async (id, data) => {
   const userCard = await app.service('user_card').update({
      where: { id },
      data,
   })
   // update cache
   userCardState.value.userCardCache[userCard.id] = userCard
   return userCard
}
