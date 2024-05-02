import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from './router'

// once imported here, can be used in any view without importing again
import 'jcb-radial'


createApp(App)
   .use(router)
   .mount('#app')
