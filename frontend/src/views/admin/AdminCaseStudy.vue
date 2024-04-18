<template>
   <h1 class="text-xl font-semibold">{{ caseStudy && caseStudy.title }}</h1>

   <h1 class="text-xl font-semibold">Cas d'étude</h1>

   <div class="link m-2" @click="back">back</div>
   <div class="link m-2" @click="preview">preview</div>

   <div>
      <textarea placeholder="Titre"
         :value="caseStudy ? caseStudy.title : ''"
         @input="debouncedInputTitle" class="textarea textarea-bordered"
         :disabled="disabledTitle"
      ></textarea>
      <span class="link m-2" @click="disabledTitle = !disabledTitle">edit</span>
   </div>
   
   <div>
      <textarea placeholder="Contenu"
         :value="caseStudy ? caseStudy.content : ''"
         @input="debouncedInputContent" class="textarea textarea-bordered"
         :disabled="disabledContent"
      ></textarea>
      <span class="link m-2" @click="disabledContent = !disabledContent">edit</span>
   </div>
   
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { getCaseStudy, updateCaseStudy } from '/src/use/useCaseStudy'
import router from '/src/router'

const props = defineProps({
   case_study_id: {
      type: Number,
      required: true
   },
})

const caseStudy = ref()

onMounted(async () => {
   caseStudy.value = await getCaseStudy(props.case_study_id)
})

const onInputTitle = async (ev) => {
   await updateCaseStudy(props.case_study_id, { title: ev.target.value })
}
const onInputContent = async (ev) => {
   await updateCaseStudy(props.case_study_id, { content: ev.target.value })
}
const debouncedInputTitle = useDebounceFn(onInputTitle, 500)
const debouncedInputContent = useDebounceFn(onInputContent, 500)

const disabledTitle = ref(true)
const disabledContent = ref(true)

const back = () => {
   router.back()
}

const preview = () => {
   console.log('preview')
}
</script>