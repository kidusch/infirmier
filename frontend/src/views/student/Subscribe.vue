<template>
   <main class="flex-1 container max-w-7xl">

      <header class="chapter-card my-6">
         <p>
            <span>Souscrire un abonnement</span>
         </p>
      </header>

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