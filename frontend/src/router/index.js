
import { createRouter, createWebHistory } from 'vue-router'
import Home from '/src/views/Home.vue'

const routes = [
   {
      name: 'home',
      path: '/home/:userid',
      component: Home,
      meta: { requiresAuth: true },
   }
]

const router = createRouter({
   history: createWebHistory(),
   routes
})


router.beforeEach(async (to, from, next) => {
   console.log('from', from.path, 'to', to.path)

   if (to.meta.requiresAuth) {
   }

   next()
})


router.afterEach(() => {
   stateAppState.value.ready = "loaded"
})

export default router
