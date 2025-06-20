<template>
   <main class="container max-w-7xl">

      <main class="flex flex-col">
         
         <div class="my-4">
            <div class="flex justify-between">
               <label for="title">Texte de l'email de bienvenue</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isEmailDisabled" @click="isEmailDisabled = !isEmailDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isEmailDisabled" @click="isEmailDisabled = !isEmailDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <textarea placeholder="Texte..." type="text" class="h-32"
                  :value="email"
                  @input="onEmailInputDebounced"
                  v-position="emailPosition"
                  :disabled="isEmailDisabled"
               />
            </div>
         </div>
         
         <div class="my-4">
            <div class="flex justify-between">
               <label for="title">Conditions générales d'utilisation</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isCGUDisabled" @click="isCGUDisabled = !isCGUDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isCGUDisabled" @click="isCGUDisabled = !isCGUDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <textarea placeholder="Texte..." type="text" class="h-32"
                  :value="cgu"
                  @input="onCGUInputDebounced"
                  v-position="cguPosition"
                  :disabled="isCGUDisabled"
               />
            </div>
         </div>
         
         <div class="my-4">
            <div class="flex justify-between">
               <label for="title">Texte page d'accueil</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isWelcomeTextDisabled" @click="isWelcomeTextDisabled = !isWelcomeTextDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isWelcomeTextDisabled" @click="isWelcomeTextDisabled = !isWelcomeTextDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <textarea placeholder="Texte..." type="text" class="h-32"
                  :value="welcomeText"
                  @input="onWelcomeTextInputDebounced"
                  v-position="welcomeTextPosition"
                  :disabled="isWelcomeTextDisabled"
               />
            </div>
         </div>
         
         <div class="my-4">
            <div class="flex justify-between">
               <label for="title">URL image page d'accueil</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isWelcomeImgDisabled" @click="isWelcomeImgDisabled = !isWelcomeImgDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isWelcomeImgDisabled" @click="isWelcomeImgDisabled = !isWelcomeImgDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <input placeholder="URL..." type="text"
                  :value="welcomeImg"
                  @input="onWelcomeImgInputDebounced"
                  v-position="welcomeImgPosition"
                  :disabled="isWelcomeImgDisabled"
               />
            </div>
         </div>
      </main>
   </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { app } from '/src/client-app.js'


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

// handle email editing
const localEmail = ref()
const email = computed(() => localEmail.value || adminMisc.value.email)
app.service('admin_misc').on('update', adminMisc => {
   localEmail.value = adminMisc.email
})
const emailPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onEmailInput = async (ev) => {
   localEmail.value = ev.target.value
   emailPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   adminMisc.value = await app.service('admin_misc').update({
      where: { id: 1 },
      data: { email: ev.target.value }
   })
}
const onEmailInputDebounced = useDebounceFn(onEmailInput, 500)
const isEmailDisabled = ref(true)

// handle CGU editing
const localCGU = ref()
const cgu = computed(() => localCGU.value || adminMisc.value.cgu)
app.service('admin_misc').on('update', adminMisc => {
   localCGU.value = adminMisc.cgu
})
const cguPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onCGUInput = async (ev) => {
   localCGU.value = ev.target.value
   cguPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   adminMisc.value = await app.service('admin_misc').update({
      where: { id: 1 },
      data: { cgu: ev.target.value }
   })
}
const onCGUInputDebounced = useDebounceFn(onCGUInput, 500)
const isCGUDisabled = ref(true)

// handle welcome text editing
const localWelcomeText = ref()
const welcomeText = computed(() => localWelcomeText.value || adminMisc.value.welcome_text)
app.service('admin_misc').on('update', adminMisc => {
   localWelcomeText.value = adminMisc.welcome_text
})
const welcomeTextPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onWelcomeTextInput = async (ev) => {
   localWelcomeText.value = ev.target.value
   welcomeTextPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   adminMisc.value = await app.service('admin_misc').update({
      where: { id: 1 },
      data: { welcome_text: ev.target.value }
   })
}
const onWelcomeTextInputDebounced = useDebounceFn(onWelcomeTextInput, 500)
const isWelcomeTextDisabled = ref(true)

// handle welcome img url editing
const localWelcomeImg = ref()
const welcomeImg = computed(() => localWelcomeImg.value || adminMisc.value.welcome_img)
app.service('admin_misc').on('update', adminMisc => {
   localWelcomeImg.value = adminMisc.welcome_img
})
const welcomeImgPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onWelcomeImgInput = async (ev) => {
   localWelcomeImg.value = ev.target.value
   welcomeImgPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   adminMisc.value = await app.service('admin_misc').update({
      where: { id: 1 },
      data: { welcome_img: ev.target.value }
   })
}
const onWelcomeImgInputDebounced = useDebounceFn(onWelcomeImgInput, 500)
const isWelcomeImgDisabled = ref(true)

// custom directive (v-position on <input> or <textarea>) which restores cursor position
const vPosition = {
   updated: (el, binding) => {
      // binding.value is the directive argument, here the cursor position ref { start, end }
      el.selectionStart, el.selectionEnd = binding.value.start, binding.value.end
   }
}
</script>
