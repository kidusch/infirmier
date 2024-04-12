<template>
   
   <h1>Conditions générales d'utilisation</h1>

   <div class="form-control">
      <label class="label cursor-pointer">
         <span class="label-text">J'accepte ces conditions</span> 
         <input type="radio" name="radio-10" class="radio checked:bg-green-500" :checked="accept === true" />
      </label>
      </div>
      <div class="form-control">
      <label class="label cursor-pointer">
         <span class="label-text">Je refuse ces conditions</span> 
         <input type="radio" name="radio-10" class="radio checked:bg-red-500" :checked="accept === false" />
      </label>
   </div>

   <button class="block btn btn-primary" @click="validate">Valider</button>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import router from '/src/router'

const props = defineProps({
   userid: {
      type: String,
      required: true
   },
})

const accept = ref()

const validate = () => {
   router.push(`/student/${props.userid}`)
}
</script>