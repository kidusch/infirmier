import { InAppPurchase } from 'jcb-capacitor-inapp'

import { app } from '/src/client-app.js'


const SUBSCRIPTION_TYPES = ['standard_monthly', 'standard_yearly', 'premium_monthly', 'premium_yearly']


export const getSubscriptionInfo = async () => {
   const platform = Capacitor.getPlatform()
   const result = {}
   for (const subscriptionType of SUBSCRIPTION_TYPES) {
      if (platform === 'ios' || platform === 'android') {
         const subscriptionInfo = await InAppPurchase.getSubscriptionInfo({ productId: subscriptionType })
         result[subscriptionType] = subscriptionInfo
      } else {
         const stripeInfo = STRIPE_SUBSCRIPTIONS[subscriptionType]
         const priceInfo = await app.service('stripe').getPriceInfo(stripeInfo.priceId)
         const price = (priceInfo.unit_amount / 100).toFixed(2) + " " + priceInfo.currency.toUpperCase()
         const period = { 'month': 'mois', 'year': 'an' }[priceInfo?.recurring?.interval]
         result[subscriptionType] = {
            price,
            period,
            ...stripeInfo
         }
      }
   }
   return result
}


//////////////////////     STRIPE      //////////////////////

export const STRIPE_SUBSCRIPTIONS = {
   standard_monthly: {
      name: "Abonnement standard mensuel",
      description: "Accès à tout le contenu",
      period: "mois",
      productId: import.meta.env.VITE_STRIPE_STANDARD_MONTHLY_SUBSCRIPTION_ID,
      priceId: import.meta.env.VITE_STRIPE_STANDARD_MONTHLY_PRICE_ID,
   },
   standard_yearly: {
      name: "Abonnement standard annuel",
      description: "Accès à tout le contenu",
      period: "an",
      productId: import.meta.env.VITE_STRIPE_STANDARD_YEARLY_SUBSCRIPTION_ID,
      priceId: import.meta.env.VITE_STRIPE_STANDARD_YEARLY_PRICE_ID,
   },
   premium_monthly: {
      name: "Abonnement premium mensuel",
      description: "Accès à tout le contenu et coaching personnalisé",
      period: "mois",
      productId: import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY_SUBSCRIPTION_ID,
      priceId: import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
   },
   premium_yearly: {
      name: "Abonnement premium annuel",
      description: "Accès à tout le contenu et coaching personnalisé",
      period: "an",
      productId: import.meta.env.VITE_STRIPE_PREMIUM_YEARLY_SUBSCRIPTION_ID,
      priceId: import.meta.env.VITE_STRIPE_PREMIUM_YEARLY_PRICE_ID,
   },
}

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
