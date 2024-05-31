<template>
   <template v-for="part in parts">

      <template v-if="part.type === 'break'">
         <br/>
      </template>

      <template v-if="part.type === 'li'">
         <li>
            <template v-for="subpart in part.content">
               <TextPart :userid="userid" :topic_id="topic_id" :card_id="card_id" :case_study_id="case_study_id" :part="subpart" :highlight="highlight"></TextPart>
            </template>
         </li>
      </template>

      <template v-if="part.type === 'image'">
         <img :src="part.ref" />
      </template>

      <template v-if="part.type === 'audio'">
         <audio controls :src="part.ref" ></audio>
      </template>

      <template v-if="part.type !== 'break' && part.type !== 'li' && part.type !== 'image' && part.type !== 'audio'">
         <TextPart :userid="userid" :topic_id="topic_id" :card_id="card_id" :case_study_id="case_study_id" :part="part" :highlight="highlight"></TextPart>
      </template>

   </template>
</template>

<script setup>
import TextPart from '/src/components/TextPart.vue'

const props = defineProps({
   userid: {
      type: Number,
      required: true
   },
   topic_id: {
      type: Number,
   },
   card_id: {
      type: Number,
   },
   case_study_id: {
      type: Number,
   },
   parts: {
      type: Array,
      required: true
   },
   highlight: {
      type: String,
      default: 'yellow'
   },
})
</script>