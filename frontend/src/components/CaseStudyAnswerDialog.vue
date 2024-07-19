<template>
   <dialog ref="modalDialog" class="modal modal-middle">
      <div class="modal-box max-w-xl">
         <div class="text-large mt-2 mb-4 font-semibold">
            Votre réponse a été transmise et une correction personnalisée vous sera envoyée dans les meilleurs délais
         </div>

         <div class="modal-action">
            <button class="karan-btn secondary-btn" @click="close">
               Continuer
            </button>
         </div>
      </div>
   </dialog>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['closed'])

const modalDialog = ref(null)

const showModal = () => {
   modalDialog.value?.showModal()
}

const close = () => {
   modalDialog.value?.close()
   emit('closed')
}

defineExpose({
   showModal,
})
</script>