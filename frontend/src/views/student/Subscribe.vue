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
               <div class="rounded-lg border-2 text-center p-6 hover:bg-gray-200" :class="{ 'box': false && subscriptionOfUser(userid) === productId }"
                  @click="buySubscription(productId)">
                  <div class="cursor-pointer text-lg text-gray-600">{{ productInfoDict[productId]?.name }}</div>
                  <div class="cursor-pointer text-sm text-gray-400">{{ productInfoDict[productId]?.description }}</div>
                  <div class="cursor-pointer text-xl text-gray-600 font-semibold">{{ productInfoDict[productId]?.price }}
                     <span class="text-lg font-normal text-gray-400"> / {{ productInfoDict[productId]?.period }}</span>
                  </div>
               </div>
            </template>
         </section>
         
      </main>

   </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { loadStripe } from '@stripe/stripe-js'

import { userOfId, updateUser } from '/src/use/useUser'
import { productInfo$ } from '/src/use/useUser'
import { appState } from '/src/use/useAppState'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const PRODUCT_ID_LIST = ['standard_monthly', 'standard_yearly', 'premium_monthly', 'premium_yearly']

const user = computed(() => userOfId.value(props.userid))
const platform = computed(() => Capacitor.getPlatform())


const errorMessage = ref('')


const productInfoDict = ref({})

let subscriptions = []

onMounted(async () => {
   try {
      appState.value.spinnerWaitingText = [ "Chargement..." ]
      for (const subscriptionType of PRODUCT_ID_LIST) {
         const observable = await productInfo$(subscriptionType)
         const subscription = observable.subscribe(info => {
            console.log('productInfo$', subscriptionType, info)
            productInfoDict.value[subscriptionType] = info
         })
         subscriptions.push(subscription)
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
