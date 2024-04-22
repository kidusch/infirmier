<template>
   
   <h1>Conditions générales d'utilisation</h1>

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

   <button class="block btn btn-primary" :disabled="accept === undefined" @click="validate">Valider</button>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import router from '/src/router'
import app from '/src/client-app.js'
import { appState } from '/src/use/useAppState'


const props = defineProps({
   userid: {
      type: String,
      required: true
   },
})

const accept = ref()

const validate = async () => {
   try {
      const user = await app.service('user').update({
         where: { id: parseInt(props.userid) },
         data: { accept_cgu: accept.value }
      })
      if (accept.value) {
         if (user.admin) {
            router.push(`/home/${user.id}/admin-ue`)
         } else {
            router.push(`/home/${user.id}/student`)
         }
      } else {
         router.push(`/`)
      }
   } catch(err) {
      appState.value.unexpectedError = true
   }
}
</script>