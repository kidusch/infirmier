import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'


// state backed in SessionStorage

const initialState = () => ({
   userCache: {},
   userStatus: {},
   userPromise: {},
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
   const status = userState.value.userStatus[id]
   if (status === 'ready') return userState.value.userCache[id]
   const promise = (status === 'ongoing') ?
      userState.value.userPromise[id] :
      app.service('user').findUnique({ where: { id }})
   try {
      const user = await promise
      userState.value.userCache[id] = user
      userState.value.userStatus[id] = 'ready'
      return user
   } catch(err) {
      userState.value.userStatus[id] = undefined
      userState.value.userPromise[id] = undefined
      throw err
   }
}


// const foodPromise = async (id) => {
//    const status = stateFoods.value.foodsStatus[id]
//    if (status === 'ready') return stateFoods.value.foods[id]
//    stateFoods.value.foodsStatus[id] = 'ongoing'
//    const food = await app.service('food').findUnique({ where: { id }})
//    stateFoods.value.foods[id] = food
//    stateFoods.value.foodsStatus[id] = 'ready'
//    return food
// }

// const foodOfId = computed(() => (id) => {
//    const status = stateFoods.value.foodsStatus[id]
//    if (status === 'ready') return stateFoods.value.foods[id]
//    if (status === 'ongoing') return undefined // ongoing request
//    stateFoods.value.foodsStatus[id] = 'ongoing'
//    app.service('food').findUnique({ where: { id }}).then(food => {
//       stateFoods.value.foods[id] = food
//       stateFoods.value.foodsStatus[id] = 'ready'
//    })
//    return undefined
// })
