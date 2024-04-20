<template>
   
   <!-- <h1>Conditions générales d'utilisation</h1>

   <div class="form-control">
      <label class="label cursor-pointer">
         <span class="label-text">J'accepte ces conditions</span> 
         <input type="radio" name="radio-10" class="radio checked:bg-green-500" :checked="accept === true" @click="accept = true" />
      </label>
      </div>
      <div class="form-control">
      <label class="label cursor-pointer">
         <span class="label-text">Je refuse ces conditions</span> 
         <input type="radio" name="radio-10" class="radio checked:bg-red-500" :checked="accept === false" @click="accept = false" />
      </label>
   </div>

   <button class="block btn btn-primary" @click="validate">Valider</button> -->

   <div class="container max-w-lg py-4 flex flex-col">

<!-- Logo -->
<header class="w-full flex justify-center">
   <img class="w-80 h-80" src="/src/assets/logo.png" alt="logo">
</header>

<section class="flex-1 flex flex-col justify-between">

   <!-- Headings -->
   <section class="h-1/4 lg:h-auto flex flex-col">
      <h1>
         Conditions Générales d'Utilisation
      </h1>
   </section>

   <!-- Login Options -->
   <div class="flex flex-col">

      <p>
         Ces Conditions Générales d'Utilisation ("CGU") régissent votre utilisation de l'application web “Devenir Infirmier”
         (ci-après dénommée "l'Application") exploité par .... Veuillez lire attentivement ces CGU avant d'utiliser l'Application.
      </p>
      <p>
         En utilisant l'Application, vous acceptez d'être lié par ces CGU. Si vous n'acceptez pas ces CGU, veuillez ne pas utiliser l'Application.
      </p>
      <p>
         1. Utilisation de l'Application
      </p>
      <p>
         1.1. Vous devez avoir l'âge légal pour utiliser l'Application conformément aux lois applicables...
      </p>

      <div class="form-control">
         <label class="label cursor-pointer">
            <span class="label-text">J'accepte ces conditions</span> 
            <input type="radio" name="radio-10" class="radio checked:bg-green-500" :checked="accept === true" @click="accept = true" />
         </label>
         </div>
         <div class="form-control">
         <label class="label cursor-pointer">
            <span class="label-text">Je refuse ces conditions</span> 
            <input type="radio" name="radio-10" class="radio checked:bg-red-500" :checked="accept === false" @click="accept = false" />
         </label>
      </div>

      <div class="justify-center flex">
         <button class="primary-btn" @click="validate" :disabled="accept === undefined">
            Valider
         </button>
      </div>

   </div>

</section>
</div>



</template>

<script setup>
import { ref, onMounted } from 'vue'

import router from '/src/router'


const props = defineProps({
   token: {
      type: String,
      required: true
   },
})

onMounted(() => {
   console.log('token', props.token)
})

const accept = ref()

const validate = () => {
   if (accept.value === true) {
      router.push(`/set-password/${props.token}`)
   } else {
      router.push(`/`)
   }
}
</script>