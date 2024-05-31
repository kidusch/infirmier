<template>
   <main class="flex-1 container max-w-7xl">

      <main class="flex flex-col">
         
         <div class="my-4">
            <label for="title">Texte de l'email de bienvenue</label>
            <div class="standard-input-container">
               <textarea placeholder="Texte..." type="text" rows="50"
                  :value="adminMisc ? adminMisc.email : ''"
                  @input="debouncedInputEmail"
                  :disabled="disabledEmail"
               />
               <img src="/src/assets/edit.svg" @click="disabledEmail = !disabledEmail">
               <div class="img-placeholder">
               </div>
            </div>
         </div>
         
         <div class="my-4">
            <label for="title">Conditions générales d'utilisation</label>
            <div class="standard-input-container">
               <textarea placeholder="Texte..." type="text" rows="50"
                  :value="adminMisc ? adminMisc.cgu : ''"
                  @input="debouncedInputCGU"
                  :disabled="disabledCGU"
               />
               <img src="/src/assets/edit.svg" @click="disabledCGU = !disabledCGU">
               <div class="img-placeholder">
               </div>
            </div>
         </div>
         
         <div class="my-4">
            <label for="title">Texte page d'accueil</label>
            <div class="standard-input-container">
               <textarea placeholder="Texte..." type="text" rows="50"
                  :value="adminMisc ? adminMisc.welcome_text : ''"
                  @input="debouncedInputWelcomeText"
                  :disabled="disabledWelcomeText"
               />
               <img src="/src/assets/edit.svg" @click="disabledWelcomeText = !disabledWelcomeText">
               <div class="img-placeholder">
               </div>
            </div>
         </div>
         
         <div class="my-4">
            <label for="title">URL image page d'accueil</label>
            <div class="standard-input-container">
               <textarea placeholder="URL..." type="text" rows="50"
                  :value="adminMisc ? adminMisc.welcome_img : ''"
                  @input="debouncedInputWelcomeImg"
                  :disabled="disabledWelcomeImg"
               />
               <img src="/src/assets/edit.svg" @click="disabledWelcomeImg = !disabledWelcomeImg">
               <div class="img-placeholder">
               </div>
            </div>
         </div>
      </main>
   </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import app from '/src/client-app.js'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const adminMisc = ref({})

onMounted(async () => {
   // the only row of table 'admin_misc' is supposed to have id=1
   adminMisc.value = await app.service('admin_misc').findUnique({ where: { id: 1 }})
})

const onInputEmail = async (ev) => {
   adminMisc.value = await app.service('admin_misc').update({
      where: { id: 1 },
      data: { email: ev.target.value }
   })
}
const debouncedInputEmail = useDebounceFn(onInputEmail, 500)
const disabledEmail = ref(true)

const onInputCGU = async (ev) => {
   adminMisc.value = await app.service('admin_misc').update({
      where: { id: 1 },
      data: { cgu: ev.target.value }
   })
}
const debouncedInputCGU = useDebounceFn(onInputCGU, 500)
const disabledCGU = ref(true)

const onInputWelcomeText = async (ev) => {
   adminMisc.value = await app.service('admin_misc').update({
      where: { id: 1 },
      data: { welcome_text: ev.target.value }
   })
}
const debouncedInputWelcomeText = useDebounceFn(onInputWelcomeText, 500)
const disabledWelcomeText = ref(true)

const onInputWelcomeImg = async (ev) => {
   adminMisc.value = await app.service('admin_misc').update({
      where: { id: 1 },
      data: { welcome_img: ev.target.value }
   })
}
const debouncedInputWelcomeImg = useDebounceFn(onInputWelcomeImg, 500)
const disabledWelcomeImg = ref(true)

</script>
