import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   ueCache: {},
   isListReady: false,
})
 
const ueState = useSessionStorage('ue-state', initialState())

export const resetUseUE = () => {
   ueState.value = initialState()
}


app.service('ue').on('create', ue => {
   console.log('UE EVENT created', ue)
   ueState.value.ueCache[ue.id] = ue
})


export const getUE = async (id) => {
   const ue = ueState.value.ueCache[id]
   if (ue) return ue
   const promise = app.service('ue').findUnique({ where: { id }})
   promise.then(ue => {
      ueState.value.ueCache[id] = ue
   })
   return promise
}

export const createUE = async (name) => {
   // get highest rank
   const result = await app.service('ue').aggregate({
      _max: { rank: true }
   })
   const highestRank = result._max.rank
   const rank = highestRank ? highestRank + 1 : 1
   // create ue with this rank
   const ue = await app.service('ue').create({
      data: {
         name,
         rank,
      }
   })
   // update cache
   ueState.value.ueCache[ue.id] = ue
   return ue
}

export const updateUE = async (id, data) => {
   const ue = await app.service('ue').update({
      where: { id },
      data,
   })
   // update cache
   ueState.value.ueCache[ue.id] = ue
   return ue
}

export const removeUE = async (id) => {
   await app.service('ue').delete({ where: { id }})
   delete ueState.value.ueCache[id]
}

export const getUEList = async () => {
   if (!ueState.value.isListReady) {
      const list = await app.service('ue').findMany()
      for (const ue of list) {
         ueState.value.ueCache[ue.id] = ue
      }
      ueState.value.isListReady = true
   }
   return Object.values(ueState.value.ueCache)
}
