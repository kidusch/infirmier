<template>
   <main class="container max-w-7xl">

      <header class="chapter-card mb-2">
         <p>
            <span>Gestion des abonnements</span>
         </p>
      </header>

      <main class="mt-4 max-w-xl">

         <section class="grid grid-cols-2 grid-flow-rows gap-4">
            <template v-for="productId of PRODUCT_ID_LIST">
               <div class="rounded-lg border-2 text-center p-6 hover:bg-gray-200" :class="{ 'box': user?.subscription_type === productId }"
                  @click="buySubscription(productId)">
                  <div class="cursor-pointer text-lg text-gray-600">{{ productInfoDict[productId]?.name }}</div>
                  <div class="cursor-pointer text-sm text-gray-400">{{ productInfoDict[productId]?.description }}</div>
                  <div class="cursor-pointer text-xl text-gray-600 font-semibold">{{ productInfoDict[productId]?.price }}
                     <span class="text-lg font-normal text-gray-400"> / {{ productInfoDict[productId]?.period }}</span>
                  </div>
               </div>
            </template>
         </section>

         <div class="my-8" v-show="stripeSubscriptionChoice">
            <div class="text-lg">{{ productInfoDict[stripeSubscriptionChoice]?.title }}</div>
            <div class="text-sm">Le montant sera prélevé immédiatement, puis à chaque échéance.</div>
            <div class="text-sm">Vous pourrez à tout moment arrêter l'abonnement en cours.</div>

            <form id="subscription-form" @submit.prevent="handleStripeSubmit">

               <div id="card-element" class="rounded-lg border-gray-300 border-2 p-3 my-2"></div>

               <button :disabled="loading" type="submit" class="primary-btn my-2">
                  {{ loading ? 'En cours...' : 'Valider le paiement' }}
               </button>
               <div class="text-red-600">
                  {{ errorMessage }}
               </div>
            </form>
         </div>

         <div class="my-2">
            <button v-if="user?.subscription_status === 'active'" class="link" @click="cancelCustomerSubscriptions">
               Résilier l'abonnement en cours...
            </button>
         </div>

      </main>

   </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'

import { getUser, userOfId, updateUser,
   getStripePublicKey, buyStoreSubscription, getOrCreateStripeCustomer, createStripeSubscription, cancelStripeCustomerSubscriptions } from '/src/use/useUser.ts'
import { productInfo$, updateUserSubscriptionStatus } from '/src/use/useUser.ts'
import { appState } from '/src/use/useAppState'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const PRODUCT_ID_LIST = ['standard_monthly', 'standard_yearly', 'premium_monthly', 'premium_yearly']

const user = computed(() => userOfId.value(props.userid))

const errorMessage = ref('')
const productInfoDict = ref({})

const stripe = ref(null)
const cardElement = ref(null)
const stripeSubscriptionChoice = ref()
const loading = ref(false)

let subscriptions = []

onMounted(async () => {
   try {
      appState.value.spinnerWaitingText = [ "Chargement..." ]

      user.value = await getUser(props.userid)

      // get subscription product info
      for (const subscriptionType of PRODUCT_ID_LIST) {
         const observable = await productInfo$(subscriptionType)
         const subscription = observable.subscribe(info => {
            console.log('productInfo$', subscriptionType, info)
            productInfoDict.value[subscriptionType] = info
         })
         subscriptions.push(subscription)
      }

      updateUserSubscriptionStatus(props.userid)

      if (Capacitor.getPlatform() === 'web') {
         // Load Stripe.js
         const stripePublicKey = await getStripePublicKey()
         console.log('stripePublicKey', stripePublicKey)
         stripe.value = await loadStripe(stripePublicKey)
         // Create an instance of Elements
         const elements = stripe.value.elements()

         // Create and mount the Card Element
         cardElement.value = elements.create('card', {
            hidePostalCode: true,
            // see: https://docs.stripe.com/payments/payment-element#affichage
            style: {
               base: {
                  color: '#32325d',
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  fontSize: '16px',
                  fontWeight: '500',
                  letterSpacing: '0.025em',
                  lineHeight: '24px',
                  padding: '10px',
                  '::placeholder': {
                     color: '#aab7c4',
                  },
                  border: '1px solid #ccc',
                  borderRadius: '4px',
               },
               invalid: {
                  iconColor: '#FFC7EE',
                  color: '#FFC7EE',
               },
            }
         })
         cardElement.value.mount('#card-element')
      }

   } catch(err) {
      console.log('err', err)
      errorMessage.value = err.toString()
   } finally {
      appState.value.spinnerWaitingText = null
   }
})

onUnmounted(() => {
   subscriptions.forEach(s => s && s.unsubscribe())
})

const buySubscription = async (subscriptionType) => {
   if (user.value?.subscription_type === subscriptionType) {
      alert("Vous avez déjà souscrit à cet abonnement")
   } else if (user?.value?.subscription_status === 'active') {
      alert("Pour souscrire un abonnement différent, vous devez d'abord résilier l'abonnement en cours")
   } else {
      const platform = Capacitor.getPlatform()
      if (platform === 'ios' || platform === 'android') {
         // buy on AppStore or GooglePlay
         await buyStoreSubscription(props.userid, subscriptionType, platform)
      } else {
         // buy with Stripe
         stripeSubscriptionChoice.value = subscriptionType
      }
   }
}

// Handle the Stripe form submission
const handleStripeSubmit = async () => {
   loading.value = true
   errorMessage.value = ''

   // Send card details to Stripe
   const { error, paymentMethod } = await stripe.value.createPaymentMethod({
      type: 'card',
      card: cardElement.value,
   })

   if (error) {
      // Display error in payment form
      errorMessage.value = error.message
      loading.value = false
      return
   } else {
      // Payment method created successfully
      console.log('Payment method created:', paymentMethod)
      const subscriptionType = stripeSubscriptionChoice.value
      const priceId = productInfoDict.value[subscriptionType].priceId
      appState.value.spinnerWaitingText = [ "Traitement..." ]
      await processStripeSubscription(subscriptionType, paymentMethod.id, priceId)
      appState.value.spinnerWaitingText = null
   }
}

// Process the Stripe subscription on the backend
const processStripeSubscription = async (subscriptionType, paymentMethodId, priceId) => {
   console.log('processStripeSubscription', subscriptionType, paymentMethodId, priceId)
   try {
      const user = await getUser(props.userid)
      const customerId = await getOrCreateStripeCustomer(props.userid, paymentMethodId, user.email)
      console.log('customerId', customerId)
      const { clientSecret, error } = await createStripeSubscription(props.userid, customerId, priceId)
      
      if (error) {
         errorMessage.value = error
      } else {
         // Confirm the subscription payment
         console.log('clientSecret', clientSecret)
         const { error } = await stripe.value.confirmCardPayment(clientSecret)
         if (error) {
            errorMessage.value = error.message
         } else {
            await updateUser(props.userid, {
               subscription_type: subscriptionType,
               subscription_status: 'active',
               subscription_platform: 'web',
            })
            alert("L'abonnement a été souscrit avec succès !")
         }
      }
   } catch (error) {
      errorMessage.value = 'Erreur inconnue...'
   } finally {
      loading.value = false
      stripeSubscriptionChoice.value = null
   }
}

const cancelCustomerSubscriptions = async () => {
   const user = await getUser(props.userid)
   if (user.subscription_status === 'active') {

      const platform = Capacitor.getPlatform()
      if (platform === user.subscription_platform) {
         // there is an active subscription and it has been made on this platform
         if (platform === 'ios') {
            alert(`Pour résilier l'abonnement, il faut que vous alliez dans les réglages de l'iPhone / Apple Id - iCloud / Contenu multimédia et achats / Abonnements`)
                  
         } else if (platform === 'android') {
            alert(`Pour résilier l'abonnement, il faut que vous alliez dans l'application Google Play Store, rubrique Paiements et abonnements`)

         } else {
            // cancel on Stripe
            try {
               // cancel all subscriptions of associated customer (there should be only one)
               appState.value.spinnerWaitingText = ["En cours de traitement..."]
               const { subscriptions, error } = await cancelStripeCustomerSubscriptions(props.userid, user.stripe_customer_id)
               if (error) {
                  errorMessage.value = error
               } else {
                  alert("L'abonnement a été annulé avec succès !")
               }
            } catch (error) {
               errorMessage.value = 'Erreur inconnue...'
            } finally {
               appState.value.spinnerWaitingText = null
            }
         }
      } else {
         // there is an active subscription and it has been made on another platform
         if (user.subscription_platform === 'ios') {
            alert("Votre abonnement a été souscrit sur iOS. Pour le résilier, il faut utiliser l'application depuis iOS")
         } else if (user.subscription_platform === 'android') {
            alert("Votre abonnement a été souscrit sur Android. Pour le résilier, il faut utiliser l'application Android")
         } else {
            alert("Votre abonnement a été souscrit sur le web. Pour le résilier, il faut utiliser l'application web")
         }
      }

   } else {
      alert("Il n'y a pas d'abonnement actif en cours")
   }
}
</script>

<style scoped>
.box {
  position: relative;
  background-color: lightblue;
  border: 1px solid #ccc;
}

.box::after {
  content: '✔'; /* Unicode for checkmark */
  font-size: 24px;
  color: green;
  position: absolute;
  bottom: 5px;
  right: 5px;
}

.payment-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-wrapper {
  margin-bottom: 20px; /* Space between card element and button */
  width: 100%; /* Full width for responsive design */
}

.stripe-element {
  border: 1px solid #ccc; /* Custom border */
  border-radius: 4px; /* Rounded corners */
  padding: 10px; /* Padding for the input area */
}
</style>
