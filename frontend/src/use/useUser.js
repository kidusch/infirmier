import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'


// state backed in SessionStorage

const initialState = () => ({
   userCache: {},
})
 
const userState = useSessionStorage('user-state', initialState())

export const resetUseUser = () => {
   userState.value = initialState()
}


app.service('user').on('create', user => {
   console.log('USER EVENT created', user)
   userState.value.userCache[user.id] = user
})


export const getUser = async (id) => {
   const user = userState.value.userCache[id]
   if (user) return user
   const promise = app.service('user').findUnique({ where: { id }})
   promise.then(user => {
      userState.value.userCache[id] = user
   })
   return promise
}

