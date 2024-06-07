import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   subUECache: {},
   subUEListStatus: {},
})

const key = 'sub-ue-state'
const subUEState = useSessionStorage(key, initialState())

export const resetUseSubUE = () => {
   // subUEState.value = initialState()
   sessionStorage.removeItem(key)
}


app.service('sub_ue').on('create', subUE => {
   console.log('SUB_UE EVENT created', subUE)
   subUEState.value.subUECache[subUE.id] = subUE
})


export const getSubUE = async (id) => {
   let ue = subUEState.value.subUECache[id]
   if (ue) return ue
   ue = await app.service('sub_ue').findUnique({ where: { id }})
   subUEState.value.subUECache[id] = ue
   return ue
}

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
   subUEState.value.subUECache[sub_ue.id] = sub_ue
   return sub_ue
}

export const removeSubUE = async (id) => {
   await app.service('sub_ue').delete({ where: { id }})
   delete subUEState.value.subUECache[id]
}

export const getSubUEList = async (ue_id) => {
   if (subUEState.value.subUEListStatus[ue_id] === 'ready') {
      return Object.values(subUEState.value.subUECache).filter(subUE => subUE.ue_id === ue_id).sort((e1, e2) => e1.rank - e2.rank)
   }
   // subUEState.value.subUEListStatus[ue_id] = 'ongoing'
   // try {
      const list = await app.service('sub_ue').findMany({
         where: { ue_id }
      })
      for (const subUE of list) {
         subUEState.value.subUECache[subUE.id] = subUE
      }
      subUEState.value.subUEListStatus[ue_id] = 'ready'
      return list
   // } catch(err) {
   //    subUEState.value.subUEListStatus[ue_id] = undefined
   //    throw err
   // }
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
         }
         subUEState.value.subUEListStatus[ue_id] = 'ready'
      }).catch(err => {
         console.log('listOfSubUEs err', err)
         subUEState.value.subUEListStatus[ue_id] = undefined
      })
   }
   return []
})
