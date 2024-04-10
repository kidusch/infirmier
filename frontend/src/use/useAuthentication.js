import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'

import { useUser } from '/src/use/useUser'
import { useAppState } from '/src/use/useAppState'

const { resetUseUser } = useUser()
const { resetUseAppState } = useAppState()


// state backed in SessionStorage

const initialState = () => {
   return {
      user: null,
   }
}

const authenticationState = useSessionStorage('authentication-state', initialState())

const resetUseAuthentication = () => {
   authenticationState.value = initialState()
}

function clearSessionStorage() {
   resetUseAuthentication()
   resetUseUser()
   resetUseAppState()
}

function getAuthenticatedUser() {
   return authenticationState.value.user
}


////////////////////////           LOGIN / LOGOUT            ////////////////////////

// throws an error 'wrong-credentials' if wrong email / password
async function localSignin(email, password) {
   const user = await app.service('auth').localSignin(email, password)
   authenticationState.value.user = user
   await app.service('user_action').create({ data: {
      user_id: user.id,
      action: 'login',
   }})
return user
}

async function logout() {
   await app.service('user_action').create({ data: {
      user_id: authenticationState.value.user.id,
      action: 'logout',
   }})
   await app.service('auth').logout()
   clearSessionStorage()
}


export function useAuthentication() {
   return {
      resetUseAuthentication,
      authenticationState,
      getAuthenticatedUser,
      localSignin,
      logout,
   }
}
