import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   userCardCache: {},
   theUserCardReady: {},
})
 
const userCardState = useSessionStorage('user-card-state', initialState())

export const resetUseUserCard = () => {
   userCardState.value = initialState()
}


app.service('user_card').on('create', (userCard) => {
   console.log('USER_CARD EVENT created', userCard)
   userCardState.value.userCardCache[userCard.id] = userCard
})

// get or create the unique user_card associated to (user_id, card_id)
export const getTheUserCard = async (user_id, card_id) => {
   const isReady = userCardState.value.theUserCardReady[user_id + ':' + card_id]
   if (isReady) return Object.values(userCardState.value.userCardCache).find(userCard => userCard.user_id === user_id && userCard.card_id === card_id)
   let [userCard] = await app.service('user_card').findMany({
      where: { user_id, card_id },
   })
   if (!userCard) {
      userCard = await app.service('user_card').create({
         data: { user_id, card_id },
      })
   }
   userCardState.value.userCardCache[userCard.id] = userCard
   userCardState.value.theUserCardReady[user_id + ':' + card_id] = true
   return userCard
}

export const updateUserCard = async (id, data) => {
   const userCard = await app.service('user_card').update({
      where: { id },
      data,
   })
   // update cache
   userCardState.value.userCardCache[userCard.id] = userCard
   return userCard
}
