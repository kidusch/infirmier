import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'

import { resetUseAppState } from '/src/use/useAppState'
import { resetUseUser } from '/src/use/useUser'
import { resetUseUE } from '/src/use/useUE'
import { resetUseSubUE } from '/src/use/useSubUE'


// state backed in SessionStorage
const initialState = () => ({
   user: null,
})

const authenticationState = useSessionStorage('authentication-state', initialState())

export const resetUseAuthentication = () => {
   authenticationState.value = initialState()
}

export function clearSessionStorage() {
   resetUseAuthentication()
   resetUseAppState()
   resetUseUser()
   resetUseUE()
   resetUseSubUE()
}

export function setAuthenticatedUser(user) {
   authenticationState.value.user = user
}

export function getAuthenticatedUser() {
   return authenticationState.value.user
}


////////////////////////           LOGIN / LOGOUT            ////////////////////////

// throws an error 'wrong-credentials' if wrong email / password
export async function localSignin(email, password) {
   const user = await app.service('auth').localSignin(email, password)
   setAuthenticatedUser(user)
   await addUserAction('login')
   return user
}

export async function logout() {
   await addUserAction('logout')
   await app.service('auth').logout()
   clearSessionStorage()
}

export async function addUserAction(action) {
   await app.service('user_action').create({ data: {
      user_id: authenticationState.value.user.id,
      action,
   }})
}
