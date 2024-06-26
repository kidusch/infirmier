import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   legislationCache: {},
   legislationStatus: {},
   legislationListStatus: undefined,
})

const legislationState = useSessionStorage('legislation-state', initialState(), { mergeDefaults: true })

export const resetUseLegislation = () => {
   legislationState.value = null
}


app.service('legislation').on('create', legislation => {
   console.log('LEGISLATION EVENT created', legislation)
   legislationState.value.legislationCache[legislation.id] = legislation
   legislationState.value.legislationStatus[legislation.id] = 'ready'
})

app.service('legislation').on('update', legislation => {
   console.log('LEGISLATION EVENT update', legislation)
   legislationState.value.legislationCache[legislation.id] = legislation
   legislationState.value.legislationStatus[legislation.id] = 'ready'
})

app.service('legislation').on('delete', legislation => {
   console.log('LEGISLATION EVENT delete', legislation)
   delete legislationState.value.legislationCache[legislation.id]
   delete legislationState.value.legislationStatus[legislation.id]
})


export const getLegislation = async (id) => {
   let legislation = legislationState.value.legislationCache[id]
   if (legislation) return legislation
   legislation = await app.service('legislation').findUnique({ where: { id }})
   legislationState.value.legislationCache[id] = legislation
   legislationState.value.legislationStatus[id] = 'ready'
   return legislation
}

export const legislationOfId = computed(() => id => {
   const status = legislationState.value.legislationStatus[id]
   if (status === 'ready') return legislationState.value.legislationCache[id]
   if (status === 'ongoing') return undefined // ongoing request
   legislationState.value.legislationStatus[id] = 'ongoing'
   app.service('legislation').findUnique({ where: { id }})
   .then(legislation => {
      legislationState.value.legislationCache[id] = legislation
      legislationState.value.legislationStatus[id] = 'ready'
   })
   .catch(err => {
      console.log('legislationOfId err', id, err)
      delete legislationState.value.legislationStatus[id]
   })
})

export const createLegislation = async (title) => {
   // get highest rank
   const result = await app.service('legislation').aggregate({
      _max: { rank: true }
   })
   const highestRank = result._max.rank
   const rank = highestRank ? highestRank + 1 : 1
   // create legislation with this rank
   const legislation = await app.service('legislation').create({
      data: {
         title,
         rank,
      }
   })
   // update cache
   legislationState.value.legislationCache[legislation.id] = legislation
   legislationState.value.legislationStatus[legislation.id] = 'ready'
   return legislation
}

export const updateLegislation = async (id, data) => {
   const legislation = await app.service('legislation').update({
      where: { id },
      data,
   })
   // update cache
   legislationState.value.legislationCache[id] = legislation
   legislationState.value.legislationStatus[id] = 'ready'
   return legislation
}

export const removeLegislation = async (id) => {
   await app.service('legislation').delete({ where: { id }})
   delete legislationState.value.legislationCache[id]
}

// export const getLegislationList = async () => {
//    if (!legislationState.value.isListReady) {
//       const list = await app.service('legislation').findMany()
//       for (const legislation of list) {
//          legislationState.value.legislationCache[legislation.id] = legislation
//          legislationState.value.legislationStatus[legislation.id] = 'ready'
//       }
//       legislationState.value.isListReady = true
//    }
//    return Object.values(legislationState.value.legislationCache).sort((e1, e2) => e1.rank - e2.rank)
// }

export const listOfLegislation = computed(() => {
   if (legislationState.value.legislationListStatus === 'ready') {
      return Object.values(legislationState.value.legislationCache).sort((e1, e2) => e1.rank - e2.rank)
   }
   if (legislationState.value.legislationListStatus !== 'ongoing') {
      legislationState.value.legislationListStatus = 'ongoing'
      app.service('legislation').findMany({})
      .then(list => {
         for (const legislation of list) {
            legislationState.value.legislationCache[legislation.id] = legislation
            legislationState.value.legislationStatus[legislation.id] = 'ready'
         }
         legislationState.value.legislationListStatus = 'ready'
      }).catch(err => {
         console.log('listOfLegislation err', err)
         legislationState.value.legislationListStatus = undefined
      })
   }
   return []
})

export const isLegislationTabVisible = computed(() => listOfLegislation.value.some(legislation => !legislation.hidden))
