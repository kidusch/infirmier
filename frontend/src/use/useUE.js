import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   ueCache: {},
   ueStatus: {},
   ueListStatus: undefined,
})

const key = 'ue-state'
const ueState = useSessionStorage(key, initialState(), { mergeDefaults: true })

export const resetUseUE = () => {
   ueState.value = null
}


app.service('ue').on('create', ue => {
   console.log('UE EVENT created', ue)
   ueState.value.ueCache[ue.id] = ue
})

app.service('ue').on('update', ue => {
   console.log('UE EVENT update', ue)
   ueState.value.ueCache[ue.id] = ue
})

app.service('ue').on('delete', ue => {
   console.log('UE EVENT delete', ue)
   delete ueState.value.ueCache[ue.id]
})


export const getUE = async (id) => {
   let ue = ueState.value.ueCache[id]
   if (ue) return ue
   ue = await app.service('ue').findUnique({ where: { id }})
   ueState.value.ueCache[id] = ue
   ueState.value.ueStatus[id] = 'ready'
   return ue
}

export const ueOfId = computed(() => id => {
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
      ueState.value.ueStatus[id] = undefined
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
         ueState.value.ueStatus[ue.id] = 'ready'
      }
      ueState.value.isListReady = true
   }
   return Object.values(ueState.value.ueCache).sort((e1, e2) => e1.rank - e2.rank)
}

export const listOfUEs = computed(() => {
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
         console.log('listOfSubUEs err', err)
         ueState.value.ueListStatus = undefined
      })
   }
   return []
})
