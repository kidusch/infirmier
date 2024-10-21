import { computed } from 'vue'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'
import { InAppPurchase } from 'jcb-capacitor-inapp'

import { app } from '/src/client-app.js'


const initialState = () => ({
   priceCache: {}
})

// TO-DELETE ?
const { data: subscriptionState } = useIDBKeyval('subscription-state', initialState(), { mergeDefaults: true })

export const resetUseSubscription = () => {
   subscriptionState.value = initialState()
}


export const SUBSCRIPTIONS = {
   standard_monthly: {
      title: "Abonnement standard mensuel",
      features: "Accès à tout le contenu",
      stripeProductId: import.meta.env.VITE_STRIPE_STANDARD_MONTHLY_SUBSCRIPTION_ID,
      // priceId: import.meta.env.VITE_STRIPE_STANDARD_MONTHLY_PRICE_ID,
   },
   standard_yearly: {
      title: "Abonnement standard annuel",
      features: "Accès à tout le contenu",
      stripeProductId: import.meta.env.VITE_STRIPE_STANDARD_YEARLY_SUBSCRIPTION_ID,
      // priceId: import.meta.env.VITE_STRIPE_STANDARD_YEARLY_PRICE_ID,
   },
   premium_monthly: {
      title: "Abonnement premium mensuel",
      features: "Accès à tout le contenu et coaching personnalisé",
      stripeProductId: import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY_SUBSCRIPTION_ID,
      // priceId: import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
   },
   premium_yearly: {
      title: "Abonnement premium annuel",
      features: "Accès à tout le contenu et coaching personnalisé",
      stripeProductId: import.meta.env.VITE_STRIPE_PREMIUM_YEARLY_SUBSCRIPTION_ID,
      // priceId: import.meta.env.VITE_STRIPE_PREMIUM_YEARLY_PRICE_ID,
   },
}

export const getSubscriptionPrices = async () => {
   const platform = Capacitor.getPlatform()
   const result = {}
   if (platform === 'ios' || platform === 'android') {
      for (const productId in SUBSCRIPTIONS) {
         const { price } = await InAppPurchase.getSubscriptionInfo({ productId })
         console.log('productId', productId, 'price', price)
         result[productId] = price
      }
   } else {
      console.log("TODO FOR STRIPE")
   }
   return result
}


//////////////////////     STRIPE      //////////////////////

export const getOrCreateStripeCustomer = async (id, paymentMethodId, customerEmail) => {
   const user = await getUser(id)
   let customerId = user.stripe_customer_id
   if (!customerId) {
      customerId = await app.service('stripe').createCustomer(paymentMethodId, customerEmail)
      await updateUser(id, {
         stripe_customer_id: customerId,
      })
   }
   return customerId
}

export const createStripeSubscription = async (id, customerId, priceId) => {
   const { clientSecret, subscriptionId, error } = await app.service('stripe').createSubscription(customerId, priceId)
   if (!error) {
      await updateUser(id, {
         stripe_subscription_id: subscriptionId,
      })
   }
   return { clientSecret, subscriptionId, error }
}

export const cancelStripeCustomerSubscriptions = async (id, customerId) => {
   const { error } = await app.service('stripe').cancelCustomerSubscriptions(customerId)
   if (!error) {
      await updateUser(id, {
         subscription_type: null,
         stripe_subscription_id: null,
         subscription_status: 'canceled',
      })
   }
   return { error }
}
