
import { computed } from 'vue'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'
import { Capacitor } from '@capacitor/core'
import { InAppPurchase } from 'jcb-capacitor-inapp'

import { app } from '/src/client-app.js'


// state backed in IndexedDB
const initialState = () => ({
   productId: undefined,
   revocationDate: undefined,
   expirationDate: undefined,
   active: undefined,
})

export const { data: subscriptionState } = useIDBKeyval('subscription-state', initialState(), { mergeDefaults: true })

export const resetUseSubscriptonState = () => {
   subscriptionState.value = initialState()
}


export const buyProduct = async (productId) => {
   const { revocationDate, expirationDate, active } = await InAppPurchase.buyProduct({ productId })
}


export const subscriptionInfo = computed(() => {
   if (!subscriptionState.value) return undefined

   // ask info to stores
   const platform = Capacitor.getPlatform()
   if (platform === 'ios' || platform === 'android') {
      console.log("checking...")
      InAppPurchase.checkSubscription().then(({ productId, revocationDate, expirationDate, active }) => {
         console.log("info", productId, revocationDate, expirationDate, active)
         if (productId) {
            // store info replaces cache info
            subscriptionState.value.productId = productId
            subscriptionState.value.revocationDate = revocationDate
            subscriptionState.value.expirationDate = expirationDate
            subscriptionState.value.active = active
         } else {
            if (subscriptionState.value.productId) {
               console.log("shouldn't happen: keep cache info")
            }
         }
      })
   } else {
      // ask stripe
   }

   // return cache info
   return {
      productId: subscriptionState.value.productId,
      revocationDate: subscriptionState.value.revocationDate, 
      expirationDate: subscriptionState.value.expirationDate,
      active: subscriptionState.value.active,
   }
})
