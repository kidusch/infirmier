<template>
   <dialog ref="modalDialog" class="modal modal-middle">
      <div class="modal-box max-w-xl">
         <div class="text-large mt-2 mb-4 font-semibold">
            Pour accéder au contenu payant, vous devez souscrire un abonnement
         </div>

         <div class="modal-action">
            <button class="karan-btn secondary-btn" @click="emit('subscribe')">
               Souscrire...
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