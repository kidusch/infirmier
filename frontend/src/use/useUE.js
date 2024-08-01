import { computed } from 'vue'
// import { useSessionStorage } from '@vueuse/core'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   ueCache: {},
   ueStatus: {},
   ueListStatus: undefined,
})

// const ueState = useSessionStorage('ue-state', initialState(), { mergeDefaults: true })
const { data: ueState } = useIDBKeyval('ue-state', initialState(), { mergeDefaults: true })

export const resetUseUE = () => {
   ueState.value = initialState()
}


app.service('ue').on('create', ue => {
   if (!ueState.value) return
   console.log('UE EVENT created', ue)
   ueState.value.ueCache[ue.id] = ue
   ueState.value.ueStatus[ue.id] = 'ready'
})

app.service('ue').on('update', ue => {
   if (!ueState.value) return
   console.log('UE EVENT update', ue)
   ueState.value.ueCache[ue.id] = ue
   ueState.value.ueStatus[ue.id] = 'ready'
})

app.service('ue').on('delete', ue => {
   if (!ueState.value) return
   console.log('UE EVENT delete', ue)
   delete ueState.value.ueCache[ue.id]
   delete ueState.value.ueStatus[ue.id]
})


export const getUE = async (id) => {
   if (!ueState.value) return
   let ue = ueState.value.ueCache[id]
   if (ue) return ue
   ue = await app.service('ue').findUnique({ where: { id }})
   ueState.value.ueCache[id] = ue
   ueState.value.ueStatus[id] = 'ready'
   return ue
}

export const ueOfId = computed(() => id => {
   if (!ueState.value) return
   const status = ueState.value.ueStatus[id]
   if (status === 'ready') return ueState.value.ueCache[id]
   if (status === 'ongoing') return undefined // ongoing request
   ueState.value.ueStatus[id] = 'ongoing'
   app.service('ue').findUnique({ where: { id }})
   .then(ue => {
      ueState.value.ueCache[id] = ue
      ueState.value.ueStatus[id] = 'ready'
   })
   .catch(err => {
      console.log('ueOfId err', id, err)
      delete ueState.value.ueStatus[id]
   })
})

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
   ueState.value.ueStatus[ue.id] = 'ready'
   return ue
}

export const updateUE = async (id, data) => {
   const ue = await app.service('ue').update({
      where: { id },
      data,
   })
   // update cache
   ueState.value.ueCache[id] = ue
   ueState.value.ueStatus[id] = 'ready'
   return ue
}

export const removeUE = async (id) => {
   await app.service('ue').delete({ where: { id }})
   delete ueState.value.ueCache[id]
}

export const getUEList = async () => {
   if (!ueState.value) return []
   if (!ueState.value.isListReady) {
      const list = await app.service('ue').findMany()
      for (const ue of list) {
         ueState.value.ueCache[ue.id] = ue
         ueState.value.ueStatus[ue.id] = 'ready'
      }
      ueState.value.isListReady = true
   }
   return Object.values(ueState.value.ueCache).sort((e1, e2) => e1.rank - e2.rank)
}

export const listOfUE = computed(() => {
   if (!ueState.value) return []
   if (ueState.value.ueListStatus === 'ready') {
      return Object.values(ueState.value.ueCache).sort((e1, e2) => e1.rank - e2.rank)
   }
   if (ueState.value.ueListStatus !== 'ongoing') {
      ueState.value.ueListStatus = 'ongoing'
      app.service('ue').findMany({})
      .then(list => {
         for (const ue of list) {
            ueState.value.ueCache[ue.id] = ue
            ueState.value.ueStatus[ue.id] = 'ready'
         }
         ueState.value.ueListStatus = 'ready'
      }).catch(err => {
         console.log('listOfUE err', err)
         ueState.value.ueListStatus = undefined
      })
   }
   return []
})
