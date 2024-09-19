<template>
   <main class="flex-1 container max-w-7xl">

      <header class="chapter-card my-6">
         <p>
            <span>Gestion des abonnements</span>
         </p>
      </header>

      <main class="mt-4">
         <section class="grid grid-cols-2 grid-flow-rows gap-4">
            <button class="rounded-lg border-2 text-center p-6 hover:bg-gray-200">
               Standard - monthly
            </button>
            <div class="rounded-lg border-2 text-center p-6 hover:bg-gray-200">
               Standard - yearly
            </div>
            <div class="rounded-lg border-2 text-center p-6 hover:bg-gray-200">
               Premium - monthly
            </div>
            <div class="rounded-lg border-2 text-center p-6 hover:bg-gray-200">
               Premium - yearly
            </div>
         </section>
      </main>

   </main>
</template>

<script setup>

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

// const subscribe = async () => {
//    const session = await app.service('stripe').createSession(props.userid)
//    console.log('session', session)
//    window.location.href = session.url
// }
</script>