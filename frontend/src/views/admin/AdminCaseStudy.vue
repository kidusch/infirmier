<template>
   <main class="flex-1 container max-w-7xl">

      <!-- Header -->
      <header class="chapter-card my-6">
         <p class="leading-loose">
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-ue`">Unités d'enseignement</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-sub-ue/${ue_id}`">{{ ue?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-topics/${ue_id}/${sub_ue_id}`">{{ subUE?.name }}</router-link>
            /
            <router-link class="cursor-pointer hover:underline" :to="`/home/${userid}/admin-topic/${ue_id}/${sub_ue_id}/${topic_id}`">{{ topic?.name }}</router-link>
            /
            <span class="font-semibold">Cas d'étude</span>
         </p>
      </header>

      <main class="flex flex-col gap-3">
         <div>
            <div class="flex justify-between">
               <label for="title">Titre</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isTitleDisabled" @click="isTitleDisabled = !isTitleDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isTitleDisabled" @click="isTitleDisabled = !isTitleDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <input placeholder="Titre..." type="text"
                  :value="title"
                  @input="onTitleInputDebounced"
                  v-position="titlePosition"
                  :disabled="isTitleDisabled"
               />
            </div>
         </div>
         
         <div>
            <div class="flex justify-between">
               <label for="title">Contenu</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/preview.svg" @click="preview">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isContentDisabled" @click="isContentDisabled = !isContentDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isContentDisabled" @click="isContentDisabled = !isContentDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <textarea placeholder="Contenu..." type="text"
                  :value="content"
                  @input="onContentInputDebounced"
                  v-position="contentPosition"
                  :disabled="isContentDisabled"
               ></textarea>
            </div>
         </div>
         
         <div>
            <div class="flex justify-between">
               <label for="title">Correction standard</label>
               <div class="flex gap-2 mb-1">
                  <img class="h-5 cursor-pointer" src="/src/assets/preview.svg" @click="previewCorrection">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit.svg" v-if="!isCorrectionDisabled" @click="isCorrectionDisabled = !isCorrectionDisabled">
                  <img class="h-5 cursor-pointer" src="/src/assets/edit-off.svg" v-if="isCorrectionDisabled" @click="isCorrectionDisabled = !isCorrectionDisabled">
               </div>
            </div>
            <div class="standard-input-container">
               <textarea placeholder="Correction..." type="text"
                  :value="standardCorrection"
                  @input="onCorrectionInputDebounced"
                  v-position="correctionPosition"
                  :disabled="isCorrectionDisabled"
               ></textarea>
            </div>
         </div>

      </main>
   </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { ueOfId } from '/src/use/useUE'
import { subUEOfId } from '/src/use/useSubUE'
import { topicOfId } from '/src/use/useTopic'
import { caseStudyOfId, updateCaseStudy } from '/src/use/useCaseStudy'

import { app } from '/src/client-app.js'

import router from '/src/router'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   ue_id: {
      type: Number,
      required: true
   },
   sub_ue_id: {
      type: Number,
      required: true
   },
   topic_id: {
      type: Number,
      required: true
   },
   case_study_id: {
      type: Number,
      required: true
   },
})

const ue = computed(() => ueOfId.value(props.ue_id))
const subUE = computed(() => subUEOfId.value(props.sub_ue_id))
const topic = computed(() => topicOfId.value(props.topic_id))
const caseStudy = computed(() => caseStudyOfId.value(props.case_study_id))

// handle title editing
const localTitle = ref()
const title = computed(() => localTitle.value || caseStudy.value.title)
app.service('case_study').on('update', caseStudy => {
   localTitle.value = caseStudy.title
})
const titlePosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onTitleInput = async (ev) => {
   localTitle.value = ev.target.value
   titlePosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateCaseStudy(props.case_study_id, { title: ev.target.value })
}
const onTitleInputDebounced = useDebounceFn(onTitleInput, 500)
const isTitleDisabled = ref(true)

// handle content editing
const localContent = ref()
const content = computed(() => localContent.value || caseStudy.value.content)
app.service('case_study').on('update', caseStudy => {
   localContent.value = caseStudy.content
})
const contentPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onContentInput = async (ev) => {
   localContent.value = ev.target.value
   contentPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateCaseStudy(props.case_study_id, { content: ev.target.value })
}
const onContentInputDebounced = useDebounceFn(onContentInput, 500)
const isContentDisabled = ref(true)

// handle standard correction editing
const localCorrection = ref()
const standardCorrection = computed(() => localCorrection.value || caseStudy.value.standard_correction)
app.service('case_study').on('update', caseStudy => {
   localCorrection.value = caseStudy.standard_correction
})
const correctionPosition = ref({}) // cursor position is stored before a database update, and restored after DOM change by directive vPosition
const onCorrectionInput = async (ev) => {
   localCorrection.value = ev.target.value
   correctionPosition.value = { start: ev.target.selectionStart, end: ev.target.selectionEnd }
   await updateCaseStudy(props.case_study_id, { standard_correction: ev.target.value })
}
const onCorrectionInputDebounced = useDebounceFn(onCorrectionInput, 500)
const isCorrectionDisabled = ref(true)

// custom directive (v-position on <input> or <textarea>) which restores cursor position
const vPosition = {
   updated: (el, binding) => {
      // binding.value is the directive argument, here the cursor position ref { start, end }
      el.selectionStart, el.selectionEnd = binding.value.start, binding.value.end
   }
}

const preview = () => {
   router.push(`/home/${props.userid}/admin-case-study-preview/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${props.case_study_id}`)
}
const previewCorrection = () => {
   router.push(`/home/${props.userid}/admin-case-study-preview-correction/${props.ue_id}/${props.sub_ue_id}/${props.topic_id}/${props.case_study_id}`)
}
</script>