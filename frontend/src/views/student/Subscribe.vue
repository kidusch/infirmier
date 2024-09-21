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
         
         <form id="subscription-form" @submit.prevent="handleSubmit">
            <div id="card-element"><!-- Stripe Elements will mount here --></div>

            <button :disabled="loading" type="submit">
               {{ loading ? 'Processing...' : 'Subscribe' }}
            </button>
            <div id="card-errors" role="alert">{{ errorMessage }}</div>
         </form>
      </main>

   </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'

import { userOfId, buyProduct, subscriptionOfUser } from '/src/use/useUser'

import { app } from '/src/client-app.js'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const user = computed(() => userOfId.value(props.userid))

const buySubscription = async (productId) => {
   const platform = Capacitor.getPlatform()
   if (platform === 'ios' || platform === 'android') {
      // buy on AppStore or GooglePlay
      await buyProduct(props.userid, productId)
   } else {
      // buy with Stripe
      const session = await app.service('stripe').createSession(props.userid)
      console.log('session', session)
      window.location.href = session.url
   }
}

const stripe = ref(null);
const cardElement = ref(null);
const errorMessage = ref('');
const loading = ref(false);

// Your Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51PbbFWH5CkAsTx9zoczqFG2RqoJ5JNK2YDInE0wxQJFH016eMYwxCqhTquzCvqnAQ64MBjMmwEnrnB6iUpG1qcZ800z2zvZQnX'
const SUBSCRIPTION_PRICE_ID = 'price_1Q1QzGH5CkAsTx9zW1U05r0Q'

onMounted(async () => {
   // Load Stripe.js
   stripe.value = await loadStripe(STRIPE_PUBLISHABLE_KEY)

   // Create an instance of Elements
   const elements = stripe.value.elements()

   // Create and mount the Card Element
   cardElement.value = elements.create('card')
   cardElement.value.mount('#card-element')
})

// Handle the form submission
const handleSubmit = async () => {
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
   } else {
      // Payment method created successfully
      console.log('Payment method created:', paymentMethod)
      await createSubscription(paymentMethod.id)
   }
}

// Process the subscription on the backend
const createSubscription = async (paymentMethodId) => {
   console.log('createSubscription', paymentMethodId)
   try {
      const result = await app.service('stripe').createSubscription(paymentMethodId, user.value.email, SUBSCRIPTION_PRICE_ID)
      if (result.error) {
         errorMessage.value = result.error
      } else {
         // Confirm the subscription payment
         const { error } = await stripe.value.confirmCardPayment(result.clientSecret)
         if (error) {
            errorMessage.value = error.message
         } else {
            alert('Subscription successful!')
         }
      }
   } catch (error) {
      errorMessage.value = 'Something went wrong!'
   } finally {
      loading.value = false
   }
}

const elementStyles = {
   base: {
      color: '#32325d', // Text color
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
         color: '#aab7c4', // Placeholder color
      },
   },
   invalid: {
      color: '#fa755a', // Invalid input color
      iconColor: '#fa755a',
   },
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
</style>
