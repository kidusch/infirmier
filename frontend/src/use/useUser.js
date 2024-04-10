import { computed, ref } from "vue"

import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'


// state backed in SessionStorage

const initialState = () => {
    return {
       userCache: null,
    }
 }
 
const userState = useSessionStorage('user-state', {})

const resetUseUsers = () => {
    userState.value = initialState()
}


app.service('user').on('create', user => {
   console.log('USER EVENT created', user)
   userState.value.userCache[user.id] = user
})


const getUser = async (id) => {
    const user = userState.value.userCache[id]
    if (user) return user
    const promise = app.service('user').findUnique({ where: { id }})
    promise
    .then(user => {
        userState.value.userCache[id] = user
    })
    return promise
}


export const useUsers = () => {
    return {
        resetUseUsers,
        getUser,
    }
}
