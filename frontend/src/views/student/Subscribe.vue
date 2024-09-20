<template>
   <main class="flex-1 container max-w-7xl">

      <header class="chapter-card my-6">
         <p>
            <span>Gestion des abonnements</span>
         </p>
      </header>

      <main class="mt-4">
         <section class="grid grid-cols-2 grid-flow-rows gap-4">
            <button class="rounded-lg border-2 text-center p-6 hover:bg-gray-200" @click="buySubscription('standard_monthly')">
               Standard - monthly
            </button>
            <div class="rounded-lg border-2 text-center p-6 hover:bg-gray-200" @click="buySubscription('standard_yearly')">
               Standard - yearly
            </div>
            <div class="rounded-lg border-2 text-center p-6 hover:bg-gray-200" @click="buySubscription('premium_monthly')">
               Premium - monthly
            </div>
            <div class="rounded-lg border-2 text-center p-6 hover:bg-gray-200" @click="buySubscription('premium_yearly')">
               Premium - yearly
            </div>
         </section>
      </main>

   </main>
</template>

<script setup>
import { buyProduct, subscriptionOfUser } from '/src/use/useUser'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const buySubscription = async (productId) => {
   const platform = Capacitor.getPlatform()
   if (platform === 'ios' || platform === 'android') {
      const b = await buyProduct(productId)
      console.log('b', b)
   } else {

   }
}

// const subscribe = async () => {
//    const session = await app.service('stripe').createSession(props.userid)
//    console.log('session', session)
//    window.location.href = session.url
// }
</script>