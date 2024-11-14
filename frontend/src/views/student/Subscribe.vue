<template>
   <main class="container max-w-7xl">

      <header class="chapter-card mb-2">
         <p>
            <span>Gestion des abonnements</span>
         </p>
      </header>

      <main class="mt-4 max-w-xl">

         <section class="grid grid-cols-2 grid-flow-rows gap-4">
            <template v-for="productId of ['standard_monthly', 'standard_yearly', 'premium_monthly', 'premium_yearly']">
               <div class="rounded-lg border-2 text-center p-6 hover:bg-gray-200" :class="{ 'box': subscriptionOfUser(userid) === productId }"
                  @click="buySubscription(productId)">
                  <div class="cursor-pointer text-lg text-gray-600">{{ subscriptionInfoDict[productId]?.name }}</div>
                  <div class="cursor-pointer text-sm text-gray-400">{{ subscriptionInfoDict[productId]?.description }}</div>
                  <div class="cursor-pointer text-xl text-gray-600 font-semibold">{{ subscriptionInfoDict[productId]?.price }}
                     <span class="text-lg font-normal text-gray-400"> / {{ subscriptionInfoDict[productId]?.period }}</span>
                  </div>
               </div>
            </template>
         </section>
         
         <div class="my-8" v-show="stripeSubscriptionChoice">

            <div class="text-lg">{{ subscriptionInfoDict[stripeSubscriptionChoice]?.title }}</div>
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
            <button v-if="hasSubscription(user.id)" class="link" @click="cancelCustomerSubscriptions">
               Résilier l'abonnement en cours...
            </button>
         </div>

      </main>

   </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'

import { userOfId, updateUser } from '/src/use/useUser'
import { isBillingReady, getStripePublicKey, getSubscriptionInfo, buyStoreSubscription, subscriptionOfUser, hasSubscription,
   getOrCreateStripeCustomer, createStripeSubscription, cancelStripeCustomerSubscriptions } from '/src/use/useUser'
import { appState } from '/src/use/useAppState'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const user = computed(() => userOfId.value(props.userid))
const platform = computed(() => Capacitor.getPlatform())

const buySubscription = async (subscriptionType) => {
   const subscribed = subscriptionOfUser.value(props.userid)
   if (subscribed === subscriptionType) {
      alert("Vous avez déjà souscrit à cet abonnement")
   } else if (subscribed) {
      alert("Pour souscrire un abonnement différent, vous devez d'abord résilier l'abonnement en cours")
   } else {
      if (platform.value === 'ios' || platform.value === 'android') {
         // buy on AppStore or GooglePlay
         await buyStoreSubscription(props.userid, subscriptionType, platform.value)
      } else {
         // buy with Stripe
         stripeSubscriptionChoice.value = subscriptionType
      }
   }
}

const subscriptionInfoDict = ref({})

const stripe = ref(null)
const cardElement = ref(null)

const errorMessage = ref('')
const loading = ref(false)
const stripeSubscriptionChoice = ref()


onMounted(async () => {
   const isBillingReady_ = await isBillingReady()
   console.log('isBillingReady_', isBillingReady_.value)
   // get subscriptions name, description, price, period
   try {
      appState.value.spinnerWaitingText = [ "Chargement..." ]
      subscriptionInfoDict.value = await getSubscriptionInfo()
   } catch(err) {
      console.log(err)
   } finally {
      appState.value.spinnerWaitingText = null
   }

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
})

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
      const priceId = subscriptionInfoDict.value[subscriptionType].priceId
      appState.value.spinnerWaitingText = [ "Traitement..." ]
      await processStripeSubscription(subscriptionType, paymentMethod.id, priceId)
      appState.value.spinnerWaitingText = null
   }
}

// Process the Stripe subscription on the backend
const processStripeSubscription = async (subscriptionType, paymentMethodId, priceId) => {
   console.log('processStripeSubscription', subscriptionType, paymentMethodId, priceId)
   try {
      const customerId = await getOrCreateStripeCustomer(props.userid, paymentMethodId, user.value.email)
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
   if (user.value.subscription_status === 'active') {

      console.log(platform.value, user.value.subscription_platform)
      if (platform.value === user.value.subscription_platform) {
         // there is an active subscription and it has been made on this platform
         if (platform.value === 'ios') {
            alert(`Pour résilier l'abonnement, il faut que vous alliez dans les réglages de l'iPhone / Apple Id - iCloud / COntenu multimédia et achats / Abonnements`)
                  
         } else if (platform.value === 'android') {
            alert(`Pour résilier l'abonnement, il faut que vous alliez dans l'application Google Play Store, rubrique Paiements et abonnements`)

         } else {
            // cancel on Stripe
            try {
               // cancel all subscriptions of associated customer (there should be only one)
               appState.value.spinnerWaitingText = ["En cours de traitement..."]
               const { subscriptions, error } = await cancelStripeCustomerSubscriptions(props.userid, user.value.stripe_customer_id)
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
         if (user.value.subscription_platform === 'ios') {
            alert("Votre abonnement a été souscrit sur iOS. Pour le résilier, il faut utiliser l'application depuis iOS")
         } else if (user.value.subscription_platform === 'android') {
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
