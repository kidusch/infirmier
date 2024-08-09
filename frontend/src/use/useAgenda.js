import { computed } from 'vue'
// import { useSessionStorage } from '@vueuse/core'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'

import { app } from '/src/client-app.js'


// state backed in SessionStorage

const initialState = () => ({
   agendaCache: {},
   agendaStatus: {},
   agendaListStatus: {},
})

// const agendaState = useSessionStorage('agenda-state', initialState(), { mergeDefaults: true })
export const { data: agendaState } = useIDBKeyval('agenda-state', initialState(), { mergeDefaults: true })

export const resetUseAgenda = () => {
   agendaState.value = initialState()
}


app.service('agenda').on('create', agenda => {
   if (!agendaState.value) return
   console.log('AGENDA EVENT created', agenda)
   agendaState.value.agendaCache[agenda.id] = agenda
   agendaState.value.agendaStatus[agenda.id] = 'ready'
})

app.service('agenda').on('update', agenda => {
   if (!agendaState.value) return
   console.log('AGENDA EVENT update', agenda)
   agendaState.value.agendaCache[agenda.id] = agenda
   agendaState.value.agendaStatus[agenda.id] = 'ready'
})

app.service('agenda').on('delete', agenda => {
   if (!agendaState.value) return
   console.log('AGENDA EVENT delete', agenda)
   delete agendaState.value.agendaCache[agenda.id]
   delete agendaState.value.agendaStatus[agenda.id]
})


export const createAgenda = async (user_id, title, start, end) => {
   const agenda = await app.service('agenda').create({
      data: {
         user_id, title, start, end
      }
   })
   agendaState.value.agendaCache[agenda.id] = agenda
   agendaState.value.agendaStatus[agenda.id] = 'ready'
   return agenda
}

export const updateAgenda = async (id, data) => {
   const agenda = await app.service('agenda').update({
      where: { id },
      data,
   })
   // update cache
   agendaState.value.agendaCache[id] = agenda
   agendaState.value.agendaStatus[id] = 'ready'
   return agenda
}

export const deleteAgenda = async (id) => {
   await app.service('agenda').delete({ where: { id }})
   delete agendaState.value.agendaCache[id]
   delete agendaState.value.agendaStatus[id]
}

// export const agendaOfId = computed(() => id => {
//    const status = agendaState.value?.agendaStatus[id]
//    if (status === 'ready') return agendaState.value.agendaCache[id]
//    if (status === 'ongoing') return undefined // ongoing request
//    agendaState.value.agendaStatus[id] = 'ongoing'
//    app.service('agenda').findUnique({ where: { id }})
//    .then(ue => {
//       agendaState.value.agendaCache[id] = ue
//       agendaState.value.agendaStatus[id] = 'ready'
//    })
//    .catch(err => {
//       console.log('agendaOfId err', id, err)
//       delete agendaState.value.agendaStatus[id]
//    })
// })

export const userListOfAgenda = computed(() => (user_id) => {
   if (!agendaState.value) return []
   if (agendaState.value.agendaListStatus[user_id] === 'ready') {
      return Object.values(agendaState.value.agendaCache).filter(agenda => agenda.user_id === user_id).sort((e1, e2) => e1.rank - e2.rank)
   }
   if (agendaState.value.agendaListStatus[user_id] !== 'ongoing') {
      agendaState.value.agendaListStatus[user_id] = 'ongoing'
      app.service('agenda').findMany({})
      .then(list => {
         for (const agenda of list) {
            agendaState.value.agendaCache[agenda.id] = agenda
            agendaState.value.agendaStatus[agenda.id] = 'ready'
         }
         agendaState.value.agendaListStatus[user_id] = 'ready'
      }).catch(err => {
         console.log('listOfAgenda err', err)
         delete agendaState.value.agendaListStatus[user_id]
      })
   }
   return []
})
