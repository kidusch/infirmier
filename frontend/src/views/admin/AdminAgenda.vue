<template>

   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <span class="font-semibold">Agendas partagés</span>
         </p>
      </header>

      <main class="flex flex-col gap-6 pb-4">

         <div class="flex flex-col gap-3">

            <!-- <div v-for="anatomy, index in listOfAnatomy">
               <EditableListItem
                  field="name" :index="index" :list="listOfAnatomy"
                  @update="(anatomy1, anatomy2) => update(anatomy1, anatomy2)"
                  @edit="(text) => edit(anatomy.id, text)"
                  @remove="remove(anatomy)"
                  @select="select(anatomy.id)"
                  @show="updateHidden(anatomy.id, false)"
                  @hide="updateHidden(anatomy.id, true)"
               ></EditableListItem>

            </div> -->

         </div>
      </main>
   </main>
</template>

<script setup>
import { ref } from 'vue'

import router from "/src/router"

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
})

const select = (id) => {
   router.push(`/admin/admin-agenda/${id}`)
}
</script>
