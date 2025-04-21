import { computed } from 'vue'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'
import { InAppPurchase } from 'jcb-capacitor-inapp'
import { fromEvent, from, of, switchMap } from 'rxjs'

import { app } from '/src/client-app.js'


const initialState = () => ({
   userCache: {},
   userStatus: {},
   userListStatus: undefined,
   subscriptionTypeInfo: {},
   subscriptionTypeInfoStatus: {},
})

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

// InAppPurchase.addListener('billingReady', () => {
//    console.log("BILLING READY!!!")
// })

interface ProductInfo {
   name: string;          // subscription name (ex: "Abonnement standard")
   description: string;   // subscription features (ex: "Accès à tout le contenu + coaching personnalisé")
   price: string;         // formatted price (ex: "2,99 EUR")
   priceId: string;       // priceId (only for Stripe)
   period: string;        // formatted subscription period (ex: "mois")
}

// `subscriptionType`: 'standard_monthly', 'standard_yearly', 'premium_monthly', 'premium_yearly'
export async function productInfo$(subscriptionType) {
   const platform = Capacitor.getPlatform()
   if (platform === 'ios') {
      const productInfoPromise = InAppPurchase.getSubscriptionProductInfo({ productId: subscriptionType })
      return from(productInfoPromise)
   } else if (platform === 'android') {
      const productInfoPromise = InAppPurchase.getSubscriptionProductInfo({ productId: subscriptionType })
      // wait for 'billingReady' event (specific to Android), then switch to promise
      return fromEvent(InAppPurchase, 'billingReady').pipe(
         switchMap(_ => from(productInfoPromise))
      )
   } else {
      // on Stripe, the product id must be obtained from `subscriptionType`
      const productId = await app.service('stripe').getProductIdFromSubscriptionType(subscriptionType)
      const stripeProductInfo = await app.service('stripe').getSubscriptionProductInfo(productId)
      const priceInfo = await app.service('stripe').getPriceInfo(stripeProductInfo.default_price)
      const price = (priceInfo.unit_amount / 100).toFixed(2) + " " + priceInfo.currency.toUpperCase()
      const period = { 'month': 'mois', 'year': 'an' }[priceInfo?.recurring?.interval]
      return of({
         name: stripeProductInfo.name,
         description: stripeProductInfo.description,
         priceId: priceInfo.id,
         price,
         period,
      })
   }
}





// return {
//    name: subscription name (ex: "Abonnement standard")
//    description: subscription features (ex: "Accès à tout le contenu + coaching personnalisé")
//    price : formatted price (ex: "2,99 EUR")
//    priceId (only for Stripe)
//    period: formatted subscription period (ex: "mois")
// }
export const infoOfSubscriptionProduct = computed(() => (subscriptionType) => {
   if (!userState.value) return {}
   const status = userState.value.subscriptionTypeInfoStatus[subscriptionType]
   if (status === 'ready') return userState.value.subscriptionTypeInfo[subscriptionType]
   if (status === 'ongoing') return undefined
   userState.value.subscriptionTypeInfoStatus[subscriptionType] = 'ongoing'
   const platform = Capacitor.getPlatform()
   if (platform === 'ios' || platform === 'android') {
      InAppPurchase.getSubscriptionProductInfo({ productId: subscriptionType }).then(productInfo => {
         console.log('productInfo', productInfo)
         userState.value.subscriptionTypeInfo[subscriptionType] = productInfo
         userState.value.subscriptionTypeInfoStatus[subscriptionType] = 'ready'
      })
   } else {
      let productInfo_
      app.service('stripe').getProductIdFromSubscriptionType(subscriptionType)
      .then(productId => {
         console.log('productId', productId)
         return app.service('stripe').getSubscriptionProductInfo(productId)
      })
      .then(productInfo => {
         productInfo_ = productInfo
         console.log('productInfo', productInfo)
         return app.service('stripe').getPriceInfo(productInfo.default_price)
      })
      .then(priceInfo => {
         console.log('priceInfo', priceInfo)
         const price = (priceInfo.unit_amount / 100).toFixed(2) + " " + priceInfo.currency.toUpperCase()
         const period = { 'month': 'mois', 'year': 'an' }[priceInfo?.recurring?.interval]
         userState.value.subscriptionTypeInfo[subscriptionType] = {
            name: productInfo_.name,
            description: productInfo_.description,
            priceId: priceInfo.id, // only for Stripe
            price,
            period,
         }
         userState.value.subscriptionTypeInfoStatus[subscriptionType] = 'ready'
      })
   }
})

// return active (= existing, not expired) subscription
// undefined,  null, 'standard_monthly', 'standard_yearly', 'premium_monthly', 'premium_yearly'
export const subscriptionOfUser = computed(() => (id) => {
   const user = userOfId.value(id)
   if (!user) return undefined
   if (!user.subscription_status) return null // no subscription (null), or a subscription has been made, but is no longer active (false)
   if (user.subscription_status !== 'active') return null // a subscription has been made, but is no longer active (false)
   return user.subscription_type
})

// has an active subscription
export const hasSubscription = computed(() => (id) => {
   const subscriptionType = subscriptionOfUser.value(id)
   return !!subscriptionType
})

// has an active, premium subscription
export const hasPremiumSubscription = computed(() => (id) => {
   const subscriptionType = subscriptionOfUser.value(id)
   if (!subscriptionType) return false
   return subscriptionType.startsWith('premium')
})

// has an active, standard subscription
export const hasStandardSubscription = computed(() => (id) => {
   const subscriptionType = subscriptionOfUser.value(id)
   if (!subscriptionType) return false
   return subscriptionType.startsWith('standard')
})

export const buyStoreSubscription = async (id, subscriptionType, platform) => {
   const { status: subscriptionStatus } = await InAppPurchase.buySubscription({ productId: subscriptionType })
   await updateUser(id, {
      subscription_type: subscriptionType,
      subscription_status: subscriptionStatus,
      subscription_platform: platform,
   })
   return { subscriptionType, subscriptionStatus }
}

export const getSubscriptionStatus = async (id) => {
   let user = await getUser(id)
   // ask info to stores
   const platform = Capacitor.getPlatform()
   if (platform === 'ios' || platform === 'android') {
      console.log("checking...")
      const { productId, status: subscriptionStatus } = await InAppPurchase.checkSubscription()
      console.log("subscriptionStatus", productId, subscriptionStatus)
      if (productId) {
         // replace cache info by Store info
         user = await updateUser(id, {
            subscription_type: productId,
            subscription_status: subscriptionStatus,
         })
      } else {
         if (user.subscription_type) {
            console.log("shouldn't happen: keeping cache info")
         }
      }
   } else {
      // ask stripe the subscriptions for stripe_customer_id
      if (user.stripe_customer_id) {
         const subscriptions = await app.service('stripe').customerActiveSubscriptions(user.stripe_customer_id)
         console.log('subscriptions', subscriptions)
         if (subscriptions.length > 0) {
            // replace cache info by Stripe info
            const subscription = subscriptions[0]
            const productId = subscription.plan.product
            // const subscriptionType = productId2subscriptionType(productId)
            const subscriptionType = await app.service('stripe').getSubscriptionTypeFromProductId(productId)
            user = await updateUser(id, {
               subscription_type: subscriptionType,
               subscription_status: subscription.status,
               stripe_subscription_id: subscription.id,
            })
         }
      }
   }

   // return cache info
   return {
      subscriptionType: user.subscription_type,
      subscriptionStatus: user.subscription_status,
   }
}


export const getStripePublicKey = async () => {
   return await app.service('stripe').getStripePublicKey()
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
