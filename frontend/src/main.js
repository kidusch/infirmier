import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import vue3dLoader from "vue-3d-loader"

import router from './router'

// once imported here, can be used in any view without importing again
import 'jcb-radial'


createApp(App)
   .use(router)
   .use(vue3dLoader)
   .mount('#app')
