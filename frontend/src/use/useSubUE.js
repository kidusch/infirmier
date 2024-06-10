import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   subUECache: {},
   subUEStatus: {},
   subUEListStatus: {},
})

const key = 'sub-ue-state'
const subUEState = useSessionStorage(key, initialState(), { mergeDefaults: true })

export const resetUseSubUE = () => {
   subUEState.value = null
}


app.service('sub_ue').on('create', subUE => {
   console.log('SUB_UE EVENT created', subUE)
   subUEState.value.subUECache[subUE.id] = subUE
})

app.service('sub_ue').on('update', subUE => {
   console.log('SUB_UE EVENT update', subUE)
   subUEState.value.subUECache[subUE.id] = subUE
})

app.service('sub_ue').on('delete', subUE => {
   console.log('SUB_UE EVENT delete', subUE)
   delete subUEState.value.subUECache[subUE.id]
})


export const getSubUE = async (id) => {
   let ue = subUEState.value.subUECache[id]
   if (ue) return ue
   ue = await app.service('sub_ue').findUnique({ where: { id }})
   subUEState.value.subUECache[id] = ue
   subUEState.value.subUEStatus[id] = 'ready'
   return ue
}

export const subUEOfId = computed(() => id => {
   const status = subUEState.value.subUEStatus[id]
   if (status === 'ready') return subUEState.value.subUECache[id]
   if (status === 'ongoing') return undefined // ongoing request
   subUEState.value.subUEStatus[id] = 'ongoing'
   app.service('sub_ue').findUnique({ where: { id }})
   .then(subUE => {
      subUEState.value.subUECache[id] = subUE
      subUEState.value.subUEStatus[id] = 'ready'
   })
   .catch(err => {
      console.log('subUEOfId err', id, err)
      subUEState.value.subUEStatus[id] = undefined
   })
})

export const createSubUE = async (ue_id, name) => {
   // get highest rank
   const result = await app.service('sub_ue').aggregate({
      where: { ue_id },
      _max: { rank: true }
   })
   const highestRank = result._max.rank
   const rank = highestRank ? highestRank + 1 : 1
   // create ue with this rank
   const subUE = await app.service('sub_ue').create({
      data: {
         name,
         rank,
         ue_id,
      }
   })
   // update cache
   subUEState.value.subUECache[subUE.id] = subUE
   return subUE
}

export const updateSubUE = async (id, data) => {
   const sub_ue = await app.service('sub_ue').update({
      where: { id },
      data,
   })
   // update cache
   subUEState.value.subUECache[id] = sub_ue
   subUEState.value.subUEStatus[id] = 'ready'
   return sub_ue
}

export const removeSubUE = async (id) => {
   await app.service('sub_ue').delete({ where: { id }})
   delete subUEState.value.subUECache[id]
}

export const getSubUEList = async (ue_id) => {
   if (subUEState.value.subUEListStatus[ue_id] === undefined) {
      subUEState.value.subUEListStatus[ue_id] = 'ongoing'
      try {
         const list = await app.service('sub_ue').findMany({
            where: { ue_id }
         })
         for (const subUE of list) {
            subUEState.value.subUECache[subUE.id] = subUE
            subUEState.value.subUEStatus[subUE.id] = 'ready'
         }
         subUEState.value.subUEListStatus[ue_id] = 'ready'
      } catch(err) {
         subUEState.value.subUEListStatus[ue_id] = undefined
         throw err
      }
   }
   return Object.values(subUEState.value.subUECache).filter(subUE => subUE.ue_id === ue_id).sort((e1, e2) => e1.rank - e2.rank)
}

export const listOfSubUEs = computed(() => (ue_id) => {
   if (subUEState.value.subUEListStatus[ue_id] === 'ready') {
      return Object.values(subUEState.value.subUECache).filter(subUE => subUE.ue_id === ue_id).sort((e1, e2) => e1.rank - e2.rank)
   }
   if (subUEState.value.subUEListStatus[ue_id] !== 'ongoing') {
      subUEState.value.subUEListStatus[ue_id] = 'ongoing'
      app.service('sub_ue').findMany({
         where: { ue_id }
      }).then(list => {
         for (const subUE of list) {
            subUEState.value.subUECache[subUE.id] = subUE
            subUEState.value.subUEStatus[subUE.id] = 'ready'
         }
         subUEState.value.subUEListStatus[ue_id] = 'ready'
      }).catch(err => {
         console.log('listOfSubUEs err', err)
         subUEState.value.subUEListStatus[ue_id] = undefined
      })
   }
   return []
})
