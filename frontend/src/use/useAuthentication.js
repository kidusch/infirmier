import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'

// import { useUsers } from '/src/use/useUsers'
import { useAppState } from '/src/use/useAppState'

// const { resetUseUsers } = useUsers()
const { resetUseAppState } = useAppState()


// state backed in SessionStorage

const initialState = () => {
   return {
      user: null,
   }
}

const stateAuthentication = useSessionStorage('state-authentication', initialState())

const resetUseAuthentication = () => {
   stateAuthentication.value = initialState()
}

function clearSessionStorage() {
   resetUseAuthentication()
   // resetUseUsers()
   resetUseAppState()
}

function isAuthenticated() {
   return !!stateAuthentication.value.user
}


////////////////////////           LOGIN / LOGOUT            ////////////////////////

// throws an error 'wrong-credentials' is wrong email / password
async function localSignin(email, password) {
   const user = await app.service('auth').localSignin(email, password)
   stateAuthentication.value.user = user
   return user
}

async function logout() {
   await app.service('auth').logout()
   clearSessionStorage()
}


export function useAuthentication() {
   return {
      resetUseAuthentication,
      stateAuthentication,
      isAuthenticated,
      localSignin,
      logout,
   }
}
