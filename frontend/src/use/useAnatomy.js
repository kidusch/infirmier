import { computed } from 'vue'
// import { useSessionStorage } from '@vueuse/core'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   anatomyCache: {},
   anatomyStatus: {},
   anatomyListStatus: undefined,
})

// const anatomyState = useSessionStorage('anatomy-state', initialState(), { mergeDefaults: true })
const { data: anatomyState } = useIDBKeyval('anatomy-state', initialState(), { mergeDefaults: true })

export const resetUseAnatomy = () => {
   anatomyState.value = initialState()
}


app.service('anatomy').on('create', anatomy => {
   if (!anatomyState.value) return
   console.log('ANATOMY EVENT created', anatomy)
   anatomyState.value.anatomyCache[anatomy.id] = anatomy
   anatomyState.value.anatomyStatus[anatomy.id] = 'ready'
})

app.service('anatomy').on('update', anatomy => {
   if (!anatomyState.value) return
   console.log('ANATOMY EVENT update', anatomy)
   anatomyState.value.anatomyCache[anatomy.id] = anatomy
   anatomyState.value.anatomyStatus[anatomy.id] = 'ready'
})

app.service('anatomy').on('delete', anatomy => {
   if (!anatomyState.value) return
   console.log('ANATOMY EVENT delete', anatomy)
   delete anatomyState.value.anatomyCache[anatomy.id]
   delete anatomyState.value.anatomyStatus[anatomy.id]
})


export const getAnatomy = async (id) => {
   if (!anatomyState.value) return
   let anatomy = anatomyState.value.anatomyCache[id]
   if (anatomy) return anatomy
   anatomy = await app.service('anatomy').findUnique({ where: { id }})
   anatomyState.value.anatomyCache[id] = anatomy
   anatomyState.value.anatomyStatus[id] = 'ready'
   return anatomy
}

export const anatomyOfId = computed(() => id => {
   if (!anatomyState.value) return
   const status = anatomyState.value.anatomyStatus[id]
   if (status === 'ready') return anatomyState.value.anatomyCache[id]
   if (status === 'ongoing') return undefined // ongoing request
   anatomyState.value.anatomyStatus[id] = 'ongoing'
   app.service('anatomy').findUnique({ where: { id }})
   .then(anatomy => {
      anatomyState.value.anatomyCache[id] = anatomy
      anatomyState.value.anatomyStatus[id] = 'ready'
   })
   .catch(err => {
      console.log('anatomyOfId err', id, err)
      delete anatomyState.value.anatomyStatus[id]
   })
})

export const createAnatomy = async (name) => {
   // get highest rank
   const result = await app.service('anatomy').aggregate({
      _max: { rank: true }
   })
   const highestRank = result._max.rank
   const rank = highestRank ? highestRank + 1 : 1
   // create anatomy with this rank
   const anatomy = await app.service('anatomy').create({
      data: {
         name,
         rank,
      }
   })
   // update cache
   anatomyState.value.anatomyCache[anatomy.id] = anatomy
   anatomyState.value.anatomyStatus[anatomy.id] = 'ready'
   return anatomy
}

export const updateAnatomy = async (id, data) => {
   const anatomy = await app.service('anatomy').update({
      where: { id },
      data,
   })
   // update cache
   anatomyState.value.anatomyCache[id] = anatomy
   anatomyState.value.anatomyStatus[id] = 'ready'
   return anatomy
}

export const removeAnatomy = async (id) => {
   await app.service('anatomy').delete({ where: { id }})
   delete anatomyState.value.anatomyCache[id]
}

export const getAnatomyList = async () => {
   if (!anatomyState.value) return []
   if (!anatomyState.value.isListReady) {
      const list = await app.service('anatomy').findMany()
      for (const anatomy of list) {
         anatomyState.value.anatomyCache[anatomy.id] = anatomy
         anatomyState.value.anatomyStatus[anatomy.id] = 'ready'
      }
      anatomyState.value.isListReady = true
   }
   return Object.values(anatomyState.value.anatomyCache).sort((e1, e2) => e1.rank - e2.rank)
}

export const listOfAnatomy = computed(() => {
   if (!anatomyState.value) return []
   if (anatomyState.value.anatomyListStatus === 'ready') {
      return Object.values(anatomyState.value.anatomyCache).sort((e1, e2) => e1.rank - e2.rank)
   }
   if (anatomyState.value.anatomyListStatus !== 'ongoing') {
      anatomyState.value.anatomyListStatus = 'ongoing'
      app.service('anatomy').findMany({})
      .then(list => {
         for (const anatomy of list) {
            anatomyState.value.anatomyCache[anatomy.id] = anatomy
            anatomyState.value.anatomyStatus[anatomy.id] = 'ready'
         }
         anatomyState.value.anatomyListStatus = 'ready'
      }).catch(err => {
         console.log('listOfAnatomy err', err)
         anatomyState.value.anatomyListStatus = undefined
      })
   }
   return []
})
