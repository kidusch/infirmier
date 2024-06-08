import { useSessionStorage } from '@vueuse/core'

import { app } from '/src/client-app.js'


// state backed in SessionStorage

const initialState = () => ({
   userCache: {},
})

const key = 'user-state'
const userState = useSessionStorage(key, initialState())

export const resetUseUser = () => {
   // userState.value = initialState()
   sessionStorage.removeItem(key)
}


app.service('user').on('create', user => {
   console.log('USER EVENT created', user)
   userState.value.userCache[user.id] = user
})

app.service('user').on('update', user => {
   console.log('USER EVENT update', user)
   userState.value.userCache[user.id] = user
})

app.service('user').on('delete', user => {
   console.log('USER EVENT delete', user)
   delete userState.value.userCache[user.id]
})


export const getUser = async (id) => {
   let user = userState.value.userCache[id]
   if (user) return user
   console.log('!!!! getUser')
   user = await app.service('user').findUnique({ where: { id }})
   userState.value.userCache[id] = user
   return user
}
