// https://vueuse.org/integrations/useIDBKeyval/

import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'

import { app } from '/src/client-app.js'


// state backed in SessionStorage
const initialState = () => ({
   lexiconCache: {},
   lexiconStatus: {},
   lexiconListStatus: undefined,
})

// const lexiconState = useSessionStorage('lexicon-state', initialState(), { mergeDefaults: true })
const { data: lexiconState } = useIDBKeyval('lexicon-state', initialState(), { mergeDefaults: true })


export const resetUseLexicon = () => {
   // lexiconState.value = null
}


app.service('lexicon').on('create', lexicon => {
   console.log('LEXICON EVENT created', lexicon)
   lexiconState.value.lexiconCache[lexicon.id] = lexicon
   lexiconState.value.lexiconStatus[lexicon.id] = 'ready'
})

app.service('lexicon').on('update', lexicon => {
   console.log('LEXICON EVENT update', lexicon)
   lexiconState.value.lexiconCache[lexicon.id] = lexicon
   lexiconState.value.lexiconStatus[lexicon.id] = 'ready'
})

app.service('lexicon').on('delete', lexicon => {
   console.log('LEXICON EVENT delete', lexicon)
   delete lexiconState.value.lexiconCache[lexicon.id]
   delete lexiconState.value.lexiconStatus[lexicon.id]
})


export const getLexicon = async (id) => {
   let lexicon = lexiconState.value.lexiconCache[id]
   if (lexicon) return lexicon
   lexicon = await app.service('lexicon').findUnique({ where: { id }})
   lexiconState.value.lexiconCache[id] = lexicon
   lexiconState.value.lexiconStatus[id] = 'ready'
   return lexicon
}

export const lexiconOfId = computed(() => id => {
   const status = lexiconState.value.lexiconStatus[id]
   if (status === 'ready') return lexiconState.value.lexiconCache[id]
   if (status === 'ongoing') return undefined // ongoing request
   lexiconState.value.lexiconStatus[id] = 'ongoing'
   app.service('lexicon').findUnique({ where: { id }})
   .then(lexicon => {
      lexiconState.value.lexiconCache[id] = lexicon
      lexiconState.value.lexiconStatus[id] = 'ready'
   })
   .catch(err => {
      console.log('lexiconOfId err', id, err)
      delete lexiconState.value.lexiconStatus[id]
   })
})

export const createLexicon = async (french_word) => {
   const lexicon = await app.service('lexicon').create({
      data: {
         french_word,
      }
   })
   // update cache
   lexiconState.value.lexiconCache[lexicon.id] = lexicon
   lexiconState.value.lexiconStatus[lexicon.id] = 'ready'
   return lexicon
}

export const updateLexicon = async (id, data) => {
   const lexicon = await app.service('lexicon').update({
      where: { id },
      data,
   })
   // update cache
   lexiconState.value.lexiconCache[id] = lexicon
   lexiconState.value.lexiconStatus[id] = 'ready'
   return lexicon
}

export const removeLexicon = async (id) => {
   await app.service('lexicon').delete({ where: { id }})
   delete lexiconState.value.lexiconCache[id]
   delete lexiconState.value.lexiconStatus[id]
}

export const listOfLexicon = computed(() => {
   if (lexiconState.value.lexiconListStatus === 'ready') {
      return Object.values(lexiconState.value.lexiconCache).sort((e1, e2) => (e1.french_word > e2.french_word ? 1 : e1.french_word < e2.french_word ? -1 : 0 ))
   }
   if (lexiconState.value.lexiconListStatus !== 'ongoing') {
      lexiconState.value.lexiconListStatus = 'ongoing'
      app.service('lexicon').findMany({}).then((list) => {
         for (const lexicon of list) {
            lexiconState.value.lexiconCache[lexicon.id] = lexicon
            lexiconState.value.lexiconStatus[lexicon.id] = 'ready'
         }
         lexiconState.value.lexiconListStatus = 'ready'
      })
   }
   return []
})
