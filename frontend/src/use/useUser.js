import { computed } from 'vue'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'
import { InAppPurchase } from 'jcb-capacitor-inapp'

import { app } from '/src/client-app.js'


// state backed in SessionStorage

const initialState = () => ({
   userCache: {},
   userStatus: {},
   userListStatus: undefined,
})

// const userState = useSessionStorage('user-state', initialState(), { mergeDefaults: true })
const { data: userState } = useIDBKeyval('user-state', initialState(), { mergeDefaults: true })

export const resetUseUser = () => {
   userState.value = initialState()
}


app.service('user').on('create', user => {
   if (!userState.value) return
   console.log('USER EVENT created', user)
   userState.value.userCache[user.id] = user
   userState.value.userStatus[user.id] = 'ready'
})

app.service('user').on('update', user => {
   if (!userState.value) return
   console.log('USER EVENT update', user)
   userState.value.userCache[user.id] = user
   userState.value.userStatus[user.id] = 'ready'
})

app.service('user').on('delete', user => {
   if (!userState.value) return
   console.log('USER EVENT delete', user)
   delete userState.value.userCache[user.id]
   delete userState.value.userStatus[user.id]
})


export const getUser = async (id) => {
   if (!userState.value) return
   if (!userState.value) return undefined
   let user = userState.value.userCache[id]
   if (user) return user
   user = await app.service('user').findUnique({ where: { id }})
   userState.value.userCache[id] = user
   userState.value.userStatus[id] = 'ready'
   return user
}

export const userOfId = computed(() => id => {
   if (!userState.value) return undefined
   const status = userState.value?.userStatus[id]
   if (status === 'ready') return userState.value.userCache[id]
   if (status === 'ongoing') return undefined // ongoing request
   userState.value.userStatus[id] = 'ongoing'
   app.service('user').findUnique({ where: { id }})
   .then(user => {
      userState.value.userCache[id] = user
      userState.value.userStatus[id] = 'ready'
   })
   .catch(err => {
      console.log('userOfId err', id, err)
      delete userState.value.userStatus[id]
   })
})

export const updateUser = async (id, data) => {
   const user = await app.service('user').update({
      where: { id },
      data,
   })
   // update cache
   userState.value.userCache[id] = user
   userState.value.userStatus[id] = 'ready'
   return user
}

export const listOfUser = computed(() => {
   if (!userState.value) return []
   if (userState.value.userListStatus === 'ready') {
      return Object.values(userState.value.userCache).sort((e1, e2) => e1.rank - e2.rank)
   }
   if (userState.value.userListStatus !== 'ongoing') {
      userState.value.userListStatus = 'ongoing'
      app.service('user').findMany({})
      .then(list => {
         for (const user of list) {
            userState.value.userCache[user.id] = user
            userState.value.userStatus[user.id] = 'ready'
         }
         userState.value.userListStatus = 'ready'
      }).catch(err => {
         console.log('listOfUser err', err)
         delete userState.value.userListStatus
      })
   }
   return []
})

//////////////////           SUBSCRIPTION           //////////////////

export const buyProduct = async (id, productId) => {
   const { revocationDate, expirationDate, active } = await InAppPurchase.buyProduct({ productId })
   await updateUser(id, {
      product_id: productId,
      revocation_date: revocationDate,
      expiration_date: expirationDate,
      active,
   })
   return { productId, revocationDate, expirationDate, active }
}

export const updateSubscriptionInfo = async (id) => {
   // ask info to stores
   const platform = Capacitor.getPlatform()
   if (platform === 'ios' || platform === 'android') {
      console.log("checking...")
      const { productId, revocationDate, expirationDate, active } = await InAppPurchase.checkSubscription()
      console.log("info", productId, revocationDate, expirationDate, active)
      if (productId) {
         // update cache info
         updateUser(id, {
            product_id: productId,
            revocation_date: revocationDate,
            expiration_date: expirationDate,
            active,
         })
      } else {
         if (userState.value.productId) {
            console.log("shouldn't happen: keeping cache info")
         }
      }
   } else {
      // ask stripe
   }

   // return cache info
   return {
      productId: userState.value.productId,
      revocationDate: userState.value.revocationDate, 
      expirationDate: userState.value.expirationDate,
      active: userState.value.active,
   }
}

// undefined,  null, 'standard_monthly', 'standard_yearly', 'premium_monthly', 'premium_yearly'
export const subscriptionOfUser = computed(() => (id) => {
   const user = userOfId.value(id)
   if (!user.value) return undefined
   if (!user.value.active) return null // no subscription (null), or a subscription has been made, but is no longer active (false)
   return user.value.product_id
})

