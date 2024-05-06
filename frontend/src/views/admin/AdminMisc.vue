<template>
   <h1 class="text-xl font-semibold">Divers</h1>
   
</template>

<script setup>
import { ref, onMounted } from 'vue'

import router from "/src/router"


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

onMounted(async () => {
})
</script>
