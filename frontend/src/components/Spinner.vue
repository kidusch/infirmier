<template>
   <div class="fixed inset-0 flex items-center justify-center">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="w-96 h-96 border-t-8 border-white border-solid rounded-full mx-auto animate-spin"></div>
      <div class="absolute inset-0 flex items-center justify-center">
         <slot></slot>
      </div>
   </div>
</template>
