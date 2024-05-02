import { useSessionStorage } from '@vueuse/core'

import app from '/src/client-app.js'

import { resetUseAppState } from '/src/use/useAppState'
import { resetUseUser } from '/src/use/useUser'
import { resetUseUE } from '/src/use/useUE'
import { resetUseSubUE } from '/src/use/useSubUE'
import { resetUseTopic } from '/src/use/useTopic'
import { resetUseCard } from '/src/use/useCard'
import { resetUseCaseStudy } from '/src/use/useCaseStudy'
import { resetUseQuiz } from '/src/use/useQuiz'
import { resetUseQuizChoice } from '/src/use/useQuizChoice'
import { resetUseUserTopic } from '/src/use/useUserTopic'
import { resetUseUserCard } from '/src/use/useUserCard'
import { resetUseUserQuiz } from '/src/use/useUserQuiz'
import { resetUseUserCaseStudy } from '/src/use/useUserCaseStudy'


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
   resetUseTopic()
   resetUseCard()
   resetUseCaseStudy()
   resetUseQuiz()
   resetUseQuizChoice()
   resetUseUserTopic()
   resetUseUserCard()
   resetUseUserQuiz()
   resetUseUserCaseStudy()
}

export function setAuthenticatedUser(user) {
   authenticationState.value.user = user
}

// export function getAuthenticatedUser() {
//    return authenticationState.value.user
// }


////////////////////////           LOGIN / LOGOUT            ////////////////////////

// throws an error 'wrong-credentials' if wrong email / password
export async function localSignin(email, password) {
   const user = await app.service('auth').localSignin(email, password)
   setAuthenticatedUser(user)
   await addUserAction('login')
   return user
}

export async function logout() {
   try {
      await addUserAction('logout')
   } catch(err) {
      console.log('err', err)
   }
   try {
      await app.service('auth').logout()
   } catch(err) {
      console.log('err', err)
   }
   clearSessionStorage()
}

export async function addUserAction(action) {
   await app.service('user_action').create({ data: {
      user_id: authenticationState.value.user.id,
      action,
   }})
}
