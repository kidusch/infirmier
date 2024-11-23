import { computed } from 'vue'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'

import { app } from '/src/client-app.js'
import { fetchAndCache, fetchAndCacheList } from '/src/lib/fetchAndCache.mjs'

// state backed in SessionStorage
const initialState = () => ({
   careCache: {},
   careStatus: {},
   // careListStatus: undefined,
   careListStatus: {},
})

const { data: careState } = useIDBKeyval('care-state', initialState(), { mergeDefaults: true })

export const resetUseCare = () => {
   careState.value = initialState()
}


app.service('care').on('create', care => {
   if (!careState.value) return
   console.log('CARE EVENT created', care)
   careState.value.careCache[care.id] = care
   careState.value.careStatus[care.id] = 'ready'
})

app.service('care').on('update', care => {
   if (!careState.value) return
   console.log('CARE EVENT update', care)
   careState.value.careCache[care.id] = care
   careState.value.careStatus[care.id] = 'ready'
})

app.service('care').on('delete', care => {
   if (!careState.value) return
   console.log('CARE EVENT delete', care)
   delete careState.value.careCache[care.id]
   delete careState.value.careStatus[care.id]
})


// export const getCare = async (id) => {
//    if (!careState.value) return
//    let care = careState.value.careCache[id]
//    if (care) return care
//    care = await app.service('care').findUnique({ where: { id }})
//    careState.value.careCache[id] = care
//    careState.value.careStatus[id] = 'ready'
//    return care
// }

// export const careOfId = computed(() => (id) => {
//    if (!careState.value) return
//    const status = careState.value.careStatus[id]
//    if (status === 'ready') return careState.value.careCache[id]
//    if (status === 'ongoing') return undefined // ongoing request
//    careState.value.careStatus[id] = 'ongoing'
//    app.service('care').findUnique({ where: { id }})
//    .then(care => {
//       careState.value.careCache[id] = care
//       careState.value.careStatus[id] = 'ready'
//    })
//    .catch(err => {
//       console.log('careOfId err', id, err)
//       delete careState.value.careStatus[id]
//    })
// })

export const getCare = async (id) => {
   const { value, promise } = fetchAndCache(id, app.service('care'), careState?.value.careStatus, careState?.value.careCache)
   return value || await promise
}

export const careOfId = computed(() => (id) => {
   const { value } = fetchAndCache(id, app.service('care'), careState?.value.careStatus, careState?.value.careCache)
   return value
})

export const createCare = async (title) => {
   // get highest rank
   const result = await app.service('care').aggregate({
      _max: { rank: true }
   })
   const highestRank = result._max.rank
   const rank = highestRank ? highestRank + 1 : 1
   // create care with this rank
   const care = await app.service('care').create({
      data: {
         title,
         rank,
      }
   })
   // update cache
   careState.value.careCache[care.id] = care
   careState.value.careStatus[care.id] = 'ready'
   return care
}

export const updateCare = async (id, data) => {
   const care = await app.service('care').update({
      where: { id },
      data,
   })
   // update cache
   careState.value.careCache[id] = care
   careState.value.careStatus[id] = 'ready'
   return care
}

export const removeCare = async (id) => {
   await app.service('care').delete({ where: { id }})
   delete careState.value.careCache[id]
   delete careState.value.careStatus[id]
}

// export const getCareList = async () => {
//    if (!careState.value.isListReady) {
//       const list = await app.service('care').findMany()
//       for (const care of list) {
//          careState.value.careCache[care.id] = care
//          careState.value.careStatus[care.id] = 'ready'
//       }
//       careState.value.isListReady = true
//    }
//    return Object.values(careState.value.careCache).sort((e1, e2) => e1.rank - e2.rank)
// }

// export const listOfCare = computed(() => {
//    if (!careState.value) return []
//    if (careState.value.careListStatus === 'ready') {
//       return Object.values(careState.value.careCache).sort((e1, e2) => e1.rank - e2.rank)
//    }
//    if (careState.value.careListStatus !== 'ongoing') {
//       careState.value.careListStatus = 'ongoing'
//       app.service('care').findMany({})
//       .then(list => {
//          for (const care of list) {
//             careState.value.careCache[care.id] = care
//             careState.value.careStatus[care.id] = 'ready'
//          }
//          careState.value.careListStatus = 'ready'
//       }).catch(err => {
//          console.log('listOfCare err', err)
//          delete careState.value.careListStatus
//       })
//    }
//    return []
// })

export const listOfCare = computed(() => {
   const { value } = fetchAndCacheList(app.service('care'), {}, ()=>true, careState?.value.careStatus, careState?.value.careCache, careState?.value.careListStatus)
   return value
})

export const isCareTabVisible = computed(() => listOfCare.value.some(care => !care.hidden))
