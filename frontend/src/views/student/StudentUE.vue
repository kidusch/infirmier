<template>
    <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="py-4">
         <h3 class="lg:opacity-50">
            Bilan des cours
         </h3>
      </header>

      <!-- Main content -> courses list -->
      <main class="flex flex-col gap-6 pb-6">
         <div class="bg-accent p-5 gap-3 flex flex-col rounded-3xl">
            <h2 class="font-semibold">
                  UE 1 - Sciences humaines, sociales et droit
            </h2>
            <div class="progress-list">
                  <div class="progress-item">
                     <img src="/src/assets/progress-bar-0.svg" alt="progress 0%">
                     <p>
                        UE 1.1 - Psychologie, sociologie,
                        anthropologie
                     </p>
                  </div>
                  <div class="progress-item">
                     <img src="/src/assets/progress-bar-25.svg" alt="progress 25%">
                     <p>
                        UE 1.2 - Santé publique et économie de la santé
                     </p>
                  </div>
                  <div class="progress-item">
                     <img src="/src/assets/progress-bar-50.svg" alt="progress 50%">
                     <p>
                        UE 1.3 - Législation, éthique, déontologie
                     </p>
                  </div>
            </div>
         </div>

         <div class="bg-accent p-5 gap-3 lg:p-8 lg:gap-5 flex flex-col rounded-3xl">
            <h2 class="font-semibold">
                  UE 2.1 - Biologie fondamentale
            </h2>
            <div class="progress-list">
                  <div class="progress-item">
                     <img src="/src/assets/progress-bar-100.svg" alt="progress 100%">
                     <p>
                        UE 2.1 - Biologie fondamentale
                     </p>
                  </div>
                  <div class="progress-item">
                     <img src="/src/assets/progress-bar-25.svg" alt="progress 25%">
                     <p>
                        UE 2.2 - Cycles de la vie et grandes fonctions
                     </p>
                  </div>
                  <div class="progress-item">
                     <img src="/src/assets/progress-bar-50.svg" alt="progress 50%">
                     <p>
                        UE 2.3 - Santé, maladie, handicap, accidents de ...
                     </p>
                  </div>
                  <div class="progress-item">
                     <img src="/src/assets/progress-bar-75.svg" alt="progress 75%">
                     <p>
                        UE 2.4 - Processus traumatiques
                     </p>
                  </div>
                  <div class="progress-item">
                     <img src="/src/assets/progress-bar-0.svg" alt="progress 0%">
                     <p>
                        UE 2.6 - Processus psychopathologiques
                     </p>
                  </div>
            </div>
         </div>
      </main>

   </main>
</template>

<script setup>
</script>