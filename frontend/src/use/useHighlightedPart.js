import { useSessionStorage } from '@vueuse/core'
import stringHash from 'string-hash'

import app from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   highlightedPartCache: {},
})
 
const highlightedPartState = useSessionStorage('highlighted-part-state', initialState())

export const resetUseHighlightedPart = () => {
   highlightedPartState.value = initialState()
}


app.service('highlighted_part').on('create', highlightedPart => {
   console.log('HIGHLIGHTED EVENT created', highlightedPart)
   highlightedPartState.value.highlightedPartCache[highlightedPart.id] = highlightedPart
})


export const getOrCreateHighlightedPart = async (userid, topic_id, card_id, text, color) => {
   const hash = stringHash(`${userid},${topic_id},${card_id},${text}`) + ''
   let highlightedPart = highlightedPartState.value.highlightedPartCache[hash]
   if (highlightedPart) return highlightedPart
   highlightedPart = await app.service('highlighted_part').upsert({
      where: { hash },
      create: { hash, text, color },
      update: { },
   })
   highlightedPartState.value.highlightedPartCache[hash] = highlightedPart
   return highlightedPart
}

export const updateHighlightedPart = async (hash, data) => {
   const highlightedPart = await app.service('highlighted_part').update({
      where: { hash },
      data,
   })
   // update cache
   highlightedPartState.value.highlightedPartCache[hash] = highlightedPart
   return highlightedPart
}
