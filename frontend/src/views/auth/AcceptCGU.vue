<template>
   <div class="container max-w-lg py-4 flex flex-col">

      <section class="flex-1 flex flex-col">

         <section class="flex flex-col">
            <h1>Conditions générales d'utilisation</h1>
         </section>

         <!-- CGU text -->
         <div v-html="adminMisc?.cgu"></div>

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
      </section>
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import router from '/src/router'
import { app } from '/src/client-app.js'
import { appState } from '/src/use/useAppState'


const props = defineProps({
   userid: {
      type: String,
      required: true
   },
})

const adminMisc = ref({})

onMounted(async () => {
   // the only row of table 'admin_misc' is supposed to have id=1
   adminMisc.value = await app.service('admin_misc').findUnique({ where: { id: 1 }})
})

const accept = ref()

const validate = async () => {
   const user = await app.service('user').update({
      where: { id: parseInt(props.userid) },
      data: { accept_cgu: accept.value }
   })
   if (accept.value) {
      router.push(`/home/${user.id}`)
   } else {
      router.push(`/`)
   }
}
</script>