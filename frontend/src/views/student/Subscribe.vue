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
               <div class="rounded-lg border-2 text-center p-6 hover:bg-gray-200" :class="{ 'box': userSubscriptionStatus === productId }"
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

         <!-- <div class="my-2">
            <button v-if="hasSubscription(user.id)" class="link" @click="cancelCustomerSubscriptions">
               Résilier l'abonnement en cours...
            </button>
         </div> -->

      </main>

   </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'

import { getStripePublicKey, buyStoreSubscription, getOrCreateStripeCustomer, createStripeSubscription, cancelStripeCustomerSubscriptions } from '/src/use/useUser.ts'
import { productInfo$, userSubscriptionStatus$ } from '/src/use/useUser.ts'
import { appState } from '/src/use/useAppState'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const PRODUCT_ID_LIST = ['standard_monthly', 'standard_yearly', 'premium_monthly', 'premium_yearly']

// const user = computed(() => userOfId.value(props.userid))

const errorMessage = ref('')
const productInfoDict = ref({})
const userSubscriptionStatus = ref()

const stripe = ref(null)
const cardElement = ref(null)
const stripeSubscriptionChoice = ref()

let subscriptions = []

onMounted(async () => {
   try {
      appState.value.spinnerWaitingText = [ "Chargement..." ]
      // get subscription product info
      for (const subscriptionType of PRODUCT_ID_LIST) {
         const observable = await productInfo$(subscriptionType)
         const subscription = observable.subscribe(info => {
            // console.log('productInfo$', subscriptionType, info)
            productInfoDict.value[subscriptionType] = info
         })
         subscriptions.push(subscription)
      }
      // get user subscription status
      const observable = await userSubscriptionStatus$(props.userid)
      const subscription = observable.subscribe(status => {
         console.log('userSubscriptionStatus$', status)
         userSubscriptionStatus.value = status
      })
      subscriptions.push(subscription)

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
      errorMessage.value = err.toString()
   } finally {
      appState.value.spinnerWaitingText = null
   }
})

onUnmounted(() => {
   subscriptions.forEach(s => s.unsubscribe())
})

const buySubscription = async (subscriptionType) => {
   if (userSubscriptionStatus.value?.subscription_type === subscriptionType) {
      alert("Vous avez déjà souscrit à cet abonnement")
   } else if (userSubscriptionStatus.value) {
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
