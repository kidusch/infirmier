import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'


// state backed in SessionStorage

const initialState = () => ({
   ueCache: {},
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

