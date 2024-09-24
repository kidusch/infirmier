<template>
   <main class="flex-1 container max-w-7xl">

      <header class="chapter-card my-6">
         <p>
            <span>Gestion des abonnements</span>
         </p>
      </header>

      <main class="mt-4 max-w-xl">

         <section class="grid grid-cols-2 grid-flow-rows gap-4">
            <div class="rounded-lg border-2 text-center p-6 hover:bg-gray-200" :class="{ 'box': subscriptionOfUser(userid) === 'standard_monthly' }"
               @click="buySubscription('standard_monthly')">
               <div class="cursor-pointer text-lg text-gray-600">Standard</div>
               <div class="cursor-pointer text-xl text-gray-600 font-semibold">2,49 €</div>
               <div class="cursor-pointer text-lg text-gray-400">/ mois</div>
            </div>
            <div class="rounded-lg border-2 text-center p-6 hover:bg-gray-200" :class="{ 'box': subscriptionOfUser(userid) === 'standard_yearly' }"
               @click="buySubscription('standard_yearly')">
               <div class="cursor-pointer text-lg text-gray-600">Standard</div>
               <div class="cursor-pointer text-xl text-gray-600 font-semibold">24,99 €</div>
               <div class="cursor-pointer text-lg text-gray-400">/ an</div>
            </div>

            <div class="rounded-lg border-2 text-center p-6 hover:bg-gray-200" :class="{ 'box': subscriptionOfUser(userid) === 'premium_monthly' }"
               @click="buySubscription('premium_monthly')">
               <div class="cursor-pointer text-lg text-gray-600">Premium</div>
               <div class="cursor-pointer text-xl text-gray-600 font-semibold">4,99 €</div>
               <div class="cursor-pointer text-lg text-gray-400">/ mois</div>
            </div>
            <div class="rounded-lg border-2 text-center p-6 hover:bg-gray-200" :class="{ 'box': subscriptionOfUser(userid) === 'premium_yearly' }"
               @click="buySubscription('premium_yearly')">
               <div class="cursor-pointer text-lg text-gray-600">Premium</div>
               <div class="cursor-pointer text-xl text-gray-600 font-semibold">49,99 €</div>
               <div class="cursor-pointer text-lg text-gray-400">/ an</div>
            </div>
         </section>
         
         <div class="my-8" v-show="stripeSubscriptionChoice">

            <div class="text-lg">{{ SUBSCRIPTIONS[stripeSubscriptionChoice]?.title }}</div>
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

               <button :disabled="false" class="link my-2" @click="cancelStripeSubscription">
                  Arrêter l'abonnement en cours...
               </button>
            </form>
         </div>

         <button class="link my-2" @click="update">
            Update
         </button>

      </main>

   </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'

import { userOfId, buyStoreProduct, subscriptionOfUser, updateSubscriptionInfo, getOrCreateStripeCustomer } from '/src/use/useUser'

import { app } from '/src/client-app.js'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const user = computed(() => userOfId.value(props.userid))

const SUBSCRIPTIONS = {
   standard_monthly: {
      subscriptionId: import.meta.env.VITE_STRIPE_STANDARD_MONTHLY_SUBSCRIPTION_ID,
      priceId: import.meta.env.VITE_STRIPE_STANDARD_MONTHLY_PRICE_ID,
      title: "Souscription à un abonnement standard mensuel",
   },
   standard_yearly: {
      subscriptionId: import.meta.env.VITE_STRIPE_STANDARD_YEARLY_SUBSCRIPTION_ID,
      priceId: import.meta.env.VITE_STRIPE_STANDARD_YEARLY_PRICE_ID,
      title: "Souscription à un abonnement standard annuel",
   },
   premium_monthly: {
      subscriptionId: import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY_SUBSCRIPTION_ID,
      priceId: import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
      title: "Souscription à un abonnement premium mensuel",
   },
   premium_yearly: {
      subscriptionId: import.meta.env.VITE_STRIPE_PREMIUM_YEARLY_SUBSCRIPTION_ID,
      priceId: import.meta.env.VITE_STRIPE_PREMIUM_YEARLY_PRICE_ID,
      title: "Souscription à un abonnement premium annuel",
   },
}

const buySubscription = async (subscriptionType) => {
   const platform = Capacitor.getPlatform()
   if (platform === 'ios' || platform === 'android') {
      // buy on AppStore or GooglePlay
      await buyStoreProduct(props.userid, subscriptionType)
   } else {
      stripeSubscriptionChoice.value = subscriptionType
   }
}

const stripe = ref(null)
const cardElement = ref(null)

const errorMessage = ref('')
const loading = ref(false)
const stripeSubscriptionChoice = ref()


onMounted(async () => {
   // Load Stripe.js
   stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
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
})

// Handle the form submission
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
      const priceId = SUBSCRIPTIONS[stripeSubscriptionChoice.value].priceId
      await createStripeSubscription(paymentMethod.id, priceId)
   }
}

// Process the subscription on the backend
const createStripeSubscription = async (paymentMethodId, priceId) => {
   console.log('createStripeSubscription', paymentMethodId, priceId)
   try {
      // const customerId = await app.service('stripe').createCustomer(paymentMethodId, user.value.email)
      const customerId = await getOrCreateStripeCustomer(props.userid, paymentMethodId, user.value.email)
      console.log('customerId', customerId)
      const result = await app.service('stripe').createSubscription(customerId, priceId)
      if (result.error) {
         errorMessage.value = result.error
      } else {
         // Confirm the subscription payment
         const { error } = await stripe.value.confirmCardPayment(result.clientSecret)
         if (error) {
            errorMessage.value = error.message
         } else {
            alert("L'abonnement a été souscrit avec succès !")
         }
      }
   } catch (error) {
      errorMessage.value = 'Erreur inconnue...'
   } finally {
      loading.value = false
   }
}

const cancelStripeSubscription = async () => {
   const subscriptionId = SUBSCRIPTIONS[stripeSubscriptionChoice.value].subscriptionId
   console.log('cancelStripeSubscription', subscriptionId)
   try {
      const result = await app.service('stripe').cancelSubscription(subscriptionId)
      if (result.error) {
         errorMessage.value = result.error
      } else {
         alert("L'abonnement a été annulé avec succès !")
      }
   } catch (error) {
      errorMessage.value = 'Erreur inconnue...'
   }
}

const update = async () => {
   const x = await updateSubscriptionInfo(props.userid)
   console.log('x', x)
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
