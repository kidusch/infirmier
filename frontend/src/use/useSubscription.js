
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'
import { Capacitor } from '@capacitor/core'
import { InAppPurchase } from 'jcb-capacitor-inapp'

import { app } from '/src/client-app.js'


// state backed in IndexedDB
const initialState = () => ({
   standardMonthly: false,
   standardYearly: false,
   premiumMonthly: false,
   premiumYearly: false,
})

export const { data: subscriptionState } = useIDBKeyval('subscription-state', initialState(), { mergeDefaults: true })

export const resetUseSubscriptonState = () => {
   subscriptionState.value = initialState()
}
