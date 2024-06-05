import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   cardCache: {},
   isListReady: {},
})
 
const cardState = useSessionStorage('card-state', initialState())

export const resetUseCard = () => {
   cardState.value = initialState()
}


app.service('card').on('create', card => {
   console.log('CARD EVENT created', card)
   cardState.value.cardCache[card.id] = card
})


export const getCard = async (id) => {
   let card = cardState.value.cardCache[id]
   if (card) return card
   card = await app.service('card').findUnique({ where: { id }})
   cardState.value.cardCache[id] = card
   return card
}

export const createCard = async (topic_id, title = '', content = '') => {
   // get highest rank
   const result = await app.service('card').aggregate({
      where: { topic_id},
      _max: { rank: true }
   })
   const highestRank = result._max.rank
   const rank = highestRank ? highestRank + 1 : 1
   // create card with this rank
   const card = await app.service('card').create({
      data: {
         rank,
         topic_id,
         title,
         content,
      }
   })
   // update cache
   cardState.value.cardCache[card.id] = card
   return card
}

export const updateCard = async (id, data) => {
   const card = await app.service('card').update({
      where: { id },
      data,
   })
   // update cache
   cardState.value.cardCache[card.id] = card
   return card
}

export const removeCard = async (id) => {
   await app.service('card').delete({ where: { id }})
   delete cardState.value.cardCache[id]
}

export const getCardList = async (topic_id) => {
   if (!cardState.value.isListReady[topic_id]) {
      const list = await app.service('card').findMany({
         where: { topic_id }
      })
      for (const card of list) {
         cardState.value.cardCache[card.id] = card
      }
      cardState.value.isListReady[topic_id] = true
   }
   return Object.values(cardState.value.cardCache).filter(card => card.topic_id === topic_id).sort((e1, e2) => e1.rank - e2.rank)
}
