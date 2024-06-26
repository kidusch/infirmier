import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage

const initialState = () => ({
   userCache: {},
   userStatus: {},
   userListStatus: undefined,
})

const userState = useSessionStorage('user-state', initialState(), { mergeDefaults: true })

export const resetUseUser = () => {
   userState.value = null
}


app.service('user').on('create', user => {
   console.log('USER EVENT created', user)
   userState.value.userCache[user.id] = user
   userState.value.userStatus[user.id] = 'ready'
})

app.service('user').on('update', user => {
   console.log('USER EVENT update', user)
   userState.value.userCache[user.id] = user
   userState.value.userStatus[user.id] = 'ready'
})

app.service('user').on('delete', user => {
   console.log('USER EVENT delete', user)
   delete userState.value.userCache[user.id]
   delete userState.value.userStatus[user.id]
})


export const getUser = async (id) => {
   let user = userState.value.userCache[id]
   if (user) return user
   user = await app.service('user').findUnique({ where: { id }})
   userState.value.userCache[id] = user
   userState.value.userStatus[id] = 'ready'
   return user
}

export const userOfId = computed(() => id => {
   const status = userState.value.userStatus[id]
   if (status === 'ready') return userState.value.userCache[id]
   if (status === 'ongoing') return undefined // ongoing request
   userState.value.userStatus[id] = 'ongoing'
   app.service('user').findUnique({ where: { id }})
   .then(ue => {
      userState.value.userCache[id] = ue
      userState.value.userStatus[id] = 'ready'
   })
   .catch(err => {
      console.log('userOfId err', id, err)
      delete userState.value.userStatus[id]
   })
})
