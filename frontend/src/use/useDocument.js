import { computed } from 'vue'
// import { useSessionStorage } from '@vueuse/core'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   documentCache: {},
   documentStatus: {},
   documentListStatus: undefined,
})

// const documentState = useSessionStorage('document-state', initialState(), { mergeDefaults: true })
const { data: documentState } = useIDBKeyval('document-state', initialState(), { mergeDefaults: true })

export const resetUseDocument = () => {
   documentState.value = initialState()
}


app.service('document').on('create', document => {
   console.log('DOCUMENT EVENT created', document)
   documentState.value.documentCache[document.id] = document
   documentState.value.documentStatus[document.id] = 'ready'
})

app.service('document').on('update', document => {
   console.log('DOCUMENT EVENT update', document)
   documentState.value.documentCache[document.id] = document
})

app.service('document').on('delete', document => {
   console.log('DOCUMENT EVENT delete', document)
   delete documentState.value.documentCache[document.id]
})


export const getDocument = async (id) => {
   let document = documentState.value.documentCache[id]
   if (document) return document
   document = await app.service('document').findUnique({ where: { id }})
   documentState.value.documentCache[id] = document
   documentState.value.documentStatus[id] = 'ready'
   return document
}

export const documentOfId = computed(() => id => {
   const status = documentState.value.documentStatus[id]
   if (status === 'ready') return documentState.value.documentCache[id]
   if (status === 'ongoing') return undefined // ongoing request
   documentState.value.documentStatus[id] = 'ongoing'
   app.service('document').findUnique({ where: { id }})
   .then(document => {
      documentState.value.documentCache[id] = document
      documentState.value.documentStatus[id] = 'ready'
   })
   .catch(err => {
      console.log('documentOfId err', id, err)
      delete documentState.value.documentStatus[id]
   })
})

export const createDocument = async (title) => {
   // get highest rank
   const result = await app.service('document').aggregate({
      _max: { rank: true }
   })
   const highestRank = result._max.rank
   const rank = highestRank ? highestRank + 1 : 1
   // create document with this rank
   const document = await app.service('document').create({
      data: {
         title,
         rank,
      }
   })
   // update cache
   documentState.value.documentCache[document.id] = document
   documentState.value.documentStatus[document.id] = 'ready'
   return document
}

export const updateDocument = async (id, data) => {
   const document = await app.service('document').update({
      where: { id },
      data,
   })
   // update cache
   documentState.value.documentCache[id] = document
   documentState.value.documentStatus[id] = 'ready'
   return document
}

export const removeDocument = async (id) => {
   await app.service('document').delete({ where: { id }})
   delete documentState.value.documentCache[id]
}

// export const getDocumentList = async () => {
//    if (!documentState.value.isListReady) {
//       const list = await app.service('document').findMany()
//       for (const document of list) {
//          documentState.value.documentCache[document.id] = document
//          documentState.value.documentStatus[document.id] = 'ready'
//       }
//       documentState.value.isListReady = true
//    }
//    return Object.values(documentState.value.documentCache).sort((e1, e2) => e1.rank - e2.rank)
// }

export const listOfDocument = computed(() => {
   if (documentState.value.documentListStatus === 'ready') {
      return Object.values(documentState.value.documentCache).sort((e1, e2) => e1.rank - e2.rank)
   }
   if (documentState.value.documentListStatus !== 'ongoing') {
      documentState.value.documentListStatus = 'ongoing'
      app.service('document').findMany({})
      .then(list => {
         for (const document of list) {
            documentState.value.documentCache[document.id] = document
            documentState.value.documentStatus[document.id] = 'ready'
         }
         documentState.value.documentListStatus = 'ready'
      }).catch(err => {
         console.log('listOfDocument err', err)
         documentState.value.documentListStatus = undefined
      })
   }
   return []
})

export const isDocumentTabVisible = computed(() => listOfDocument.value.some(document => !document.hidden))
