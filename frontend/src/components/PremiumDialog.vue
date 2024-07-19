<template>
   <dialog ref="modalDialog" class="modal modal-middle">
      <div class="modal-box max-w-xl">
         <div class="text-large mt-2 mb-4 font-semibold">
            Pour obtenir une correction personnalisée, vous devez souscrire à la version premium de l’application
         </div>

         <div class="modal-action">
            <button class="karan-btn secondary-btn" @click="emit('subscribe')">
               Souscrire à la version premium
            </button>
            <button class="karan-btn secondary-btn" @click="emit('cancel')">
               Annuler
            </button>
         </div>
      </div>
   </dialog>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['cancel', 'subscribe'])

const modalDialog = ref(null)

const showModal = () => {
   modalDialog.value?.showModal()
}

const close = () => {
   modalDialog.value?.close()
}

defineExpose({
   showModal,
   close,
})
</script>