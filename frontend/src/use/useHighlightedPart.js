import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   highlightedPartCache: {},
})
 
const highlightedPartState = useSessionStorage('highlighted-part-state', initialState())

export const resetUseHighlightedPart = () => {
   highlightedPartState.value = initialState()
}


app.service('highlighted-part').on('create', highlightedPart => {
   console.log('HIGHLIGHTED EVENT created', highlightedPart)
   highlightedPartState.value.highlightedPartCache[highlightedPart.id] = highlightedPart
})


export const getHighlightedPart = async (hash) => {
   const highlightedPart = highlightedPartState.value.highlightedPartCache[hash]
   if (highlightedPart) return highlightedPart
   const promise = app.service('highlighted-part').findUnique({ where: { hash }})
   promise.then(highlightedPart => {
      highlightedPartState.value.highlightedPartCache[hash] = highlightedPart
   })
   return promise
}

export const createHighlightedPart = async (hash, color) => {
   const highlightedPart = await app.service('highlightedPart').create({
      data: {
         hash,
         color,
      }
   })
   // update cache
   highlightedPartState.value.highlightedPartCache[highlightedPart.hash] = highlightedPart
   return highlightedPart
}
