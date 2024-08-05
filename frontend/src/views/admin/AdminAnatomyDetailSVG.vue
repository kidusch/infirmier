<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/admin/admin-anatomy`">Anatomie</router-link>
            /
            <span class="font-semibold">{{ anatomy?.name }}</span>
         </p>
      </header>

      <main class="flex flex-col gap-3">
         <div>
            <div class="flex justify-between">
               <label>Titre</label>
               <img class="h-5 mb-1" src="/src/assets/edit.svg"  @click="disabledName = !disabledName">
            </div>
            <div class="standard-input-container">
               <input placeholder="Nom de la carte anatomique..." type="text"
                  :value="anatomy?.name"
                  @input="debouncedInputName"
                  :disabled="disabledName"
               />
            </div>
         </div>
         
         <div>
            <button class="primary-btn px-8" @click="open">Chargez un fichier SVG...</button>
         </div>

         <div v-for="path, index in featuredPaths">
            <PathItem
               :index="index" :list="featuredPaths"
               @update="updatePaths"
               @edit="(text) => editPathTitle(path, text)"
               @remove="removePath(path)"
               @select="select(path)"
            ></PathItem>
         </div>

         <div ref="svg" v-html="anatomy.content" class="w-full"></div>
      </main>
   </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFileDialog } from '@vueuse/core'

import { readFileAsyncAsArrayBuffer } from '/src/lib/utilities.mjs'
import { anatomyOfId, updateAnatomy } from '/src/use/useAnatomy'

import PathItem from '/src/components/PathItem.vue'


const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   anatomy_id: {
      type: Number,
      required: true
   },
})

const anatomy = computed(() => anatomyOfId.value(props.anatomy_id))


const { open, onChange } = useFileDialog({
  accept: 'image/svg+xml',
  directory: false,
})

onChange(async (files) => {
   const file = files[0]
   const arrayBuffer = await readFileAsyncAsArrayBuffer(file)
   const decoder = new TextDecoder('utf-8')
   const utf8Svg = decoder.decode(arrayBuffer)

   await updateAnatomy(props.anatomy_id, { content: utf8Svg })
   featuredPaths.value = []
})

const svg = ref(null)
const featuredPaths = ref([])

function updateSelectedPaths() {
   const result = []
   for (const path of svg.value.querySelectorAll('path, ellipse, circle, rect')) {
      if (!path.dataset.rank) continue
      result.push(path)
   }
   featuredPaths.value = result.sort((path1, path2) => path1.dataset.rank - path2.dataset.rank)
}

const highestRank = computed(() => featuredPaths.value.reduce((accu, path) => Math.max(accu, path.dataset.rank), 0))

// mouseenter/mouseleave au lieu de mouseover/mouseout
// target / relatedTarget
function mouseoverListener(event) {
   if (event.target.tagName?.toLowerCase() === 'path') {
      event.target.style.opacity = 0.33
      highlightPath(event.target)
   }
}

function mouseoutListener(event) {
   if (event.target.tagName?.toLowerCase() === 'path') {
      event.target.style.opacity = 1
   }
}

async function clickListener(event) {
   if (event.target.tagName?.toLowerCase() === 'path') {
      console.log('click')
      if (window.confirm("Ajouter un élément ?")) {
         if (!event.target.dataset.rank) {
            event.target.dataset.rank = highestRank.value + 1
            event.target.style.opacity = 1

            await updateAnatomy(props.anatomy_id, { content: svg.value.innerHTML })
            updateSelectedPaths()
         }
      }
   }
}

onMounted(() => {
   svg.value.addEventListener('mouseover', mouseoverListener)
   svg.value.addEventListener('mouseout', mouseoutListener)
   svg.value.addEventListener('click', clickListener)
   updateSelectedPaths()
})

function highlightPath(path) {
   path.style.opacity = 0.33
   setTimeout(() => path.style.opacity = 1, 1000)
}

const select = (path) => {
   highlightPath(path)
}

const editPathTitle = async (path, text) => {
   path.dataset.name = text
   await updateAnatomy(props.anatomy_id, { content: svg.value.innerHTML })
   updateSelectedPaths()
}

const updatePaths = async () => {
   await updateAnatomy(props.anatomy_id, { content: svg.value.innerHTML })
   updateSelectedPaths()
}

const removePath = async (path) => {
   delete path.dataset.rank
   delete path.dataset.name
   await updateAnatomy(props.anatomy_id, { content: svg.value.innerHTML })
   updateSelectedPaths()
}
</script>
